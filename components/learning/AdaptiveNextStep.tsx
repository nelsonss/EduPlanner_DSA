import React, { useState, useCallback } from 'react';
import { LearningPath } from '../../types';
import { useUser } from '../../contexts/UserContext';
import { useSkills } from '../../contexts/SkillContext';
import { generateAdaptiveLearningStep } from '../../services/geminiService';
import { Icon } from '../shared/Icon';

export const AdaptiveNextStep: React.FC<{ path: LearningPath }> = ({ path }) => {
    const { user } = useUser();
    const { skills } = useSkills();
    const [recommendation, setRecommendation] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleGetRecommendation = useCallback(async () => {
        setIsLoading(true);
        try {
            const result = await generateAdaptiveLearningStep(path, user, skills);
            setRecommendation(result);
        } catch (error) {
            setRecommendation("Could not generate a recommendation at this time.");
            console.error("Error generating adaptive step:", error);
        } finally {
            setIsLoading(false);
        }
    }, [path, user, skills]);

    return (
        <div className="my-6 p-4 bg-blue-900/30 rounded-lg border border-brand-primary/50">
            <h3 className="font-semibold text-text-primary mb-2 flex items-center">
                <Icon name="suggestion" className="h-5 w-5 mr-2 text-brand-primary" />
                Adaptive Next Step
            </h3>
            {recommendation ? (
                <p className="text-sm text-text-secondary italic">{recommendation}</p>
            ) : (
                <>
                    <p className="text-sm text-text-secondary mb-3">Not sure what to do next? Let our AI Analyst recommend the most effective step for you based on your progress and learning style.</p>
                    <button
                        onClick={handleGetRecommendation}
                        disabled={isLoading}
                        className="w-full bg-brand-primary text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50 flex items-center justify-center"
                    >
                        {isLoading ? (
                            <>
                                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Analyzing...
                            </>
                        ) : "What's Next?"}
                    </button>
                </>
            )}
        </div>
    );
};