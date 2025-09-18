import React from 'react';
import { Card } from '../shared/Card';
import { useTheme } from '../../contexts/ThemeContext';
import { Icon } from '../shared/Icon';

export const ThemeSettings: React.FC = () => {
    const { theme, toggleTheme } = useTheme();
    const isDark = theme === 'dark';

    return (
        <Card title="Appearance">
            <div className="flex items-center justify-between">
                <div>
                    <h4 className="font-semibold text-gray-900 dark:text-text-primary">Theme</h4>
                    <p className="text-sm text-gray-600 dark:text-text-secondary">
                        Switch between light and dark mode.
                    </p>
                </div>
                <button
                    onClick={toggleTheme}
                    className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-primary ${
                        isDark ? 'bg-brand-primary' : 'bg-gray-300'
                    }`}
                    role="switch"
                    aria-checked={isDark}
                >
                    <span className="sr-only">Toggle theme</span>
                    <span className="absolute left-0 inline-block w-6 h-6 transform bg-white rounded-full shadow-lg transition-transform duration-200 ease-in-out"
                          style={{ transform: isDark ? 'translateX(20px)' : 'translateX(0px)' }}
                    >
                        <span className={`absolute inset-0 flex items-center justify-center transition-opacity duration-200 ease-in-out ${isDark ? 'opacity-0 ease-out' : 'opacity-100 ease-in'}`}>
                           <Icon name="sun" className="h-4 w-4 text-yellow-500" />
                        </span>
                         <span className={`absolute inset-0 flex items-center justify-center transition-opacity duration-200 ease-in-out ${isDark ? 'opacity-100 ease-in' : 'opacity-0 ease-out'}`}>
                           <Icon name="moon" className="h-4 w-4 text-brand-primary" />
                        </span>
                    </span>
                </button>
            </div>
        </Card>
    );
};
