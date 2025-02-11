'use client'
import { useEffect, useRef, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import useAuthStore from './authStore';

interface Player {
  id: string;
  username: string;
}

interface GameState {
  roomId: string | null;
  players: Player[];
  isPlaying: boolean;
  opponentScore: number;
  challengePending: boolean;
  challengerId: string | null;
}

export const useMultiplayerGame = () => {
  const [gameState, setGameState] = useState<GameState>({
    roomId: null,
    players: [],
    isPlaying: false,
    opponentScore: 0,
    challengePending: false,
    challengerId: null,
  });
  
  const socketRef = useRef<Socket>();
  const [playerId, setPlayerId] = useState<string | null>(null);

  const {userId, name} = useAuthStore()

  useEffect(() => {
    socketRef.current = io(process.env.NEXT_PUBLIC_API_BASE_URL);
    // socketRef.current = io('http://localhost:3001');
    
    // Register player
    socketRef.current.emit('register', { name, userId });

    // Handle registration confirmation
    socketRef.current.on('registered', (data: { playerId: string }) => {
      setPlayerId(data.playerId);
    });

    // Handle player list updates
    socketRef.current.on('playerList', (players: Player[]) => {
      setGameState(prev => ({ ...prev, players }));
    });

    // Handle incoming challenges
    socketRef.current.on('challengeReceived', (data: { roomId: string, challenger: Player }) => {
      setGameState(prev => ({
        ...prev,
        challengePending: true,
        challengerId: data.challenger.id,
        roomId: data.roomId,
      }));
    });

    // Handle game start
    socketRef.current.on('gameStarted', (data: { roomId: string, players: Player[] }) => {
      setGameState(prev => ({
        ...prev,
        roomId: data.roomId,
        isPlaying: true,
        challengePending: false,
      }));
    });

    // Handle opponent updates
    socketRef.current.on('opponentUpdate', (data: { score: number }) => {
      setGameState(prev => ({
        ...prev,
        opponentScore: data.score,
      }));
    });

    // Handle opponent disconnect
    socketRef.current.on('opponentDisconnected', () => {
      setGameState(prev => ({
        ...prev,
        isPlaying: false,
        roomId: null,
        opponentScore: 0,
      }));
    });

    return () => {
      socketRef.current?.disconnect();
    };
  }, [name]);

  const challengePlayer = (targetPlayerId: string) => {
    socketRef.current?.emit('challengePlayer', { targetPlayerId });
  };

  const acceptChallenge = () => {
    if (gameState.roomId) {
      socketRef.current?.emit('acceptChallenge', { roomId: gameState.roomId });
    }
  };

  const sendGameUpdate = (score: number) => {
    if (gameState.roomId && gameState.isPlaying) {
      socketRef.current?.emit('gameUpdate', {
        roomId: gameState.roomId,
        score,
      });
    }
  };

  const endGame = (finalScore: number) => {
    if (gameState.roomId) {
      socketRef.current?.emit('gameEnd', {
        roomId: gameState.roomId,
        finalScore,
      });
    }
  };

  return {
    gameState,
    playerId,
    challengePlayer,
    acceptChallenge,
    sendGameUpdate,
    endGame,
  };
};