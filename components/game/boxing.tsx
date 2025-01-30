'use client'

import { Bubble } from "@/classes/buble";
import { useGameState, usePoseDetection } from "@/hooks";
import { AudioService, PunchDetectionService } from "@/services";
import { GameConfig, PunchType } from "@/types";
import { checkCollision } from "@/utils";
import { useCallback, useEffect, useRef } from "react";

const BoxingTrainingGame: React.FC<{ gameConfig: GameConfig }> = ({ gameConfig }) => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const audioService = useRef<AudioService>(new AudioService());
    const bubbleRef = useRef<Bubble[]>([]);
    const gameStartTimeRef = useRef<number>(0);
    const timerRef = useRef<NodeJS.Timeout>();

    const {
        gameState,
        setGameState,
        sequenceIndexRef,
        completedMovesRef,
        resetGame
    } = useGameState(gameConfig);

    // Handle pose detection results
    const handlePoseResults = useCallback((results: any) => {
        if (!canvasRef.current || gameState.gameOver) return;
        
        const ctx = canvasRef.current.getContext('2d');
        if (!ctx) return;

        // Clear and draw camera feed
        ctx.save();
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        ctx.drawImage(
            results.image, 
            0, 
            0, 
            ctx.canvas.width, 
            ctx.canvas.height
        );

        // Detect punch and handle game mode
        if (results.poseLandmarks) {
            const detectedPunch = PunchDetectionService.detectPunch(results.poseLandmarks);
            setGameState(prev => ({ ...prev, currentPunch: detectedPunch }));

            if (gameConfig.mode === 'sequence') {
                handleSequenceMode(detectedPunch);
                drawSequenceInterface(ctx);
            } else {
                handleBubbleMode(detectedPunch, results.poseLandmarks);
                updateBubbles(ctx);
            }

            // Draw landmark points
            results.poseLandmarks.forEach((landmark: any) => {
                ctx.beginPath();
                ctx.arc(
                    landmark.x * ctx.canvas.width,
                    landmark.y * ctx.canvas.height,
                    5, 0, 2 * Math.PI
                );
                ctx.fillStyle = '#FF4444';
                ctx.fill();
            });
        }

        ctx.restore();
    }, [gameState.gameOver, gameConfig.mode]);

    const { initPoseDetection, stopDetection } = usePoseDetection(
        videoRef,
        handlePoseResults
    );

    // Game control functions
    const handleSequenceMode = useCallback((detectedPunch: PunchType | '') => {
        if (!gameConfig.sequence || !detectedPunch) return;

        const expectedPunch = gameConfig.sequence[sequenceIndexRef.current];
        
        if (detectedPunch === expectedPunch && 
            !completedMovesRef.current.has(sequenceIndexRef.current)) {
            
            completedMovesRef.current.add(sequenceIndexRef.current);
            audioService.current.playSuccess();
            
            const isLastMove = sequenceIndexRef.current === gameConfig.sequence.length - 1;
            
            if (isLastMove) {
                audioService.current.speak("Excellent! Sequence completed!");
                setGameState(prev => ({
                    ...prev,
                    gameOver: true,
                    successMessage: 'Congratulations! You completed the sequence!'
                }));
                handleGameStop();
            } else {
                audioService.current.speak("Good job! Next, " + 
                    gameConfig.sequence[sequenceIndexRef.current + 1]);
                sequenceIndexRef.current++;
            }
        }
    }, [gameConfig.sequence]);

    const handleBubbleMode = useCallback((detectedPunch: PunchType | '', landmarks: any) => {
        if (!canvasRef.current || !detectedPunch) return;

        const activeWrist = landmarks[detectedPunch.startsWith('Left') ? 15 : 16];
        
        bubbleRef.current.forEach(bubble => {
            if (bubble.active && 
                bubble.punchType === detectedPunch && 
                checkCollision(
                    activeWrist, 
                    bubble, 
                    canvasRef.current!.width, 
                    canvasRef.current!.height
                )) {
                bubble.active = false;
                audioService.current.playSuccess();
                setGameState(prev => ({ ...prev, score: prev.score + 10 }));
            }
        });
    }, []);

    const handleGameStart = async () => {
        if (!videoRef.current || !canvasRef.current || gameState.isRunning) return;

        resetGame();
        gameStartTimeRef.current = Date.now();
        bubbleRef.current = [];

        const success = await initPoseDetection();

        if (success) {
            setGameState(prev => ({ ...prev, isRunning: true }));
            
            if (gameConfig.mode === 'sequence' && gameConfig.sequence) {
                audioService.current.speak("Start with " + gameConfig.sequence[0]);
            }

            // Start timer for bubble mode
            if (gameConfig.mode === 'bubble' && gameConfig.duration) {
                timerRef.current = setInterval(() => {
                    setGameState(prev => {
                        if (prev.timeLeft <= 1) {
                            handleGameStop();
                            return { ...prev, timeLeft: 0, gameOver: true };
                        }
                        return { ...prev, timeLeft: prev.timeLeft - 1 };
                    });
                }, 1000);
            }
        }
    };

    const handleGameStop = useCallback(async () => {
        await stopDetection();
        if (timerRef.current) {
            clearInterval(timerRef.current);
        }
        setGameState(prev => ({ ...prev, isRunning: false }));
        bubbleRef.current = [];
        
        if (canvasRef.current) {
            const ctx = canvasRef.current.getContext('2d');
            if (ctx) ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        }
    }, [stopDetection]);

    const drawSequenceInterface = (ctx: CanvasRenderingContext2D) => {
        if (!gameConfig.sequence) return;

        ctx.font = 'bold 24px Arial';
        ctx.fillStyle = 'white';
        ctx.textAlign = 'center';
        
        const currentMove = gameConfig.sequence[sequenceIndexRef.current];
        ctx.fillText(`Perform: ${currentMove}`, ctx.canvas.width / 2, 50);
        
        // Draw progress circles
        gameConfig.sequence.forEach((move, index) => {
            const x = (ctx.canvas.width / (gameConfig.sequence.length + 1)) * (index + 1);
            const y = 100;
            ctx.beginPath();
            ctx.arc(x, y, 20, 0, Math.PI * 2);
            ctx.fillStyle = completedMovesRef.current.has(index) ? '#4CAF50' : '#757575';
            ctx.fill();
            ctx.strokeStyle = 'white';
            ctx.lineWidth = 2;
            ctx.stroke();
        });
    };

    const updateBubbles = (ctx: CanvasRenderingContext2D) => {
        const elapsedTime = (Date.now() - gameStartTimeRef.current) / 1000;
        
        // Add new bubble if needed
        if (bubbleRef.current.length === 0 || 
            bubbleRef.current[bubbleRef.current.length - 1].y > -300) {
            const lastBubble = bubbleRef.current[bubbleRef.current.length - 1];
            const lastBubbleY = lastBubble ? lastBubble.y : null;
            bubbleRef.current.push(new Bubble(lastBubbleY));
        }

        // Update and draw existing bubbles
        bubbleRef.current = bubbleRef.current.filter(bubble => {
            if (!bubble.isOffscreen(ctx.canvas.height) && bubble.active) {
                bubble.update(elapsedTime);
                bubble.draw(ctx);
                return true;
            }
            return false;
        });
    };

    // Cleanup
    useEffect(() => {
        return () => {
            if (gameState.isRunning) {
                handleGameStop();
            }
            if (timerRef.current) {
                clearInterval(timerRef.current);
            }
            audioService.current.cleanup();
        };
    }, [gameState.isRunning, handleGameStop]);

    return (
        <div className="relative w-full max-w-4xl mx-auto">
            <video
                ref={videoRef}
                className="hidden"
                playsInline
            />
            <canvas
                ref={canvasRef}
                className="w-full aspect-video bg-gray-900 rounded-lg shadow-lg"
                width={640}
                height={480}
            />
            
            {/* Game overlay */}
            <div className="absolute top-4 right-4 bg-black/50 p-4 rounded-lg">
                {gameConfig.mode === 'bubble' ? (
                    <>
                        <p className="text-white font-semibold">Score: {gameState.score}</p>
                        <p className="text-white font-semibold">Time: {gameState.timeLeft}s</p>
                    </>
                ) : (
                    <p className="text-white font-semibold">
                        {gameState.successMessage || 
                         `Moves completed: ${completedMovesRef.current.size}/${gameConfig.sequence?.length || 0}`}
                    </p>
                )}
            </div>

            {/* Current punch indicator */}
            {gameState.currentPunch && (
                <div className="absolute top-4 left-4 bg-black/50 p-4 rounded-lg">
                    <p className="text-white font-semibold">
                        Current Punch: {gameState.currentPunch}
                    </p>
                </div>
            )}

            {/* Start/Restart button */}
            {!gameState.isRunning && (
                <button
                    onClick={handleGameStart}
                    className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 
                             bg-blue-500 hover:bg-blue-600 text-white px-8 py-4 rounded-lg
                             font-bold text-lg shadow-lg transition-colors"
                >
                    {gameState.gameOver ? 'Play Again' : 'Start Game'}
                </button>
            )}
        </div>
    );
};

export default BoxingTrainingGame;