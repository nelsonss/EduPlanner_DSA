import React, { useState, useMemo } from 'react';
import { BADGES_DATA, LEARNING_PATHS_DATA } from '../../constants';
import { Card } from '../shared/Card';
import { Icon } from '../shared/Icon';
import { useUser } from '../../contexts/UserContext';
import { ShareModal } from '../shared/ShareModal';
import { Badge, getSkillStatus, SkillStatus } from '../../types';
import { useSkills } from '../../contexts/SkillContext';

const BadgeIcon: React.FC<{ badge: Badge; onShare: () => void }> = ({ badge, onShare }) => {
    return (
        <div className="group relative flex flex-col items-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-background-dark ring-2 ring-gray-700 group-hover:ring-brand-primary transition-all relative">
                <Icon name={badge.icon} className="h-8 w-8 text-yellow-400" />
                 <button
                    onClick={onShare}
                    className="absolute inset-0 flex items-center justify-center bg-black/60 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    aria-label={`Share ${badge.name} badge`}
                >
                    <Icon name="share" className="h-6 w-6 text-white" />
                </button>
            </div>
            <div className="pointer-events-none absolute -top-14 w-max opacity-0 transition-opacity group-hover:opacity-100 z-10">
                 <div className="rounded-lg bg-gray-900 px-3 py-2 text-sm font-semibold text-white shadow-lg border border-gray-700">
                    <p className="font-bold">{badge.name}</p>
                    <p className="text-xs text-text-secondary">{badge.description}</p>
                </div>
            </div>
        </div>
    );
};


export const UserProfile: React.FC = () => {
    const { user } = useUser();
    const { skillMap } = useSkills();
    const [shareModalContent, setShareModalContent] = useState<{title: string, text: string} | null>(null);

    const handleShareBadge = (badge: Badge) => {
        setShareModalContent({
            title: `I Earned the "${badge.name}" Badge!`,
            text: `I just earned the "${badge.name}" badge on EduPlanner DSA! Come join me in learning Data Structures and Algorithms.`
        });
    };

    const earnedBadges = user.earnedBadgeIds.map(id => BADGES_DATA.find(b => b.id === id)).filter((b): b is Badge => !!b);
    
    const completedPaths = useMemo(() => {
        return LEARNING_PATHS_DATA.filter(path => {
            return path.skillIds.every(skillId => {
                const skill = skillMap.get(skillId);
                return skill ? getSkillStatus(skill.proficiency) === SkillStatus.Mastered : false;
            });
        }).length;
    }, [skillMap]);

    return (
        <>
            {shareModalContent && (
                <ShareModal
                    title={shareModalContent.title}
                    shareText={shareModalContent.text}
                    shareUrl={window.location.href}
                    onClose={() => setShareModalContent(null)}
                />
            )}

            <Card title="User Profile">
                <div className="flex flex-col items-center md:flex-row md:items-start md:space-x-8">
                    <div className="flex-shrink-0 mb-6 md:mb-0">
                        <img
                            className="h-32 w-32 rounded-full object-cover ring-4 ring-brand-primary"
                            src={user.avatar}
                            alt="User avatar"
                        />
                    </div>
                    <div className="text-center md:text-left">
                        <h2 className="text-3xl font-bold text-gray-900 dark:text-text-primary">{user.name}</h2>
                        <p className="text-md text-gray-600 dark:text-text-secondary mt-1">{user.email}</p>
                        <div className="mt-4 inline-flex items-center px-4 py-2 bg-accent-blue/20 text-accent-blue rounded-full text-sm font-medium">
                            Intermediate Learner
                        </div>
                        <div className="mt-6 border-t border-gray-200 dark:border-gray-700 pt-6">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-text-primary mb-3">Learning Stats</h3>
                            <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-8">
                                <div className="flex items-center">
                                    <Icon name="star" className="h-6 w-6 mr-3 text-yellow-400" />
                                    <div>
                                        <p className="font-bold text-xl">{user.points}</p>
                                        <p className="text-sm text-gray-600 dark:text-text-secondary">Total Points</p>
                                    </div>
                                </div>
                                <div className="flex items-center">
                                    <Icon name="learn" className="h-6 w-6 mr-3 text-brand-primary" />
                                    <div>
                                        <p className="font-bold text-xl">{completedPaths}</p>
                                        <p className="text-sm text-gray-600 dark:text-text-secondary">Paths Completed</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </Card>
            <Card title="My Badges">
                {earnedBadges.length > 0 ? (
                     <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-6">
                        {earnedBadges.map(badge => <BadgeIcon key={badge.id} badge={badge} onShare={() => handleShareBadge(badge)} />)}
                    </div>
                ) : (
                    <p className="text-text-secondary">You haven't earned any badges yet. Keep learning to unlock them!</p>
                )}
            </Card>
        </>
    );
};
