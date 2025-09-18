# EduPlanner DSA - Technical Architecture Document

This document provides a technical overview of the EduPlanner DSA application's architecture. It is intended for developers who wish to understand, maintain, or contribute to the project.

## 1. High-Level Overview

EduPlanner DSA is a modern single-page application (SPA) built with a **React + TypeScript** frontend and a lightweight **Node.js + Express** backend. The backend's sole responsibility is to act as a **secure proxy** between the client and the Google GenAI (Gemini) API.

This client-server architecture is a deliberate and critical design choice made to:
1.  **Secure the API Key:** The secret Google GenAI API key is stored exclusively on the server and is never exposed to the public-facing frontend code.
2.  **Bypass CORS Restrictions:** Browsers' Same-Origin Policy prevents direct calls from a web application to a different domain (like Google's API endpoints). By routing requests through our own backend, we operate within these security constraints.

## 2. System Architecture Diagram

The flow of a request to the AI is simple, secure, and robust:

```
+------------------+        (1) User action triggers      +----------------------+        (2) Backend adds API key      +-----------------+
|                  |        API call with prompt          |                      |        & forwards request        |                 |
|  React Client    |  --------------------------------->  |  Node.js Proxy Server|  ------------------------------> |  Google GenAI   |
| (localhost:3000) |                                    |  (localhost:3001)    |                                |  (Gemini API)   |
|                  |        (4) Backend forwards          |                      |        (3) Gemini processes        |                 |
|                  |        response to client            |                      |        & sends response back       |                 |
+------------------+  <---------------------------------  +----------------------+  <------------------------------  +-----------------+
```

1.  **Client Request:** A user action in the React application (e.g., clicking "Get Feedback") calls a function in `services/geminiService.ts`. This function sends a `POST` request to our backend proxy at `http://localhost:3001/api/generate`.
2.  **Proxy to Gemini:** The Node.js server receives the request, adds the secret `API_KEY` from its environment variables, and forwards the payload to the official Google GenAI API endpoint.
3.  **Gemini to Proxy:** The Gemini API processes the request and sends the response back to our Node.js server.
4.  **Proxy to Client:** The Node.js server receives the response, formats it as needed (e.g., parsing JSON), and sends it back to the React client, which then updates the UI.

## 3. Frontend Architecture

The frontend is structured to be scalable, maintainable, and type-safe.

### 3.1. Folder Structure

-   `/components`: Contains all reusable React components, organized by feature or page (e.g., `/dashboard`, `/learning`, `/shared`).
-   `/contexts`: Holds React Context providers for global state management (`SkillContext`, `UserContext`, `ThemeContext`).
-   `/pages`: Contains top-level components that represent a full page or view (e.g., `DashboardPage.tsx`, `LabPage.tsx`).
-   `/services`: Contains modules that handle external communication. `geminiService.ts` is the most critical, abstracting all interactions with our backend proxy.
-   `/hooks`: For custom React hooks that encapsulate reusable logic (e.g., `useCustomLearningPaths.ts`).
-   `/constants.tsx`: Stores static data, like the initial skill tree structure and mock data.
-   `/types.ts`: Centralized location for all TypeScript type definitions and interfaces used across the application.

### 3.2. State Management Philosophy

We use **React's built-in Context API** for global state management. This approach was chosen for its simplicity and direct integration with React, avoiding the need for external libraries like Redux for a project of this scale.

-   **`SkillContext`**: The source of truth for the entire skill tree. It manages the state of all skills, their proficiencies, and includes logic for proficiency decay.
-   **`UserContext`**: Manages the user's profile data. It intelligently *derives* state like total points and earned badges from `SkillContext`, ensuring data consistency without duplication. It also handles updates to the user's AI-inferred cognitive profile.
-   **`ThemeContext`**: A simple context to manage the application's light/dark mode.
-   **Local State (`useState`)**: Individual components manage their own UI state (e.g., loading spinners, modal visibility, form inputs) using the `useState` and `useReducer` hooks. This keeps components self-contained and prevents unnecessary re-renders of the global state.

## 4. Backend Architecture (The Proxy Server)

The backend is a minimalist Express server with a single purpose.

-   **File:** `backend/server.js`
-   **Dependencies:** `express`, `cors`, `dotenv`, `@google/genai`.
-   **Environment:** The server relies on a `.env` file in the `/backend` directory to securely load the `API_KEY`.

### 4.1. API Endpoint Contract

The server exposes a single, critical endpoint:

-   **Route:** `POST /api/generate`
-   **Request Body:** A JSON object with the following structure:
    ```json
    {
      "contents": "...", // The prompt string or content object
      "config": { ... }  // Optional: A configuration object for the Gemini model
    }
    ```
-   **Response Body:** The server intelligently adapts its response based on the `config` sent by the client.
    -   **For text generation (default):**
        ```json
        {
          "text": "This is the text response from the AI."
        }
        ```
    -   **For JSON generation (`config.responseMimeType === "application/json"`):**
        The server parses the AI's stringified JSON response and returns the JavaScript object directly.
        ```json
        {
          "title": "Generated Coding Problem",
          "description": "..."
        }
        ```

## 5. AI Service Layer

-   **File:** `services/geminiService.ts`

This module is the bridge between the frontend components and the backend proxy.

-   **Abstraction:** It hides the implementation details of `fetch` and the proxy URL from the components. A component simply calls a function like `generateSkillFeedback(skill)` without needing to know *how* or *where* the request is sent.
-   **Prompt Engineering:** This is where the "intelligence" of the application is crafted. Each function is responsible for creating a highly detailed, context-rich prompt that instructs the Gemini model on its role, the required output format (including JSON schemas), and the user-specific data to consider (like the cognitive profile).
-   **Error Handling:** The service uses a `try...catch` block to handle network failures and re-throws errors to be caught by the calling component. This allows UI components to manage their own loading and error states effectively.
