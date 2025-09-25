import { SkillNode, LearningPath, UserProfileData, Goal, LearningModuleContent, CodingProblem, StrategyFeedbackResponse, CodeFeedbackResponse } from '../types';

/**
 * EduPlanner DSA - AI Service Integration
 *
 * This service integrates with three specialized AI agents:
 * - Analyst: Data specialist for learning patterns and student insights
 * - Evaluator: Instructional coach for content quality assessment
 * - Optimizer: Content drafter for lesson plans and materials
 *
 * Architecture: All requests route through a secure backend proxy to protect API keys
 * and handle CORS policies. The backend server must be running on localhost:3001.
 */

// Backend proxy configuration
const PROXY_URL = 'http://localhost:3001/api/generate';

// Agent type definitions for the three AI specialists
export type AgentName = 'analyst' | 'evaluator' | 'optimizer';

// System instructions for each specialized agent
const AGENT_SYSTEM_INSTRUCTIONS = {
    analyst: `You are the Analyst, a data specialist for EduPlanner DSA. Your role is to:
    - Identify student learning patterns and performance trends
    - Detect common errors and disengagement signals
    - Provide actionable insights for early intervention
    - Focus on data-driven recommendations based on student behavior and progress`,

    evaluator: `You are the Evaluator, an objective instructional coach for EduPlanner DSA. Your role is to:
    - Analyze teaching materials against pedagogical frameworks (CIDPP: Clarity, Interactivity, Difficulty, Practicality, Completeness)
    - Provide structured feedback on content quality and effectiveness
    - Promote reflective teaching practices through objective assessment
    - Suggest specific improvements based on educational best practices`,

    optimizer: `You are the Optimizer, an expert content drafter for EduPlanner DSA. Your role is to:
    - Generate and refine lesson plans, examples, and assessments
    - Create adaptive content based on student cognitive profiles
    - Optimize materials for different learning styles and difficulty levels
    - Ensure content aligns with Data Structures & Algorithms curriculum standards`
};

/**
 * Core proxy communication function
 * Handles all API requests to the backend with proper error handling
 */
async function callGeminiProxy(prompt: string, config?: any): Promise<any> {
    try {
        // Format content for Gemini API - it expects an array of content objects
        const contents = [
            {
                role: 'user',
                parts: [{ text: prompt }]
            }
        ];

        const response = await fetch(PROXY_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ contents, config }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error('Backend proxy error:', errorData);
            throw new Error(errorData.error || `HTTP ${response.status}: Backend proxy error`);
        }

        return await response.json();
    } catch (error) {
        console.error("Gemini proxy communication failed:", error);
        throw error;
    }
}

/**
 * Generic agent communication function
 * Routes requests to specific AI agents with their system instructions
 */
export async function getAgentResponse(prompt: string, agent: AgentName): Promise<string> {
    const systemInstruction = AGENT_SYSTEM_INSTRUCTIONS[agent];

    const fullPrompt = `${systemInstruction}\n\n${prompt}`;

    try {
        const response = await callGeminiProxy(fullPrompt);
        return response.text;
    } catch (error) {
        console.error(`Error communicating with ${agent} agent:`, error);
        throw new Error(`Failed to get response from ${agent} agent`);
    }
}

// ANALYST AGENT FUNCTIONS
/**
 * Uses the Analyst agent to generate skill feedback based on student data analysis
 */
export const generateSkillFeedback = async (skill: SkillNode, allSkills: SkillNode[], user: UserProfileData): Promise<string> => {
    const relatedSkills = allSkills
        .filter(s => skill.prerequisites.includes(s.id) || s.prerequisites.includes(skill.id))
        .map(s => `${s.name}: ${Math.round(s.proficiency * 100)}% proficiency`)
        .join('\n');

    const prompt = `
        STUDENT DATA ANALYSIS REQUEST:
        Analyze the learning patterns for student: ${user.name}

        COGNITIVE PROFILE DATA:
        - Logical Reasoning: ${user.cognitiveProfile.logicalReasoning.toFixed(1)}/5
        - Abstract Thinking: ${user.cognitiveProfile.abstractThinking.toFixed(1)}/5
        - Pattern Recognition: ${user.cognitiveProfile.patternRecognition.toFixed(1)}/5
        - Attention to Detail: ${user.cognitiveProfile.attentionToDetail.toFixed(1)}/5

        SKILL PERFORMANCE DATA:
        - Target Skill: "${skill.name}" (${Math.round(skill.proficiency * 100)}% proficiency)
        - Description: "${skill.description}"
        - Related Skills Performance:
        ${relatedSkills || 'No related skills data available'}

        ANALYSIS REQUEST:
        Provide a data-driven feedback analysis (2-3 sentences) that:
        1. Identifies learning patterns from the cognitive profile
        2. Suggests evidence-based next steps
        3. Highlights specific areas for intervention based on proficiency gaps
    `;

    return await getAgentResponse(prompt, 'analyst');
};

