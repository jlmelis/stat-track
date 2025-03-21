'use client'

import { useState, useEffect, useCallback } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Moon, Sun, Monitor, PlusCircle, Trash2, Edit, Save, ListChecks } from 'lucide-react';
import { useTheme } from 'next-themes';
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from 'framer-motion';

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
const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
    exit: { opacity: 0, y: -20, transition: { duration: 0.2 } }
};

const listItemVariants = {
    hidden: { opacity: 0, x: -10 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.2 } },
    exit: { opacity: 0, x: 10, transition: { duration: 0.1 } }
};

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
    const [editingPlayerId, setEditingPlayerId] = useState<string | null>(null);
    const [newPlayerName, setNewPlayerName] = useState('');
    const [newPlayerNumber, setNewPlayerNumber] = useState('');
    const [newGameDate, setNewGameDate] = useState('');
    const [newGameOpponent, setNewGameOpponent] = useState('');

    // Persist state to localStorage
    useEffect(() => {
        if (typeof window !== 'undefined') {
            localStorage.setItem('volleyballPlayers', JSON.stringify(players));
            localStorage.setItem('volleyballGames', JSON.stringify(games));
        }
    }, [players, games]);

    // Helper functions
    const createNewGame = useCallback(() => {
        if (!newGameDate || !newGameOpponent) return;

        const newGame: Game = {
            id: crypto.randomUUID(),
            date: newGameDate,
            opponent: newGameOpponent,
            playerStats: Object.fromEntries(players.map(p => [p.id, { ...initialPlayerStats }])),
        };
        setGames(prevGames => [...prevGames, newGame]);
        setCurrentGameId(newGame.id);
        setNewGameDate('');
        setNewGameOpponent('');
    }, [newGameDate, newGameOpponent, players]);

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
        setEditingPlayerId(null); // Exit edit mode
    }, [newPlayerName, newPlayerNumber]);

    const updatePlayer = (id: string, newName: string, newNumber: string) => {
        setPlayers(prevPlayers =>
            prevPlayers.map(p =>
                p.id === id ? { ...p, name: newName, number: newNumber } : p
            )
        );
        setEditingPlayerId(null); // Exit edit mode after saving
    };

    const deletePlayer = (id: string) => {
        setPlayers(prevPlayers => prevPlayers.filter(p => p.id !== id));
        // Remove player stats from all games
        setGames(prevGames =>
            prevGames.map(game => {
                const { [id]: _, ...rest } = game.playerStats; // Destructure to remove
                return { ...game, playerStats: rest };
            })
        );
    };

    const deleteGame = (id: string) => {
        setGames(prevGames => prevGames.filter(g => g.id !== id));
        if (currentGameId === id) {
            setCurrentGameId(null); // Reset current game if it's deleted
        }
    };

    const updateStat = (gameId: string, playerId: string, stat: keyof PlayerStats, value: number) => {
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

    const getPlayerTotalStats = (playerId: string): PlayerStats => {
        return games.reduce((total, game) => {
            const gameStats = game.playerStats[playerId] || initialPlayerStats;  // Use initial if undefined
            for (const key in total) {
                if (total.hasOwnProperty(key)) {
                  total[key as keyof PlayerStats] += gameStats[key as keyof PlayerStats] || 0;
                }
            }
            return total;
        }, { ...initialPlayerStats });
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
                                <Button onClick={createNewGame} className="w-full">
                                    <PlusCircle className="mr-2 h-4 w-4" />
                                    Create Game
                                </Button>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Games</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <AnimatePresence>
                                    {games.map((game) => (
                                        <motion.div
                                            key={game.id}
                                            variants={listItemVariants}
                                            initial="hidden"
                                            animate="visible"
                                            exit="exit"
                                            className="flex items-center justify-between p-2 border-b last:border-0"
                                        >
                                            <div>
                                                {game.date} - {game.opponent}
                                            </div>
                                            <div className="flex gap-2">
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => setCurrentGameId(game.id)}
                                                >
                                                    <ListChecks className="mr-2 h-4 w-4" />
                                                    View Stats
                                                </Button>
                                                <Button
                                                    variant="destructive"
                                                    size="sm"
                                                    onClick={() => deleteGame(game.id)}
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </motion.div>
                                    ))}
                                </AnimatePresence>
                            </CardContent>
                        </Card>

                        {/* Display Stats for Selected Game */}
                        {currentGameId && (
                            <Card>
                                <CardHeader>
                                    <CardTitle>Game Stats: {games.find(g => g.id === currentGameId)?.date} - {games.find(g => g.id === currentGameId)?.opponent}</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    {players.map((player) => (
                                        <div key={player.id} className="mb-4 p-4 border rounded">
                                            <h3 className="text-lg font-semibold">{player.name} (#{player.number})</h3>
                                            <div className="grid grid-cols-3 gap-2">
                                                {Object.keys(initialPlayerStats).map((stat) => (
                                                    <div key={stat} className="flex items-center justify-between">
                                                        <span>{stat.charAt(0).toUpperCase() + stat.slice(1)}:</span>
                                                        <div className="flex gap-2">
                                                            <Button
                                                                variant="outline"
                                                                size="icon"
                                                                onClick={() => updateStat(currentGameId, player.id, stat as keyof PlayerStats, (games.find(g => g.id === currentGameId)?.playerStats[player.id]?.[stat as keyof PlayerStats] || 0) - 1)}
                                                                disabled={(games.find(g => g.id === currentGameId)?.playerStats[player.id]?.[stat as keyof PlayerStats] || 0) <= 0}
                                                            >
                                                                -
                                                            </Button>
                                                            <span>{games.find(g => g.id === currentGameId)?.playerStats[player.id]?.[stat as keyof PlayerStats] || 0}</span>
                                                            <Button
                                                                variant="outline"
                                                                size="icon"
                                                                onClick={() => updateStat(currentGameId, player.id, stat as keyof PlayerStats, (games.find(g => g.id === currentGameId)?.playerStats[player.id]?.[stat as keyof PlayerStats] || 0) + 1)}
                                                            >
                                                                +
                                                            </Button>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </CardContent>
                            </Card>
                        )}
                    </TabsContent>

                    {/* Players Tab Content */}
                    <TabsContent value="players" className="space-y-4">
                        <Card>
                            <CardHeader>
                                <CardTitle>Add New Player</CardTitle>
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

                        <Card>
                            <CardHeader>
                                <CardTitle>Players</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <AnimatePresence>
                                    {players.map((player) => (
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
                                                        setNewPlayerNumber(player.number)
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
                                    ))}
                                </AnimatePresence>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* Stats Tab Content */}
                    <TabsContent value="stats" className="space-y-4">
                        <Card>
                            <CardHeader>
                                 <CardTitle>Player Stats Overview</CardTitle>
                            </CardHeader>
                            <CardContent>
                                {players.map((player) => {
                                    const totalStats = getPlayerTotalStats(player.id);
                                    return (
                                        <div key={player.id} className="mb-6 p-4 border rounded">
                                             <h3 className="text-lg font-semibold">{player.name} (#{player.number})</h3>
                                            <div className="grid grid-cols-3 gap-2">
                                                {Object.entries(totalStats).map(([stat, value]) => (
                                                    <div key={stat} className="flex items-center justify-between">
                                                        <span>{stat.charAt(0).toUpperCase() + stat.slice(1)}:</span>
                                                        <span>{value}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    );
                                })}
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </main>
        </div>
    );
}
