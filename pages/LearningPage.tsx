import React, { useState } from 'react';
import { Card } from '../components/shared/Card';
import { LEARNING_PATHS_DATA } from '../constants';
import { useSkills } from '../contexts/SkillContext';
import { getSkillStatus, SkillStatus, LearningPath } from '../types';
import { Icon } from '../components/shared/Icon';
import { CreatePathModal } from '../components/learning/CreatePathModal';
import { useCustomLearningPaths } from '../hooks/useCustomLearningPaths';
import { AdaptiveNextStep } from '../components/learning/AdaptiveNextStep';
import { LearningModule } from '../components/learning/LearningModule';

const PathCard: React.FC<{
    path: LearningPath;
    progress: number;
    onStartPath: (path: LearningPath) => void;
    onDeletePath?: (id: string) => void;
}> = ({ path, progress, onStartPath, onDeletePath }) => (
    <Card title={path.title}>
        <div className="flex flex-col h-full">
            <p className="text-sm text-text-secondary flex-grow">{path.description}</p>

            <div className="my-4">
                <div className="flex justify-between items-baseline mb-1">
                    <p className="text-sm font-medium text-text-primary">Progress</p>
                    <p className="text-xs text-text-secondary">{progress}%</p>
                </div>
                <div className="w-full bg-background-dark rounded-full h-2.5">
                    <div className="bg-brand-primary h-2.5 rounded-full" style={{ width: `${progress}%` }}></div>
                </div>
            </div>

            <div className="flex justify-between items-center mt-2">
                 <button 
                    onClick={() => onStartPath(path)}
                    className="bg-brand-primary text-white font-bold py-2 px-4 rounded-lg text-sm hover:bg-blue-600 transition-colors"
                >
                    {progress > 0 && progress < 100 ? 'Continue Path' : 'Start Path'}
                </button>
                {path.isCustom && onDeletePath && (
                    <button 
                        onClick={() => onDeletePath(path.id)} 
                        className="text-sm text-accent-red hover:underline self-start flex items-center"
                    >
                        <Icon name="trash" className="h-4 w-4 mr-1" />
                        Delete
                    </button>
                )}
            </div>
        </div>
    </Card>
);

const PathDetailView: React.FC<{
    path: LearningPath;
    onBack: () => void;
    onStartLearn: (skillId: string) => void;
}> = ({ path, onBack, onStartLearn }) => {
    const { skillMap } = useSkills();
    return (
        <div>
            <button onClick={onBack} className="flex items-center text-sm text-brand-primary hover:underline mb-4">
                <Icon name="chevron-down" className="h-4 w-4 mr-1 transform -rotate-90" />
                Back to All Paths
            </button>
            <h1 className="text-3xl font-bold">{path.title}</h1>
            <p className="mt-2 text-text-secondary max-w-2xl">{path.description}</p>
            
            <AdaptiveNextStep path={path} />

            <div className="mt-8 space-y-4">
                {path.skillIds.map(skillId => {
                    const skill = skillMap.get(skillId);
                    if (!skill) return null;
                     const status = getSkillStatus(skill.proficiency);
                     const isCompleted = status === SkillStatus.Mastered;
                    return (
                        <div key={skillId} onClick={() => onStartLearn(skillId)} className="p-4 bg-background-light rounded-lg flex items-center justify-between cursor-pointer hover:ring-2 ring-brand-primary transition-all">
                            <div>
                                <h3 className="font-semibold text-text-primary">{skill.name}</h3>
                                <p className="text-sm text-text-secondary">{skill.description}</p>
                            </div>
                            <div className={`p-2 rounded-full ${isCompleted ? 'bg-accent-green' : 'bg-gray-700'}`}>
                                <Icon name={isCompleted ? 'check' : 'learn'} className="h-5 w-5 text-white" />
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};


export const LearningPage: React.FC = () => {
    const { skillMap } = useSkills();
    const { customPaths, addCustomPath, deleteCustomPath } = useCustomLearningPaths();
    const [isCreateModalOpen, setCreateModalOpen] = useState(false);
    
    // State to manage view
    const [activePath, setActivePath] = useState<LearningPath | null>(null);
    const [activeSkillId, setActiveSkillId] = useState<string | null>(null);

    const allPaths = [...LEARNING_PATHS_DATA, ...customPaths];

    const getPathProgress = (skillIds: string[]): number => {
        const masteredCount = skillIds.filter(id => {
            const skill = skillMap.get(id);
            return skill && getSkillStatus(skill.proficiency) === SkillStatus.Mastered;
        }).length;
        return skillIds.length > 0 ? Math.round((masteredCount / skillIds.length) * 100) : 0;
    };

    // If a skill is being learned, show the module
    if (activeSkillId) {
        return <LearningModule skillId={activeSkillId} onClose={() => setActiveSkillId(null)} />;
    }

    // If a path is selected, show its details
    if (activePath) {
        return <PathDetailView path={activePath} onBack={() => setActivePath(null)} onStartLearn={setActiveSkillId} />;
    }
    
    // Default view: Show all learning paths
    return (
        <div className="space-y-8">
            {isCreateModalOpen && (
                <CreatePathModal
                    onClose={() => setCreateModalOpen(false)}
                    onSave={addCustomPath}
                />
            )}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold">Learning Paths</h1>
                    <p className="mt-2 text-text-secondary max-w-2xl">
                        Follow our curated paths or create your own to guide your learning journey.
                    </p>
                </div>
                <button
                    onClick={() => setCreateModalOpen(true)}
                    className="flex items-center bg-brand-primary text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors"
                >
                    <Icon name="plus" className="h-5 w-5 mr-2" />
                    Create Path
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {allPaths.map(path => (
                    <PathCard
                        key={path.id}
                        path={path}
                        progress={getPathProgress(path.skillIds)}
                        onStartPath={setActivePath}
                        onDeletePath={path.isCustom ? deleteCustomPath : undefined}
                    />
                ))}
            </div>
        </div>
    );
};