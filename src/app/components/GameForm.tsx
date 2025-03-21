import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PlusCircle } from 'lucide-react';

interface GameFormProps {
    onCreateGame: (date: string, opponent: string) => void;
}

const GameForm: React.FC<GameFormProps> = ({ onCreateGame }) => {
    const [newGameDate, setNewGameDate] = useState('');
    const [newGameOpponent, setNewGameOpponent] = useState('');

    const handleCreateGame = () => {
        if (!newGameDate || !newGameOpponent) return;
        onCreateGame(newGameDate, newGameOpponent);
        setNewGameDate('');
        setNewGameOpponent('');
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Create New Game</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                    <input
                        type="date"
                        placeholder="Date"
                        value={newGameDate}
                        onChange={(e) => setNewGameDate(e.target.value)}
                        className="p-2 border rounded"
                    />
                    <input
                        type="text"
                        placeholder="Opponent"
                        value={newGameOpponent}
                        onChange={(e) => setNewGameOpponent(e.target.value)}
                        className="p-2 border rounded"
                    />
                </div>
                <Button onClick={handleCreateGame} className="w-full">
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Create Game
                </Button>
            </CardContent>
        </Card>
    );
};

export default GameForm;
