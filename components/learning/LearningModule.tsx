import React, { useState, useEffect } from 'react';
import { useSkills } from '../../contexts/SkillContext';
import { generateLearningModuleContent, generateDeeperExplanation } from '../../services/geminiService';
import { LearningModuleContent, QuizQuestion, SkillNode } from '../../types';
import { Icon } from '../shared/Icon';
import { AlgorithmVisualizer } from './AlgorithmVisualizer';
import { useUser } from '../../contexts/UserContext';

const QuizComponent: React.FC<{ quiz: QuizQuestion }> = ({ quiz }) => {
    const [selectedOption, setSelectedOption] = useState<string | null>(null);
    const [isSubmitted, setIsSubmitted] = useState(false);
    
    const handleSubmit = () => {
        if (selectedOption !== null) {
            setIsSubmitted(true);
        }
    };

    return (
        <div className="my-6 p-4 bg-background-dark rounded-lg border border-gray-700">
            <h4 className="font-semibold text-text-primary mb-3">Check Your Understanding</h4>
            <p className="text-sm text-text-secondary mb-4">{quiz.question}</p>
            <div className="space-y-2">
                {quiz.options.map((option, index) => {
                    let bgColor = 'bg-gray-800/50 hover:bg-gray-700';
                    if (isSubmitted) {
                        if (option === quiz.correctAnswer) {
                            bgColor = 'bg-accent-green/50';
                        } else if (option === selectedOption) {
                            bgColor = 'bg-accent-red/50';
                        }
                    }

                    return (
                        <button
                            key={index}
                            onClick={() => !isSubmitted && setSelectedOption(option)}
                            className={`w-full text-left p-3 rounded-md text-sm transition-colors disabled:cursor-not-allowed ${bgColor} ${selectedOption === option && !isSubmitted ? 'ring-2 ring-brand-primary' : ''}`}
                            disabled={isSubmitted}
                        >
                            {option}
                        </button>
                    );
                })}
            </div>
            {!isSubmitted ? (
                 <button onClick={handleSubmit} disabled={selectedOption === null} className="mt-4 bg-brand-primary text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50">
                    Submit
                </button>
            ) : (
                <div className="mt-4 p-3 text-sm bg-gray-900 rounded-md">
                   <p className="font-bold">{selectedOption === quiz.correctAnswer ? 'Correct!' : 'Not quite.'}</p>
                   <p className="text-text-secondary mt-1">{quiz.explanation}</p>
                </div>
            )}
        </div>
    );
};


export const LearningModule: React.FC<{ skillId: string, onClose: () => void }> = ({ skillId, onClose }) => {
    const { skillMap } = useSkills();
    const { user } = useUser();
    const [skill, setSkill] = useState<SkillNode | null>(null);
    const [moduleContent, setModuleContent] = useState<LearningModuleContent | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [detailedExplanation, setDetailedExplanation] = useState<{ [key: number]: string }>({});
    const [isExplanationLoading, setIsExplanationLoading] = useState<number | null>(null);

    useEffect(() => {
        const fetchContent = async (currentSkill: SkillNode) => {
            setIsLoading(true);
            setError(null);
            try {
                const content = await generateLearningModuleContent(currentSkill, user);
                setModuleContent(content);
            } catch (err) {
                console.error("Error generating learning module:", err);
                setError('Failed to generate learning content. The AI service may be unavailable.');
            } finally {
                setIsLoading(false);
            }
        };

        const currentSkill = skillMap.get(skillId);
        if (currentSkill) {
            setSkill(currentSkill);
            fetchContent(currentSkill);
        } else {
            setError('Skill not found.');
            setIsLoading(false);
        }
    }, [skillId, skillMap, user]);

    const handleExplainFurther = async (sectionIndex: number) => {
        if (!skill || !moduleContent) return;

        setIsExplanationLoading(sectionIndex);
        try {
            const section = moduleContent.sections[sectionIndex];
            const explanation = await generateDeeperExplanation(skill.name, section.title, section.explanation);
            
            setDetailedExplanation(prev => ({
                ...prev,
                [sectionIndex]: explanation,
            }));
        } catch (err) {
            console.error("Error generating deeper explanation:", err);
            setDetailedExplanation(prev => ({
                ...prev,
                [sectionIndex]: "Could not generate a more detailed explanation at this time. Please try again later.",
            }));
        } finally {
            setIsExplanationLoading(null);
        }
    };

    const renderContent = () => {
        if (isLoading) {
            return <div className="text-center p-10"><p className="animate-pulse">Generating your personalized learning module...</p></div>;
        }
        if (error) {
            return <div className="text-center p-10 text-accent-red">{error}</div>;
        }
        if (moduleContent) {
            return (
                <div className="space-y-8">
                    {moduleContent.sections.map((section, index) => (
                        <div key={index}>
                            <h2 className="text-2xl font-bold border-b-2 border-brand-primary pb-2 mb-4">{section.title}</h2>
                            <p className="text-text-secondary leading-relaxed whitespace-pre-wrap">{section.explanation}</p>
                            
                            {detailedExplanation[index] ? (
                                <div className="mt-4 p-4 bg-background-dark rounded-md border-l-2 border-accent-blue">
                                    <h4 className="font-semibold text-gray-900 dark:text-text-primary mb-2 flex items-center">
                                        <Icon name="suggestion" className="h-5 w-5 mr-2 text-accent-blue" /> Deeper Dive
                                    </h4>
                                    <p className="text-sm text-text-secondary whitespace-pre-wrap">{detailedExplanation[index]}</p>
                                    <button
                                        onClick={() => setDetailedExplanation(prev => {
                                            const newExplanations = {...prev};
                                            delete newExplanations[index];
                                            return newExplanations;
                                        })}
                                        className="text-xs mt-3 text-brand-primary hover:underline"
                                    >
                                        Hide Explanation
                                    </button>
                                </div>
                            ) : (
                                <div className="mt-4">
                                    <button
                                        onClick={() => handleExplainFurther(index)}
                                        disabled={isExplanationLoading === index}
                                        className="flex items-center text-sm text-brand-primary hover:underline disabled:opacity-50 disabled:cursor-wait"
                                    >
                                        {isExplanationLoading === index ? (
                                            <>
                                                <svg className="animate-spin -ml-1 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                                                Generating...
                                            </>
                                        ) : 'Explain Further'}
                                    </button>
                                </div>
                            )}

                            {section.visualizer === 'stack' && <AlgorithmVisualizer />}
                            {section.quiz && <QuizComponent quiz={section.quiz} />}
                        </div>
                    ))}
                </div>
            );
        }
        return null;
    };

    return (
        <div className="max-w-4xl mx-auto">
             <button onClick={onClose} className="flex items-center text-sm text-brand-primary hover:underline mb-6">
                <Icon name="chevron-down" className="h-4 w-4 mr-1 transform -rotate-90" />
                Back to Learning Path
            </button>
            <div className="bg-background-light p-8 rounded-lg shadow-xl">
                 <h1 className="text-4xl font-bold mb-2">{skill?.name}</h1>
                 <p className="text-lg text-text-secondary mb-8">{skill?.description}</p>
                {renderContent()}
            </div>
        </div>
    );
};