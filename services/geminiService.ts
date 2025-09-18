import { SkillNode, LearningPath, UserProfileData, Goal, LearningModuleContent, CodingProblem, StrategyFeedbackResponse, CodeFeedbackResponse } from '../types';

/**
 * NOTE ON ARCHITECTURE:
 * This service has been refactored to use a backend proxy. Originally, it attempted to call the
 * Google GenAI API directly from the frontend, which is insecure and not viable due to:
 * 1. API Key Exposure: Frontend code is public, and embedding an API key would allow anyone to steal and use it.
 * 2. CORS Policy: For security, browsers block direct API calls from a web page to a different domain unless specifically allowed by that domain. Google's AI services do not allow this.
 * 
 * The functions below now make requests to a hypothetical backend endpoint (e.g., http://localhost:3001/api/generate).
 * This backend is responsible for securely storing the API key and forwarding requests to the Google GenAI API.
 * 
 * For this application to be fully functional, a corresponding backend server must be created and running.
 */

// This is the endpoint of the secure backend proxy.
const PROXY_URL = 'http://localhost:3001/api/generate';

/**
 * A helper function to communicate with the backend proxy.
 * @param contents The prompt or content to send to the model.
 * @param config Optional configuration for the model, like responseMimeType.
 * @returns The JSON response from the backend.
 */
async function callGeminiProxy(contents: any, config?: any): Promise<any> {
    try {
        const response = await fetch(PROXY_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ contents, config }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error('Error from backend proxy:', errorData);
            throw new Error(errorData.error || 'An unknown error occurred with the backend proxy.');
        }

        return await response.json();
    } catch (error) {
        console.error("Failed to fetch from the Gemini proxy:", error);
        // Re-throw the error to be handled by the calling component's catch block.
        throw error;
    }
}

export const generateSkillFeedback = async (skill: SkillNode, allSkills: SkillNode[], user: UserProfileData): Promise<string> => {
    const prompt = `
        Act as an expert and encouraging Data Structures & Algorithms tutor.
        You are providing personalized feedback to a student named ${user.name}.

        **Student's Cognitive Profile:**
        - Logical Reasoning: ${user.cognitiveProfile.logicalReasoning.toFixed(1)}/5
        - Abstract Thinking: ${user.cognitiveProfile.abstractThinking.toFixed(1)}/5
        - Pattern Recognition: ${user.cognitiveProfile.patternRecognition.toFixed(1)}/5
        - Attention to Detail: ${user.cognitiveProfile.attentionToDetail.toFixed(1)}/5

        **Skill Analysis:**
        - Skill: "${skill.name}"
        - Current Proficiency: ${Math.round(skill.proficiency * 100)}%
        - Description: "${skill.description}"
        - Related Skills Context:
        ${allSkills
            .filter(s => skill.prerequisites.includes(s.id) || s.prerequisites.includes(skill.id))
            .map(s => `  - ${s.name}: ${Math.round(s.proficiency * 100)}% proficiency`)
            .join('\n')
        }

        **Your Task:**
        Provide a brief (2-3 sentences) piece of feedback. It must be:
        1.  **Encouraging:** Start with a positive observation.
        2.  **Actionable:** Suggest a concrete next step.
        3.  **Personalized:** Tailor the suggestion based on the user's cognitive profile. For example, if their "Attention to Detail" is low, recommend a problem with tricky edge cases. If their "Pattern Recognition" is high, suggest a problem that combines multiple patterns.
    `;
    const response = await callGeminiProxy(prompt);
    return response.text;
};

export const generateJustification = async (recommendationTitle: string, user: UserProfileData, skills: SkillNode[]): Promise<string> => {
    const masteredSkills = skills.filter(s => s.proficiency > 0.9).map(s => s.name).join(', ') || 'None';
    const inProgressSkills = skills.filter(s => s.proficiency > 0.1 && s.proficiency <= 0.9).map(s => `${s.name} (${Math.round(s.proficiency*100)}%)`).join(', ') || 'None';
    
    const strongestCognitiveTrait = Object.entries(user.cognitiveProfile).reduce((a, b) => b[1] > a[1] ? b : a)[0];

    const prompt = `
        Act as a helpful academic advisor for a student named ${user.name}.
        Your task is to provide a personalized and encouraging justification (1-2 sentences) for a new recommendation.

        **Student Context:**
        - Mastered Skills: ${masteredSkills}
        - Skills In Progress: ${inProgressSkills}
        - Strongest Cognitive Trait: ${strongestCognitiveTrait}

        **Recommendation:**
        - You are recommending the student works on: "${recommendationTitle}"

        **Instructions:**
        - Explain *why* this specific recommendation is a good next step based on their context.
        - Connect it to their mastered skills or their skills in progress.
        - Keep the tone positive and motivational.
        - Do not just repeat the recommendation title.
    `;
    const response = await callGeminiProxy(prompt);
    return response.text;
};

