import React from 'react';
import { NavLink } from 'react-router-dom';
import { Icon } from '../shared/Icon';

const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: 'dashboard' },
    { name: 'Learn', path: '/learn', icon: 'learn' },
    { name: 'Practice Lab', path: '/lab', icon: 'lab' },
    { name: 'Evaluation', path: '/evaluate', icon: 'evaluate' },
    { name: 'Compete', path: '/compete', icon: 'trophy' },
    { name: 'Projects', path: '/projects', icon: 'code' },
];

const secondaryNavItems = [
     { name: 'Teacher Dashboard', path: '/teacher', icon: 'teacher' },
     { name: 'Settings', path: '/settings', icon: 'settings' },
];

export const Sidebar: React.FC = () => {
    return (
        <aside className="hidden md:flex flex-col w-64 bg-white dark:bg-background-light border-r border-gray-200 dark:border-gray-800">
            <div className="flex items-center justify-center h-20 border-b border-gray-200 dark:border-gray-700">
                <Icon name="logo" className="h-8 w-8 text-brand-primary" />
                <h1 className="ml-3 text-2xl font-bold text-gray-900 dark:text-text-primary">EduPlanner</h1>
            </div>
            <nav className="flex-1 flex flex-col justify-between px-4 py-6">
                <div className="space-y-2">
                    {navItems.map(item => (
                        <NavLink
                            key={item.name}
                            to={item.path}
                            className={({ isActive }) =>
                                `flex items-center px-4 py-2.5 text-sm font-medium rounded-lg transition-colors ${
                                    isActive
                                        ? 'bg-brand-primary/20 text-brand-primary'
                                        : 'text-gray-600 dark:text-text-secondary hover:bg-gray-200 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white'
                                }`
                            }
                        >
                            <Icon name={item.icon} className="h-5 w-5 mr-3" />
                            {item.name}
                        </NavLink>
                    ))}
                </div>
                 <div className="space-y-2">
                    {secondaryNavItems.map(item => (
                        <NavLink
                            key={item.name}
                            to={item.path}
                            className={({ isActive }) =>
                                `flex items-center px-4 py-2.5 text-sm font-medium rounded-lg transition-colors ${
                                    isActive
                                        ? 'bg-brand-primary/20 text-brand-primary'
                                        : 'text-gray-600 dark:text-text-secondary hover:bg-gray-200 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white'
                                }`
                            }
                        >
                            <Icon name={item.icon} className="h-5 w-5 mr-3" />
                            {item.name}
                        </NavLink>
                    ))}
                </div>
            </nav>
        </aside>
    );
};