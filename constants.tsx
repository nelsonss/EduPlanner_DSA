import { SkillNode, Recommendation, RecommendationType, Notification, NotificationType, LearningPath, LeaderboardUser, UserProfileData, Badge, Goal } from './types';

// Skill Tree Data
export const SKILL_TREE_DATA: SkillNode[] = [
    { id: 'arrays', name: 'Arrays', description: 'Fundamental linear data structure.', proficiency: 0.95, prerequisites: [], isParent: true, subSkillIds: ['arrays-basics', 'arrays-ops'], position: { x: 0, y: 1 }, lastPracticed: '2023-10-01T10:00:00Z' },
    { id: 'arrays-basics', name: 'Basics', description: 'Declaration, initialization, access.', proficiency: 0.98, prerequisites: ['arrays'], isParent: false, position: { x: 1, y: 0 }, lastPracticed: '2023-10-01T10:00:00Z' },
    { id: 'arrays-ops', name: 'Operations', description: 'Insertion, deletion, search.', proficiency: 0.92, prerequisites: ['arrays'], isParent: false, position: { x: 1, y: 1 }, lastPracticed: '2023-09-28T10:00:00Z' },
    { id: 'linked-lists', name: 'Linked Lists', description: 'Nodes connected in a sequence.', proficiency: 0.75, prerequisites: ['arrays'], isParent: true, subSkillIds: ['singly-ll', 'doubly-ll'], position: { x: 1, y: 1 }, lastPracticed: '2023-09-15T10:00:00Z' },
    { id: 'singly-ll', name: 'Singly', description: 'Nodes with a single next pointer.', proficiency: 0.8, prerequisites: ['linked-lists'], isParent: false, position: { x: 2, y: 0 }, lastPracticed: '2023-09-15T10:00:00Z' },
    { id: 'doubly-ll', name: 'Doubly', description: 'Nodes with next and previous pointers.', proficiency: 0.7, prerequisites: ['linked-lists'], isParent: false, position: { x: 2, y: 1 }, lastPracticed: '2023-09-12T10:00:00Z' },
    { id: 'stacks', name: 'Stacks', description: 'LIFO data structure.', proficiency: 0.6, prerequisites: ['linked-lists'], isParent: false, position: { x: 2, y: 2 }, lastPracticed: '2023-09-10T10:00:00Z' },
    { id: 'queues', name: 'Queues', description: 'FIFO data structure.', proficiency: 0.5, prerequisites: ['linked-lists'], isParent: false, position: { x: 2, y: 3 }, lastPracticed: '2023-09-05T10:00:00Z' },
    { id: 'trees', name: 'Trees', description: 'Hierarchical data structure.', proficiency: 0.4, prerequisites: ['linked-lists'], isParent: true, subSkillIds:['bst', 'heaps'], position: { x: 1, y: 3 }, lastPracticed: '2023-08-20T10:00:00Z' },
    { id: 'bst', name: 'BSTs', description: 'Binary Search Trees', proficiency: 0.45, prerequisites: ['trees'], isParent: false, position: { x: 2, y: 4 }, lastPracticed: '2023-08-20T10:00:00Z' },
    { id: 'heaps', name: 'Heaps', description: 'Specialized tree-based data structure.', proficiency: 0.35, prerequisites: ['trees'], isParent: false, position: { x: 2, y: 5 }, lastPracticed: '2023-08-18T10:00:00Z' },
    { id: 'graphs', name: 'Graphs', description: 'Nodes with edges.', proficiency: 0.2, prerequisites: ['trees'], isParent: true, subSkillIds:['bfs', 'dfs'], position: { x: 2, y: 6 }, lastPracticed: '2023-08-10T10:00:00Z' },
    { id: 'bfs', name: 'BFS', description: 'Breadth-First Search.', proficiency: 0.25, prerequisites: ['graphs'], isParent: false, position: { x: 3, y: 5 }, lastPracticed: '2023-08-10T10:00:00Z' },
    { id: 'dfs', name: 'DFS', description: 'Depth-First Search.', proficiency: 0.15, prerequisites: ['graphs'], isParent: false, position: { x: 3, y: 6 }, lastPracticed: '2023-08-08T10:00:00Z' },
];

