# EduPlanner DSA: An AI-Powered Personal Tutor for Data Structures & Algorithms
<img width="1024" height="1024" alt="Generated Image September 18, 2025 - 11_40AM" src="https://github.com/user-attachments/assets/40dd7738-c0e1-4c53-8cb5-e1fe6e46d01c" />
**EduPlanner DSA is not merely a learning tool; it is a pedagogical ecosystem designed to transform the traditional "one-size-fits-all" curriculum into a dynamic, personalized, and deeply insightful learning journey, powered by advanced generative AI.**

This project serves as a research prototype and functional application demonstrating how artificial intelligence can act not just as a content generator, but as a personal cognitive partner. It understands each student's unique learning profile, adapts materials in real-time, and creates a feedback loop that accelerates mastery and metacognitive awareness.

---

## 💡 The Pedagogical Innovation: AI as a Cognitive Partner

EduPlanner DSA's significance lies in its novel approach to instructional design and learning personalization, making it a valuable case study for students, faculty, and administrators interested in the future of education.


### 1. **Dynamic Cognitive Profiling**
At the system's core is a unique **cognitive profile** for each student, which the AI infers and updates based on performance in the Practice Lab. The AI evaluates not only if an answer is correct, but *how* the student approaches the problem.
*   **Logical Reasoning:** Was the plan logical and step-by-step?
*   **Attention to Detail:** Were edge cases and constraints overlooked?
*   **Pattern Recognition:** Was a known algorithmic pattern correctly identified?
*   **Abstract Thinking:** Was an efficient, non-obvious solution devised?

This profile allows for recommendations and learning modules to be adapted with unprecedented precision.

### 2. **Real-Time Adaptive Curriculum**
Instead of a linear learning path, the AI generates personalized **learning modules, justifications, and feedback** on the fly.
*   For a student with a lower "Abstract Thinking" score, the AI will include concrete, real-world analogies in its explanations.
*   For a learner with lower "Attention to Detail," the AI will generate practice problems with complex edge cases.

### 3. **The Practice Lab: An Intelligent Feedback Loop**
The `Plan -> Code -> Receive Feedback` cycle in the Practice Lab is where the core learning happens. The AI acts as an expert coach, providing instant, constructive feedback that goes beyond a simple "correct/incorrect," refining both the student's coding skills and their cognitive profile.

### 4. **Educator-AI Synergy**
The **Teacher Dashboard** is a central component, not an afterthought. It empowers human educators to calibrate, curate, and guide the AI, blending pedagogical expertise with the AI's ability to personalize at scale. An instructor can fine-tune a student's cognitive profile based on classroom observation, ensuring the AI acts as an extension of their teaching style.

---

## ✨ Key Features

*   **Interactive Skill Tree Visualizer:** A dynamic and customizable map of the knowledge domain.
*   **Intelligent Recommendations:** Personalized study suggestions with AI-generated justifications.
*   **AI-Powered Practice Lab:** An environment for solving problems with real-time feedback on both strategy and code.
*   **Adaptive Learning Modules:** AI-generated educational content that adjusts to the learner's cognitive profile.
*   **Detailed Performance Analytics:** In-depth visualizations and reports for tracking progress.
*   **Teacher Dashboard:** Tools for educators to oversee student progress and calibrate the AI system.

---

## 🛠️ Technology Stack

*   **Frontend:** React, TypeScript, Tailwind CSS, Recharts.
*   **Backend (Secure Proxy):** Node.js, Express.
*   **AI API:** Google GenAI (Gemini model).

---

## 🚀 Local Installation & Execution Guide

To run this application, you must have both the frontend and the backend server running simultaneously.

### 1. Prerequisites
Ensure you have the following installed on your system:
- **Node.js**: Version 18.x or higher.
- **npm**: (Typically comes with Node.js).

You can verify your installation by opening a terminal and running:
```bash
node -v
npm -v
```

### 2. Initial Setup

1.  **Download & Unzip:** Download the project's source code and unzip it into a folder of your choice.

2.  **Open a Terminal:** Navigate your terminal to the root project folder you just unzipped.

### 3. Backend Setup (Proxy Server)
The backend is crucial for securely managing the Google GenAI API key.

1.  **Navigate to the backend directory:**
    ```bash
    cd backend
    ```

2.  **Create the environment file (`.env`):** This file will store your secret API key. **It is critical that this file is never shared or committed to a public repository.**
    *   Create a new file named `.env` inside the `backend` directory.
    *   Open the file and add the following line, replacing `"YOUR_SECRET_API_KEY_HERE"` with your actual Google GenAI API key:
    ```
    API_KEY="YOUR_SECRET_API_KEY_HERE"
    ```

3.  **Install backend dependencies:**
    ```bash
    npm install
    ```
    This will read the `package.json` file in the `backend` folder and install Express, @google/genai, cors, and dotenv.

### 4. Frontend Setup (React Application)

1.  **Return to the project's root directory:**
    ```bash
    cd ..
    ```

2.  **Install frontend dependencies:**
    ```bash
    npm install
    ```
    This will read the root `package.json` file and install React, ReactDOM, Recharts, etc.

### 5. Running the Application
You will need **two separate terminals** running at the same time.

#### Terminal 1: Start the Backend

1.  Open a terminal and navigate to the `backend` folder:
    ```bash
    cd /path/to/your/project/backend
    ```

2.  Start the server:
    ```bash
    npm start
    ```

3.  You should see a confirmation message. **Leave this terminal running!**
    ```
    🚀 Secure Gemini proxy server is running on http://localhost:3001
    ```

#### Terminal 2: Start the Frontend

1.  Open a **new terminal window** and navigate to the **root project folder**:
    ```bash
    cd /path/to/your/project
    ```

2.  Start the React application:
    ```bash
    npm start
    ```

3.  This should automatically open your web browser to an address like `http://localhost:3000`.

Your EduPlanner DSA application is now fully functional on your local machine. The frontend will securely communicate with your backend proxy, which in turn will communicate with the Gemini API.

---

## 🤝 Contributing

Contributions are welcome. If you wish to enhance the project, please follow these steps:
1.  Fork the repository.
2.  Create a new branch (`git checkout -b feature/new-amazing-feature`).
3.  Make your changes and commit them (`git commit -m 'Add new amazing feature'`).
4.  Push to the branch (`git push origin feature/new-amazing-feature`).
5.  Open a Pull Request.

---

## 📜 License

This project is licensed under the MIT License. See the `LICENSE` file for details.
