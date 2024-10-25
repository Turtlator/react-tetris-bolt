export type TetrominoType = 'I' | 'O' | 'T' | 'S' | 'Z' | 'J' | 'L';

export interface Position {
  x: number;
  y: number;
}

export interface Tetromino {
  type: TetrominoType;
  shape: boolean[][];
  position: Position;
}

export interface GameState {
  board: (TetrominoType | null)[][];
  score: number;
  level: number;
  lines: number;
  currentPiece: Tetromino | null;
  nextPiece: Tetromino | null;
  gameOver: boolean;
}