export const PROGRESS_METRICS_DATA = [
    { date: 'Mon', studyTime: 60 }, { date: 'Tue', studyTime: 90 },
    { date: 'Wed', studyTime: 45 }, { date: 'Thu', studyTime: 120 },
    { date: 'Fri', studyTime: 75 }, { date: 'Sat', studyTime: 150 },
    { date: 'Sun', studyTime: 30 },
];

export const RECOMMENDATIONS_DATA: Recommendation[] = [
    { id: 'rec1', type: RecommendationType.Coding, title: 'Two Sum Problem', description: 'Practice your hash map skills with this classic.', estimatedTime: '15 min', difficulty: 2, justification: "It's a great warm-up for arrays and hash maps." },
    { id: 'rec2', type: RecommendationType.Lecture, title: 'Intro to Big O Notation', description: 'Understand how to analyze algorithm efficiency.', estimatedTime: '30 min', difficulty: 3 },
    { id: 'rec3', type: RecommendationType.Project, title: 'Build a Trie for Autocomplete', description: 'Apply your knowledge of tree structures.', estimatedTime: '2 hours', difficulty: 4, justification: 'You seem to be doing well with trees, this is a good next step.'},
    { id: 'rec4', type: RecommendationType.Quiz, title: 'Linked List Concepts', description: 'Test your understanding of pointers and nodes.', estimatedTime: '10 min', difficulty: 2 },
    { id: 'rec5', type: RecommendationType.Reinforcement, title: 'Review Stack Operations', description: 'Your proficiency in Stacks is decaying. A quick review is recommended.', estimatedTime: '20 min', difficulty: 1 },
];

export const NOTIFICATIONS_DATA: Notification[] = [
    { id: 'notif1', type: NotificationType.Achievement, title: 'Array Apprentice Badge Unlocked!', message: 'You mastered the basics of arrays. Keep it up!', timestamp: '2h ago', read: false },
    { id: 'notif2', type: NotificationType.Suggestion, title: 'New Recommendation', message: 'Based on your progress, we suggest trying the "Two Sum" problem.', timestamp: '1d ago', read: false },
    { id: 'notif3', type: NotificationType.Reminder, title: 'Daily Goal', message: 'Remember to complete your daily study goal to keep your streak.', timestamp: '3d ago', read: true },
    { id: 'notif4', type: NotificationType.Alert, title: 'Proficiency Decay', message: 'Your "Stacks" skill needs reinforcement soon.', timestamp: '5d ago', read: true },
];

export const LEARNING_PATHS_DATA: LearningPath[] = [
    { id: 'lp1', title: 'DSA Fundamentals', description: 'Master the core data structures essential for any programmer.', skillIds: ['arrays', 'linked-lists', 'stacks', 'queues'] },
    { id: 'lp2', title: 'Advanced Structures', description: 'Dive into non-linear data structures like trees and graphs.', skillIds: ['trees', 'graphs', 'bst', 'heaps'] },
    { id: 'lp3', title: 'Interview Crash Course', description: 'A focused path covering the most common interview topics.', skillIds: ['arrays', 'linked-lists', 'bst', 'bfs', 'dfs'] },
];

