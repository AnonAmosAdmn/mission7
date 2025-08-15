"use client";

import { useEffect, useRef, useState, useCallback } from "react";

const rows = 16;
const cols = 8;
const cellSize = 30;
const colors = ["red", "blue", "yellow"] as const;
const emptyColor = "lightgray";
const borderColor = "#333";
const speedLevels = [800, 650, 500, 400, 300, 200, 150, 100];

type Color = typeof colors[number];
type Orientation = "horizontal" | "vertical";

interface Pill {
  row: number;
  col: number;
  color1: Color;
  color2: Color;
  orientation: Orientation;
}

export default function DrMarioCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [grid, setGrid] = useState<(Color | null)[][]>(
    Array.from({ length: rows }, () => Array(cols).fill(null))
  );
  const [pill, setPill] = useState<Pill>(generateNewPill());
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [level, setLevel] = useState(1);
  const [speed, setSpeed] = useState(speedLevels[0]);
  const [nextPill, setNextPill] = useState<Pill>(generateNewPill());

  function generateNewPill(): Pill {
    return {
      row: 0,
      col: Math.floor(cols / 2) - 1,
      color1: colors[Math.floor(Math.random() * 3)],
      color2: colors[Math.floor(Math.random() * 3)],
      orientation: "horizontal",
    };
  }

  const draw = useCallback(() => {
    const ctx = canvasRef.current?.getContext("2d");
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, cols * cellSize, rows * cellSize);

    // Draw grid background
    ctx.fillStyle = emptyColor;
    ctx.fillRect(0, 0, cols * cellSize, rows * cellSize);

    // Draw grid borders
    ctx.strokeStyle = borderColor;
    ctx.lineWidth = 1;
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        ctx.strokeRect(c * cellSize, r * cellSize, cellSize, cellSize);
      }
    }

    // Draw settled pills
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        if (grid[r][c]) {
          ctx.fillStyle = grid[r][c]!;
          ctx.fillRect(c * cellSize + 1, r * cellSize + 1, cellSize - 2, cellSize - 2);
        }
      }
    }

    // Draw current pill
    if (!gameOver) {
      ctx.fillStyle = pill.color1;
      ctx.fillRect(pill.col * cellSize + 1, pill.row * cellSize + 1, cellSize - 2, cellSize - 2);
      
      if (pill.orientation === "horizontal") {
        ctx.fillStyle = pill.color2;
        ctx.fillRect((pill.col + 1) * cellSize + 1, pill.row * cellSize + 1, cellSize - 2, cellSize - 2);
      } else {
        ctx.fillStyle = pill.color2;
        ctx.fillRect(pill.col * cellSize + 1, (pill.row + 1) * cellSize + 1, cellSize - 2, cellSize - 2);
      }
    }
  }, [grid, pill, gameOver]);

  const movePillDown = useCallback(() => {
    if (gameOver) return;

    setPill(prevPill => {
      // Check if pill can move down
      const canMoveDown = checkMove(prevPill, "down");
      if (canMoveDown) {
        return { ...prevPill, row: prevPill.row + 1 };
      } else {
        // Pill can't move down, settle it
        settlePill(prevPill);
        checkMatches();
        const newPill = { ...nextPill };
        setNextPill(generateNewPill());
        
        // Check if game over
        if (!checkValidPosition(newPill)) {
          setGameOver(true);
        }
        return newPill;
      }
    });
  }, [gameOver, nextPill]);

  const checkMove = (currentPill: Pill, direction: "left" | "right" | "down" | "rotate"): boolean => {
    let newRow = currentPill.row;
    let newCol = currentPill.col;
    let newOrientation = currentPill.orientation;

    if (direction === "left") newCol--;
    if (direction === "right") newCol++;
    if (direction === "down") newRow++;
    if (direction === "rotate") {
      newOrientation = currentPill.orientation === "horizontal" ? "vertical" : "horizontal";
    }

    const testPill: Pill = {
      ...currentPill,
      row: newRow,
      col: newCol,
      orientation: newOrientation,
    };

    return checkValidPosition(testPill);
  };

  const checkValidPosition = (testPill: Pill): boolean => {
    // Check boundaries
    if (testPill.orientation === "horizontal") {
      if (testPill.col < 0 || testPill.col + 1 >= cols) return false;
      if (testPill.row >= rows) return false;
      
      // Check if cells are occupied
      if (grid[testPill.row][testPill.col] !== null) return false;
      if (grid[testPill.row][testPill.col + 1] !== null) return false;
    } else {
      if (testPill.col < 0 || testPill.col >= cols) return false;
      if (testPill.row + 1 >= rows) return false;
      
      // Check if cells are occupied
      if (grid[testPill.row][testPill.col] !== null) return false;
      if (grid[testPill.row + 1][testPill.col] !== null) return false;
    }
    
    return true;
  };

  const settlePill = (currentPill: Pill) => {
    setGrid(prevGrid => {
      const newGrid = [...prevGrid.map(row => [...row])];
      newGrid[currentPill.row][currentPill.col] = currentPill.color1;
      
      if (currentPill.orientation === "horizontal") {
        newGrid[currentPill.row][currentPill.col + 1] = currentPill.color2;
      } else {
        newGrid[currentPill.row + 1][currentPill.col] = currentPill.color2;
      }
      
      return newGrid;
    });
  };

  const checkMatches = () => {
    setGrid(prevGrid => {
      const newGrid = [...prevGrid.map(row => [...row])];
      let matchesFound = false;
      let matchCount = 0;

      // Check horizontal matches
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols - 3; c++) {
          if (
            newGrid[r][c] &&
            newGrid[r][c] === newGrid[r][c + 1] &&
            newGrid[r][c] === newGrid[r][c + 2] &&
            newGrid[r][c] === newGrid[r][c + 3]
          ) {
            // Mark for removal
            newGrid[r][c] = null;
            newGrid[r][c + 1] = null;
            newGrid[r][c + 2] = null;
            newGrid[r][c + 3] = null;
            matchesFound = true;
            matchCount++;
          }
        }
      }

      // Check vertical matches
      for (let c = 0; c < cols; c++) {
        for (let r = 0; r < rows - 3; r++) {
          if (
            newGrid[r][c] &&
            newGrid[r][c] === newGrid[r + 1][c] &&
            newGrid[r][c] === newGrid[r + 2][c] &&
            newGrid[r][c] === newGrid[r + 3][c]
          ) {
            // Mark for removal
            newGrid[r][c] = null;
            newGrid[r + 1][c] = null;
            newGrid[r + 2][c] = null;
            newGrid[r + 3][c] = null;
            matchesFound = true;
            matchCount++;
          }
        }
      }

      if (matchesFound) {
        setScore(prev => prev + matchCount * 100 * level);
        // Increase level every 5 matches
        if (matchCount >= 5 && level < speedLevels.length) {
          setLevel(prev => prev + 1);
          setSpeed(speedLevels[level]);
        }
        
        // Apply gravity to make pills fall
        applyGravity(newGrid);
      }

      return newGrid;
    });
  };

  const applyGravity = (grid: (Color | null)[][]) => {
    for (let c = 0; c < cols; c++) {
      let emptyRow = rows - 1;
      
      for (let r = rows - 1; r >= 0; r--) {
        if (grid[r][c] !== null) {
          if (r !== emptyRow) {
            grid[emptyRow][c] = grid[r][c];
            grid[r][c] = null;
          }
          emptyRow--;
        }
      }
    }
  };

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (gameOver) return;

    switch (e.key) {
      case "ArrowLeft":
        setPill(prevPill => checkMove(prevPill, "left") ? { ...prevPill, col: prevPill.col - 1 } : prevPill);
        break;
      case "ArrowRight":
        setPill(prevPill => checkMove(prevPill, "right") ? { ...prevPill, col: prevPill.col + 1 } : prevPill);
        break;
      case "ArrowDown":
        movePillDown();
        break;
      case "ArrowUp":
        setPill(prevPill => checkMove(prevPill, "rotate") ? { ...prevPill, orientation: prevPill.orientation === "horizontal" ? "vertical" : "horizontal" } : prevPill);
        break;
      case " ":
        // Hard drop
        while (checkMove(pill, "down")) {
          setPill(prev => ({ ...prev, row: prev.row + 1 }));
        }
        movePillDown();
        break;
    }
  }, [gameOver, movePillDown, pill]);

  const resetGame = () => {
    setGrid(Array.from({ length: rows }, () => Array(cols).fill(null)));
    setPill(generateNewPill());
    setNextPill(generateNewPill());
    setGameOver(false);
    setScore(0);
    setLevel(1);
    setSpeed(speedLevels[0]);
  };

  useEffect(() => {
    draw();
  }, [draw]);

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  useEffect(() => {
    const gameLoop = setInterval(() => {
      movePillDown();
    }, speed);

    return () => clearInterval(gameLoop);
  }, [movePillDown, speed]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <h1 className="text-4xl font-bold mb-6 text-blue-600">Dr. Mario Clone</h1>
      
      <div className="flex flex-col md:flex-row items-center gap-8">
        <div className="flex flex-col items-center">
          <canvas
            ref={canvasRef}
            width={cols * cellSize}
            height={rows * cellSize}
            className="border-4 border-gray-800 bg-white shadow-lg"
          />
          
          <div className="mt-4 flex gap-4">
            <button
              onClick={resetGame}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
            >
              New Game
            </button>
            
            {gameOver && (
              <div className="px-4 py-2 bg-red-600 text-white rounded">
                Game Over!
              </div>
            )}
          </div>
        </div>
        
        <div className="flex flex-col gap-4 bg-white p-6 rounded-lg shadow-md">
          <div className="text-2xl font-semibold">Score: {score}</div>
          <div className="text-xl">Level: {level}</div>
          
          <div className="mt-4">
            <h3 className="text-lg font-medium mb-2">Next Pill:</h3>
            <div className="relative w-16 h-16 border border-gray-300 bg-gray-100">
              {nextPill.orientation === "horizontal" ? (
                <>
                  <div 
                    className="absolute top-1 left-1 w-6 h-6 border border-gray-800"
                    style={{ backgroundColor: nextPill.color1 }}
                  />
                  <div 
                    className="absolute top-1 left-9 w-6 h-6 border border-gray-800"
                    style={{ backgroundColor: nextPill.color2 }}
                  />
                </>
              ) : (
                <>
                  <div 
                    className="absolute top-1 left-1 w-6 h-6 border border-gray-800"
                    style={{ backgroundColor: nextPill.color1 }}
                  />
                  <div 
                    className="absolute top-9 left-1 w-6 h-6 border border-gray-800"
                    style={{ backgroundColor: nextPill.color2 }}
                  />
                </>
              )}
            </div>
          </div>
          
          <div className="mt-6">
            <h3 className="text-lg font-medium mb-2">Controls:</h3>
            <ul className="list-disc pl-5 space-y-1">
              <li>← → : Move left/right</li>
              <li>↑ : Rotate pill</li>
              <li>↓ : Move down faster</li>
              <li>Space : Hard drop</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}