import React from 'react';
import type { StatTrackerTypes } from '@/lib/types';

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

function PlayerStatsCard({ player, onUpdateStat }: { player: StatTrackerTypes.Player, onUpdateStat: (playerId: string, statType: keyof StatTrackerTypes.PlayerStats, newValue: number) => void }) {
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
            {/* Player Info Header */}
            <div className="flex justify-between items-center mb-4 pb-2 border-b border-gray-200 dark:border-gray-700">
                <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">{player.name}</h3>
                <span className="text-lg font-semibold text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-gray-700 px-3 py-1 rounded-full">
                    #{player.number}
                </span>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {STAT_DISPLAY_NAMES.map((displayName) => {
                    const statKey = STAT_TYPE_MAP[displayName]; // Get the internal key
                    const statValue = player.stats[statKey] ?? 0; // Get the value safely
                    return (
                        <div key={statKey} className="text-center p-3 bg-gray-50 dark:bg-gray-700 rounded-md">
                            <p className="text-sm font-medium text-gray-600 dark:text-gray-300 mb-1">{displayName}</p>
                            <div className="flex items-center justify-center space-x-3">
                                {/* Decrement Button */}
                                <button
                                    onClick={() => handleDecrement(statKey)} // Use statKey
                                    className="px-2 py-0.5 bg-red-200 dark:bg-red-700 text-red-800 dark:text-red-100 rounded hover:bg-red-300 dark:hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-400 disabled:opacity-50"
                                    disabled={statValue <= 0} // Disable if stat is 0
                                    aria-label={`Decrease ${displayName} for ${player.name}`}
                                >
                                    -
                                </button>
                                {/* Stat Value */}
                                <span className="text-xl font-semibold text-gray-800 dark:text-gray-100 w-8 text-center">
                                    {statValue}
                                </span>
                                {/* Increment Button */}
                                <button
                                    onClick={() => handleIncrement(statKey)} // Use statKey
                                    className="px-2 py-0.5 bg-green-200 dark:bg-green-700 text-green-800 dark:text-green-100 rounded hover:bg-green-300 dark:hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-400"
                                    aria-label={`Increase ${displayName} for ${player.name}`}
                                >
                                    +
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

const PlayerStats: React.FC<PlayerStatsProps> = ({ gameId, player, initialPlayerStats, games, updateStat }) => {
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
        <PlayerStatsCard player={{...player, stats: playerStats}} onUpdateStat={onUpdateStat} />
    );
};

export default PlayerStats;
