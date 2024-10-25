import React from 'react';
import { TetrominoType, Tetromino } from '../types/tetris';

interface GameBoardProps {
  board: (TetrominoType | null)[][];
  currentPiece: Tetromino | null;
}

const COLORS: Record<TetrominoType, string> = {
  I: 'bg-cyan-400',
  O: 'bg-yellow-400',
  T: 'bg-purple-500',
  S: 'bg-green-500',
  Z: 'bg-red-500',
  J: 'bg-blue-500',
  L: 'bg-orange-500'
};

export const GameBoard: React.FC<GameBoardProps> = ({ board, currentPiece }) => {
  // Create a copy of the board to render current piece
  const displayBoard = board.map(row => [...row]);

  // Merge current piece into display board
  if (currentPiece) {
    currentPiece.shape.forEach((row, y) => {
      row.forEach((cell, x) => {
        if (cell) {
          const boardY = currentPiece.position.y + y;
          const boardX = currentPiece.position.x + x;
          if (boardY >= 0 && boardY < board.length && boardX >= 0 && boardX < board[0].length) {
            displayBoard[boardY][boardX] = currentPiece.type;
          }
        }
      });
    });
  }

  return (
    <div className="grid gap-[1px] bg-gray-700 p-1 rounded-lg">
      {displayBoard.map((row, y) => (
        <div key={y} className="flex">
          {row.map((cell, x) => (
            <div
              key={`${x}-${y}`}
              className={`w-6 h-6 border-[1px] border-opacity-10 border-white
                ${cell ? COLORS[cell] : 'bg-gray-900 bg-opacity-90'}
                ${cell ? 'shadow-inner' : ''}
                transition-colors duration-100`}
            />
          ))}
        </div>
      ))}
    </div>
  );
};