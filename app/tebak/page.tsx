import BoxingTrainingGame from "@/components/game/boxing";
import { GameConfig } from "@/types";

const TebakPage = () => {
    const sequenceConfig: GameConfig = {
        mode: 'sequence',
        sequence: [
            'Left Jab',
            'Right Uppercut',
            'Left Uppercut',
            'Right Jab'
        ]
    };

    return <BoxingTrainingGame gameConfig={sequenceConfig} />;
};

export default TebakPage