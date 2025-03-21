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
        <Card>
            <CardHeader>
                <CardTitle>Games</CardTitle>
            </CardHeader>
            <CardContent>
                <AnimatePresence>
                    {games.map((game) => (
                        <GameListItem
                            key={game.id}
                            game={game}
                            setCurrentGameId={setCurrentGameId}
                            deleteGame={deleteGame}
                        />
                    ))}
                </AnimatePresence>
            </CardContent>
        </Card>
    );
};

export default GameList;
