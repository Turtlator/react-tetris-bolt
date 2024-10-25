import { useState, useEffect, useCallback } from 'react';
import { GameState, Tetromino, TetrominoType, Position } from '../types/tetris';

const BOARD_WIDTH = 10;
const BOARD_HEIGHT = 20;
const INITIAL_SPEED = 800;

const TETROMINOES: Record<TetrominoType, boolean[][]> = {
  I: [[true, true, true, true]],
  O: [[true, true], [true, true]],
  T: [[true, true, true], [false, true, false]],
  S: [[false, true, true], [true, true, false]],
  Z: [[true, true, false], [false, true, true]],
  J: [[true, false, false], [true, true, true]],
  L: [[false, false, true], [true, true, true]]
};

const createEmptyBoard = () => 
  Array(BOARD_HEIGHT).fill(null).map(() => Array(BOARD_WIDTH).fill(null));

const randomTetromino = (): Tetromino => {
  const types: TetrominoType[] = ['I', 'O', 'T', 'S', 'Z', 'J', 'L'];
  const type = types[Math.floor(Math.random() * types.length)];
  return {
    type,
    shape: TETROMINOES[type],
    position: { x: Math.floor(BOARD_WIDTH / 2) - 1, y: 0 }
  };
};

export const useTetris = () => {
  const [gameState, setGameState] = useState<GameState>({
    board: createEmptyBoard(),
    score: 0,
    level: 1,
    lines: 0,
    currentPiece: randomTetromino(),
    nextPiece: randomTetromino(),
    gameOver: false
  });

  const checkCollision = useCallback((piece: Tetromino, position: Position) => {
    for (let y = 0; y < piece.shape.length; y++) {
      for (let x = 0; x < piece.shape[y].length; x++) {
        if (piece.shape[y][x]) {
          const newX = position.x + x;
          const newY = position.y + y;
          
          if (
            newX < 0 || 
            newX >= BOARD_WIDTH || 
            newY >= BOARD_HEIGHT ||
            (newY >= 0 && gameState.board[newY][newX])
          ) {
            return true;
          }
        }
      }
    }
    return false;
  }, [gameState.board]);

  const mergePiece = useCallback((piece: Tetromino) => {
    const newBoard = gameState.board.map(row => [...row]);
    piece.shape.forEach((row, y) => {
      row.forEach((cell, x) => {
        if (cell) {
          const boardY = piece.position.y + y;
          const boardX = piece.position.x + x;
          if (boardY >= 0) {
            newBoard[boardY][boardX] = piece.type;
          }
        }
      });
    });
    return newBoard;
  }, [gameState.board]);

  const moveDown = useCallback(() => {
    if (!gameState.currentPiece || gameState.gameOver) return;

    const newPosition = {
      ...gameState.currentPiece.position,
      y: gameState.currentPiece.position.y + 1
    };

    if (checkCollision(gameState.currentPiece, newPosition)) {
      const newBoard = mergePiece(gameState.currentPiece);
      const completedLines = newBoard.reduce((acc, row, i) => {
        if (row.every(cell => cell !== null)) {
          return [...acc, i];
        }
        return acc;
      }, [] as number[]);

      const clearedBoard = newBoard.filter((_, i) => !completedLines.includes(i));
      const newLines = Array(completedLines.length)
        .fill(null)
        .map(() => Array(BOARD_WIDTH).fill(null));

      setGameState(prev => ({
        ...prev,
        board: [...newLines, ...clearedBoard],
        currentPiece: prev.nextPiece,
        nextPiece: randomTetromino(),
        score: prev.score + (completedLines.length * 100 * prev.level),
        lines: prev.lines + completedLines.length,
        level: Math.floor((prev.lines + completedLines.length) / 10) + 1,
        gameOver: prev.nextPiece !== null && 
          checkCollision(prev.nextPiece, { x: Math.floor(BOARD_WIDTH / 2) - 1, y: 0 })
      }));
    } else {
      setGameState(prev => ({
        ...prev,
        currentPiece: {
          ...prev.currentPiece!,
          position: newPosition
        }
      }));
    }
  }, [gameState, checkCollision, mergePiece]);

  const hardDrop = useCallback(() => {
    if (!gameState.currentPiece || gameState.gameOver) return;

    let newY = gameState.currentPiece.position.y;
    while (!checkCollision(gameState.currentPiece, { ...gameState.currentPiece.position, y: newY + 1 })) {
      newY++;
    }

    setGameState(prev => ({
      ...prev,
      currentPiece: {
        ...prev.currentPiece!,
        position: { ...prev.currentPiece!.position, y: newY }
      }
    }));
    moveDown();
  }, [gameState, checkCollision, moveDown]);

  const move = useCallback((direction: -1 | 1) => {
    if (!gameState.currentPiece || gameState.gameOver) return;

    const newPosition = {
      ...gameState.currentPiece.position,
      x: gameState.currentPiece.position.x + direction
    };

    if (!checkCollision(gameState.currentPiece, newPosition)) {
      setGameState(prev => ({
        ...prev,
        currentPiece: {
          ...prev.currentPiece!,
          position: newPosition
        }
      }));
    }
  }, [gameState, checkCollision]);

  const rotate = useCallback(() => {
    if (!gameState.currentPiece || gameState.gameOver) return;

    const rotatedShape = gameState.currentPiece.shape[0].map((_, i) =>
      gameState.currentPiece!.shape.map(row => row[i]).reverse()
    );

    const newPiece = {
      ...gameState.currentPiece,
      shape: rotatedShape
    };

    if (!checkCollision(newPiece, gameState.currentPiece.position)) {
      setGameState(prev => ({
        ...prev,
        currentPiece: newPiece
      }));
    }
  }, [gameState, checkCollision]);

  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      switch (event.key) {
        case 'ArrowLeft':
          move(-1);
          break;
        case 'ArrowRight':
          move(1);
          break;
        case 'ArrowDown':
          moveDown();
          break;
        case 'ArrowUp':
          rotate();
          break;
        case ' ':
          hardDrop();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [move, moveDown, rotate, hardDrop]);

  useEffect(() => {
    const interval = setInterval(() => {
      moveDown();
    }, Math.max(100, INITIAL_SPEED - (gameState.level - 1) * 50));

    return () => clearInterval(interval);
  }, [moveDown, gameState.level]);

  const resetGame = useCallback(() => {
    setGameState({
      board: createEmptyBoard(),
      score: 0,
      level: 1,
      lines: 0,
      currentPiece: randomTetromino(),
      nextPiece: randomTetromino(),
      gameOver: false
    });
  }, []);

  return {
    ...gameState,
    move,
    rotate,
    moveDown,
    resetGame
  };
};