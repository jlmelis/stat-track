import React from 'react';
import type { StatTrackerTypes } from '@/lib/types';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogFooter,
    DialogTitle,
} from "@/components/ui/dialog"

interface EditPlayerStatsModalProps {
    isOpen: boolean;
    onClose: () => void;
    player: StatTrackerTypes.Player;
    onUpdateStat: (gameId: string, playerId: string, statType: keyof StatTrackerTypes.PlayerStats, newValue: number) => void;
    gameId: string;
}

const EditPlayerStatsModal: React.FC<EditPlayerStatsModalProps> = ({ player, isOpen, onClose, onUpdateStat, gameId }) => {

    const handleIncrement = (statKey: keyof StatTrackerTypes.PlayerStats) => {
        const currentValue = player.stats[statKey] ?? 0;
        onUpdateStat(gameId, player.id, statKey, currentValue + 1);
    };

    const handleDecrement = (statKey: keyof StatTrackerTypes.PlayerStats) => {
        const currentValue = player.stats[statKey] ?? 0;
        onUpdateStat(gameId, player.id, statKey, Math.max(0, currentValue - 1));
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
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader className="text-center">
                    <DialogTitle className="text-center">Edit Player Stats</DialogTitle>
                    <h4 className="text-md leading-6 font-medium text-gray-700 text-center">{player.name} #{player.number}</h4>
                </DialogHeader>
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
                <DialogFooter>
                    <button
                        onClick={onClose}
                        className="px-4 py-2 bg-gray-500 text-white text-base font-medium rounded-md width-full shadow-sm hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-300"
                    >
                        Close
                    </button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default EditPlayerStatsModal;
