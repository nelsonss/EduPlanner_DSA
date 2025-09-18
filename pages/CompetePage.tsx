import React from 'react';
import { LEADERBOARD_DATA } from '../constants';
import { Card } from '../components/shared/Card';
import { useUser } from '../contexts/UserContext';
import { Icon } from '../components/shared/Icon';
import { LeaderboardUser } from '../types';

const RankDisplay: React.FC<{ rank: number }> = ({ rank }) => {
    if (rank === 1) {
        return <Icon name="trophy" className="h-8 w-8 text-yellow-400" aria-label="1st place"/>;
    }
    if (rank === 2) {
        return <Icon name="trophy" className="h-8 w-8 text-gray-300" aria-label="2nd place"/>;
    }
    if (rank === 3) {
        return <Icon name="trophy" className="h-8 w-8 text-yellow-600" aria-label="3rd place"/>;
    }
    return (
        <span className="flex items-center justify-center h-8 w-8 rounded-full bg-gray-700 text-text-primary font-semibold">
            {rank}
        </span>
    );
};

export const CompetePage: React.FC = () => {
    const { user } = useUser();

    // Rebuild leaderboard with dynamic user data
    const rankedUsers = [
        // Filter out the static entry for the current user
        ...LEADERBOARD_DATA.filter(u => u.id !== user.id),
        // Add the current user's dynamic data
        {
            id: user.id,
            rank: 0, // Placeholder, will be recalculated
            name: user.name,
            avatar: user.avatar,
            points: user.points,
        }
    ]
    .sort((a, b) => b.points - a.points)
    .map((u, index) => ({ ...u, rank: index + 1 }));

    const currentUser = rankedUsers.find(u => u.id === user.id);
    const currentUserIndex = rankedUsers.findIndex(u => u.id === user.id);
    const userAbove = currentUser && currentUser.rank > 1 ? rankedUsers[currentUser.rank - 2] : null;

    let displayUsers: (LeaderboardUser | { type: 'separator' })[] = [];
    const VIEW_LIMIT = 10;

    // Logic to show top users, and the current user's position if they are outside the top view
    if (currentUserIndex === -1 || currentUserIndex < VIEW_LIMIT) {
        displayUsers = rankedUsers.slice(0, VIEW_LIMIT);
    } else {
        displayUsers = [
            ...rankedUsers.slice(0, 5),
            { type: 'separator' },
            // Slice to get user, one above, and one below
            ...rankedUsers.slice(Math.max(0, currentUserIndex - 1), currentUserIndex + 2)
        ];
    }

    const UserRankCard = () => {
        if (!currentUser) return null;
    
        const pointsToNextRank = userAbove ? userAbove.points - currentUser.points + 1 : 0;
        const progressToNextRank = userAbove ? (currentUser.points / userAbove.points) * 100 : 100;
    
        return (
            <Card title="Your Position">
                <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                        <div className="text-5xl font-bold text-brand-primary drop-shadow-lg">#{currentUser.rank}</div>
                        <div className="flex items-center gap-3">
                            <img className="h-12 w-12 rounded-full ring-2 ring-brand-primary/50" src={currentUser.avatar} alt="Your avatar" />
                            <div>
                                <div className="font-bold text-text-primary">{currentUser.name}</div>
                                <div className="text-sm text-yellow-400 font-semibold">{currentUser.points.toLocaleString()} Points</div>
                            </div>
                        </div>
                    </div>
                    {userAbove && (
                        <div className="text-sm w-full md:w-auto text-right">
                            <p className="text-text-secondary">{pointsToNextRank.toLocaleString()} points to rank #{userAbove.rank}</p>
                            <div className="w-full bg-background-dark rounded-full h-2 mt-1">
                                <div className="bg-brand-primary h-2 rounded-full" style={{ width: `${progressToNextRank}%` }}></div>
                            </div>
                        </div>
                    )}
                    {currentUser.rank === 1 && (
                         <div className="text-sm text-yellow-400 font-semibold flex items-center gap-2">
                            <Icon name="trophy" className="h-5 w-5" />
                            You're at the top! Keep it up!
                        </div>
                    )}
                </div>
            </Card>
        );
    };

    return (
        <div className="space-y-8">
            <div className="text-center">
                <h1 className="text-3xl font-bold">Leaderboard</h1>
                <p className="mt-2 text-text-secondary max-w-2xl mx-auto">
                    See how you rank against other learners. Keep mastering skills to climb to the top!
                </p>
            </div>

            <UserRankCard />

            <Card title="Top Learners">
                <div className="flow-root">
                    <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                        <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
                            <table className="min-w-full divide-y divide-gray-700">
                                <thead>
                                    <tr>
                                        <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-text-primary sm:pl-0 w-24 text-center">Rank</th>
                                        <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-text-primary">User</th>
                                        <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-text-primary">Points</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-800">
                                    {displayUsers.map((item) => {
                                        if ('type' in item && item.type === 'separator') {
                                            return (
                                                <tr key="separator">
                                                    <td colSpan={3} className="py-2 text-center text-gray-500">
                                                        <div className="text-2xl tracking-widest">...</div>
                                                    </td>
                                                </tr>
                                            );
                                        }

                                        const person = item as LeaderboardUser;
                                        const isCurrentUser = person.id === user.id;

                                        return (
                                            <tr key={person.id} className={isCurrentUser ? 'bg-brand-primary/20' : ''}>
                                                <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-text-primary sm:pl-0">
                                                   <div className="flex items-center justify-center">
                                                     <RankDisplay rank={person.rank} />
                                                   </div>
                                                </td>
                                                <td className="whitespace-nowrap px-3 py-4 text-sm text-text-secondary">
                                                    <div className="flex items-center">
                                                        <div className="h-10 w-10 flex-shrink-0">
                                                            <img className="h-10 w-10 rounded-full" src={person.avatar} alt={`${person.name}'s avatar`} />
                                                        </div>
                                                        <div className="ml-4">
                                                            <div className={`font-medium ${isCurrentUser ? 'font-extrabold text-white' : 'text-text-primary'}`}>{person.name}</div>
                                                        </div>
                                                        {isCurrentUser && (
                                                            <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-500/30 text-accent-blue">
                                                                You
                                                            </span>
                                                        )}
                                                    </div>
                                                </td>
                                                <td className={`whitespace-nowrap px-3 py-4 text-sm ${isCurrentUser ? 'font-extrabold text-yellow-300 text-base' : 'text-yellow-400 font-bold'}`}>{person.points.toLocaleString()}</td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </Card>
        </div>
    );
};
