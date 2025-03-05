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
        const leftHip = landmarks[23];
        const rightHip = landmarks[24];

        // Deteksi untuk tangan kiri
        const leftPunch = this.detectPunchType(leftShoulder, rightShoulder, leftElbow, leftWrist, leftHip);
        if (leftPunch) return leftPunch;

        // Deteksi untuk tangan kanan
        const rightPunch = this.detectPunchType(rightShoulder, leftShoulder, rightElbow, rightWrist, rightHip);
        if (rightPunch) return rightPunch;

        return '';
    }

    private static detectPunchType(
        shoulder: any, 
        oppositeShoulder: any, 
        elbow: any, 
        wrist: any, 
        hip: any
    ): PunchType | '' {
        // Hitung sudut siku (elbow angle)
        const elbowAngle = calculateAngle(shoulder, elbow, wrist);
        
        // Periksa posisi relatif pergelangan tangan terhadap garis tengah tubuh
        const isCrossingMidline = wrist.x > oppositeShoulder.x;
        
        // Periksa rotasi bahu dan pinggul
        const shoulderRotation = Math.abs(shoulder.z - oppositeShoulder.z);
        
        // Deteksi UPPERCUT - Disederhanakan
        // - Siku membentuk sudut sekitar 90° (diberikan toleransi lebih besar)
        // - Pergelangan tangan berada lebih rendah dari siku atau bergerak ke atas
        // - Tidak perlu memeriksa lutut untuk menyederhanakan deteksi
        if (elbowAngle <= 90 && wrist.y < shoulder.y) {
            return 'uppercut';
        }
        
        // Deteksi JAB
        if (elbowAngle > 160 && !isCrossingMidline && shoulderRotation < 0.2) {
            return 'jab';
        }
        
        // Deteksi CROSS
        if (elbowAngle > 160 && isCrossingMidline && shoulderRotation >= 0.2) {
            return 'cross';
        }
        
        // Deteksi HOOK
        if (elbowAngle >= 70 && elbowAngle <= 110 && shoulderRotation >= 0.3 && !isCrossingMidline) {
            return 'hook';
        }
        
        return '';
    }
}