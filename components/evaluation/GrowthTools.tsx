import React, { useState, useMemo } from 'react';
import { Card } from '../shared/Card';
import { GOALS_DATA } from '../../constants';
import { Goal, SkillStatus, getSkillStatus } from '../../types';
import { Icon } from '../shared/Icon';
import { useSkills } from '../../contexts/SkillContext';

export const GrowthTools: React.FC = () => {
    const { skills } = useSkills();
    const [goals, setGoals] = useState<Goal[]>(GOALS_DATA);
    
    const reinforcementSkills = useMemo(() => {
        return skills.filter(skill => getSkillStatus(skill.proficiency) === SkillStatus.Reinforcement);
    }, [skills]);

    return (
        <Card title="Interactivity & Growth Tools">
            <div className="space-y-6">
                {/* Challenge Me! */}
                <div>
                    <h4 className="font-semibold text-text-primary mb-2">Personalized "Challenge Me!"</h4>
                    <p className="text-sm text-text-secondary mb-3">Generate a problem specifically designed to target your weakest area based on your performance data.</p>
                    <button className="w-full bg-accent-yellow text-background-dark font-bold py-2 px-4 rounded-lg hover:bg-yellow-500 transition-colors">
                        Challenge Me!
                    </button>
                </div>

                {/* Spaced Repetition Deck */}
                <div>
                    <h4 className="font-semibold text-text-primary mb-2">Spaced Repetition Deck</h4>
                     <div className="space-y-2">
                        {reinforcementSkills.length > 0 ? (
                            reinforcementSkills.map(item => (
                                <div key={item.id} className="p-3 bg-background-dark rounded-lg flex justify-between items-center">
                                   <div>
                                       <p className="text-sm font-medium text-text-primary">{item.name}</p>
                                       <p className="text-xs text-text-secondary">Proficiency: {Math.round(item.proficiency * 100)}%</p>
                                   </div>
                                   <span className="text-xs font-semibold text-accent-blue">Review Now</span>
                                </div>
                            ))
                        ) : (
                            <p className="text-sm text-text-secondary p-3 bg-background-dark rounded-lg">Your knowledge is solid! No skills need immediate reinforcement.</p>
                        )}
                    </div>
                </div>

                {/* Interactive Goal Setting */}
                <div>
                     <h4 className="font-semibold text-text-primary mb-3">Interactive Goal Setting</h4>
                     <div className="space-y-4">
                        {goals.map(goal => {
                            const progress = Math.min((goal.current / goal.target) * 100, 100);
                            return (
                                <div key={goal.id}>
                                    <div className="flex justify-between items-baseline mb-1">
                                        <p className="text-sm font-medium text-text-primary">{goal.title}</p>
                                        <p className="text-xs text-text-secondary">{goal.current} / {goal.target} {goal.unit}</p>
                                    </div>
                                    <div className="w-full bg-background-dark rounded-full h-2.5">
                                        <div className="bg-brand-primary h-2.5 rounded-full" style={{ width: `${progress}%` }}></div>
                                    </div>
                                </div>
                            );
                        })}
                        <button className="w-full mt-2 text-sm text-brand-primary hover:underline flex items-center justify-center">
                            <Icon name="plus" className="h-4 w-4 mr-1" />
                            Add New Goal
                        </button>
                     </div>
                </div>
            </div>
        </Card>
    );
};