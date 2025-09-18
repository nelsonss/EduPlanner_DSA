import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Card } from '../shared/Card';
import { PERFORMANCE_CHART_DATA } from '../../constants';

export const PerformanceCharts: React.FC = () => {
    return (
        <Card title="Performance Over Time">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 h-80">
                <div>
                    <h4 className="text-center text-sm font-semibold text-text-secondary mb-2">Problem Accuracy (%)</h4>
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={PERFORMANCE_CHART_DATA} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#4a5568" />
                            <XAxis dataKey="month" fontSize={12} tick={{ fill: '#a0aec0' }} stroke="#a0aec0" />
                            <YAxis domain={[60, 100]} fontSize={12} tick={{ fill: '#a0aec0' }} stroke="#a0aec0" />
                            <Tooltip contentStyle={{ backgroundColor: '#2d3748', border: '1px solid #4a5568' }} />
                            <Legend wrapperStyle={{fontSize: "12px"}} />
                            <Line type="monotone" dataKey="accuracy" stroke="#38a169" strokeWidth={2} name="Accuracy" unit="%" />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
                <div>
                    <h4 className="text-center text-sm font-semibold text-text-secondary mb-2">Avg. Time to Solve (min)</h4>
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={PERFORMANCE_CHART_DATA} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#4a5568" />
                            <XAxis dataKey="month" fontSize={12} tick={{ fill: '#a0aec0' }} stroke="#a0aec0" />
                            <YAxis domain={[10, 30]} fontSize={12} tick={{ fill: '#a0aec0' }} stroke="#a0aec0" />
                            <Tooltip contentStyle={{ backgroundColor: '#2d3748', border: '1px solid #4a5568' }} />
                            <Legend wrapperStyle={{fontSize: "12px"}} />
                            <Line type="monotone" dataKey="solveTime" stroke="#3182ce" strokeWidth={2} name="Time (min)" />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </Card>
    );
};