/**
 * Uses the Analyst agent to provide data-driven justification for recommendations
 */
export const generateJustification = async (recommendationTitle: string, user: UserProfileData, skills: SkillNode[]): Promise<string> => {
    const masteredSkills = skills.filter(s => s.proficiency > 0.9).map(s => s.name).join(', ') || 'None';
    const inProgressSkills = skills.filter(s => s.proficiency > 0.1 && s.proficiency <= 0.9)
        .map(s => `${s.name} (${Math.round(s.proficiency*100)}%)`)
        .join(', ') || 'None';

    const strongestTrait = Object.entries(user.cognitiveProfile).reduce((a, b) => b[1] > a[1] ? b : a)[0];

    const prompt = `
        RECOMMENDATION JUSTIFICATION ANALYSIS:
        Analyze why "${recommendationTitle}" is the optimal next step for student: ${user.name}

        STUDENT PERFORMANCE DATA:
        - Mastered Skills: ${masteredSkills}
        - Skills In Progress: ${inProgressSkills}
        - Strongest Cognitive Pattern: ${strongestTrait}

        ANALYSIS REQUEST:
        Provide a data-driven justification (1-2 sentences) explaining:
        1. The learning progression logic behind this recommendation
        2. How it connects to their current skill mastery level
        3. Why this timing is optimal based on their learning patterns
    `;

    return await getAgentResponse(prompt, 'analyst');
};

/**
 * Uses the Analyst agent to generate comprehensive performance reviews
 */
export const generatePerformanceReview = async (
    performanceData: { month: string; accuracy: number; solveTime: number }[],
    goals: Goal[],
    masteredSkills: SkillNode[]
): Promise<string> => {
    const performanceTrends = performanceData.map(d =>
        `${d.month}: ${d.accuracy}% accuracy, ${d.solveTime}s avg solve time`
    ).join('\n');

    const goalProgress = goals.map(g =>
        `${g.title}: ${g.current}/${g.target} (${Math.round((g.current/g.target)*100)}%)`
    ).join('\n');

    const prompt = `
        COMPREHENSIVE PERFORMANCE ANALYSIS REQUEST:
        Analyze student performance trends and provide insights for continuous improvement.

        PERFORMANCE DATA ANALYSIS:
        Monthly Performance Trends:
        ${performanceTrends}

        Goal Achievement Progress:
        ${goalProgress}

        Skills Mastery Status:
        ${masteredSkills.map(s => s.name).join(', ') || 'No skills fully mastered yet'}

        ANALYSIS REQUEST:
        Provide a structured performance review in Markdown format with:
        1. **Overall Progress Summary** - Key trends and patterns identified
        2. **Strengths Identified** - Areas showing consistent improvement
        3. **Areas for Improvement** - Data-backed recommendations for growth
        4. **Next Steps** - Specific, measurable action items based on analysis

        Focus on data-driven insights and measurable metrics.
    `;

    return await getAgentResponse(prompt, 'analyst');
};

/**
 * Uses the Analyst agent for adaptive learning path analysis
 */
export const generateAdaptiveLearningStep = async (path: LearningPath, user: UserProfileData, skills: SkillNode[]): Promise<string> => {
    const pathSkills = path.skillIds.map(id => skills.find(s => s.id === id)).filter(Boolean) as SkillNode[];
    const skillProgress = pathSkills.map(s => `${s.name}: ${Math.round(s.proficiency * 100)}% proficiency`).join('\n');

    const prompt = `
        ADAPTIVE LEARNING PATH ANALYSIS:
        Analyze optimal next step for student: ${user.name} on "${path.title}" learning path

        STUDENT COGNITIVE PROFILE:
        - Logical Reasoning: ${user.cognitiveProfile.logicalReasoning.toFixed(1)}/5
        - Abstract Thinking: ${user.cognitiveProfile.abstractThinking.toFixed(1)}/5
        - Pattern Recognition: ${user.cognitiveProfile.patternRecognition.toFixed(1)}/5
        - Attention to Detail: ${user.cognitiveProfile.attentionToDetail.toFixed(1)}/5

        LEARNING PATH PROGRESS:
        ${skillProgress}

        ANALYSIS REQUEST:
        Based on learning pattern analysis, recommend the single most effective next step:
        - Continue to next unmastered skill, OR
        - Review prerequisite concepts, OR
        - Focus on specific problem types

        Provide specific justification based on proficiency gaps and cognitive patterns.
    `;

    return await getAgentResponse(prompt, 'analyst');
};

