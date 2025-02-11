import { useRef, useCallback } from 'react';

export const usePoseDetection = (
    videoRef: any,
    onResults: (results: any) => void
) => {
    const cameraRef = useRef<any>(null);
    const poseRef = useRef<any>(null);

    const initPoseDetection = useCallback(async () => {
        if (!videoRef.current) return false;

        try {
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

            pose.onResults(onResults);
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
            return true;
        } catch (error) {
            console.error('Error initializing pose detection:', error);
            return false;
        }
    }, [onResults]);

    const stopDetection = useCallback(async () => {
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
        } catch (error) {
            console.error('Error stopping detection:', error);
        }
    }, []);

    return { initPoseDetection, stopDetection };
};