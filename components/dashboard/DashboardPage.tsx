import React from 'react';
import { SkillTree } from './SkillTree';
import { ProgressMetrics } from './ProgressMetrics';
import { Recommendations } from './Recommendations';
import { NotificationsPanel } from './NotificationsPanel';
import { Card } from '../shared/Card';
import { useSkills } from '../../contexts/SkillContext';

export const DashboardPage: React.FC = () => {
    const { skills, skillMap } = useSkills();
    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-8">
            <div className="lg:col-span-2 xl:col-span-3">
                <Card title="Skill-Tree Visualizer" fullHeight>
                    <SkillTree skills={skills} skillMap={skillMap} />
                </Card>
            </div>
            <div className="lg:col-span-1 xl:col-span-1 space-y-6 lg:space-y-8">
                 <ProgressMetrics />
            </div>
            <div className="lg:col-span-3 xl:col-span-2">
                <Recommendations />
            </div>
             <div className="lg:col-span-3 xl:col-span-2">
                <NotificationsPanel />
            </div>
        </div>
    );
};
