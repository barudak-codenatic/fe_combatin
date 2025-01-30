import { PunchType } from "@/types";

export class Bubble {
    x: number;
    y: number;
    radius: number;
    speed: number;
    punchType: PunchType;
    active: boolean;
    creationTime: number;

    constructor(previousBubbleY: number | null) {
        this.radius = 40;
        this.x = 120;
        this.y = previousBubbleY === null ? -this.radius : 
                previousBubbleY - (300 + Math.random() * 400);
        this.active = true;
        const punchTypes: PunchType[] = ['Left Jab', 'Right Jab', 'Left Uppercut', 'Right Uppercut'];
        this.punchType = punchTypes[Math.floor(Math.random() * punchTypes.length)];
        this.creationTime = Date.now();
        this.speed = 3;
    }

    update(elapsedTime: number) {
        const speedProgress = Math.min(elapsedTime / 60, 1);
        this.speed = 3 + (5 - 3) * speedProgress;
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