import React from 'react';
import { UserProfile } from '../components/settings/UserProfile';
import { ThemeSettings } from '../components/settings/ThemeSettings';

export const SettingsPage: React.FC = () => {
    return (
        <div className="space-y-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-text-primary">Settings</h1>
            
            <div className="max-w-4xl mx-auto space-y-8">
                <UserProfile />
                <ThemeSettings />
            </div>

            {/* Placeholder for future settings */}
            <div className="text-center p-10 mt-8 bg-white dark:bg-background-light rounded-lg border border-gray-200 dark:border-gray-700">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-text-primary">More Customization Options</h2>
                <p className="mt-4 text-gray-600 dark:text-text-secondary">Interface settings, notification preferences, and account management options will be available here soon!</p>
            </div>
        </div>
    );
};