'use client'

import { Button } from "@/components/ui/button";
import { motion } from 'framer-motion';
import { Edit, Trash2 } from 'lucide-react';

interface Player {
    id: string;
    name: string;
    number: string;
}

interface PlayerListItemProps {
    player: Player;
    editingPlayerId: string | null;
    setEditingPlayerId: (id: string | null) => void;
    setNewPlayerName: (name: string) => void;
    setNewPlayerNumber: (number: string) => void;
    deletePlayer: (id: string) => void;
}

const listItemVariants = {
    hidden: { opacity: 0, x: -10 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.2 } },
    exit: { opacity: 0, x: 10, transition: { duration: 0.1 } }
};

const PlayerListItem: React.FC<PlayerListItemProps> = ({
    player,
    editingPlayerId,
    setEditingPlayerId,
    setNewPlayerName,
    setNewPlayerNumber,
    deletePlayer,
}) => {
    return (
        <motion.div
            key={player.id}
            variants={listItemVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="flex items-center justify-between p-2 border-b last:border-0"
        >
            <div>
                {player.name} (#{player.number})
            </div>
            <div className="flex gap-2">
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                        setEditingPlayerId(player.id);
                        setNewPlayerName(player.name);
                        setNewPlayerNumber(player.number);
                    }}
                >
                    <Edit className="h-4 w-4" />
                </Button>
                <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => deletePlayer(player.id)}
                >
                    <Trash2 className="h-4 w-4" />
                </Button>
            </div>
        </motion.div>
    );
};

export default PlayerListItem;
