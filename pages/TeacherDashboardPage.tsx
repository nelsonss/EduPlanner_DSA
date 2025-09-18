import React from 'react';
import { Card } from '../components/shared/Card';
import { Icon } from '../components/shared/Icon';

const FeatureCard: React.FC<{ icon: string; title: string; description: string }> = ({ icon, title, description }) => (
    <Card title="">
        <div className="text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-brand-primary/20">
                <Icon name={icon} className="h-6 w-6 text-brand-primary" />
            </div>
            <h3 className="mt-4 text-lg font-semibold text-text-primary">{title}</h3>
            <p className="mt-2 text-sm text-text-secondary">{description}</p>
            <button className="mt-4 text-sm font-semibold text-brand-primary hover:underline">
                Go to Tool &rarr;
            </button>
        </div>
    </Card>
);

export const TeacherDashboardPage: React.FC = () => {
    return (
        <div className="space-y-8">
            <div className="text-center">
                <h1 className="text-3xl font-bold">Teacher Dashboard</h1>
                <p className="mt-2 text-text-secondary max-w-2xl mx-auto">
                    Welcome, Instructor! This is your command center to guide, refine, and collaborate with the EduPlanner AI, ensuring the best learning outcomes for your students.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                <FeatureCard 
                    icon="lab"
                    title="Content Curation"
                    description="Review, edit, and approve AI-generated problems to create a curated learning experience for your class."
                />
                <FeatureCard 
                    icon="evaluate"
                    title="Feedback Calibration"
                    description="Annotate and rate AI feedback on student submissions to align it with your pedagogical style."
                />
                <FeatureCard 
                    icon="learn"
                    title="Instructional Directives"
                    description="Set weekly learning goals and curriculum focus to guide the AI's adaptive recommendations for all students."
                />
                 <FeatureCard 
                    icon="settings"
                    title="Cognitive Profile Tuning"
                    description="Use your classroom insights to fine-tune the AI's understanding of individual student strengths and weaknesses."
                />
            </div>
             <Card title="Class Overview (Coming Soon)">
                <div className="text-center p-10">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-text-primary">At-a-Glance Analytics</h2>
                    <p className="mt-4 text-gray-600 dark:text-text-secondary">A comprehensive view of your class's progress, identifying struggling students and celebrating top performers, will be available here soon.</p>
                </div>
            </Card>
        </div>
    );
};