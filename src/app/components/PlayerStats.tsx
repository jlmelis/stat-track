import { Button } from "@/components/ui/button";

interface Game {
    id: string;
    date: string;
    opponent: string;
    playerStats: { [playerId: string]: PlayerStatsType };
}

interface PlayerStatsType {
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

interface PlayerStatsProps {
    gameId: string;
    player: {
        id: string;
        name: string;
        number: string;
    };
    initialPlayerStats: PlayerStatsType;
    games: Game[];
    updateStat: (gameId: string, playerId: string, stat: string, value: number) => void;
}

const PlayerStats: React.FC<PlayerStatsProps> = ({ gameId, player, initialPlayerStats, games, updateStat }) => {
    return (
        <div key={player.id} className="mb-4 p-4 border rounded">
            <h3 className="text-lg font-semibold">{player.name} (#{player.number})</h3>
            <div className="grid grid-cols-3 gap-2">
                {Object.keys(initialPlayerStats).map((stat) => (
                    <div key={stat} className="flex items-center justify-between">
                        <span>{stat.charAt(0).toUpperCase() + stat.slice(1)}:</span>
                        <div className="flex gap-2">
                            <Button
                                variant="outline"
                                size="icon"
                                 onClick={() => updateStat(gameId, player.id, stat, (games.find(g => g.id === gameId)?.playerStats[player.id]?.[stat as keyof PlayerStatsType] || 0) - 1)}
                                disabled={(games.find(g => g.id === gameId)?.playerStats[player.id]?.[stat as keyof PlayerStatsType] || 0) <= 0}
                            >
                                -
                            </Button>
                            <span>{games.find(g => g.id === gameId)?.playerStats[player.id]?.[stat as keyof PlayerStatsType] || 0}</span>
                            <Button
                                variant="outline"
                                size="icon"
                                onClick={() => updateStat(gameId, player.id, stat, (games.find(g => g.id === gameId)?.playerStats[player.id]?.[stat as keyof PlayerStatsType] || 0) + 1)}
                            >
                                +
                            </Button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default PlayerStats;
