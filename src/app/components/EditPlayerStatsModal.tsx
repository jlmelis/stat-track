import React from 'react';
import type { StatTrackerTypes } from '@/lib/types';

interface EditPlayerStatsModalProps {
    player: StatTrackerTypes.Player;
    isOpen: boolean;
    onClose: () => void;
    onUpdateStat: (playerId: string, statType: keyof StatTrackerTypes.PlayerStats, newValue: number) => void;
}

const EditPlayerStatsModal: React.FC<EditPlayerStatsModalProps> = ({ player, isOpen, onClose, onUpdateStat }) => {
    if (!isOpen) {
        return null;
    }

    const handleIncrement = (statKey: keyof StatTrackerTypes.PlayerStats) => {
        const currentValue = player.stats[statKey] ?? 0;
        onUpdateStat(player.id, statKey, currentValue + 1);
    };

    const handleDecrement = (statKey: keyof StatTrackerTypes.PlayerStats) => {
        const currentValue = player.stats[statKey] ?? 0;
        onUpdateStat(player.id, statKey, Math.max(0, currentValue - 1));
    };

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

    return (
        <div className="fixed inset-0 bg-[rgba(209,213,219,0.6)] overflow-y-auto h-full w-full" onClick={onClose}>
            <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white" onClick={(e) => e.stopPropagation()}>
                <div className="mt-3 text-center">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">Edit Player Stats</h3>
                    <h4 className="text-md leading-6 font-medium text-gray-700">{player.name} #{player.number}</h4>
                    <div className="px-7 py-3 grid grid-cols-3 gap-4">
                        {STAT_DISPLAY_NAMES.map((displayName) => {
                            const statKey = STAT_TYPE_MAP[displayName]; // Get the internal key
                            const statValue = player.stats[statKey] ?? 0; // Get the value safely
                            return (
                                <div key={statKey} className="text-center">
                                    <label className="block text-gray-700 text-sm font-bold mb-2">{displayName}</label>
                                    <div className="flex items-center justify-center space-x-3">
                                        <button
                                            onClick={() => handleDecrement(statKey)}
                                            className="px-2 py-0.5 bg-red-200 dark:bg-red-700 text-red-800 dark:text-red-100 rounded hover:bg-red-300 dark:hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-400 disabled:opacity-50"
                                            disabled={statValue <= 0}
                                            aria-label={`Decrease ${displayName} for ${player.name}`}
                                        >
                                            -
                                        </button>
                                        <span className="text-xl font-semibold text-gray-800 dark:text-gray-100 w-8 text-center">
                                            {statValue}
                                        </span>
                                        <button
                                            onClick={() => handleIncrement(statKey)}
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
                    <div className="items-center px-4 py-3">
                        <button
                            onClick={onClose}
                            className="px-4 py-2 bg-gray-500 text-white text-base font-medium rounded-md width-full shadow-sm hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-300"
                        >
                            Close
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EditPlayerStatsModal;