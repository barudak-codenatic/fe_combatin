export type GameMode = 'bubble' | 'sequence';
export type PunchType = 'Left Jab' | 'Right Jab' | 'Left Uppercut' | 'Right Uppercut';

export interface GameConfig {
    mode: GameMode;
    duration?: number;
    sequence?: PunchType[];
}

export interface GameState {
    isRunning: boolean;
    score: number;
    timeLeft: number;
    gameOver: boolean;
    currentPunch: string;
    successMessage: string;
}