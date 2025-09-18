import React from 'react';

interface CardProps {
    title: string;
    children: React.ReactNode;
    fullHeight?: boolean;
}

export const Card: React.FC<CardProps> = ({ title, children, fullHeight = false }) => {
    return (
        <div className={`bg-white dark:bg-background-light rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 flex flex-col ${fullHeight ? 'h-full' : ''}`}>
            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-text-primary">{title}</h3>
            </div>
            <div className="p-4 flex-grow">
                {children}
            </div>
        </div>
    );
};