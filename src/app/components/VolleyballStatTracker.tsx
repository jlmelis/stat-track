'use client'

import { useCallback } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, List } from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Moon, Sun, Monitor } from 'lucide-react';
import { useTheme } from 'next-themes';
import { useState, useEffect } from 'react';
import GameForm from './GameForm';
import GameList from './GameList';
import PlayerForm from './PlayerForm';
import PlayerList from './PlayerList';
import StatsOverview from './StatsOverview';
import PlayerStats from './PlayerStats';
import type { StatTrackerTypes } from '@/lib/types';

const initialPlayerStats: StatTrackerTypes.PlayerStats = {
    kills: 0,
    errors: 0,
    assists: 0,
    digs: 0,
    blocks: 0,
    aces: 0,
    serves: 0,
    passes: 0,
    sets: 0,
};

// Animation Variants

export default function VolleyballStatTracker() {
    const { theme, setTheme } = useTheme();
    const [players, setPlayers] = useState<StatTrackerTypes.Player[] | null>(null);
    const [games, setGames] = useState<StatTrackerTypes.Game[] | null>(null);
    const [currentGameId, setCurrentGameId] = useState<string | null>(null);
    const [showGameList, setShowGameList] = useState(true);
    const [open, setOpen] = useState(false);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const savedPlayers = localStorage.getItem('volleyballPlayers');
            const savedGames = localStorage.getItem('volleyballGames');
            const parsedGames = savedGames ? JSON.parse(savedGames) : [];
            setPlayers(savedPlayers ? JSON.parse(savedPlayers) : []);
            setGames(parsedGames);
        }
    }, []);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            localStorage.setItem('volleyballPlayers', JSON.stringify(players));
            localStorage.setItem('volleyballGames', JSON.stringify(games));
        }
    }, [players, games]);

    // Helper functions
    const createNewGame = useCallback((date: string, opponent: string) => {
        if (!players) return;

        const newGame: StatTrackerTypes.Game = {
            id: crypto.randomUUID(),
            date: date,
            opponent: opponent,
            playerStats: Object.fromEntries(players.map(p => [p.id, { ...initialPlayerStats }])), // Ensure copies here too
        };
        setGames(prevGames => [...(prevGames || []), newGame]);
        setCurrentGameId(newGame.id);
    }, [players]);

    const addPlayer = useCallback((name: string, number: string) => {
        if (!name.trim() || !number.trim()) return;

        const newPlayer: StatTrackerTypes.Player = {
            id: crypto.randomUUID(),
            name: name,
            number: number,
            stats: { ...initialPlayerStats }, // Create a copy
        };
        setPlayers(prevPlayers => [...(prevPlayers || []), newPlayer]);
    }, []);

    const deleteGame = (id: string) => {
        setGames(prevGames => (prevGames ? prevGames.filter(g => g.id !== id) : null));
        if (currentGameId === id) {
            setCurrentGameId(null); // Reset current game if it's deleted
        }
    };

    const updateStat = (gameId: string, playerId: string, stat: keyof StatTrackerTypes.PlayerStats, value: number) => {
        setGames(prevGames => {
            if (!prevGames) return null; // Handle case where games might be null initially

            return prevGames.map(game => {
                if (game.id === gameId) {
                    // Ensure playerStats and the specific player's stats exist
                    const currentPlayerStats = game.playerStats?.[playerId] ?? initialPlayerStats;

                    const updatedPlayerStats = {
                        ...game.playerStats,
                        [playerId]: {
                            ...currentPlayerStats,
                            [stat]: value, // Use the provided new value
                        },
                    };
                    return { ...game, playerStats: updatedPlayerStats };
                }
                return game;
            });
        });
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
                        <Dialog open={open} onOpenChange={setOpen}>
                            <DialogTrigger asChild>
                                <Button variant="secondary" className="mr-2">
                                    <Plus className="h-4 w-4" />
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-[425px]">
                               <DialogHeader>
                                   <DialogTitle>Create New Game</DialogTitle>
                               </DialogHeader>
                               <GameForm onCreateGame={createNewGame} onClose={() => setOpen(false)} />
                           </DialogContent>
                        </Dialog>

                        {showGameList && games && (
                            <GameList
                                games={games}
                                setCurrentGameId={(id: string | null) => {
                                    setCurrentGameId(id);
                                    setShowGameList(false);
                                }}
                                deleteGame={deleteGame}
                            />
                        )}

                    {/* Display Stats for Selected Game */}
                    {!showGameList && currentGameId && (
                        <>
                            <Button variant="secondary" className="mr-2" onClick={() => {
                                setCurrentGameId(null);
                                setShowGameList(true);
                            }}>
                                <List className="h-4 w-4" />
                            </Button>
                            <Card>
                                <CardHeader>
                                    <CardTitle>Game Stats: {games?.find(g => g.id === currentGameId)?.date || ''} - {games?.find(g => g.id === currentGameId)?.opponent || ''}</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    {players && games && players.map((player) => (
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
                        </>
                    )}
                    </TabsContent>

                    {/* Players Tab Content */}
                    <TabsContent value="players" className="space-y-4">
                        <PlayerForm
                            onAddPlayer={addPlayer}
                        />
                        {players && (
                            <PlayerList
                                players={players}
                            />
                        )}
                    </TabsContent>

                    {/* Stats Tab Content */}
                    <TabsContent value="stats" className="space-y-4">
                        {players && games && <StatsOverview players={players} games={games} />}
                    </TabsContent>
                </Tabs>
            </main>
        </div>
    );
}
