'use client'

import { Button } from "@/components/ui/button";
import { motion } from 'framer-motion';
import { Trash2, ListChecks } from 'lucide-react';

interface GameListItemProps {
    game: {
        id: string;
        date: string;
        opponent: string;
    };
    currentGameId: string | null;
    setCurrentGameId: (id: string | null) => void;
    deleteGame: (id: string) => void;
}

const listItemVariants = {
    hidden: { opacity: 0, x: -10 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.2 } },
    exit: { opacity: 0, x: 10, transition: { duration: 0.1 } }
};

const GameListItem: React.FC<GameListItemProps> = ({ game, currentGameId, setCurrentGameId, deleteGame }) => {
    return (
        <motion.div
            key={game.id}
            variants={listItemVariants}
            initial={false}
            animate="visible"
            exit="exit"
            className="flex items-center justify-between p-2 border-b last:border-0"
        >
            <div>
                {game.date} - {game.opponent}
            </div>
            <div className="flex gap-2">
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentGameId(game.id)}
                >
                    <ListChecks className="mr-2 h-4 w-4" />
                    View Stats
                </Button>
                <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => deleteGame(game.id)}
                >
                    <Trash2 className="h-4 w-4" />
                </Button>
            </div>
        </motion.div>
    );
};

export default GameListItem;
