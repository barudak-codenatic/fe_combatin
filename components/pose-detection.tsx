'use client';

import React, { useRef, useEffect, useState } from 'react';

const PoseDetectionComponent = () => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [punchType, setPunchType] = useState<string>('');

    const calculateAngle = (a: any, b: any, c: any) => {
        const radians = Math.atan2(c.y - b.y, c.x - b.x) - 
                        Math.atan2(a.y - b.y, a.x - b.x);
        let angle = Math.abs(radians * 180 / Math.PI);
        angle = Math.min(angle, 360 - angle);
        return angle;
    };

    const detectPunchType = (landmarks: any) => {
        if (!landmarks) return '';

        // Get key landmarks for punch detection
        const leftShoulder = landmarks[11];
        const rightShoulder = landmarks[12];
        const leftElbow = landmarks[13];
        const rightElbow = landmarks[14];
        const leftWrist = landmarks[15];
        const rightWrist = landmarks[16];

        // Jab Detection Logic (180-degree punch)
        const isJab = (shoulder: any, elbow: any, wrist: any) => {
            const elbowAngle = calculateAngle(shoulder, elbow, wrist);
            return Math.abs(elbowAngle - 180) < 30 && 
                   wrist.y < shoulder.y;
        };

        // Uppercut Detection Logic (90-degree elbow bend)
        const isUppercut = (shoulder: any, elbow: any, wrist: any) => {
            const elbowAngle = calculateAngle(shoulder, elbow, wrist);
            return Math.abs(elbowAngle - 90) < 30 && 
                   wrist.y < shoulder.y;
        };

        // Check both left and right sides
        if (isJab(leftShoulder, leftElbow, leftWrist)) return 'Left Jab';
        if (isJab(rightShoulder, rightElbow, rightWrist)) return 'Right Jab';
        if (isUppercut(leftShoulder, leftElbow, leftWrist)) return 'Left Uppercut';
        if (isUppercut(rightShoulder, rightElbow, rightWrist)) return 'Right Uppercut';

        return '';
    };

    const initPoseDetection = async () => {
        if (!videoRef.current || !canvasRef.current) return;

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
            const canvasCtx = canvasRef.current?.getContext('2d');
            if (!canvasCtx) return;

            canvasCtx.clearRect(0, 0, canvasRef.current!.width, canvasRef.current!.height);
            canvasCtx.drawImage(results.image, 0, 0, canvasRef.current!.width, canvasRef.current!.height);

            if (results.poseLandmarks) {
                // Detect punch type
                const punch = detectPunchType(results.poseLandmarks);
                setPunchType(punch);

                // Draw landmarks
                results.poseLandmarks.forEach((landmark) => {
                    canvasCtx.beginPath();
                    canvasCtx.arc(landmark.x * canvasRef.current!.width, 
                                   landmark.y * canvasRef.current!.height, 
                                   5, 0, 2 * Math.PI);
                    canvasCtx.fillStyle = 'red';
                    canvasCtx.fill();
                });
            }
        });

        const camera = new Camera(videoRef.current, {
            onFrame: async () => {
                await pose.send({ image: videoRef.current! });
            },
            width: 640,
            height: 480
        });

        camera.start();
    };

    return (
        <div>
            <button 
                onClick={initPoseDetection} 
                className='bg-green-500 rounded-full px-4 pt-2 mb-2'
            >
                Mulai Deteksi
            </button>
            {punchType && (
                <div className='text-xl font-bold text-blue-600'>
                    Punch Detected: {punchType}
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
            />
        </div>
    );
};

export default PoseDetectionComponent;