'use client'

import { motion } from 'framer-motion';

interface Player {
    id: string;
    name: string;
    number: string;
}

interface PlayerListItemProps {
    player: Player;
}

const listItemVariants = {
    hidden: { opacity: 0, x: -10 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.2 } },
    exit: { opacity: 0, x: 10, transition: { duration: 0.1 } }
};

const PlayerListItem: React.FC<PlayerListItemProps> = ({
    player,
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
        </motion.div>
    );
};

export default PlayerListItem;
