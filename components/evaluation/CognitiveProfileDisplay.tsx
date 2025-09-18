import React from 'react';
import { Card } from '../shared/Card';
import { useUser } from '../../contexts/UserContext';
import { CognitiveProfile } from '../../types';

const traitLabels: { [key in keyof CognitiveProfile]: string } = {
    logicalReasoning: 'Logical Reasoning',
    abstractThinking: 'Abstract Thinking',
    patternRecognition: 'Pattern Recognition',
    attentionToDetail: 'Attention to Detail',
};

const traitDescriptions: { [key in keyof CognitiveProfile]: string } = {
    logicalReasoning: 'Ability to construct step-by-step, correct solutions.',
    abstractThinking: 'Ability to devise efficient, non-obvious algorithms and data structures.',
    patternRecognition: 'Ability to identify underlying problem types and apply known solutions.',
    attentionToDetail: 'Ability to handle edge cases, constraints, and avoid off-by-one errors.',
};

export const CognitiveProfileDisplay: React.FC<{ isTeacherView?: boolean }> = ({ isTeacherView = false }) => {
    const { user, updateCognitiveProfile } = useUser();
    const profile = user.cognitiveProfile;

    const handleAdjustment = (trait: keyof CognitiveProfile, value: number) => {
        const oldValue = profile[trait];
        const change = value - oldValue;
        // In a real app, this would also require a justification popup.
        // For now, we directly call the update function.
        updateCognitiveProfile({ [trait]: change });
    };

    return (
        <Card title="Cognitive Profile">
             <p className="text-sm text-text-secondary mb-4">
                {isTeacherView 
                    ? "Adjust the student's AI-estimated profile based on your observations. Your input refines the AI's future recommendations."
                    : "This profile is estimated by our AI based on your code submissions in the Practice Lab. It reflects your problem-solving tendencies."
                }
            </p>
            <div className="space-y-4">
                {(Object.keys(profile) as Array<keyof CognitiveProfile>).map(trait => {
                    const value = profile[trait];
                    const percentage = (value / 5) * 100;
                    return (
                        <div key={trait} className="group relative">
                            <div className="flex justify-between items-baseline mb-1">
                                <p className="text-sm font-medium text-text-primary">{traitLabels[trait]}</p>
                                <p className="text-xs text-text-secondary">{value.toFixed(1)} / 5</p>
                            </div>
                            {isTeacherView ? (
                                <input
                                    type="range"
                                    min="1"
                                    max="5"
                                    step="0.1"
                                    value={value}
                                    onChange={(e) => handleAdjustment(trait, parseFloat(e.target.value))}
                                    className="w-full h-2.5 bg-background-dark rounded-full appearance-none cursor-pointer accent-brand-primary"
                                />
                            ) : (
                                <div className="w-full bg-background-dark rounded-full h-2.5">
                                    <div
                                        className="bg-brand-primary h-2.5 rounded-full transition-all duration-500"
                                        style={{ width: `${percentage}%` }}
                                    ></div>
                                </div>
                            )}
                            <div className="pointer-events-none absolute -top-10 left-1/2 -translate-x-1/2 w-max opacity-0 transition-opacity group-hover:opacity-100 z-10">
                                 <div className="rounded-lg bg-gray-900 px-3 py-2 text-xs font-semibold text-white shadow-lg border border-gray-700">
                                   {traitDescriptions[trait]}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </Card>
    );
};