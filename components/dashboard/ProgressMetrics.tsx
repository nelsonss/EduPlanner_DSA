import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { Card } from '../shared/Card';
import { PROGRESS_METRICS_DATA } from '../../constants';
import { SkillStatus, getSkillStatus } from '../../types';
import { Icon } from '../shared/Icon';
import { useSkills } from '../../contexts/SkillContext';

const Badge: React.FC<{ icon: string; label: string }> = ({ icon, label }) => (
    <div className="flex flex-col items-center p-2 bg-background-light rounded-lg">
        <div className="p-2 bg-gray-700 rounded-full text-brand-primary"><Icon name={icon} /></div>
        <span className="text-xs mt-1 text-center text-text-secondary">{label}</span>
    </div>
);


export const ProgressMetrics: React.FC = () => {
    const { skills } = useSkills();

    const totalSkills = skills.filter(s => !s.isParent).length;
    const masteredSkills = skills.filter(s => !s.isParent && getSkillStatus(s.proficiency) === SkillStatus.Mastered).length;
    const completion = totalSkills > 0 ? Math.round((masteredSkills / totalSkills) * 100) : 0;

    return (
        <div className="space-y-6 lg:space-y-8">
            <Card title="Overall Progress">
                <div className="flex items-center justify-center space-x-4">
                    <div className="relative h-24 w-24">
                        <svg className="w-full h-full" viewBox="0 0 36 36">
                            <path
                                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                                fill="none"
                                stroke="#374151"
                                strokeWidth="3"
                            />
                            <path
                                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                                fill="none"
                                stroke="#007BFF"
                                strokeWidth="3"
                                strokeDasharray={`${completion}, 100`}
                                strokeLinecap="round"
                            />
                        </svg>
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-xl font-bold">
                            {completion}%
                        </div>
                    </div>
                    <div className="text-sm">
                        <p className="font-semibold">{masteredSkills} / {totalSkills}</p>
                        <p className="text-text-secondary">Skills Mastered</p>
                    </div>
                </div>
            </Card>

            <Card title="Study Streak">
                 <div className="text-center">
                    <p className="text-4xl font-bold text-yellow-400">12</p>
                    <p className="text-text-secondary">Consecutive Days</p>
                </div>
                 <div className="grid grid-cols-2 gap-4 mt-4">
                    <Badge icon="linkedlist" label="Link Legend" />
                    <Badge icon="dashboard" label="Array Apprentice" />
                </div>
            </Card>

            <Card title="Study Time (Last 7 Days)">
                <div className="h-40">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={PROGRESS_METRICS_DATA} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#4a5568" />
                            <XAxis dataKey="date" fontSize={12} tick={{ fill: '#a0aec0' }} stroke="#a0aec0"/>
                            <YAxis fontSize={12} tick={{ fill: '#a0aec0' }} stroke="#a0aec0"/>
                            <Tooltip contentStyle={{ backgroundColor: '#2d3748', border: '1px solid #4a5568' }}/>
                            <Bar dataKey="studyTime" fill="#007BFF" name="Minutes" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </Card>
        </div>
    );
};
