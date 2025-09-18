import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { Card } from '../components/shared/Card';
import { useSkills } from '../contexts/SkillContext';
import { useUser } from '../contexts/UserContext';
import { generateCodingProblem, generateStrategyFeedback, generateCodeFeedback } from '../services/geminiService';
import { CodingProblem, StrategyFeedbackResponse, CodeFeedbackResponse, CognitiveInference } from '../types';
import { Icon } from '../components/shared/Icon';

// The LabPage functions as a state machine, progressing through these steps.
type LabStep = 'initial' | 'planning' | 'coding' | 'feedback';

// --- Sub-components ---

const LoadingIndicator: React.FC<{ text: string }> = ({ text }) => (
    <div className="flex items-center justify-center space-x-2 text-text-secondary">
        <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <span>{text}</span>
    </div>
);

const FeedbackDisplay: React.FC<{ title: string; feedback: string; inferences: CognitiveInference[] }> = ({ title, feedback, inferences }) => (
    <div className="mt-4 p-4 bg-background-dark rounded-lg border border-gray-700 space-y-3">
        <h4 className="font-semibold text-text-primary">{title}</h4>
        {/* whitespace-pre-wrap is important to respect newlines from the AI's Markdown response */}
        <p className="text-sm text-text-secondary whitespace-pre-wrap">{feedback}</p>
        <div>
            <h5 className="text-xs font-bold uppercase text-text-secondary mb-1">Cognitive Insights:</h5>
            {inferences.map(inf => (
                <p key={inf.trait} className="text-xs text-text-secondary">
                    <span className={`font-semibold ${inf.change > 0 ? 'text-accent-green' : 'text-accent-red'}`}>
                        {inf.change > 0 ? `+${inf.change.toFixed(2)}` : inf.change.toFixed(2)}
                    </span> to {inf.trait}: {inf.reasoning}
                </p>
            ))}
        </div>
    </div>
);

// --- Main Component ---

