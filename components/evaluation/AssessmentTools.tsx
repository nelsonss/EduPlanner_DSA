import React, { useState } from 'react';
import { Card } from '../shared/Card';
import { PERFORMANCE_CHART_DATA, GOALS_DATA } from '../../constants';
import { generatePerformanceReview } from '../../services/geminiService';
import { Icon } from '../shared/Icon';
import { SkillNode, getSkillStatus, SkillStatus } from '../../types';
import { useSkills } from '../../contexts/SkillContext';

export const AssessmentTools: React.FC = () => {
    const { skills } = useSkills();
    const practiceableSkills = React.useMemo(() => skills.filter(s => !s.isParent), [skills]);
    const [selectedSkill, setSelectedSkill] = useState<string>(practiceableSkills[0]?.id || '');
    const [aiReport, setAiReport] = useState<string>('');
    const [isLoadingReport, setIsLoadingReport] = useState(false);

    const handleRequestReport = async () => {
        setIsLoadingReport(true);
        setAiReport('');
        try {
            const masteredSkills = skills.filter(s => getSkillStatus(s.proficiency) === SkillStatus.Mastered);
            const report = await generatePerformanceReview(PERFORMANCE_CHART_DATA, GOALS_DATA, masteredSkills);
            setAiReport(report);
        } catch (error) {
            setAiReport("Could not generate performance review at this time.");
            console.error("Error generating performance review:", error);
        } finally {
            setIsLoadingReport(false);
        }
    };

    return (
        <Card title="Evaluation Components">
            <div className="space-y-6">
                {/* On-Demand Skill Assessment */}
                <div>
                    <h4 className="font-semibold text-text-primary mb-2">On-Demand Skill Assessment</h4>
                    <p className="text-sm text-text-secondary mb-3">Generate a comprehensive quiz on a topic of your choice to test your knowledge.</p>
                    <div className="flex items-center space-x-2">
                        <select
                            value={selectedSkill}
                            onChange={(e) => setSelectedSkill(e.target.value)}
                            className="flex-grow w-full bg-background-dark border border-gray-600 rounded-lg py-2 px-3 text-text-primary focus:outline-none focus:ring-2 focus:ring-brand-primary"
                            aria-label="Select skill for assessment"
                        >
                            {practiceableSkills.map(skill => (
                                <option key={skill.id} value={skill.id}>{skill.name}</option>
                            ))}
                        </select>
                        <button className="bg-brand-primary text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors">
                            Start
                        </button>
                    </div>
                </div>

                {/* Mock Interview Simulator */}
                <div>
                    <h4 className="font-semibold text-text-primary mb-2">Mock Interview Simulator</h4>
                    <p className="text-sm text-text-secondary mb-3">Simulate a real technical interview with a timed problem and a realistic environment.</p>
                    <button className="w-full bg-brand-primary/80 text-white font-bold py-2 px-4 rounded-lg hover:bg-brand-primary transition-colors">
                        Start Simulation
                    </button>
                </div>

                {/* AI Performance Report */}
                <div>
                    <h4 className="font-semibold text-text-primary mb-2">AI Performance Report</h4>
                    <p className="text-sm text-text-secondary mb-3">Get a detailed monthly performance review from our AI Analyst based on your activity.</p>
                    <button 
                        onClick={handleRequestReport}
                        disabled={isLoadingReport}
                        className="w-full flex items-center justify-center bg-accent-green text-white font-bold py-2 px-4 rounded-lg hover:bg-green-600 transition-colors disabled:opacity-50"
                    >
                        {isLoadingReport ? (
                            <>
                                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                                Generating...
                            </>
                        ) : 'Request Monthly Review'}
                    </button>
                    {aiReport && (
                        <div className="mt-4 p-4 bg-background-dark rounded-lg border border-gray-700">
                             <div className="prose prose-invert max-w-none prose-p:text-text-secondary prose-headings:text-text-primary prose-strong:text-text-primary prose-ul:text-text-secondary">
                                {aiReport.split('\n').map((line, index) => {
                                    if (line.startsWith('**1. Overall Summary:**')) return <h5 key={index} className="!mt-2 !mb-1">{line.replace(/\*\*/g, '')}</h5>;
                                    if (line.startsWith('**2. Strengths:**')) return <h5 key={index} className="!mt-2 !mb-1">{line.replace(/\*\*/g, '')}</h5>;
                                    if (line.startsWith('**3. Areas for Improvement:**')) return <h5 key={index} className="!mt-2 !mb-1">{line.replace(/\*\*/g, '')}</h5>;
                                    if (line.startsWith('**4. Actionable Next Steps:**')) return <h5 key={index} className="!mt-2 !mb-1">{line.replace(/\*\*/g, '')}</h5>;
                                    if (line.startsWith('- ')) return <p key={index} className="!my-1">{line}</p>;
                                    return <p key={index} className="!my-2">{line}</p>;
                                })}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </Card>
    );
};