export namespace StatTrackerTypes {
    export interface Player {
        id: string;
        name: string;
        number: string;
        stats: PlayerStats;
    }

    export interface Game {
        id: string;
        date: string;
        opponent: string;
        playerStats: { [playerId: string]: PlayerStats };
    }

    export interface PlayerStats {
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
}
