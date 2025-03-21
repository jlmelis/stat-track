import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PlusCircle } from 'lucide-react';

interface PlayerFormProps {
    newPlayerName: string;
    setNewPlayerName: (name: string) => void;
    newPlayerNumber: string;
    setNewPlayerNumber: (number: string) => void;
    addPlayer: () => void;
}

const PlayerForm: React.FC<PlayerFormProps> = ({
    newPlayerName,
    setNewPlayerName,
    newPlayerNumber,
    setNewPlayerNumber,
    addPlayer,
}) => {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Add New Player</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
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
            </CardContent>
        </Card>
    );
};

export default PlayerForm;
