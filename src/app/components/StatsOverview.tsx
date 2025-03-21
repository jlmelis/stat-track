'use client'

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Player {
    id: string;
    name: string;
    number: string;
}

interface PlayerStats {
    kills: number;
    blocks: number;
    aces: number;
    serves: number;
    passes: number;
    sets: number;
    digs: number;
    assists: number;
    errors: number;
}

interface StatsOverviewProps {
    players: Player[];
    games: any[];
}

const initialPlayerStats: PlayerStats = {
    kills: 0,
    blocks: 0,
    aces: 0,
    serves: 0,
    passes: 0,
    sets: 0,
    digs: 0,
    assists: 0,
    errors: 0,
};

const StatsOverview: React.FC<StatsOverviewProps> = ({ players, games }) => {
    const getPlayerTotalStats = (playerId: string): PlayerStats => {
        return games.reduce((total, game) => {
            const gameStats = game.playerStats[playerId] || initialPlayerStats;  // Use initial if undefined
            for (const key in total) {
                if (total.hasOwnProperty(key)) {
                  total[key as keyof PlayerStats] += gameStats[key as keyof PlayerStats] || 0;
                }
            }
            return total;
        }, { ...initialPlayerStats });
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Player Stats Overview</CardTitle>
            </CardHeader>
            <CardContent>
                {players.map((player) => {
                    const totalStats = getPlayerTotalStats(player.id);
                    return (
                        <div key={player.id} className="mb-6 p-4 border rounded">
                            <h3 className="text-lg font-semibold">{player.name} (#{player.number})</h3>
                            <div className="grid grid-cols-3 gap-2">
                                {Object.entries(totalStats).map(([stat, value]) => (
                                    <div key={stat} className="flex items-center justify-between">
                                        <span>{stat.charAt(0).toUpperCase() + stat.slice(1)}:</span>
                                        <span>{value}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    );
                })}
            </CardContent>
        </Card>
    );
};

export default StatsOverview;
