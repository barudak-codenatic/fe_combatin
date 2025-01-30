export const calculateAngle = (a: any, b: any, c: any) => {
    const radians = Math.atan2(c.y - b.y, c.x - b.x) - 
                    Math.atan2(a.y - b.y, a.x - b.x);
    let angle = Math.abs(radians * 180 / Math.PI);
    angle = Math.min(angle, 360 - angle);
    return angle;
};

export const checkCollision = (
    wrist: any, 
    target: any, 
    canvasWidth: number, 
    canvasHeight: number
) => {
    const wristX = wrist.x * canvasWidth;
    const wristY = wrist.y * canvasHeight;
    
    const distance = Math.sqrt(
        Math.pow(target.x - wristX, 2) + 
        Math.pow(target.y - wristY, 2)
    );
    
    return distance < target.radius;
};