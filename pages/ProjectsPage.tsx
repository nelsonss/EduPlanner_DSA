import React from 'react';
import { Card } from '../components/shared/Card';

export const ProjectsPage: React.FC = () => {
    return (
        <div className="space-y-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-text-primary">Projects</h1>
            <Card title="Coming Soon!">
                <div className="text-center p-10">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-text-primary">Real-World Projects</h2>
                    <p className="mt-4 text-gray-600 dark:text-text-secondary">Apply your DSA knowledge by building impressive portfolio projects. This feature is coming soon!</p>
                </div>
            </Card>
        </div>
    );
};
