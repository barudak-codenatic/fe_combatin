import { useMultiplayerGame } from '@/hooks/useMultiplayerGame';
import BoxingTrainingGame from './boxing';

interface Props {
  name: string;
}

export const MultiplayerBoxingGame: React.FC<Props> = ({ name }) => {
  const {
    gameState,
    playerId,
    challengePlayer,
    acceptChallenge,
    sendGameUpdate,
    endGame,
  } = useMultiplayerGame(name);

  console.log(gameState)

  return (
    <div className="container mx-auto p-4">
      {!gameState.isPlaying ? (
        <div className="space-y-4">
          <h2 className="text-2xl font-bold">Available Players</h2>
          <div className="grid grid-cols-1 gap-4">
            {gameState.players
              .filter(player => player.id !== playerId)
              .map(player => (
                <div
                  key={player.id}
                  className="flex items-center justify-between p-4 bg-gray-100 rounded-lg"
                >
                  <span>{player.name}</span>
                  <button
                    onClick={() => challengePlayer(player.id)}
                    className="px-4 py-2 bg-blue-500 text-white rounded"
                  >
                    Challenge
                  </button>
                </div>
              ))}
          </div>

          {gameState.challengePending && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
              <div className="bg-white p-6 rounded-lg">
                <p className="mb-4">You have been challenged to a game!</p>
                <button
                  onClick={acceptChallenge}
                  className="px-4 py-2 bg-green-500 text-white rounded"
                >
                  Accept Challenge
                </button>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="relative">
          <BoxingTrainingGame
            gameConfig={{
              mode: 'bubble',
              duration: 60,
            }}
          />
          
          <div className="absolute top-4 left-4 bg-black/50 p-4 rounded">
            <p className="text-white">Opponent Score: {gameState.opponentScore}</p>
          </div>
        </div>
      )}
    </div>
  );
};