// OPTIMIZER AGENT FUNCTIONS

/**
 * Uses the Optimizer agent to generate adaptive learning module content
 */
export const generateLearningModuleContent = async (skill: SkillNode, user: UserProfileData): Promise<LearningModuleContent> => {
    const adaptationRules = [];
    if (user.cognitiveProfile.abstractThinking < 3.5) {
        adaptationRules.push("Include simple real-world analogies");
    }
    if (user.cognitiveProfile.attentionToDetail < 3.5) {
        adaptationRules.push("Focus quiz questions on edge cases");
    }
    if (user.cognitiveProfile.logicalReasoning > 4.0) {
        adaptationRules.push("Use formal, technical explanations");
    }

    const prompt = `
        ADAPTIVE LEARNING MODULE GENERATION:
        Create personalized DSA learning content for: ${skill.name}

        STUDENT PROFILE:
        Name: ${user.name}
        Cognitive Adaptations Required:
        - Logical Reasoning: ${user.cognitiveProfile.logicalReasoning.toFixed(1)}/5
        - Abstract Thinking: ${user.cognitiveProfile.abstractThinking.toFixed(1)}/5
        - Pattern Recognition: ${user.cognitiveProfile.patternRecognition.toFixed(1)}/5
        - Attention to Detail: ${user.cognitiveProfile.attentionToDetail.toFixed(1)}/5

        CONTENT ADAPTATION RULES:
        ${adaptationRules.length > 0 ? adaptationRules.join('\n') : 'Standard content approach suitable for balanced profile'}

        GENERATION REQUEST:
        Create a structured learning module with 2-3 sections in JSON format:
        {
          "sections": [
            {
              "title": "string",
              "explanation": "string (use \\n for newlines)",
              "visualizer": "optional string (use 'stack' only for Stack topics)",
              "quiz": {
                "question": "string",
                "options": ["option1", "option2", "option3", "option4"],
                "correctAnswer": "string (must match one option exactly)",
                "explanation": "string"
              }
            }
          ]
        }

        Suggested structure:
        1. Introduction to ${skill.name} (what it is, why it's used)
        2. Core Operations/Concepts
        3. Interactive quiz question (adapted to cognitive profile)
    `;

    const config = { responseMimeType: "application/json" };

    try {
        const response = await callGeminiProxy(prompt, config);
        return response as LearningModuleContent;
    } catch (error) {
        console.error("Error generating learning module content:", error);
        throw new Error("Failed to generate adaptive learning content");
    }
};

/**
 * Uses the Optimizer agent to generate deeper explanations for complex concepts
 */
export const generateDeeperExplanation = async (topic: string, conceptTitle: string, initialExplanation: string): Promise<string> => {
    const prompt = `
        IN-DEPTH CONTENT GENERATION REQUEST:
        Expand learning content for DSA concept understanding

        TOPIC CONTEXT:
        Primary Topic: "${topic}"
        Concept Section: "${conceptTitle}"
        Current Explanation: "${initialExplanation}"

        CONTENT ENHANCEMENT REQUEST:
        Generate deeper explanations that:
        1. Elaborate key concepts beyond the initial explanation
        2. Include practical analogies or real-world examples
        3. Provide pseudo-code illustrations when applicable
        4. Use markdown formatting for enhanced readability
        5. Maintain encouraging, intermediate-level tone

        Focus on adding new, valuable information that builds upon the existing explanation.
        Do not repeat the initial content - expand and enhance it.
    `;

    return await getAgentResponse(prompt, 'optimizer');
};

/**
 * Uses the Optimizer agent to generate coding problems for practice
 */
