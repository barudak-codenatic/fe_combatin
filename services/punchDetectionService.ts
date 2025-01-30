import { PunchType } from "@/types";
import { calculateAngle } from "@/utils";

export class PunchDetectionService {
    static detectPunch(landmarks: any): PunchType | '' {
        if (!landmarks) return '';

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

        if (isJab(leftShoulder, leftElbow, leftWrist)) {
            return 'Left Jab';
        } else if (isJab(rightShoulder, rightElbow, rightWrist)) {
            return 'Right Jab';
        } else if (isUppercut(leftShoulder, leftElbow, leftWrist)) {
            return 'Left Uppercut';
        } else if (isUppercut(rightShoulder, rightElbow, rightWrist)) {
            return 'Right Uppercut';
        }

        return '';
    }
}