import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AnimatePresence } from 'framer-motion';
import GameListItem from './GameListItem';

interface Game {
    id: string;
    date: string;
    opponent: string;
    playerStats: { [playerId: string]: any };
}


interface GameListProps {
    games: Game[];
    currentGameId: string | null;
    setCurrentGameId: (id: string | null) => void;
    deleteGame: (id: string) => void;
}

const GameList: React.FC<GameListProps> = ({ games, currentGameId, setCurrentGameId, deleteGame }) => {
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
                            currentGameId={currentGameId}
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
