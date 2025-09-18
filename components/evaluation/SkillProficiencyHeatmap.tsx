import React from 'react';
import { Card } from '../shared/Card';
import { HEATMAP_DATA } from '../../constants';

const proficiencyColors = [
    'bg-gray-700', // 0 - Not Started
    'bg-accent-red/50', // 1 - Weak
    'bg-accent-red/80', // 2 - Novice
    'bg-accent-yellow/60', // 3 - Competent
    'bg-accent-green/70', // 4 - Proficient
    'bg-accent-green/100', // 5 - Expert
];

const concepts = ['Traversal', 'Manipulation', 'Searching', 'Sorting', 'Two Pointers', 'Implementation', 'Usage', 'Cycle Detection', 'Monotonic Stack', 'Deque', 'Priority Queue', 'BSTs', 'Tries', 'Heaps', 'Representation', 'BFS', 'DFS', 'Shortest Path', 'MST'];
const uniqueConcepts = Array.from(new Set(HEATMAP_DATA.flatMap(d => Object.keys(d.concepts))));


export const SkillProficiencyHeatmap: React.FC = () => {
    return (
        <Card title="Skill Proficiency Heatmap">
            <div className="overflow-x-auto">
                <table className="min-w-full text-sm text-left">
                    <thead className="text-xs text-text-secondary uppercase">
                        <tr>
                            <th scope="col" className="py-3 px-2">Category</th>
                            {uniqueConcepts.map(concept => (
                                <th key={concept} scope="col" className="py-3 px-2 text-center" style={{ minWidth: '80px' }}>
                                    {concept}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {HEATMAP_DATA.map(data => (
                            <tr key={data.category} className="border-b border-gray-700">
                                <th scope="row" className="py-3 px-2 font-medium text-text-primary whitespace-nowrap">
                                    {data.category}
                                </th>
                                {uniqueConcepts.map(concept => {
                                    const proficiency = data.concepts[concept] ?? -1;
                                    const colorClass = proficiency >= 0 ? proficiencyColors[proficiency] : 'bg-background-dark';
                                    
                                    return (
                                        <td key={`${data.category}-${concept}`} className="py-3 px-2">
                                            <div className="group relative">
                                                <div className={`w-full h-8 rounded ${colorClass}`}></div>
                                                {proficiency >= 0 && (
                                                    <div className="pointer-events-none absolute -top-10 left-1/2 -translate-x-1/2 w-max opacity-0 transition-opacity group-hover:opacity-100 z-10">
                                                        <div className="rounded-md bg-gray-900 px-2 py-1 text-xs font-semibold text-white shadow-lg border border-gray-600">
                                                            Proficiency: {proficiency}/5
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </td>
                                    );
                                })}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
             <div className="flex items-center justify-end space-x-4 mt-4 text-xs text-text-secondary">
                <span>Less Proficient</span>
                {proficiencyColors.map((color, index) => (
                    <div key={index} className={`w-4 h-4 rounded-sm ${color}`}></div>
                ))}
                <span>More Proficient</span>
            </div>
        </Card>
    );
};