export const generateCodingProblem = async (topics: string[], difficulty: 'Easy' | 'Medium' | 'Hard'): Promise<CodingProblem> => {
    const prompt = `
        CODING PROBLEM GENERATION REQUEST:
        Create an engaging DSA practice problem with appropriate difficulty scaling

        PROBLEM SPECIFICATION:
        - Target Topics: ${topics.join(', ')}
        - Difficulty Level: ${difficulty}

        GENERATION REQUEST:
        Create a coding problem in JSON format with optimal learning value:
        {
          "title": "Creative, descriptive title (e.g., 'Binary Search in Rotated Array')",
          "description": "Clear problem statement in Markdown with example input/output",
          "topic": "Primary topic from the specified list",
          "difficulty": "The specified difficulty level"
        }

        Ensure the problem:
        1. Matches the specified difficulty appropriately
        2. Provides clear examples and constraints
        3. Focuses on the core concepts of the specified topics
        4. Is engaging and pedagogically valuable
    `;

    const config = { responseMimeType: "application/json" };

    try {
        const response = await callGeminiProxy(prompt, config);
        return response as CodingProblem;
    } catch (error) {
        console.error("Error generating coding problem:", error);
        throw new Error("Failed to generate coding problem");
    }
};

// EVALUATOR AGENT FUNCTIONS

/**
 * Uses the Evaluator agent to assess student problem-solving strategies
 */
export const generateStrategyFeedback = async (problem: CodingProblem, plan: string): Promise<StrategyFeedbackResponse> => {
    const prompt = `
        STRATEGY EVALUATION REQUEST:
        Assess student's problem-solving approach using pedagogical frameworks

        PROBLEM CONTEXT:
        Title: "${problem.title}"
        Description: "${problem.description}"

        STUDENT'S PROPOSED STRATEGY:
        ${plan}

        EVALUATION REQUEST:
        Provide structured assessment in JSON format:
        {
          "feedback": "Constructive evaluation of strategy correctness, efficiency, and completeness. Be encouraging while identifying gaps.",
          "cognitiveInferences": [
            {
              "trait": "One of: logicalReasoning, abstractThinking, patternRecognition, attentionToDetail",
              "change": "Small adjustment (+0.1, -0.05, etc.)",
              "reasoning": "Evidence-based justification for the cognitive assessment"
            }
          ]
        }

        Assessment Criteria (CIDPP Framework):
        - Clarity: Is the approach well-structured and clear?
        - Correctness: Does the strategy solve the problem?
        - Efficiency: Are there optimization opportunities?
        - Completeness: Are edge cases considered?

        Provide 1-2 cognitive inferences based on evidence from the strategy.
    `;

    const config = { responseMimeType: "application/json" };

    try {
        const response = await callGeminiProxy(prompt, config);
        return response as StrategyFeedbackResponse;
    } catch (error) {
        console.error("Error generating strategy feedback:", error);
        throw new Error("Failed to evaluate strategy");
    }
};

/**
 * Uses the Evaluator agent to provide comprehensive code review and assessment
 */
export const generateCodeFeedback = async (problem: CodingProblem, code: string): Promise<CodeFeedbackResponse> => {
    const prompt = `
        CODE EVALUATION REQUEST:
        Comprehensive DSA code review using educational assessment frameworks

        PROBLEM CONTEXT:
        Title: "${problem.title}"
        Description: "${problem.description}"

        STUDENT'S SOLUTION:
        \`\`\`javascript
        ${code}
        \`\`\`

        EVALUATION REQUEST:
        Provide comprehensive assessment in JSON format:
        {
          "feedback": "Detailed code review in Markdown format. Include strengths, areas for improvement, and specific suggestions.",
          "isCorrect": "Boolean assessment of solution correctness",
          "efficiency": "Time and space complexity analysis (e.g., 'O(n) time, O(1) space')",
          "cognitiveInferences": [
            {
              "trait": "One of: logicalReasoning, abstractThinking, patternRecognition, attentionToDetail",
              "change": "Small adjustment (+0.1, -0.05, etc.)",
              "reasoning": "Evidence-based justification for cognitive assessment"
            }
          ]
        }

        Assessment Framework (CIDPP):
        - Clarity: Is the code readable and well-structured?
        - Interactivity: Does it handle inputs/outputs correctly?
        - Difficulty: Does complexity match problem requirements?
        - Practicality: Are solutions realistic and implementable?
        - Completeness: Are edge cases and error handling addressed?

        Provide 2-3 cognitive inferences based on code analysis evidence.
    `;

    const config = { responseMimeType: "application/json" };

    try {
        const response = await callGeminiProxy(prompt, config);
        return response as CodeFeedbackResponse;
    } catch (error) {
        console.error("Error generating code feedback:", error);
        throw new Error("Failed to evaluate code submission");
    }
}