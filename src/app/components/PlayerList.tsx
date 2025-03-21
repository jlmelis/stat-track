'use client'

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AnimatePresence } from 'framer-motion';
import PlayerListItem from './PlayerListItem';

interface Player {
    id: string;
    name: string;
    number: string;
}

interface PlayerListProps {
    players: Player[];
    setNewPlayerName: (name: string) => void;
    setNewPlayerNumber: (number: string) => void;
}

const PlayerList: React.FC<PlayerListProps> = ({
    players,
    setNewPlayerName,
    setNewPlayerNumber,
}) => {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Players</CardTitle>
            </CardHeader>
            <CardContent>
                <AnimatePresence>
                    {players.map((player) => (
                        <PlayerListItem
                            key={player.id}
                            player={player}
                            setNewPlayerName={setNewPlayerName}
                            setNewPlayerNumber={setNewPlayerNumber}
                        />
                    ))}
                </AnimatePresence>
            </CardContent>
        </Card>
    );
};

export default PlayerList;