export const LabPage: React.FC = () => {
    // --- State Management ---
    const { skills, updateSkillProficiency } = useSkills();
    const { updateCognitiveProfile } = useUser();

    // State for the current step in the lab's workflow.
    const [step, setStep] = useState<LabStep>('initial');
    // State for user inputs in the initial problem generation form.
    const [selectedTopics, setSelectedTopics] = useState<string[]>([]);
    const [selectedDifficulty, setSelectedDifficulty] = useState<'Easy' | 'Medium' | 'Hard'>('Easy');
    // Generic loading and error states for various async operations.
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    
    // State to hold the data for the current practice session.
    const [problem, setProblem] = useState<CodingProblem | null>(null);
    const [strategy, setStrategy] = useState('');
    const [strategyFeedback, setStrategyFeedback] = useState<StrategyFeedbackResponse | null>(null);
    const [code, setCode] = useState('');
    const [codeFeedback, setCodeFeedback] = useState<CodeFeedbackResponse | null>(null);
    
    // Memoize the list of skills that can be practiced to avoid recalculation on every render.
    const practiceableSkills = useMemo(() => skills.filter(s => !s.isParent), [skills]);

    // --- Side Effects ---
    // This effect loads a saved code draft from localStorage when a new problem is generated.
    useEffect(() => {
        if (problem) {
            const savedCode = localStorage.getItem(`codeDraft_${problem.title}`);
            if (savedCode) setCode(savedCode);
        }
    }, [problem]);

    // This effect auto-saves the user's code to localStorage. It's debounced to avoid excessive writes.
    useEffect(() => {
        if (problem) {
            const handler = setTimeout(() => {
                localStorage.setItem(`codeDraft_${problem.title}`, code);
            }, 500);
            return () => clearTimeout(handler);
        }
    }, [code, problem]);

    // --- AI Interaction Callbacks ---

    /**
     * Handles the asynchronous request to generate a new coding problem.
     * Manages loading and error states and transitions the lab to the 'planning' step on success.
     */
    const handleGenerateProblem = useCallback(async () => {
        if (selectedTopics.length === 0) {
            setError('Please select at least one topic.');
            return;
        }
        setIsLoading(true);
        setError('');
        try {
            const generatedProblem = await generateCodingProblem(selectedTopics, selectedDifficulty);
            setProblem(generatedProblem);
            setStep('planning'); // Move to the next step
        } catch (err) {
            setError('Failed to generate a problem. The AI service may be unavailable. Please try again.');
            console.error("Error generating problem:", err);
        } finally {
            setIsLoading(false);
        }
    }, [selectedTopics, selectedDifficulty]);

    /**
     * Handles the request for AI feedback on the user's strategy/plan.
     * Updates the cognitive profile based on the AI's inferences.
     */
    const handleGetStrategyFeedback = useCallback(async () => {
        if (!problem || !strategy.trim()) return;
        setIsLoading(true);
        try {
            const feedback = await generateStrategyFeedback(problem, strategy);
            setStrategyFeedback(feedback);
            // Apply the cognitive changes returned by the AI to the user's profile.
            updateCognitiveProfile(
                feedback.cognitiveInferences.reduce((acc, inf) => ({ ...acc, [inf.trait]: inf.change }), {})
            );
        } catch (err) {
            console.error("Error getting strategy feedback:", err);
            // Provide a user-facing error message directly in the feedback object.
            setStrategyFeedback({
                feedback: 'An error occurred while analyzing your plan. The AI service may be unavailable. Please try again.',
                cognitiveInferences: []
            });
        } finally {
            setIsLoading(false);
        }
    }, [problem, strategy, updateCognitiveProfile]);

    /**
     * Handles the final code submission for AI review.
     * Updates both the cognitive profile and the relevant skill proficiency based on the AI's feedback.
     * Transitions the lab to the final 'feedback' step.
     */
    const handleSubmitCode = useCallback(async () => {
        if (!problem || !code.trim()) return;
        setIsLoading(true);
        try {
            const feedback = await generateCodeFeedback(problem, code);
            setCodeFeedback(feedback);
            // Apply cognitive changes.
            updateCognitiveProfile(
                feedback.cognitiveInferences.reduce((acc, inf) => ({ ...acc, [inf.trait]: inf.change }), {})
            );
            // Update skill proficiency based on correctness.
            const topicSkill = skills.find(s => s.name === problem.topic);
            if (topicSkill) {
                const currentProficiency = topicSkill.proficiency;
                const change = feedback.isCorrect ? 0.05 : -0.02; // Gain proficiency for correct, lose a little for incorrect.
                updateSkillProficiency(topicSkill.id, currentProficiency + change);
            }
            setStep('feedback'); // Move to the final step
        } catch (err) {
            console.error("Error getting code feedback:", err);
            // Provide a user-facing error message and still move to the feedback step.
            setCodeFeedback({
                feedback: "An error occurred while analyzing your code. The AI service may be unavailable. Please try again.",
                isCorrect: false,
                efficiency: 'N/A',
                cognitiveInferences: []
            });
            setStep('feedback');
        } finally {
            setIsLoading(false);
        }
    }, [problem, code, skills, updateCognitiveProfile, updateSkillProficiency]);
    
    /**
     * Resets the entire lab state to start a new problem.
     */
    const handleReset = () => {
        setStep('initial');
        setProblem(null);
        setStrategy('');
        setStrategyFeedback(null);
        setCode('');
        setCodeFeedback(null);
        setSelectedTopics([]);
        setError('');
    };

    // --- Render Logic ---

    // Renders the initial form for generating a new problem.
    const renderInitialStep = () => (
        <Card title="Problem Generation">
            <div className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-text-secondary mb-1">Topic(s)</label>
                    <div className="max-h-40 overflow-y-auto p-2 bg-background-dark rounded-md border border-gray-600">
                        {practiceableSkills.map(skill => (
                            <label key={skill.id} className="flex items-center space-x-2 p-1 rounded hover:bg-gray-700/50 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={selectedTopics.includes(skill.name)}
                                    onChange={() => {
                                        setSelectedTopics(prev => 
                                            prev.includes(skill.name) 
                                            ? prev.filter(t => t !== skill.name) 
                                            : [...prev, skill.name]
                                        );
                                    }}
                                     className="h-4 w-4 rounded bg-gray-700 border-gray-500 text-brand-primary focus:ring-brand-primary"
                                />
                                <span className="text-sm">{skill.name}</span>
                            </label>
                        ))}
                    </div>
                </div>
                <div>
                     <label className="block text-sm font-medium text-text-secondary mb-1">Difficulty</label>
                     <select
                        value={selectedDifficulty}
                        onChange={(e) => setSelectedDifficulty(e.target.value as any)}
                        className="w-full bg-background-dark border border-gray-600 rounded-lg py-2 px-3 text-text-primary focus:outline-none focus:ring-2 focus:ring-brand-primary"
                    >
                        <option>Easy</option>
                        <option>Medium</option>
                        <option>Hard</option>
                    </select>
                </div>
                 {error && <p className="text-sm text-accent-red">{error}</p>}
                <button onClick={handleGenerateProblem} disabled={isLoading} className="w-full bg-brand-primary text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50">
                    {isLoading ? 'Generating...' : 'Generate Problem'}
                </button>
            </div>
        </Card>
    );

    // Renders the UI for the user to write their plan and get feedback.
    const renderPlanningStep = () => (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Card title={problem?.title || 'Problem'}>
                {/* Use dangerouslySetInnerHTML to render Markdown from the AI */}
                <div className="prose prose-invert max-w-none prose-p:text-text-secondary prose-headings:text-text-primary prose-strong:text-text-primary prose-ul:text-text-secondary" dangerouslySetInnerHTML={{ __html: problem?.description || '' }} />
            </Card>
             <Card title="1. Strategy Planner">
                <p className="text-sm text-text-secondary mb-3">Before coding, outline your strategy in plain English. What is your step-by-step approach?</p>
                <textarea
                    value={strategy}
                    onChange={(e) => setStrategy(e.target.value)}
                    rows={8}
                    className="w-full bg-background-dark border border-gray-600 rounded-lg p-2 text-sm"
                    placeholder="e.g., 1. Create a hash map to store frequencies...&#10;2. Iterate through the array..."
                />
                <div className="flex space-x-2 mt-2">
                    <button onClick={handleGetStrategyFeedback} disabled={isLoading || !strategy.trim()} className="flex-1 bg-accent-blue/80 text-white font-bold py-2 px-4 rounded-lg hover:bg-accent-blue transition-colors disabled:opacity-50">
                        Get Feedback on Plan
                    </button>
                    <button onClick={() => setStep('coding')} className="flex-1 bg-brand-primary text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors">
                        Proceed to Code
                    </button>
                </div>
                {isLoading && !strategyFeedback && <div className="mt-4"><LoadingIndicator text="Analyzing your plan..." /></div>}
                {strategyFeedback && <FeedbackDisplay title="AI Feedback on Your Plan" feedback={strategyFeedback.feedback} inferences={strategyFeedback.cognitiveInferences} />}
            </Card>
        </div>
    );

    // Renders the main coding interface.
    const renderCodingStep = () => (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
             <Card title="Problem & Your Plan">
                 <h3 className="font-bold text-lg mb-2">{problem?.title}</h3>
                 <div className="prose prose-invert max-w-none text-sm" dangerouslySetInnerHTML={{ __html: problem?.description || '' }} />
                 <h4 className="font-bold mt-4 border-t border-gray-700 pt-4">Your Plan:</h4>
                 <p className="text-sm text-text-secondary italic whitespace-pre-wrap">{strategy}</p>
             </Card>
              <Card title="2. Code Implementation">
                 <textarea
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    rows={15}
                    className="w-full bg-background-dark border border-gray-600 rounded-lg p-2 text-sm font-mono"
                    placeholder="function solveProblem(args) { ... }"
                />
                 <button onClick={handleSubmitCode} disabled={isLoading || !code.trim()} className="w-full mt-2 bg-accent-green text-white font-bold py-2 px-4 rounded-lg hover:bg-green-600 transition-colors disabled:opacity-50">
                    {isLoading ? 'Submitting...' : 'Submit Solution'}
                </button>
             </Card>
        </div>
    );
    
    // Renders the final feedback report after code submission.
    const renderFeedbackStep = () => (
        <Card title="Solution Review">
            <h2 className="text-xl font-bold mb-2">{problem?.title}</h2>
            {codeFeedback ? (
                 <div className="space-y-4">
                    <div className={`p-3 rounded-lg text-white font-bold text-center ${codeFeedback.isCorrect ? 'bg-accent-green' : 'bg-accent-red'}`}>
                        {codeFeedback.isCorrect ? 'Solution Accepted!' : 'Solution has issues'}
                    </div>
                    <div>
                        <h4 className="font-semibold">Code Submitted:</h4>
                        <pre className="bg-background-dark p-2 rounded-md text-sm font-mono overflow-x-auto"><code>{code}</code></pre>
                    </div>
                    <FeedbackDisplay title="AI Code Review" feedback={codeFeedback.feedback} inferences={codeFeedback.cognitiveInferences} />
                     <p className="text-sm"><span className="font-semibold">Efficiency Analysis:</span> {codeFeedback.efficiency}</p>
                 </div>
            ) : <p>No feedback available.</p>}
            <button onClick={handleReset} className="mt-6 w-full bg-brand-primary text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors">
                Practice Another Problem
            </button>
        </Card>
    );

    /**
     * Main render router for the component.
     * Displays the correct UI based on the current 'step' state.
     */
    const renderContent = () => {
        switch (step) {
            case 'initial': return renderInitialStep();
            case 'planning': return renderPlanningStep();
            case 'coding': return renderCodingStep();
            case 'feedback': return renderFeedbackStep();
            default: return renderInitialStep();
        }
    };
    
    return (
        <div className="space-y-8">
            <div className="flex justify-between items-start">
                 <div>
                    <h1 className="text-3xl font-bold">Practice Lab</h1>
                    <p className="mt-2 text-text-secondary max-w-2xl">
                       Generate problems, plan your strategy, and get AI-powered feedback.
                    </p>
                </div>
                {step !== 'initial' && <button onClick={handleReset} className="text-sm text-accent-red hover:underline">Start Over</button>}
            </div>
            {renderContent()}
        </div>
    );
};
