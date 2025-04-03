import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface GameFormProps {
    onCreateGame: (date: string, opponent: string) => void;
    onClose: () => void;
}

const GameForm: React.FC<GameFormProps> = ({ onCreateGame, onClose }) => {
    const [newGameDate, setNewGameDate] = useState('');
    const [newGameOpponent, setNewGameOpponent] = useState('');

    const handleCreateGame = () => {
        if (!newGameDate || !newGameOpponent) return;
        onCreateGame(newGameDate, newGameOpponent);
       setNewGameDate('');
       setNewGameOpponent('');
       onClose();
   };

    return (
        <Card>
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
                    Create
                </Button>
            </CardContent>
        </Card>
    );
};

export default GameForm;