export const LEADERBOARD_DATA: LeaderboardUser[] = [
    { id: 'user2', rank: 1, name: 'Alice', avatar: 'https://i.pravatar.cc/150?u=alice', points: 12500 },
    { id: 'user3', rank: 2, name: 'Bob', avatar: 'https://i.pravatar.cc/150?u=bob', points: 11800 },
    { id: 'user4', rank: 3, name: 'Charlie', avatar: 'https://i.pravatar.cc/150?u=charlie', points: 11200 },
    { id: 'user5', rank: 4, name: 'Diana', avatar: 'https://i.pravatar.cc/150?u=diana', points: 10500 },
    { id: 'user1', rank: 5, name: 'You', avatar: 'https://i.pravatar.cc/150?u=you', points: 9800 },
    { id: 'user6', rank: 6, name: 'Eve', avatar: 'https://i.pravatar.cc/150?u=eve', points: 9200 },
    { id: 'user7', rank: 7, name: 'Frank', avatar: 'https://i.pravatar.cc/150?u=frank', points: 8500 },
    { id: 'user8', rank: 8, name: 'Grace', avatar: 'https://i.pravatar.cc/150?u=grace', points: 7800 },
    { id: 'user9', rank: 9, name: 'Heidi', avatar: 'https://i.pravatar.cc/150?u=heidi', points: 7100 },
    { id: 'user10', rank: 10, name: 'Ivan', avatar: 'https://i.pravatar.cc/150?u=ivan', points: 6400 },
];

export const USER_DATA: UserProfileData = {
    id: 'user1',
    name: 'Alex Doe',
    email: 'alex.doe@example.com',
    avatar: 'https://i.pravatar.cc/150?u=alexdoe',
    points: 9800,
    earnedBadgeIds: ['badge1'],
    cognitiveProfile: {
        logicalReasoning: 4.2,
        abstractThinking: 3.8,
        patternRecognition: 4.5,
        attentionToDetail: 3.5,
    },
};

export const BADGES_DATA: Badge[] = [
    { id: 'badge1', name: 'Array Apprentice', description: 'Mastered all array-related skills.', icon: 'dashboard', condition: (ids) => ids.has('arrays-basics') && ids.has('arrays-ops') },
    { id: 'badge2', name: 'Link Legend', description: 'Mastered all linked list skills.', icon: 'linkedlist', condition: (ids) => ids.has('singly-ll') && ids.has('doubly-ll') },
    { id: 'badge3', name: 'Complexity King', description: 'Mastered Big O notation.', icon: 'complexity', condition: (ids) => false }, // Placeholder
];

export const GOALS_DATA: Goal[] = [
    { id: 'goal1', title: 'Solve 50 Easy Problems', current: 35, target: 50, unit: 'problems' },
    { id: 'goal2', title: 'Master 5 Core Topics', current: 2, target: 5, unit: 'topics' },
];

export const PERFORMANCE_CHART_DATA = [
    { month: 'Jan', accuracy: 75, solveTime: 25 }, { month: 'Feb', accuracy: 78, solveTime: 22 },
    { month: 'Mar', accuracy: 82, solveTime: 20 }, { month: 'Apr', accuracy: 85, solveTime: 18 },
    { month: 'May', accuracy: 88, solveTime: 16 }, { month: 'Jun', accuracy: 92, solveTime: 15 },
];

export const HEATMAP_DATA: { category: string, concepts: Record<string, number> }[] = [
    { category: 'Arrays', concepts: { Traversal: 5, Manipulation: 4, Searching: 5, Sorting: 3, 'Two Pointers': 4 } },
    { category: 'Linked Lists', concepts: { Implementation: 4, Usage: 5, 'Cycle Detection': 3, Traversal: 4 } },
    { category: 'Stacks / Queues', concepts: { 'Monotonic Stack': 2, Deque: 3, 'Priority Queue': 4, Usage: 4 } },
    { category: 'Trees', concepts: { Traversal: 3, BSTs: 3, Tries: 2, Heaps: 3 } },
    { category: 'Graphs', concepts: { Representation: 2, BFS: 3, DFS: 2, 'Shortest Path': 1, MST: 1 } },
];

export const ACTIVITY_CALENDAR_DATA: { [date: string]: number } = {};
const today = new Date();
for (let i = 0; i < 182; i++) {
    const date = new Date();
    date.setDate(today.getDate() - i);
    const dateString = date.toISOString().split('T')[0];
    if (Math.random() > 0.3) { // 70% chance of activity
        ACTIVITY_CALENDAR_DATA[dateString] = Math.floor(Math.random() * 150); // 0-150 minutes
    }
}
