import React from 'react';
import { Card } from '../shared/Card';
import { ACTIVITY_CALENDAR_DATA } from '../../constants';

const getContributionColor = (count: number): string => {
    if (count === 0) return 'bg-gray-700';
    if (count < 30) return 'bg-accent-green/20';
    if (count < 60) return 'bg-accent-green/40';
    if (count < 120) return 'bg-accent-green/70';
    return 'bg-accent-green';
};

export const ActivityCalendar: React.FC = () => {
    const today = new Date();
    const days = Array.from({ length: 182 }, (_, i) => {
        const date = new Date();
        date.setDate(today.getDate() - (181 - i));
        return date;
    });

    const firstDayOffset = days[0].getDay();

    return (
        <Card title="Activity Calendar (Last 6 Months)">
            <div className="flex flex-col items-center">
                <div className="grid grid-cols-7 grid-rows-27 gap-1" style={{gridAutoFlow: "column"}}>
                    {/* Add blank tiles to offset the start day */}
                    {Array.from({ length: firstDayOffset }).map((_, index) => (
                        <div key={`offset-${index}`} className="w-4 h-4" />
                    ))}
                    {days.map(date => {
                        const dateString = date.toISOString().split('T')[0];
                        const studyTime = ACTIVITY_CALENDAR_DATA[dateString] || 0;
                        const colorClass = getContributionColor(studyTime);
                        return (
                            <div key={dateString} className="group relative">
                                <div className={`w-4 h-4 rounded-sm ${colorClass}`} />
                                <div className="pointer-events-none absolute -top-10 left-1/2 -translate-x-1/2 w-max opacity-0 transition-opacity group-hover:opacity-100 z-10">
                                    <div className="rounded-md bg-gray-900 px-2 py-1 text-xs font-semibold text-white shadow-lg border border-gray-600">
                                        {studyTime > 0 ? `${studyTime} min` : 'No activity'} on {date.toLocaleDateString()}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
                 <div className="flex items-center space-x-2 mt-4 text-xs text-text-secondary">
                    <span>Less</span>
                    <div className="w-3 h-3 rounded-sm bg-gray-700"></div>
                    <div className="w-3 h-3 rounded-sm bg-accent-green/20"></div>
                    <div className="w-3 h-3 rounded-sm bg-accent-green/40"></div>
                    <div className="w-3 h-3 rounded-sm bg-accent-green/70"></div>
                    <div className="w-3 h-3 rounded-sm bg-accent-green"></div>
                    <span>More</span>
                </div>
            </div>
        </Card>
    );
};