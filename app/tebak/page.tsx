import BoxingTrainingGame from "@/components/game/boxing";
import { GameConfig } from "@/types";

const TebakPage = () => {
    const sequenceConfig: GameConfig = {
        mode: 'sequence',
        sequence: [
            'jab',
            'cross',
            'hook',
            'uppercut'
        ]
    };

    return <BoxingTrainingGame gameConfig={sequenceConfig} />;
};

export default TebakPage