import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PlusCircle, Save } from 'lucide-react';

interface PlayerFormProps {
    editingPlayerId: string | null;
    setEditingPlayerId: (id: string | null) => void;
    newPlayerName: string;
    setNewPlayerName: (name: string) => void;
    newPlayerNumber: string;
    setNewPlayerNumber: (number: string) => void;
    addPlayer: () => void;
    updatePlayer: (id: string, newName: string, newNumber: string) => void;
}

const PlayerForm: React.FC<PlayerFormProps> = ({
    editingPlayerId,
    setEditingPlayerId,
    newPlayerName,
    setNewPlayerName,
    newPlayerNumber,
    setNewPlayerNumber,
    addPlayer,
    updatePlayer
}) => {
    return (
        <Card>
            <CardHeader>
                <CardTitle>{editingPlayerId ? "Edit Player" : "Add New Player"}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                {editingPlayerId ? (
                    // Render inputs for editing the player
                    <div className="grid grid-cols-2 gap-4">
                        <input
                            type="text"
                            placeholder="Player Name"
                            value={newPlayerName}
                            onChange={(e) => setNewPlayerName(e.target.value)}
                            className="p-2 border rounded"
                        />
                        <input
                            type="text"
                            placeholder="Player Number"
                            value={newPlayerNumber}
                            onChange={(e) => setNewPlayerNumber(e.target.value)}
                            className="p-2 border rounded"
                        />
                        <Button
                            onClick={() => updatePlayer(editingPlayerId, newPlayerName, newPlayerNumber)} // Save
                            className="col-span-2"
                        >
                            <Save className="mr-2 h-4 w-4" />
                            Save
                        </Button>
                    </div>
                ) : (
                    // Render inputs for adding a new player
                    <div className="grid grid-cols-2 gap-4">
                        <input
                            type="text"
                            placeholder="Player Name"
                            value={newPlayerName}
                            onChange={(e) => setNewPlayerName(e.target.value)}
                            className="p-2 border rounded"
                        />
                        <input
                            type="text"
                            placeholder="Player Number"
                            value={newPlayerNumber}
                            onChange={(e) => setNewPlayerNumber(e.target.value)}
                            className="p-2 border rounded"
                        />
                        <Button onClick={addPlayer} className="col-span-2">
                            <PlusCircle className="mr-2 h-4 w-4" />
                            Add Player
                        </Button>
                    </div>
                )}
            </CardContent>
        </Card>
    );
};

export default PlayerForm;
