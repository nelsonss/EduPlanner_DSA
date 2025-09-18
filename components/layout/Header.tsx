import React from 'react';
import { Icon } from '../shared/Icon';
import { useSearch } from '../../App';
import { useTheme } from '../../contexts/ThemeContext';
import { useUser } from '../../contexts/UserContext';

export const Header: React.FC = () => {
    const { searchQuery, setSearchQuery } = useSearch();
    const { theme, toggleTheme } = useTheme();
    const { user } = useUser();

    return (
        <header className="flex items-center justify-between p-4 bg-white dark:bg-background-light border-b border-gray-200 dark:border-gray-700">
            <div className="relative flex-1 max-w-xl">
                <Icon name="search" className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                    type="text"
                    placeholder="Search for skills..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 bg-gray-100 dark:bg-background-dark border border-gray-200 dark:border-gray-600 rounded-lg text-gray-900 dark:text-text-primary focus:outline-none focus:ring-2 focus:ring-brand-primary"
                />
            </div>
            <div className="flex items-center space-x-4 ml-4">
                <button
                    onClick={toggleTheme}
                    className="p-2 rounded-full text-gray-500 dark:text-text-secondary hover:bg-gray-200 dark:hover:bg-gray-700"
                    aria-label="Toggle theme"
                >
                    <Icon name={theme === 'dark' ? 'sun' : 'moon'} />
                </button>
                <button className="relative p-2 rounded-full text-gray-500 dark:text-text-secondary hover:bg-gray-200 dark:hover:bg-gray-700">
                    <Icon name="bell" />
                    <span className="absolute top-1 right-1 block h-2.5 w-2.5 rounded-full bg-accent-red ring-2 ring-white dark:ring-background-light"></span>
                </button>
                <div className="flex items-center space-x-2">
                    <img src={user.avatar} alt="User avatar" className="h-9 w-9 rounded-full" />
                    <span className="hidden md:block font-semibold text-gray-900 dark:text-text-primary">{user.name}</span>
                </div>
            </div>
        </header>
    );
};
