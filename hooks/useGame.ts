import { GameConfig, GameState } from '@/types';
import { useState, useRef } from 'react';

export const useGameState = (gameConfig: GameConfig) => {
    const [gameState, setGameState] = useState<GameState>({
        isRunning: false,
        score: 0,
        timeLeft: gameConfig.duration || 60,
        gameOver: false,
        currentPunch: '',
        successMessage: ''
    });

    const sequenceIndexRef = useRef<number>(0);
    const completedMovesRef = useRef<Set<number>>(new Set());

    const resetGame = () => {
        setGameState({
            isRunning: false,
            score: 0,
            timeLeft: gameConfig.duration || 60,
            gameOver: false,
            currentPunch: '',
            successMessage: ''
        });
        sequenceIndexRef.current = 0;
        completedMovesRef.current.clear();
    };

    return {
        gameState,
        setGameState,
        sequenceIndexRef,
        completedMovesRef,
        resetGame
    };
};