export const generatePerformanceReview = async (
    performanceData: { month: string; accuracy: number; solveTime: number }[],
    goals: Goal[],
    masteredSkills: SkillNode[]
): Promise<string> => {
    const prompt = `
    Generate a performance review for a student based on the following data:
    - Performance Trends: ${JSON.stringify(performanceData)}
    - Goals: ${JSON.stringify(goals.map(g => `${g.title} (${g.current}/${g.target})`))}
    - Mastered Skills: ${masteredSkills.map(s => s.name).join(', ')}

    Provide a summary with:
    1. An overall summary of their progress.
    2. Key strengths observed.
    3. One or two areas for improvement.
    4. Actionable next steps.
    Format the response in Markdown with bold headings.
    `;
    const response = await callGeminiProxy(prompt);
    return response.text;
};

export const generateAdaptiveLearningStep = async (path: LearningPath, user: UserProfileData, skills: SkillNode[]): Promise<string> => {
    const pathSkills = path.skillIds.map(id => skills.find(s => s.id === id)).filter(Boolean) as SkillNode[];
    const prompt = `
    A user named ${user.name} is on the "${path.title}" learning path.
    Their cognitive profile is: ${JSON.stringify(user.cognitiveProfile)}.
    Their progress in this path is: ${JSON.stringify(pathSkills.map(s => ({ name: s.name, proficiency: s.proficiency })))}.
    
    Based on this, recommend the single most effective next step for them. It could be continuing to the next unmastered skill, reviewing a prerequisite, or tackling a specific type of problem. Be specific and provide a brief justification.
    `;
    const response = await callGeminiProxy(prompt);
    return response.text;
};

export const generateLearningModuleContent = async (skill: SkillNode, user: UserProfileData): Promise<LearningModuleContent> => {
    const prompt = `
        Act as a curriculum designer creating a personalized, concise learning module for a student named ${user.name}.

        **Topic:** "${skill.name}"
        **Target Audience:** An intermediate learner with the following cognitive profile:
        - Logical Reasoning: ${user.cognitiveProfile.logicalReasoning.toFixed(1)}/5
        - Abstract Thinking: ${user.cognitiveProfile.abstractThinking.toFixed(1)}/5
        - Pattern Recognition: ${user.cognitiveProfile.patternRecognition.toFixed(1)}/5
        - Attention to Detail: ${user.cognitiveProfile.attentionToDetail.toFixed(1)}/5

        **Content Generation Rules:**
        - **Adapt the content:**
            - If "Abstract Thinking" is low (below 3.5), you MUST include a simple real-world analogy in the introduction section's explanation.
            - If "Attention to Detail" is low (below 3.5), the quiz question MUST focus on a common edge case (e.g., empty array, null pointers).
            - If "Logical Reasoning" is high (above 4.0), the explanation of core operations can be more formal and technical.
        - **Output Format:** You MUST respond with a valid JSON object.
        - **JSON Structure:**
          {
            "sections": [
              {
                "title": "string",
                "explanation": "string (use \\n for newlines)",
                "visualizer": "optional string (only use 'stack' if the topic is Stacks)",
                "quiz": { // optional, include for one section
                  "question": "string",
                  "options": ["string", "string", "string", "string"],
                  "correctAnswer": "string (must match one of the options)",
                  "explanation": "string"
                }
              }
            ]
          }
        - **Module Sections:** Create 2-3 sections. A good structure would be:
          1.  Introduction to ${skill.name} (What is it? Why is it used? Include an analogy if required by the rules).
          2.  Core Operations / Concepts (e.g., Push/Pop for Stacks, Traversal for Trees).
          3.  A simple quiz question to check understanding (tailor it based on the cognitive profile rules).
    `;

    const config = { responseMimeType: "application/json" };
    // The backend should parse the JSON and return the object directly.
    const responseJson = await callGeminiProxy(prompt, config);
    return responseJson as LearningModuleContent;
};

