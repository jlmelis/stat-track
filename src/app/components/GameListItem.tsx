'use client'

import { Button } from "@/components/ui/button";
import { motion } from 'framer-motion';
import { Trash2, ListChecks, Eye } from 'lucide-react';

interface GameListItemProps {
    game: {
        id: string;
        date: string;
        opponent: string;
    };
    setCurrentGameId: (id: string | null) => void;
    deleteGame: (id: string) => void;
}

const listItemVariants = {
    hidden: { opacity: 0, x: -10 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.2 } },
    exit: { opacity: 0, x: 10, transition: { duration: 0.1 } }
};

const GameListItem: React.FC<GameListItemProps> = ({ game, setCurrentGameId, deleteGame }) => {
    return (
        <motion.div
            key={game.id}
            variants={listItemVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="flex items-center justify-between p-2 border-b last:border-0"
        >
            <div>
                {game.date} - {game.opponent}
            </div>
            <div className="flex gap-2">
                {/* Text Button (Hidden on Small Screens) */}
                <Button
                    variant="outline"
                    size="sm"
                    className="hidden md:flex items-center"
                    onClick={() => setCurrentGameId(game.id)}
                >
                    <ListChecks className="mr-2 h-4 w-4" />
                    View Stats
                </Button>
                {/* Icon Button (Hidden on Medium Screens and Up) */}
                <Button
                    variant="outline"
                    size="sm"
                    className="md:hidden"
                    onClick={() => setCurrentGameId(game.id)}
                    aria-label="View Stats"
                >
                    <Eye className="h-4 w-4" />
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
