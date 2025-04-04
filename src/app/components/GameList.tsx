import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AnimatePresence } from 'framer-motion';
import GameListItem from './GameListItem';

interface Game {
    id: string;
    date: string;
    opponent: string;
    playerStats: { [playerId: string]: {
        kills: number;
        blocks: number;
        aces: number;
        serves: number;
        passes: number;
        sets: number;
        digs: number;
        assists: number;
        errors: number;
    } };
}

interface GameListProps {
    games: Game[];
    setCurrentGameId: (id: string | null) => void;
    deleteGame: (id: string) => void;
}

const GameList: React.FC<GameListProps> = ({ games, setCurrentGameId, deleteGame }) => {
    return (
        <div className="w-full flex justify-center">
            <Card className="w-full md:w-3/4 lg:w-2/3 max-w-7xl mx-auto">
                <CardHeader>
                    <CardTitle>Games</CardTitle>
                </CardHeader>
                <CardContent className="p-4">
                    <AnimatePresence>
                        <div className="flex flex-col gap-4"> {/* Vertical flexbox for smaller screens */}
                            {games.map((game) => (
                                <GameListItem
                                    key={game.id}
                                    game={game}
                                    setCurrentGameId={setCurrentGameId}
                                    deleteGame={deleteGame}
                                />
                            ))}
                        </div>
                    </AnimatePresence>
                </CardContent>
            </Card>
        </div>
    );
};

export default GameList;
