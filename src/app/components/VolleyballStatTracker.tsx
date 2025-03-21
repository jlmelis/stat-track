'use client'

import { useCallback } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Moon, Sun, Monitor } from 'lucide-react';
import { useTheme } from 'next-themes';
import { useState, useEffect } from 'react';
import GameForm from './GameForm';
import GameList from './GameList';
import PlayerForm from './PlayerForm';
import PlayerStats from './PlayerStats';
import PlayerList from './PlayerList';
import StatsOverview from './StatsOverview';

// Define the types
interface Player {
    id: string;
    name: string;
    number: string;
}

interface Game {
    id: string;
    date: string;
    opponent: string;
    playerStats: { [playerId: string]: PlayerStats };
}

interface PlayerStats {
    kills: number;
    blocks: number;
    aces: number;
    serves: number;
    passes: number;
    sets: number;
    digs: number;
    assists: number;
    errors: number;
}

const initialPlayerStats: PlayerStats = {
    kills: 0,
    blocks: 0,
    aces: 0,
    serves: 0,
    passes: 0,
    sets: 0,
    digs: 0,
    assists: 0,
    errors: 0,
};

// Animation Variants

export default function VolleyballStatTracker() {
    const { theme, setTheme } = useTheme();
    const [players, setPlayers] = useState<Player[]>(() => {
        if (typeof window !== 'undefined') {
            const savedPlayers = localStorage.getItem('volleyballPlayers');
            return savedPlayers ? JSON.parse(savedPlayers) : [];
        }
        return [];
    });
    const [games, setGames] = useState<Game[]>(() => {
        if (typeof window !== 'undefined') {
            const savedGames = localStorage.getItem('volleyballGames');
            return savedGames ? JSON.parse(savedGames) : [];
        }
        return [];
    });
    const [currentGameId, setCurrentGameId] = useState<string | null>(null);
    const [newPlayerName, setNewPlayerName] = useState('');
    const [newPlayerNumber, setNewPlayerNumber] = useState('');
    // Persist state to localStorage
     useEffect(() => {
        if (typeof window !== 'undefined') {
            localStorage.setItem('volleyballPlayers', JSON.stringify(players));
            localStorage.setItem('volleyballGames', JSON.stringify(games));
        }
    }, [players, games]);

    // Helper functions
    const createNewGame = useCallback((date: string, opponent: string) => {
        const newGame: Game = {
            id: crypto.randomUUID(),
            date: date,
            opponent: opponent,
            playerStats: Object.fromEntries(players.map(p => [p.id, { ...initialPlayerStats }])),
        };
        setGames(prevGames => [...prevGames, newGame]);
        setCurrentGameId(newGame.id);
    }, [players]);

    const addPlayer = useCallback(() => {
        if (!newPlayerName.trim() || !newPlayerNumber.trim()) return;

        const newPlayer: Player = {
            id: crypto.randomUUID(),
            name: newPlayerName,
            number: newPlayerNumber,
        };
        setPlayers(prevPlayers => [...prevPlayers, newPlayer]);
        setNewPlayerName('');
        setNewPlayerNumber('');
    }, [newPlayerName, newPlayerNumber]);

    const deleteGame = (id: string) => {
        setGames(prevGames => prevGames.filter(g => g.id !== id));
        if (currentGameId === id) {
            setCurrentGameId(null); // Reset current game if it's deleted
        }
    };

    const updateStat = (gameId: string, playerId: string, stat: string | number | symbol, value: number) => {
        setGames(prevGames =>
            prevGames.map(game =>
                game.id === gameId
                    ? {
                        ...game,
                        playerStats: {
                            ...game.playerStats,
                            [playerId]: {
                                ...game.playerStats[playerId],
                                [stat]: value,
                            },
                        },
                    }
                    : game
            )
        );
    };

    // Theme Toggle
    const toggleTheme = () => {
        if (theme === 'system') {
            setTheme('light');
        } else if (theme === 'light') {
            setTheme('dark');
        } else {
            setTheme('system');
        }
    };

    return (
        <div className="min-h-screen bg-background text-foreground">
            <header className="py-4 px-6 border-b border-border flex items-center justify-between">
                <h1 className="text-2xl font-bold">Volleyball Stat Tracker</h1>
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" onClick={toggleTheme}>
                        {theme === 'dark' ? (
                            <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                        ) : theme === 'system' ? (
                            <Monitor className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                        ) : (
                            <Moon className="h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                        )}
                        <span className="sr-only">Toggle theme</span>
                    </Button>
                </div>
            </header>

            <main className="p-6">
                <Tabs defaultValue="games" className="space-y-6">
                    <TabsList className="grid w-full grid-cols-3">
                        <TabsTrigger value="games">Games</TabsTrigger>
                        <TabsTrigger value="players">Players</TabsTrigger>
                        <TabsTrigger value="stats">Stats</TabsTrigger>
                    </TabsList>

                    {/* Games Tab Content */}
                    <TabsContent value="games" className="space-y-4">
                        <GameForm onCreateGame={createNewGame} />

                        <GameList 
                                games={games}
                                setCurrentGameId={setCurrentGameId}
                                deleteGame={deleteGame}
                            />

                        {/* Display Stats for Selected Game */}
                        {currentGameId && (
                            <Card>
                                <CardHeader>
                                 <CardTitle>Game Stats: {games.find(g => g.id === currentGameId)?.date} - {games.find(g => g.id === currentGameId)?.opponent}</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    {players.map((player) => (
                                        <PlayerStats
                                            key={player.id}
                                            gameId={currentGameId}
                                            player={player}
                                            initialPlayerStats={initialPlayerStats}
                                            games={games}
                                            updateStat={updateStat}
                                        />
                                    ))}
                                </CardContent>
                            </Card>
                        )}
                    </TabsContent>

                    {/* Players Tab Content */}
                    <TabsContent value="players" className="space-y-4">
                        <PlayerForm
                            newPlayerName={newPlayerName}
                            setNewPlayerName={setNewPlayerName}
                            newPlayerNumber={newPlayerNumber}
                            setNewPlayerNumber={setNewPlayerNumber}
                            addPlayer={addPlayer}
                        />
                        <PlayerList
                            players={players}
                            setNewPlayerName={setNewPlayerName}
                            setNewPlayerNumber={setNewPlayerNumber}
                        />
                    </TabsContent>

                    {/* Stats Tab Content */}
                    <TabsContent value="stats" className="space-y-4">
                        <StatsOverview players={players} games={games} />
                    </TabsContent>
                </Tabs>
            </main>
        </div>
    );
}
