'use client'

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from 'framer-motion';
import { Edit, Trash2 } from 'lucide-react';
import PlayerListItem from './PlayerListItem';

interface Player {
    id: string;
    name: string;
    number: string;
}

interface PlayerListProps {
    players: Player[];
    editingPlayerId: string | null;
    setEditingPlayerId: (id: string | null) => void;
    setNewPlayerName: (name: string) => void;
    setNewPlayerNumber: (number: string) => void;
    deletePlayer: (id: string) => void;
}

const PlayerList: React.FC<PlayerListProps> = ({
    players,
    editingPlayerId,
    setEditingPlayerId,
    setNewPlayerName,
    setNewPlayerNumber,
    deletePlayer,
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
                            editingPlayerId={editingPlayerId}
                            setEditingPlayerId={setEditingPlayerId}
                            setNewPlayerName={setNewPlayerName}
                            setNewPlayerNumber={setNewPlayerNumber}
                            deletePlayer={deletePlayer}
                        />
                    ))}
                </AnimatePresence>
            </CardContent>
        </Card>
    );
};

export default PlayerList;