export const generateDeeperExplanation = async (topic: string, conceptTitle: string, initialExplanation: string): Promise<string> => {
    const prompt = `
        A user is learning about the Data Structures & Algorithms topic: "${topic}".
        They are currently viewing a section titled "${conceptTitle}" with the following explanation:
        "${initialExplanation}"

        The user wants a more in-depth explanation. Please provide a detailed breakdown of this concept. 
        - Elaborate on the key ideas.
        - Use a simple analogy or a real-world example to clarify.
        - If applicable, provide a simple pseudo-code snippet to illustrate the logic.
        - Keep the tone clear, encouraging, and easy for an intermediate learner to understand.
        - Do not repeat the initial explanation. Focus on adding new, valuable information.
        - The response should be a few paragraphs long and formatted with markdown for readability (e.g., using bold for keywords).
    `;

    const response = await callGeminiProxy(prompt);
    return response.text;
};

export const generateCodingProblem = async (topics: string[], difficulty: 'Easy' | 'Medium' | 'Hard'): Promise<CodingProblem> => {
    const prompt = `
    Generate a new coding problem for a user learning Data Structures and Algorithms.
    
    Problem constraints:
    - Topic(s): ${topics.join(', ')}
    - Difficulty: ${difficulty}
    
    Provide a response in JSON format with the following keys:
    - "title": A creative and descriptive title for the problem (e.g., "Rotated Array Search").
    - "description": A clear, concise problem description in Markdown format. Include a simple example with input and output.
    - "topic": The primary topic, chosen from the list provided.
    - "difficulty": The difficulty level provided.
    `;

    const config = { responseMimeType: "application/json" };
    const responseJson = await callGeminiProxy(prompt, config);
    return responseJson as CodingProblem;
};

export const generateStrategyFeedback = async (problem: CodingProblem, plan: string): Promise<StrategyFeedbackResponse> => {
    const prompt = `
    Act as an expert DSA coach. A user has proposed a plan to solve a coding problem.
    Analyze their plan and provide feedback and cognitive insights.
    
    Problem Title: "${problem.title}"
    Problem Description: "${problem.description}"
    User's Plan: "${plan}"
    
    Respond in a JSON object with two keys:
    1. "feedback": (string) Provide constructive feedback on the plan. Is it correct? Is it efficient? Does it miss edge cases? Be encouraging.
    2. "cognitiveInferences": (array of objects) Based *only* on the plan, infer cognitive traits. Each object should have:
        - "trait": (string) One of "logicalReasoning", "abstractThinking", "patternRecognition", "attentionToDetail".
        - "change": (number) A small increment/decrement (e.g., +0.1, -0.05).
        - "reasoning": (string) A brief justification for the change.
        
    Example reasoning: "The user correctly identified the two-pointer pattern (+0.1 to patternRecognition)" or "The plan doesn't account for an empty array (-0.05 to attentionToDetail)".
    Provide 1-2 inferences.
    `;

    const config = { responseMimeType: "application/json" };
    const responseJson = await callGeminiProxy(prompt, config);
    return responseJson as StrategyFeedbackResponse;
};

export const generateCodeFeedback = async (problem: CodingProblem, code: string): Promise<CodeFeedbackResponse> => {
     const prompt = `
    Act as an expert DSA code reviewer. A user has submitted a solution to a coding problem.
    Analyze their code and provide a full review.
    
    Problem Title: "${problem.title}"
    Problem Description: "${problem.description}"
    User's Code (JavaScript):
    \`\`\`javascript
    ${code}
    \`\`\`
    
    Respond in a JSON object with four keys:
    1. "feedback": (string) Provide constructive, line-by-line feedback if necessary. Explain what's good and what can be improved. Use Markdown.
    2. "isCorrect": (boolean) Does the code likely solve the problem correctly?
    3. "efficiency": (string) Briefly analyze the time and space complexity (e.g., "O(n) time, O(1) space").
    4. "cognitiveInferences": (array of objects) Based on the code, infer cognitive traits. Each object should have:
        - "trait": (string) One of "logicalReasoning", "abstractThinking", "patternRecognition", "attentionToDetail".
        - "change": (number) A small increment/decrement (e.g., +0.1, -0.05).
        - "reasoning": (string) A brief justification for the change.
        
    Example reasoning: "The solution uses an optimal hash map approach (+0.1 to abstractThinking)" or "The loop condition is off by one (-0.1 to attentionToDetail)".
    Provide 2-3 inferences.
    `;

    const config = { responseMimeType: "application/json" };
    const responseJson = await callGeminiProxy(prompt, config);
    return responseJson as CodeFeedbackResponse;
}