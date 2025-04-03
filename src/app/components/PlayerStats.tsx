import React, { useState } from 'react';
import type { StatTrackerTypes } from '@/lib/types';
import { Pencil, Eye, ChevronUp, ChevronDown } from 'lucide-react';
import EditPlayerStatsModal from './EditPlayerStatsModal';

// Map display names to internal keys
const STAT_TYPE_MAP: { [key: string]: keyof StatTrackerTypes.PlayerStats } = {
    Kills: 'kills',
    Errors: 'errors',
    Assists: 'assists',
    Digs: 'digs',
    Blocks: 'blocks',
    Aces: 'aces',
    Serves: 'serves',
    Passes: 'passes',
    Sets: 'sets',
};
const STAT_DISPLAY_NAMES = Object.keys(STAT_TYPE_MAP); // Get display names for rendering

interface PlayerStatsProps {
    gameId: string;
    player: StatTrackerTypes.Player;
    initialPlayerStats: StatTrackerTypes.PlayerStats;
    games: StatTrackerTypes.Game[]; // Use the specific type
    updateStat: (gameId: string, playerId: string, stat: keyof StatTrackerTypes.PlayerStats, value: number) => void; // Match the updated type
}

interface PlayerStatsCardProps {
    player: StatTrackerTypes.Player;
    onUpdateStat: (playerId: string, statType: keyof StatTrackerTypes.PlayerStats, newValue: number) => void;
}

function PlayerStatsCard({ player, onUpdateStat }: PlayerStatsCardProps) {
    // Function to handle incrementing a stat
    const handleIncrement = (statKey: keyof StatTrackerTypes.PlayerStats) => {
        const currentValue = player.stats[statKey] ?? 0; // Use nullish coalescing for safety
        onUpdateStat(player.id, statKey, currentValue + 1);
    };

    // Function to handle decrementing a stat (ensuring it doesn't go below 0)
    const handleDecrement = (statKey: keyof StatTrackerTypes.PlayerStats) => {
        const currentValue = player.stats[statKey] ?? 0; // Use nullish coalescing for safety
        onUpdateStat(player.id, statKey, Math.max(0, currentValue - 1));
    };

    return (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-5 transition-shadow hover:shadow-lg">
            {/* Stats Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {STAT_DISPLAY_NAMES.map((displayName) => {
                    const statKey = STAT_TYPE_MAP[displayName]; // Get the internal key
                    const statValue = player.stats[statKey] ?? 0; // Get the value safely
                    return (
                        <div key={statKey} className="text-center p-3 bg-gray-50 dark:bg-gray-700 rounded-md">
                            <p className="text-sm font-medium text-gray-600 dark:text-gray-300 mb-1">{displayName}</p>
                            <span className="text-xl font-semibold text-gray-800 dark:text-gray-100 w-8 text-center">
                                {statValue}
                            </span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}


const PlayerStats: React.FC<PlayerStatsProps> = ({ gameId, player, initialPlayerStats, games, updateStat }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    // This intermediate onUpdateStat is no longer strictly necessary as the types align,
    // but we keep the PlayerStatsCard separate for structure.
    // We need to ensure the statType passed from PlayerStatsCard is correctly typed.
    const onUpdateStat = (playerId: string, statType: keyof StatTrackerTypes.PlayerStats, newValue: number) => {
        updateStat(gameId, playerId, statType, newValue);
    };

    // Find the specific game to get the correct stats for this player in this game
    const game = games.find((g: StatTrackerTypes.Game) => g.id === gameId);
    const playerStats = game?.playerStats[player.id] || initialPlayerStats;

    return (
        <div>
            <div className="mb-6 p-4 border rounded cursor-pointer" onClick={() => setIsExpanded(!isExpanded)}>
                <h3 className="text-lg font-semibold flex items-center"><span className="text-lg font-semibold text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-gray-700 px-3 py-1 rounded-full mr-1">#{player.number}</span>{player.name}
                <div className="flex items-center ml-auto">
                    <Pencil className="h-4 w-4 text-gray-500 hover:text-gray-400 cursor-pointer ml-2" aria-label="Edit" onClick={() => setIsModalOpen(true)} />
                    {isExpanded ? (
                        <ChevronUp className="h-4 w-4 text-gray-500 hover:text-gray-400 cursor-pointer ml-2" onClick={() => setIsExpanded(false)} />
                    ) : (
                        <ChevronDown className="h-4 w-4 text-gray-500 hover:text-gray-400 cursor-pointer ml-2" onClick={() => setIsExpanded(true)} />
                    )}
                </div></h3>
                {isExpanded && (
                    <PlayerStatsCard player={{...player, stats: playerStats}} onUpdateStat={onUpdateStat} />
                )}
            </div>
            {isExpanded && (
                <EditPlayerStatsModal
                    player={{...player, stats: playerStats}}
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    onUpdateStat={onUpdateStat}
                />
            )}
        </div>
    );
};

export default PlayerStats;
