import React, { createContext, useContext, useMemo, useState, useEffect } from 'react';
import { UserProfileData, CognitiveProfile, getSkillStatus, SkillStatus } from '../types';
import { USER_DATA, BADGES_DATA } from '../constants';
import { useSkills } from './SkillContext';

interface UserContextType {
    user: UserProfileData;
    updateCognitiveProfile: (updates: Partial<CognitiveProfile>) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { skills } = useSkills();
    const [user, setUser] = useState<UserProfileData>(USER_DATA);

    useEffect(() => {
        const masteredSkills = skills.filter(skill => getSkillStatus(skill.proficiency) === SkillStatus.Mastered);
        const masteredSkillIds = new Set(masteredSkills.map(skill => skill.id));
        
        const points = masteredSkills.length * 100;
        
        const earnedBadgeIds = BADGES_DATA
            .filter(badge => badge.condition(masteredSkillIds))
            .map(badge => badge.id);

        setUser(prevUser => ({
            ...prevUser,
            points,
            earnedBadgeIds
        }));

    }, [skills]);

    const updateCognitiveProfile = (updates: Partial<CognitiveProfile>) => {
        setUser(prevUser => {
            const newProfile = { ...prevUser.cognitiveProfile };
            for (const key in updates) {
                const trait = key as keyof CognitiveProfile;
                newProfile[trait] = Math.max(1, Math.min(5, (newProfile[trait] || 3) + (updates[trait] || 0)));
            }
            return {
                ...prevUser,
                cognitiveProfile: newProfile,
            };
        });
    };

    const value = useMemo(() => ({ user, updateCognitiveProfile }), [user]);

    return (
        <UserContext.Provider value={value}>
            {children}
        </UserContext.Provider>
    );
};

export const useUser = (): UserContextType => {
    const context = useContext(UserContext);
    if (!context) {
        throw new Error('useUser must be used within a UserProvider');
    }
    return context;
};