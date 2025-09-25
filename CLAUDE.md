# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

EduPlanner DSA is an AI-powered personal tutor for Data Structures & Algorithms built with React + TypeScript frontend and Node.js + Express backend. The application uses Google GenAI (Gemini) for personalized learning experiences, cognitive profiling, and adaptive content generation.

## Common Development Commands

### Frontend (React + Vite)
- **Development server**: `npm run dev` (starts Vite dev server on localhost:3000)
- **Build**: `npm run build` (creates production build)
- **Preview**: `npm run preview` (preview production build)

### Backend (Node.js + Express)
- **Navigate to backend**: `cd backend`
- **Start server**: `npm start` (starts proxy server on localhost:3001)
- **Install backend dependencies**: `cd backend && npm install`

### Running the Full Application
The application requires **both frontend and backend servers running simultaneously**:
1. Terminal 1: `cd backend && npm start` (Backend proxy server on localhost:3001)
2. Terminal 2: `npm run dev` (Frontend React app on localhost:3000)

**IMPORTANT**: Before running, configure your Google Gemini API key in `backend/.env`:
```
API_KEY=your_google_genai_api_key_here
```

## Architecture Overview

### High-Level Structure
- **Frontend**: React SPA with TypeScript, using Vite for build tooling
- **Backend**: Lightweight Express.js proxy server that securely manages Google GenAI API calls
- **AI Integration**: All AI functionality routed through backend proxy to protect API keys and handle CORS

### Key Directories
- `/components`: React components organized by feature (dashboard, learning, evaluation, layout, shared)
- `/pages`: Top-level page components for routing
- `/contexts`: React Context providers for global state (SkillContext, UserContext, ThemeContext)
- `/services`: External API communication (`geminiService.ts` handles all AI interactions)
- `/hooks`: Custom React hooks
- `/backend`: Express server with single `/api/generate` endpoint

### State Management Philosophy
Uses React's built-in Context API with three main contexts:
- **SkillContext**: Source of truth for skill tree, proficiency levels, knowledge decay logic
- **UserContext**: User profile data, cognitive profiles, derived state (points, badges)
- **ThemeContext**: Light/dark mode theming

### AI Service Architecture
All AI interactions flow through `services/geminiService.ts` which:
- Abstracts frontend components from HTTP details
- Contains sophisticated prompt engineering for each AI feature
- Routes requests through backend proxy at `localhost:3001/api/generate`
- Handles both text and JSON response formats from Gemini

### Backend Proxy Design
The backend (`backend/server.js`) serves as a secure proxy:
- Single endpoint: `POST /api/generate`
- Adds API key from environment variables to requests
- Supports both text and JSON response modes based on `config.responseMimeType`
- Handles CORS and security concerns

## Core Features & AI Integration

### Cognitive Profiling System
The application builds dynamic cognitive profiles across four dimensions:
- Logical Reasoning, Abstract Thinking, Pattern Recognition, Attention to Detail
- Updated in real-time through Practice Lab interactions
- Drives personalized content generation and recommendations

### Practice Lab Workflow
1. **Problem Generation**: AI creates coding problems based on topics/difficulty
2. **Strategy Planning**: Students submit plans, receive AI feedback before coding
3. **Code Review**: AI provides detailed feedback with cognitive insights
4. **Profile Updates**: Each interaction updates the student's cognitive model

### Key AI Functions (in geminiService.ts)
- `generateSkillFeedback()`: Personalized skill-based feedback
- `generateLearningModuleContent()`: Adaptive learning content based on cognitive profile
- `generateCodingProblem()`: Custom coding challenges
- `generateStrategyFeedback()` & `generateCodeFeedback()`: Practice lab feedback with cognitive inferences

## Environment Setup

### Required Environment Variables
Backend requires `.env` file in `/backend` directory:
```
API_KEY="your_google_genai_api_key_here"
```

### TypeScript Configuration
- Uses path alias `@/*` mapping to project root
- Configured for modern React with JSX transform
- No emission (handled by Vite)

## Development Patterns

### Component Organization
- Feature-based organization (dashboard, learning, evaluation)
- Shared components in `/shared` directory
- Consistent TypeScript interfaces in `types.ts`

### Context Usage
- Global state through contexts, local state with useState/useReducer
- Derived state computed in contexts to prevent duplication
- Minimal prop drilling through strategic context placement

### AI Integration Patterns
- Always call AI functions through try/catch blocks
- Show loading states during AI operations
- Handle errors gracefully with user-friendly messages
- Prompt engineering includes user cognitive profiles and contextual data

## Important Notes

- **Security**: API keys never exposed to frontend; all AI calls proxied through backend
- **CORS**: Backend handles CORS for frontend-to-AI communication
- **Knowledge Decay**: Skill proficiencies automatically decay over time if not practiced
- **Personalization**: All AI content adapted based on user's cognitive profile
- **Error Handling**: Graceful degradation when AI services are unavailable