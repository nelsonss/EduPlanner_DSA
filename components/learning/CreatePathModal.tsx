import React, { useState } from 'react';
import { Modal } from '../shared/Modal';
import { SKILL_TREE_DATA } from '../../constants';
import { LearningPath } from '../../types';

interface CreatePathModalProps {
    onClose: () => void;
    onSave: (pathData: Omit<LearningPath, 'id' | 'isCustom'>) => void;
}

export const CreatePathModal: React.FC<CreatePathModalProps> = ({ onClose, onSave }) => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [selectedSkillIds, setSelectedSkillIds] = useState<Set<string>>(new Set());
    const [error, setError] = useState('');

    const handleSkillToggle = (skillId: string) => {
        setSelectedSkillIds(prev => {
            const newSet = new Set(prev);
            if (newSet.has(skillId)) {
                newSet.delete(skillId);
            } else {
                newSet.add(skillId);
            }
            return newSet;
        });
    };

    const handleSubmit = () => {
        if (!title.trim()) {
            setError('Path title is required.');
            return;
        }
        if (selectedSkillIds.size === 0) {
            setError('Please select at least one skill.');
            return;
        }
        setError('');
        onSave({
            title,
            description,
            skillIds: Array.from(selectedSkillIds),
        });
        onClose();
    };

    return (
        <Modal title="Create Custom Learning Path" onClose={onClose}>
            <div className="space-y-4">
                <div>
                    <label htmlFor="path-title" className="block text-sm font-medium text-text-secondary mb-1">Path Title</label>
                    <input
                        type="text"
                        id="path-title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="w-full bg-background-dark border border-gray-600 rounded-lg py-2 px-3 text-text-primary focus:outline-none focus:ring-2 focus:ring-brand-primary"
                        placeholder="e.g., Advanced Algorithms Prep"
                    />
                </div>
                <div>
                    <label htmlFor="path-description" className="block text-sm font-medium text-text-secondary mb-1">Description</label>
                    <textarea
                        id="path-description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        rows={3}
                        className="w-full bg-background-dark border border-gray-600 rounded-lg py-2 px-3 text-text-primary focus:outline-none focus:ring-2 focus:ring-brand-primary"
                        placeholder="A brief description of this learning path."
                    />
                </div>
                <div>
                    <h4 className="text-sm font-medium text-text-secondary mb-2">Select Skills</h4>
                    <div className="max-h-60 overflow-y-auto p-3 bg-background-dark rounded-lg border border-gray-600 space-y-2">
                        {SKILL_TREE_DATA.map(skill => (
                            <label key={skill.id} className="flex items-center space-x-3 cursor-pointer p-2 rounded-md hover:bg-gray-700/50">
                                <input
                                    type="checkbox"
                                    checked={selectedSkillIds.has(skill.id)}
                                    onChange={() => handleSkillToggle(skill.id)}
                                    className="h-4 w-4 rounded bg-gray-700 border-gray-500 text-brand-primary focus:ring-brand-primary"
                                />
                                <span className="text-text-primary">{skill.name}</span>
                            </label>
                        ))}
                    </div>
                </div>
                {error && <p className="text-sm text-accent-red">{error}</p>}
                <div className="flex justify-end space-x-3 pt-2">
                    <button onClick={onClose} className="py-2 px-4 rounded-lg text-text-secondary hover:bg-gray-700 transition-colors">
                        Cancel
                    </button>
                    <button onClick={handleSubmit} className="bg-brand-primary text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors">
                        Save Path
                    </button>
                </div>
            </div>
        </Modal>
    );
};