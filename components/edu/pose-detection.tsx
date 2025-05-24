"use client";

import React, { useRef, useEffect, useState, Dispatch, SetStateAction } from "react";
import Webcam from "react-webcam";
import { Results as PoseResults, Landmark } from "@mediapipe/pose";
import * as poseDetection from "@mediapipe/pose";
import * as cameraUtils from '@mediapipe/camera_utils';
import * as drawingUtils from '@mediapipe/drawing_utils';
import { LandmarkIndex } from "@/utils";
import { Test } from "@/types";
import { StepProgress } from "./progressBar";
import useApiRequest from "@/hooks/useRequest";
import apiClient from "@/services/apiService";

const PREDICTION_API_URL = "http://localhost:5000/predict"; 

interface Prediction {
    class: string;
    probability: number;
    message?: string;
    error?: string;
}

// --- KOMPONEN REACT ---

export const PoseDetection: React.FC<{test : Test|null|undefined, setStart : Dispatch<SetStateAction<Boolean>>}> = ({test, setStart}) => {
    const webcamRef = useRef<Webcam>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [prediction, setPrediction] = useState<Prediction>({ class: "Loading...", probability: 0 });
    const poseRef = useRef<poseDetection.Pose | null>(null);
    const cameraRef = useRef<cameraUtils.Camera | null>(null);

    const { loading : postLoading, error : postError, makeRequest, data : postData } = useApiRequest<{message : string}, string>();

    const [currentMoveIndex, setCurrentMoveIndex] = useState<number>(0);
    const [gameStatus, setGameStatus] = useState<string>("ready"); 

    const [movement, setMovement] = useState(test?.config)

    useEffect(()=>{
        setMovement(test?.config)
    },[test])

    const lastSendTimeRef = useRef<number>(0);
    const SEND_INTERVAL = 100; // milliseconds

    const [apiStatus, setApiStatus] = useState<string>("Idle"); 

    const sendPoseData = async (landmarksData: number[]) => {
        setApiStatus("Sending..."); 
        try {
            const response = await fetch(PREDICTION_API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ landmarks: landmarksData }),
            });

            const result: Prediction = await response.json();

            if (!response.ok) { 
                console.error("API Error Response:", response.status, result);
                setPrediction({ class: `API Error: ${response.status}`, probability: 0, error: result.error || "Unknown API error" });
                 setApiStatus(`Error: ${response.status}`);
            } else {
                console.log("API Success Response:", result);
                if (result.error) {
                     setPrediction({ class: `Server Error: ${result.error}`, probability: 0 });
                     setApiStatus("Server Error");
                } else if (result.message) { 
                     setPrediction({ class: result.message, probability: 0 });
                     setApiStatus("OK");
                }
                 else {
                    setPrediction({
                        class: result.class,
                        probability: typeof result.probability === 'number' ? result.probability : 0
                    });
                     setApiStatus("OK");
                }
            }
        } catch (error: any) {
            console.error("Fetch API Error:", error);
            setPrediction({ class: `Workspace Error: ${error.message}`, probability: 0 });
            setApiStatus("Fetch Error");
        }
    };

    useEffect(() => {
        console.log("Initializing MediaPipe Pose and Camera...");

        if (!webcamRef.current || !canvasRef.current) {
            console.error("Webcam or Canvas ref not available yet.");
            setPrediction({ class: "Setup Error: Refs", probability: 0 });
            return;
        }

        // Inisialisasi MediaPipe Pose
        const pose = new poseDetection.Pose({
            locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/pose/${file}`,
        });

        pose.setOptions({
            modelComplexity: 1,
            smoothLandmarks: true,
            enableSegmentation: false,
            smoothSegmentation: false,
            minDetectionConfidence: 0.5,
            minTrackingConfidence: 0.5,
        });

        // Set callback onResults
        pose.onResults(onResults);
        poseRef.current = pose;
        console.log("MediaPipe Pose initialized.");
        setPrediction({ class: "Menunggu Gerakan", probability: 0 }); 

        // Setup MediaPipe Camera
        if (webcamRef.current.video) {
            const camera = new cameraUtils.Camera(webcamRef.current.video, {
                onFrame: async () => {
                    if (webcamRef.current?.video && poseRef.current) {
                        try {
                            await poseRef.current.send({ image: webcamRef.current.video });
                        } catch (error) {
                            console.error("Error sending frame to MediaPipe Pose:", error);
                        }
                    }
                },
                width: 640,
                height: 480,
            });
            camera.start();
            cameraRef.current = camera;
            console.log("MediaPipe Camera started.");
        } else {
            console.error("Webcam video element not available for Camera setup.");
             setPrediction({ class: "Setup Error: Webcam", probability: 0 });
        }

        // Cleanup function
        return () => {
            console.log("Cleaning up Camera and MediaPipe Pose...");
            cameraRef.current?.stop();
             if (cameraRef.current) {
                console.log("MediaPipe Camera stopped.");
                cameraRef.current = null;
             }
            poseRef.current?.close()
                .then(() => console.log("MediaPipe Pose closed."))
                .catch(e => console.error("Error closing MediaPipe Pose:", e));
             poseRef.current = null;
        };
    }, []); 

    const onResults = (results: PoseResults) => {
        const canvas = canvasRef.current;
        const ctx = canvas?.getContext("2d");

        if (!canvas || !ctx) { 
            return;
        }

        const videoWidth = webcamRef.current?.video?.videoWidth || 640;
        const videoHeight = webcamRef.current?.video?.videoHeight || 480;
        canvas.width = videoWidth;
        canvas.height = videoHeight;

        ctx.save();
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(results.image, 0, 0, canvas.width, canvas.height);

        if (!results.poseLandmarks) {
            if (prediction.class !== "No Pose Detected") {
                console.log("No pose landmarks detected by MediaPipe.");
                setPrediction({ class: "No Pose Detected", probability: 0 });
            }
             ctx.restore();
            return; 
        }

        const landmarks: Landmark[] = results.poseLandmarks;

        const minVisibility = 0.5;
        const leftHip = landmarks[LandmarkIndex.LEFT_HIP];
        const rightHip = landmarks[LandmarkIndex.RIGHT_HIP];
        const leftShoulder = landmarks[LandmarkIndex.LEFT_SHOULDER];

        const areKeyLandmarksVisible = leftHip && rightHip && leftShoulder &&
                                       (leftHip.visibility ?? 0) >= minVisibility &&
                                       (rightHip.visibility ?? 0) >= minVisibility &&
                                       (leftShoulder.visibility ?? 0) >= minVisibility;


        if (!areKeyLandmarksVisible)
        {
            if (prediction.class !== "Menunggu Pose") {
                console.log("Key landmarks not visible enough.");
                setPrediction({ class: "Menunggu Pose", probability: 0 });
            }

            if (landmarks) {
                 drawingUtils.drawConnectors(ctx, landmarks, poseDetection.POSE_CONNECTIONS,
                  {color: '#808080', lineWidth: 2}); 
                 drawingUtils.drawLandmarks(ctx, landmarks,
                  {color: '#FFA500', lineWidth: 1, radius: 3}); 
            }
            ctx.restore();
            return; 
        }

        const centerX = (leftHip.x + rightHip.x) / 2;
        const centerY = (leftHip.y + rightHip.y) / 2;
        let scale = Math.abs(leftShoulder.y - leftHip.y);
        const MIN_SCALE_THRESHOLD = 0.05;

        if (scale < MIN_SCALE_THRESHOLD) { 
            if (prediction.class !== "Invalid Pose Scale") {
                console.log(`Pose scale (${scale.toFixed(4)}) too small.`);
                setPrediction({ class: "Invalid Pose Scale", probability: 0 });
            }
             drawingUtils.drawConnectors(ctx, landmarks, poseDetection.POSE_CONNECTIONS,
              {color: '#808080', lineWidth: 2}); 
            drawingUtils.drawLandmarks(ctx, landmarks,
              {color: '#FFFF00', lineWidth: 1, radius: 3}); 
            ctx.restore();
            return; 
        }

        const poseArray: number[] = [];
        for (let i = 0; i < landmarks.length; i++) {
             const landmark = landmarks[i];
             if (landmark && typeof landmark.x === 'number' && typeof landmark.y === 'number') {
                 poseArray.push(
                     landmark.x,
                     landmark.y,
                     landmark.z || 0,
                     landmark.visibility || 0
                 );
             } else {
                 console.warn(`Landmark ke-${i} tidak valid, menggunakan 0.`);
                 poseArray.push(0, 0, 0, 0);
             }
        }

        const now = Date.now();

        if (now - lastSendTimeRef.current > SEND_INTERVAL) {
            console.log(`Attempting to send pose data to API (interval: ${SEND_INTERVAL}ms)...`);
            sendPoseData(poseArray);
            lastSendTimeRef.current = now;
        } 

        drawingUtils.drawConnectors(ctx, landmarks, poseDetection.POSE_CONNECTIONS,
            {color: '#00FF00', lineWidth: 2}); 
        drawingUtils.drawLandmarks(ctx, landmarks,
            {color: '#FF0000', lineWidth: 1, radius: 3}); 

        ctx.restore();
    };

    useEffect(()=>{
        if(movement) {
            if (movement.length < currentMoveIndex + 1) setGameStatus('complete');
            if (movement[currentMoveIndex] == prediction.class) setCurrentMoveIndex(currentMoveIndex+1);
        }
    },[prediction])

    const doneTask = async () => {
        try {
            await makeRequest(() => apiClient.post(`/content-progress/${test?.id}`, {testId : test?.id, completed : true}));
            setStart(false)
        } catch (error) {
            console.log(error)
        }
    };

    useEffect(()=>{
        if (gameStatus=='complete') {
            doneTask()
            setStart(false)
        }
    },[gameStatus])

    return (
        <div className="flex flex-col items-center justify-center font-sans">
            <div className="relative w-full aspect-video border-2 rounded-lg shadow-lg overflow-hidden bg-black">
                {/* Webcam */}
                <Webcam
                    ref={webcamRef}
                    className="absolute top-0 left-0 w-full h-full object-cover z-10"
                    mirrored
                    audio={false}
                    videoConstraints={{
                        width: 640,
                        height: 480,
                        facingMode: "user"
                    }}
                    onUserMediaError={(err) => {
                         console.error("Webcam Error:", err);
                         setPrediction({ class: `Webcam Error: ${err.name}`, probability: 0 });
                    }}
                />

                <canvas
                    ref={canvasRef}
                    className="absolute top-0 left-0 w-full h-full z-20"
                />

                {/* API status indicator (opsional, ganti dari Socket status) */}
                 <div className={`absolute top-2 right-2 px-2 py-1 rounded-md z-30 text-xs font-semibold `}>
                    {prediction.error ? (
                        <h3 className="text-xl font-bold text-red-600 mb-1">Error: {prediction.error}</h3>
                    ) : prediction.message ? ( // Tampilkan pesan khusus seperti Invalid Pose Scale
                        <h3 className="text-xl font-bold text-yellow-600 mb-1">{prediction.message}</h3>
                    ) : ( 
                        <div className="bg-red-600 px-3 rounded-full py-1 flex gap-2 items-center">
                            {prediction.probability > 0 ? <h3 className="text-xl text-white">{(prediction.probability * 100).toFixed(1)}%</h3> : null}
                            <h3 className="text-xl font-bold text-white mb-1">{prediction.class}</h3>
                        </div>
                    )}
                 </div>
                 <div className="absolute top-2 bottom-2 left-2 w-fit z-30 flex items-center">
                    {movement&&<StepProgress
                        steps={movement}
                        currentStep={currentMoveIndex}
                        direction="vertical"
                    />}
                 </div>
            </div>
        </div>
    );
};