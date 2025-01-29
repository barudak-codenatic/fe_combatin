'use client';

import React, { useRef, useEffect, useState } from 'react';

const GAME_DURATION = 60; // 60 seconds
const MIN_GAP = 300; // Minimum vertical gap between bubbles
const MAX_GAP = 700; // Maximum vertical gap between bubbles
const INITIAL_SPEED = 3; // Starting speed
const MAX_SPEED = 5; // Maximum speed at the end

const PunchTrainingGame = () => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [punchType, setPunchType] = useState<string>('');
    const [isRunning, setIsRunning] = useState(false);
    const [score, setScore] = useState(0);
    const [timeLeft, setTimeLeft] = useState(GAME_DURATION);
    const [gameOver, setGameOver] = useState(false);
    const cameraRef = useRef<any>(null);
    const poseRef = useRef<any>(null);
    const bubbleRef = useRef<any[]>([]);
    const gameStartTimeRef = useRef<number>(0);

    class Bubble {
        x: number;
        y: number;
        radius: number;
        speed: number;
        punchType: string;
        active: boolean;
        creationTime: number;

        constructor(previousBubbleY: number | null) {
            this.radius = 40;
            this.x = 120; // Fixed x position for vertical alignment
            // Set y position based on previous bubble
            this.y = previousBubbleY === null ? -this.radius : 
                    previousBubbleY - (MIN_GAP + Math.random() * (MAX_GAP - MIN_GAP));
            this.active = true;
            const punchTypes = ['Left Jab', 'Right Jab', 'Left Uppercut', 'Right Uppercut'];
            this.punchType = punchTypes[Math.floor(Math.random() * punchTypes.length)];
            this.creationTime = Date.now();
            // Initial speed will be updated in update()
            this.speed = INITIAL_SPEED;
        }

        update(elapsedTime: number) {
            // Calculate speed based on elapsed time
            const speedProgress = Math.min(elapsedTime / GAME_DURATION, 1);
            this.speed = INITIAL_SPEED + (MAX_SPEED - INITIAL_SPEED) * speedProgress;
            this.y += this.speed;
        }

        draw(ctx: CanvasRenderingContext2D) {
            if (!this.active) return;
            
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(65, 105, 225, 0.6)';
            ctx.fill();
            ctx.strokeStyle = 'white';
            ctx.lineWidth = 2;
            ctx.stroke();
            
            ctx.fillStyle = 'white';
            ctx.font = 'bold 16px Arial';
            ctx.textAlign = 'center';
            ctx.fillText(this.punchType, this.x, this.y);
        }

        isOffscreen(height: number) {
            return this.y > height + this.radius;
        }
    }

    const calculateAngle = (a: any, b: any, c: any) => {
        const radians = Math.atan2(c.y - b.y, c.x - b.x) - 
                        Math.atan2(a.y - b.y, a.x - b.x);
        let angle = Math.abs(radians * 180 / Math.PI);
        angle = Math.min(angle, 360 - angle);
        return angle;
    };

    const checkCollision = (wrist: any, bubble: any, canvasWidth: number, canvasHeight: number) => {
        const wristX = wrist.x * canvasWidth;
        const wristY = wrist.y * canvasHeight;
        
        const distance = Math.sqrt(
            Math.pow(bubble.x - wristX, 2) + 
            Math.pow(bubble.y - wristY, 2)
        );
        
        return distance < bubble.radius;
    };

    const detectPunchType = (landmarks: any) => {
        if (!landmarks || !canvasRef.current) return '';

        const leftShoulder = landmarks[11];
        const rightShoulder = landmarks[12];
        const leftElbow = landmarks[13];
        const rightElbow = landmarks[14];
        const leftWrist = landmarks[15];
        const rightWrist = landmarks[16];

        const isJab = (shoulder: any, elbow: any, wrist: any) => {
            const elbowAngle = calculateAngle(shoulder, elbow, wrist);
            return Math.abs(elbowAngle - 180) < 30 && 
                   wrist.y < shoulder.y;
        };

        const isUppercut = (shoulder: any, elbow: any, wrist: any) => {
            const elbowAngle = calculateAngle(shoulder, elbow, wrist);
            return Math.abs(elbowAngle - 90) < 30 && 
                   wrist.y < shoulder.y;
        };

        let detectedPunch = '';
        let activeWrist = null;

        if (isJab(leftShoulder, leftElbow, leftWrist)) {
            detectedPunch = 'Left Jab';
            activeWrist = leftWrist;
        } else if (isJab(rightShoulder, rightElbow, rightWrist)) {
            detectedPunch = 'Right Jab';
            activeWrist = rightWrist;
        } else if (isUppercut(leftShoulder, leftElbow, leftWrist)) {
            detectedPunch = 'Left Uppercut';
            activeWrist = leftWrist;
        } else if (isUppercut(rightShoulder, rightElbow, rightWrist)) {
            detectedPunch = 'Right Uppercut';
            activeWrist = rightWrist;
        }

        // Check collision with bubbles if punch detected
        if (detectedPunch && activeWrist) {
            bubbleRef.current.forEach(bubble => {
                if (bubble.active && 
                    bubble.punchType === detectedPunch && 
                    checkCollision(activeWrist, bubble, canvasRef.current!.width, canvasRef.current!.height)) {
                    bubble.active = false;
                    setScore(prev => prev + 10);
                }
            });
        }

        return detectedPunch;
    };

    const updateBubbles = (ctx: CanvasRenderingContext2D) => {
        const elapsedTime = (Date.now() - gameStartTimeRef.current) / 1000;
        
        // Add new bubble if needed
        if (bubbleRef.current.length === 0 || 
            bubbleRef.current[bubbleRef.current.length - 1].y > -MAX_GAP) {
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

    const stopDetection = async () => {
        try {
            if (cameraRef.current) {
                cameraRef.current.stop();
            }
            
            await new Promise(resolve => setTimeout(resolve, 100));
            
            if (poseRef.current) {
                poseRef.current.close();
            }

            cameraRef.current = null;
            poseRef.current = null;
            bubbleRef.current = [];
            
            const ctx = canvasRef.current?.getContext('2d');
            if (ctx) ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
            
            setIsRunning(false);
            setPunchType('');
            setTimeLeft(GAME_DURATION);
            setGameOver(false);
        } catch (error) {
            console.error('Error stopping detection:', error);
            setIsRunning(false);
        }
    };

    const initPoseDetection = async () => {
        if (!videoRef.current || !canvasRef.current || isRunning) return;

        try {
            await stopDetection();
            setScore(0);
            gameStartTimeRef.current = Date.now();
            setGameOver(false);

            const { Camera } = await import('@mediapipe/camera_utils');
            const { Pose } = await import('@mediapipe/pose');

            const pose = new Pose({
                locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/pose/${file}`
            });

            pose.setOptions({
                modelComplexity: 1,
                smoothLandmarks: true,
                minDetectionConfidence: 0.5,
                minTrackingConfidence: 0.5
            });

            pose.onResults((results) => {
                if (!canvasRef.current || gameOver) return;
                const canvasCtx = canvasRef.current.getContext('2d');
                if (!canvasCtx) return;

                canvasCtx.save();
                canvasCtx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
                canvasCtx.drawImage(results.image, 0, 0, canvasRef.current.width, canvasRef.current.height);

                if (results.poseLandmarks) {
                    const punch = detectPunchType(results.poseLandmarks);
                    setPunchType(punch);

                    results.poseLandmarks.forEach((landmark) => {
                        canvasCtx.beginPath();
                        canvasCtx.arc(
                            landmark.x * canvasRef.current!.width,
                            landmark.y * canvasRef.current!.height,
                            5, 0, 2 * Math.PI
                        );
                        canvasCtx.fillStyle = 'red';
                        canvasCtx.fill();
                    });
                }

                updateBubbles(canvasCtx);
                canvasCtx.restore();
            });

            await pose.initialize();

            const camera = new Camera(videoRef.current, {
                onFrame: async () => {
                    if (poseRef.current) {
                        await pose.send({ image: videoRef.current! });
                    }
                },
                width: 640,
                height: 480
            });

            poseRef.current = pose;
            cameraRef.current = camera;

            await camera.start();
            setIsRunning(true);

            // Start timer
            const timer = setInterval(() => {
                setTimeLeft(prev => {
                    if (prev <= 1) {
                        clearInterval(timer);
                        setGameOver(true);
                        stopDetection();
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
        } catch (error) {
            console.error('Error initializing pose detection:', error);
            await stopDetection();
        }
    };

    useEffect(() => {
        return () => {
            if (isRunning) {
                stopDetection();
            }
        };
    }, [isRunning]);

    return (
        <div>
            <div className="mb-4 space-x-2">
                <button 
                    onClick={initPoseDetection}
                    disabled={isRunning}
                    className={`rounded-full px-4 py-2 ${
                        isRunning 
                            ? 'bg-gray-400 cursor-not-allowed' 
                            : 'bg-green-500 hover:bg-green-600'
                    }`}
                >
                    Mulai Game
                </button>
                <button 
                    onClick={stopDetection}
                    disabled={!isRunning}
                    className={`rounded-full px-4 py-2 ${
                        !isRunning 
                            ? 'bg-gray-400 cursor-not-allowed' 
                            : 'bg-red-500 hover:bg-red-600'
                    }`}
                >
                    Berhenti Game
                </button>
                <span className="text-2xl font-bold ml-4">Score: {score}</span>
                <span className="text-2xl font-bold ml-4">Time: {timeLeft}s</span>
            </div>
            {gameOver && (
                <div className="text-3xl font-bold text-green-600 mb-4">
                    Game Over! Final Score: {score}
                </div>
            )}
            {punchType && (
                <div className='text-xl font-bold text-blue-600 mb-2'>
                    Current Punch: {punchType}
                </div>
            )}
            <video 
                ref={videoRef} 
                style={{ display: 'none' }} 
                width={640} 
                height={480} 
                autoPlay 
                playsInline
            />
            <canvas 
                ref={canvasRef} 
                width={640} 
                height={480}
                className="rounded"
            />
        </div>
    );
};

export default PunchTrainingGame;