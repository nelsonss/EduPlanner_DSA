import { useState, useEffect } from 'react';
import { LearningPath } from '../types';

const STORAGE_KEY = 'customLearningPaths';

export const useCustomLearningPaths = () => {
    const [customPaths, setCustomPaths] = useState<LearningPath[]>([]);

    useEffect(() => {
        try {
            const item = window.localStorage.getItem(STORAGE_KEY);
            if (item) {
                setCustomPaths(JSON.parse(item));
            }
        } catch (error) {
            console.warn(`Error reading localStorage key “${STORAGE_KEY}”:`, error);
        }
    }, []);

    const savePaths = (paths: LearningPath[]) => {
        try {
            setCustomPaths(paths);
            window.localStorage.setItem(STORAGE_KEY, JSON.stringify(paths));
        } catch (error) {
            console.warn(`Error setting localStorage key “${STORAGE_KEY}”:`, error);
        }
    };

    const addCustomPath = (pathData: Omit<LearningPath, 'id' | 'isCustom'>) => {
        const newPath: LearningPath = {
            ...pathData,
            id: `custom-${Date.now()}`,
            isCustom: true,
        };
        savePaths([...customPaths, newPath]);
    };

    const deleteCustomPath = (pathId: string) => {
        const updatedPaths = customPaths.filter(path => path.id !== pathId);
        savePaths(updatedPaths);
    };

    return { customPaths, addCustomPath, deleteCustomPath };
};
