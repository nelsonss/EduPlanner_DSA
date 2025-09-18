import React, { useState } from 'react';
import { ActivityCalendar } from '../components/evaluation/ActivityCalendar';
import { AssessmentTools } from '../components/evaluation/AssessmentTools';
import { GrowthTools } from '../components/evaluation/GrowthTools';
import { PerformanceCharts } from '../components/evaluation/PerformanceCharts';
import { SkillProficiencyHeatmap } from '../components/evaluation/SkillProficiencyHeatmap';
import { useUser } from '../contexts/UserContext';
import { CognitiveProfileDisplay } from '../components/evaluation/CognitiveProfileDisplay';

export const EvaluationPage: React.FC = () => {
    const { user } = useUser();
    const [isTeacherView, setIsTeacherView] = useState(false);

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-start">
                <div className="text-center w-full">
                    <h1 className="text-3xl font-bold">Performance Evaluation</h1>
                    <p className="mt-2 text-text-secondary max-w-2xl mx-auto">
                        This is your personal command center for data-driven learning. Track your progress, assess your skills, and get personalized recommendations for growth.
                    </p>
                </div>
                <div className="flex-shrink-0">
                    <label htmlFor="teacher-view-toggle" className="flex items-center cursor-pointer">
                        <span className="mr-2 text-sm font-medium text-text-secondary">Teacher View</span>
                        <div className="relative">
                            <input
                                type="checkbox"
                                id="teacher-view-toggle"
                                className="sr-only"
                                checked={isTeacherView}
                                onChange={() => setIsTeacherView(!isTeacherView)}
                            />
                            <div className="block bg-gray-600 w-10 h-6 rounded-full"></div>
                            <div className={`dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${isTeacherView ? 'transform translate-x-full bg-brand-primary' : ''}`}></div>
                        </div>
                    </label>
                </div>
            </div>


            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column */}
                <div className="lg:col-span-1 space-y-8">
                    <AssessmentTools />
                    <GrowthTools />
                </div>

                {/* Right Column */}
                <div className="lg:col-span-2 space-y-8">
                    <CognitiveProfileDisplay isTeacherView={isTeacherView} />
                    <SkillProficiencyHeatmap />
                    <PerformanceCharts />
                    <ActivityCalendar />
                </div>
            </div>
        </div>
    );
};