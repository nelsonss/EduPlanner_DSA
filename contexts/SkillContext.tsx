import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { SkillNode } from '../types';
import { SKILL_TREE_DATA } from '../constants';

interface SkillContextType {
    skills: SkillNode[];
    skillMap: Map<string, SkillNode>;
    updateSkillProficiency: (skillId: string, newProficiency: number) => void;
}

const SkillContext = createContext<SkillContextType | undefined>(undefined);

const DECAY_RATE = 0.005; // Proficiency decay per day for inactive skills
const PROFICIENCY_THRESHOLD_MASTERED = 0.9;
const PROFICIENCY_THRESHOLD_REINFORCEMENT = 0.6;


export const SkillProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [skills, setSkills] = useState<SkillNode[]>(() => {
        const today = new Date();
        // Apply knowledge decay on initial load
        return SKILL_TREE_DATA.map(skill => {
            if (skill.proficiency >= PROFICIENCY_THRESHOLD_MASTERED) {
                const lastPracticed = new Date(skill.lastPracticed);
                const daysSincePracticed = Math.floor((today.getTime() - lastPracticed.getTime()) / (1000 * 3600 * 24));
                
                if (daysSincePracticed > 7) { // Start decaying after a week of inactivity
                    const decayAmount = (daysSincePracticed - 7) * DECAY_RATE;
                    const newProficiency = Math.max(PROFICIENCY_THRESHOLD_REINFORCEMENT - 0.1, skill.proficiency - decayAmount);
                    return { ...skill, proficiency: newProficiency };
                }
            }
            return skill;
        });
    });

    const skillMap = useMemo(() => {
        const map = new Map<string, SkillNode>();
        skills.forEach(skill => map.set(skill.id, skill));
        return map;
    }, [skills]);

    const updateSkillProficiency = (skillId: string, newProficiency: number) => {
        setSkills(prevSkills => 
            prevSkills.map(skill => 
                skill.id === skillId 
                ? { ...skill, proficiency: Math.max(0, Math.min(1, newProficiency)), lastPracticed: new Date().toISOString() } 
                : skill
            )
        );
    };

    const value = useMemo(() => ({ skills, skillMap, updateSkillProficiency }), [skills, skillMap]);

    return (
        <SkillContext.Provider value={value}>
            {children}
        </SkillContext.Provider>
    );
};

export const useSkills = (): SkillContextType => {
    const context = useContext(SkillContext);
    if (context === undefined) {
        throw new Error('useSkills must be used within a SkillProvider');
    }
    return context;
};