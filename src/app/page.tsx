'use client';

import { useEffect, useState } from 'react';
import styles from './page.module.css';

type CellValue = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7;
type Board = CellValue[][];

type Tetromino = {
  shape: number[][];
  position: { x: number; y: number };
  color: CellValue;
};

const BOARD_WIDTH = 10;
const BOARD_HEIGHT = 20;

const TETROMINOS = [
  [
    [0, 1, 0, 0],
    [0, 1, 0, 0],
    [0, 1, 0, 0],
    [0, 1, 0, 0],
  ],
  [
    [0, 2, 0],
    [0, 2, 0],
    [2, 2, 0],
  ],
  [
    [0, 3, 0],
    [0, 3, 0],
    [0, 3, 3],
  ],
  [
    [4, 4],
    [4, 4],
  ],
  [
    [0, 5, 5],
    [5, 5, 0],
    [0, 0, 0],
  ],
  [
    [0, 6, 5],
    [6, 6, 6],
    [0, 0, 0],
  ],
  [
    [7, 7, 0],
    [0, 7, 7],
    [0, 0, 0],
  ],
];

const createEnptyBoard = (): Board => {
  return Array.from({ length: BOARD_HEIGHT }, () => Array.from({ length: BOARD_WIDTH }, () => 0));
};

const createNewTetromino = (): Tetromino => {
  const randomIndex = Math.floor(Math.random() * TETROMINOS.length);
  const shape = TETROMINOS[randomIndex];
  const color = (randomIndex + 1) as CellValue;

  return {
    shape,
    position: { x: Math.floor(BOARD_WIDTH / 2) - Math.floor(shape[0].length / 2), y: 0 },
    color,
  };
};

const getColor = (colorValue: CellValue): string => {
  switch (colorValue) {
    case 1:
      return 'cyan';
    case 2:
      return 'blue';
    case 3:
      return 'orange';
    case 4:
      return 'yellow';
    case 5:
      return 'lime';
    case 6:
      return 'purple';
    case 7:
      return 'red';
    default:
      return 'transparent'; // 空のセル
  }
};

export default function Home() {
  const [board, setBoard] = useState<Board>(createEnptyBoard());
  const [currentTetromino, setCurrentTetromino] = useState<Tetromino>(createNewTetromino());

  useEffect(() => {
    const timerId = setInterval(() => {
      setCurrentTetromino((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          position: { ...prev.position, y: prev.position.y + 1 },
        };
      });
    }, 500);
    return () => clearInterval(timerId);
  }, []);

  const mergedBoard = board.map((row) => [...row]);

  if (currentTetromino) {
    const { shape, position, color } = currentTetromino;
    shape.forEach((row, y) => {
      row.forEach((cell, x) => {
        if (cell !== 0) {
          const boardY = position.y + y;
          const boardX = position.x + x;
          if (boardY >= 0 && boardY < BOARD_HEIGHT && boardX < BOARD_WIDTH) {
            mergedBoard[boardY][boardX] = color;
          }
        }
      });
    });
  }

  return (
    <div className={styles.container}>
      <div className={styles.board}>
        {board.map((row, y) =>
          row.map((color, x) => (
            <div
              className={styles.cell}
              key={`${x}-${y}`}
              style={{ backgroundColor: getColor(color) }}
            />
          )),
        )}
      </div>
    </div>
  );
}
