import React from 'react';
import { Icon } from './Icon';

interface ModalProps {
    title: string;
    children: React.ReactNode;
    onClose: () => void;
}

export const Modal: React.FC<ModalProps> = ({ title, children, onClose }) => {
    return (
        <div 
            className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4"
            onClick={onClose}
        >
            <div 
                className="bg-white dark:bg-background-light rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 w-full max-w-md flex flex-col"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="p-4 flex justify-between items-center border-b border-gray-200 dark:border-gray-700">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-text-primary">{title}</h3>
                    <button onClick={onClose} className="text-gray-500 dark:text-text-secondary hover:text-gray-900 dark:hover:text-white transition-colors">
                        <Icon name="close" />
                    </button>
                </div>
                <div className="p-4 flex-grow">
                    {children}
                </div>
            </div>
        </div>
    );
};