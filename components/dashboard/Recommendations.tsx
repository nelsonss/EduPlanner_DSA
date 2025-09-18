import React, { useState } from 'react';
import { Card } from '../shared/Card';
import { RECOMMENDATIONS_DATA } from '../../constants';
import { Recommendation, RecommendationType } from '../../types';
import { Icon } from '../shared/Icon';
import { generateJustification } from '../../services/geminiService';
import { useUser } from '../../contexts/UserContext';
import { useSkills } from '../../contexts/SkillContext';

const typeIcons: { [key in RecommendationType]: string } = {
    [RecommendationType.Coding]: 'code',
    [RecommendationType.Lecture]: 'lecture',
    [RecommendationType.Project]: 'lab',
    [RecommendationType.Quiz]: 'quiz',
    [RecommendationType.Reinforcement]: 'reinforcement',
    // FIX: Added missing 'Adaptive' type to match the RecommendationType enum.
    [RecommendationType.Adaptive]: 'suggestion',
};

const RecommendationCard: React.FC<{ rec: Recommendation }> = ({ rec }) => {
    const { user } = useUser();
    const { skills } = useSkills();
    const [justification, setJustification] = useState(rec.justification);
    const [isLoading, setIsLoading] = useState(false);

    const handleGenerateJustification = async () => {
        setIsLoading(true);
        try {
            const newJustification = await generateJustification(rec.title, user, skills);
            setJustification(newJustification);
        } catch (error) {
            setJustification("Justification could not be generated at this time.");
            console.error("Error generating justification:", error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="bg-background-light p-4 rounded-lg flex items-start space-x-4 hover:bg-gray-700 transition-colors">
            <div className="text-brand-primary mt-1">
                <Icon name={typeIcons[rec.type]} className="h-6 w-6" />
            </div>
            <div className="flex-1">
                <h4 className="font-semibold text-text-primary">{rec.title}</h4>
                <p className="text-sm text-text-secondary mt-1">{rec.description}</p>
                <div className="flex items-center space-x-4 text-xs text-text-secondary mt-3">
                    <div className="flex items-center"><Icon name="clock" className="h-4 w-4 mr-1" /> {rec.estimatedTime}</div>
                    <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                            <Icon key={i} name="star" className={`h-4 w-4 ${i < rec.difficulty ? 'text-yellow-400' : 'text-gray-600'}`} />
                        ))}
                    </div>
                </div>
                {justification && (
                     <div className="mt-3 p-3 bg-gray-900/50 rounded-md text-xs italic text-text-secondary border-l-2 border-brand-primary">
                        {isLoading ? <span className="animate-pulse">Thinking...</span> : justification}
                    </div>
                )}
                 {!rec.justification && (
                    <button onClick={handleGenerateJustification} disabled={isLoading} className="text-xs mt-2 text-brand-primary hover:underline disabled:opacity-50">
                        {isLoading ? 'Generating...' : 'Why am I seeing this?'}
                    </button>
                )}
            </div>
            <button className="self-center bg-brand-primary text-white font-bold py-2 px-4 rounded-lg text-sm hover:bg-blue-600 transition-colors">
                Start
            </button>
        </div>
    );
};

export const Recommendations: React.FC = () => {
    return (
        <Card title="Intelligent Recommendations">
            <div className="space-y-4">
                {RECOMMENDATIONS_DATA.map(rec => (
                    <RecommendationCard key={rec.id} rec={rec} />
                ))}
            </div>
        </Card>
    );
};