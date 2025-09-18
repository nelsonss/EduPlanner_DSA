export interface SkillNode {
    id: string;
    name: string;
    description: string;
    proficiency: number; // 0 to 1
    prerequisites: string[];
    isParent: boolean;
    subSkillIds?: string[];
    position: { x: number; y: number };
    lastPracticed: string; // ISO date string
}

export enum SkillStatus {
    NotStarted = 'Not Started',
    InProgress = 'In Progress',
    Mastered = 'Mastered',
    Reinforcement = 'Needs Reinforcement',
}

export const getSkillStatus = (proficiency: number): SkillStatus => {
    if (proficiency >= 0.9) return SkillStatus.Mastered;
    if (proficiency >= 0.6) return SkillStatus.Reinforcement;
    if (proficiency > 0) return SkillStatus.InProgress;
    return SkillStatus.NotStarted;
};

export enum RecommendationType {
    Coding = 'coding',
    Lecture = 'lecture',
    Project = 'project',
    Quiz = 'quiz',
    Reinforcement = 'reinforcement',
    Adaptive = 'adaptive',
}

export interface Recommendation {
    id: string;
    type: RecommendationType;
    title: string;
    description: string;
    estimatedTime: string;
    difficulty: number; // 1-5
    justification?: string;
}

export enum NotificationType {
    Achievement = 'achievement',
    Reminder = 'reminder',
    Alert = 'alert',
    Suggestion = 'suggestion',
}

export interface Notification {
    id: string;
    type: NotificationType;
    title: string;
    message: string;
    timestamp: string;
    read: boolean;
}

export interface LearningPath {
    id: string;
    title: string;
    description: string;
    skillIds: string[];
    isCustom?: boolean;
}

export interface LeaderboardUser {
    id: string;
    rank: number;
    name: string;
    avatar: string;
    points: number;
}

export interface CognitiveProfile {
    logicalReasoning: number; // 1-5
    abstractThinking: number; // 1-5
    patternRecognition: number; // 1-5
    attentionToDetail: number; // 1-5
}

export interface UserProfileData {
    id: string;
    name: string;
    email: string;
    avatar: string;
    points: number;
    earnedBadgeIds: string[];
    cognitiveProfile: CognitiveProfile;
}

export interface Badge {
    id: string;
    name: string;
    description: string;
    icon: string;
    condition: (masteredSkillIds: Set<string>) => boolean;
}

export interface Goal {
    id: string;
    title: string;
    current: number;
    target: number;
    unit: string;
}

export interface QuizQuestion {
    question: string;
    options: string[];
    correctAnswer: string;
    explanation: string;
}

export interface LearningModuleContent {
    sections: {
        title: string;
        explanation: string;
        visualizer?: 'stack'; // Extendable
        quiz?: QuizQuestion;
    }[];
}

// --- New Types for Practice Lab ---

export interface CodingProblem {
    title: string;
    description: string;
    topic: string;
    difficulty: 'Easy' | 'Medium' | 'Hard';
}

export type CognitiveInference = {
    trait: keyof CognitiveProfile;
    change: number; // e.g., +0.1, -0.05
    reasoning: string;
};

export interface StrategyFeedbackResponse {
    feedback: string;
    cognitiveInferences: CognitiveInference[];
}

export interface CodeFeedbackResponse {
    feedback: string;
    isCorrect: boolean;
    efficiency: string;
    cognitiveInferences: CognitiveInference[];
}
