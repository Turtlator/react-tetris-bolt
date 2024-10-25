import React from 'react';
import { GameBoard } from './components/GameBoard';
import { GameStats } from './components/GameStats';
import { useTetris } from './hooks/useTetris';
import { Gamepad2 } from 'lucide-react';

function App() {
  const { board, currentPiece, score, level, lines, gameOver, resetGame } = useTetris();

  return (
    <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
      <div className="max-w-4xl w-full p-4">
        <div className="flex items-center justify-center gap-2 mb-8">
          <Gamepad2 className="w-8 h-8 text-purple-500" />
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">
            React Tetris
          </h1>
        </div>

        <div className="flex flex-col md:flex-row gap-8 items-center justify-center">
          <GameBoard board={board} currentPiece={currentPiece} />
          
          <div className="flex flex-col gap-6">
            <GameStats score={score} level={level} lines={lines} />
            
            {gameOver && (
              <div className="text-center">
                <div className="text-2xl font-bold text-red-500 mb-4">Game Over!</div>
                <button
                  onClick={resetGame}
                  className="px-6 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg
                    transition-colors duration-200 font-semibold"
                >
                  Play Again
                </button>
              </div>
            )}

            <div className="bg-gray-800 p-4 rounded-lg">
              <h3 className="text-lg font-semibold mb-2">Controls</h3>
              <ul className="space-y-1 text-sm text-gray-400">
                <li>← → : Move piece</li>
                <li>↓ : Move down</li>
                <li>↑ : Rotate piece</li>
                <li>Space : Drop piece</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;