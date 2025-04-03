import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PlusCircle } from 'lucide-react';

interface PlayerFormProps {
    onAddPlayer: (name: string, number: string) => void;
}

const PlayerForm: React.FC<PlayerFormProps> = ({ onAddPlayer }) => {
    const [name, setName] = useState('');
    const [number, setNumber] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!name.trim() || !number.trim()) {
            alert('Please enter both player name and number.');
            return;
        }

        if (isNaN(Number(number))) {
            alert('Please enter a valid number for the player number.');
            return;
        }

        onAddPlayer(name, number);
        setName('');
        setNumber('');
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Add New Player</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-2 gap-4">
                        <input
                            type="text"
                            placeholder="Player Name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="p-2 border rounded"
                            required
                        />
                        <input
                            type="number"
                            placeholder="Number"
                            value={number}
                            onChange={(e) => setNumber(e.target.value)}
                            className="p-2 border rounded"
                            required
                        />
                    </div>
                    <Button type="submit" className="w-full">
                        <PlusCircle className="mr-2 h-4 w-4" />
                        Add Player
                    </Button>
                </form>
            </CardContent>
        </Card>
    );
};

export default PlayerForm;
