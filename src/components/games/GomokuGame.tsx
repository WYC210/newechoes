import React, { useState, useCallback, useEffect } from 'react';

interface GomokuGameProps {
  mode: 'ai' | 'pvp';
  onBack: () => void;
}

type Player = 'black' | 'white' | null;

const GomokuGame: React.FC<GomokuGameProps> = ({ mode, onBack }) => {
  const BOARD_SIZE = 15;
  const [board, setBoard] = useState<Player[][]>(() => 
    Array(BOARD_SIZE).fill(null).map(() => Array(BOARD_SIZE).fill(null))
  );
  const [currentPlayer, setCurrentPlayer] = useState<Player>('black');
  const [winner, setWinner] = useState<Player>(null);
  const [gameStarted, setGameStarted] = useState(false);
  const [isThinking, setIsThinking] = useState(false);

  const checkWinner = useCallback((board: Player[][], row: number, col: number, player: Player): boolean => {
    const directions = [
      [0, 1],   // 水平
      [1, 0],   // 垂直
      [1, 1],   // 对角线
      [1, -1]   // 反对角线
    ];

    for (const [dx, dy] of directions) {
      let count = 1;
      
      // 向一个方向检查
      for (let i = 1; i < 5; i++) {
        const newRow = row + dx * i;
        const newCol = col + dy * i;
        if (newRow >= 0 && newRow < BOARD_SIZE && newCol >= 0 && newCol < BOARD_SIZE && 
            board[newRow][newCol] === player) {
          count++;
        } else {
          break;
        }
      }
      
      // 向相反方向检查
      for (let i = 1; i < 5; i++) {
        const newRow = row - dx * i;
        const newCol = col - dy * i;
        if (newRow >= 0 && newRow < BOARD_SIZE && newCol >= 0 && newCol < BOARD_SIZE && 
            board[newRow][newCol] === player) {
          count++;
        } else {
          break;
        }
      }
      
      if (count >= 5) {
        return true;
      }
    }
    
    return false;
  }, []);

  const evaluatePosition = useCallback((board: Player[][], row: number, col: number, player: Player): number => {
    let score = 0;
    const directions = [[0, 1], [1, 0], [1, 1], [1, -1]];
    
    for (const [dx, dy] of directions) {
      let count = 1;
      let blocked = 0;
      
      // 向一个方向检查
      for (let i = 1; i < 5; i++) {
        const newRow = row + dx * i;
        const newCol = col + dy * i;
        if (newRow >= 0 && newRow < BOARD_SIZE && newCol >= 0 && newCol < BOARD_SIZE) {
          if (board[newRow][newCol] === player) {
            count++;
          } else if (board[newRow][newCol] !== null) {
            blocked++;
            break;
          } else {
            break;
          }
        } else {
          blocked++;
          break;
        }
      }
      
      // 向相反方向检查
      for (let i = 1; i < 5; i++) {
        const newRow = row - dx * i;
        const newCol = col - dy * i;
        if (newRow >= 0 && newRow < BOARD_SIZE && newCol >= 0 && newCol < BOARD_SIZE) {
          if (board[newRow][newCol] === player) {
            count++;
          } else if (board[newRow][newCol] !== null) {
            blocked++;
            break;
          } else {
            break;
          }
        } else {
          blocked++;
          break;
        }
      }
      
      // 根据连子数和阻挡情况计算分数
      if (count >= 5) {
        score += 100000;
      } else if (count === 4 && blocked === 0) {
        score += 10000;
      } else if (count === 4 && blocked === 1) {
        score += 1000;
      } else if (count === 3 && blocked === 0) {
        score += 1000;
      } else if (count === 3 && blocked === 1) {
        score += 100;
      } else if (count === 2 && blocked === 0) {
        score += 100;
      } else if (count === 2 && blocked === 1) {
        score += 10;
      }
    }
    
    return score;
  }, []);

  const getAIMove = useCallback((board: Player[][]): [number, number] | null => {
    let bestScore = -1;
    let bestMove: [number, number] | null = null;
    
    // 简单AI：寻找最佳位置
    for (let row = 0; row < BOARD_SIZE; row++) {
      for (let col = 0; col < BOARD_SIZE; col++) {
        if (board[row][col] === null) {
          // 评估AI下这步的分数
          const aiScore = evaluatePosition(board, row, col, 'white');
          // 评估阻止玩家的分数
          const blockScore = evaluatePosition(board, row, col, 'black');
          
          const totalScore = aiScore + blockScore * 0.8;
          
          if (totalScore > bestScore) {
            bestScore = totalScore;
            bestMove = [row, col];
          }
        }
      }
    }
    
    return bestMove;
  }, [evaluatePosition]);

  const makeMove = useCallback((row: number, col: number) => {
    if (board[row][col] !== null || winner || !gameStarted) return;

    const newBoard = board.map(r => [...r]);
    newBoard[row][col] = currentPlayer;
    setBoard(newBoard);

    if (checkWinner(newBoard, row, col, currentPlayer)) {
      setWinner(currentPlayer);
      return;
    }

    // 切换玩家
    const nextPlayer = currentPlayer === 'black' ? 'white' : 'black';
    setCurrentPlayer(nextPlayer);

    // AI模式下，如果下一个是白棋（AI），则让AI下棋
    if (mode === 'ai' && nextPlayer === 'white') {
      setIsThinking(true);
      setTimeout(() => {
        const aiMove = getAIMove(newBoard);
        if (aiMove) {
          const [aiRow, aiCol] = aiMove;
          const aiBoard = newBoard.map(r => [...r]);
          aiBoard[aiRow][aiCol] = 'white';
          setBoard(aiBoard);

          if (checkWinner(aiBoard, aiRow, aiCol, 'white')) {
            setWinner('white');
          } else {
            setCurrentPlayer('black');
          }
        }
        setIsThinking(false);
      }, 500);
    }
  }, [board, currentPlayer, winner, gameStarted, mode, checkWinner, getAIMove]);

  const startGame = useCallback(() => {
    setBoard(Array(BOARD_SIZE).fill(null).map(() => Array(BOARD_SIZE).fill(null)));
    setCurrentPlayer('black');
    setWinner(null);
    setGameStarted(true);
    setIsThinking(false);
  }, []);

  const resetGame = useCallback(() => {
    startGame();
  }, [startGame]);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-4 md:mb-6">
        <div className="flex items-center">
          <div className="text-2xl md:text-3xl mr-2 md:mr-4">⚫</div>
          <div>
            <h2 className="text-xl md:text-2xl font-bold text-gray-800 dark:text-gray-200">
              五子棋 - {mode === 'ai' ? '人机对战' : '双人对战'}
            </h2>
            <p className="text-sm md:text-base text-gray-600 dark:text-gray-400">
              {gameStarted ? (winner ? '游戏结束' : isThinking ? 'AI思考中...' : `${currentPlayer === 'black' ? '黑棋' : '白棋'}回合`) : '点击开始游戏'}
            </p>
          </div>
        </div>
        <button
          onClick={onBack}
          className="px-2 md:px-4 py-1 md:py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg transition-colors text-sm md:text-base"
        >
          ← 返回
        </button>
      </div>

      {/* 游戏控制和状态区域 - 移到上方 */}
      <div className="text-center mb-4">
        {/* 游戏控制按钮 */}
        <div className="mb-4">
          {!gameStarted ? (
            <button
              onClick={startGame}
              className="px-4 md:px-6 py-2 md:py-3 bg-green-500 hover:bg-green-600 text-white rounded-lg font-semibold transition-colors text-sm md:text-base"
            >
              🎮 开始游戏
            </button>
          ) : (
            <button
              onClick={resetGame}
              className="px-4 md:px-6 py-2 md:py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-semibold transition-colors text-sm md:text-base"
            >
              🔄 重新开始
            </button>
          )}
        </div>

        {/* 胜利提示 - 移到上方 */}
        {winner && (
          <div className="mb-4 p-3 md:p-4 bg-green-100 dark:bg-green-900 rounded-lg mx-4">
            <p className="text-green-800 dark:text-green-200 font-bold text-lg md:text-xl">
              🎉 {winner === 'black' ? '黑棋' : '白棋'}获胜！
            </p>
            {mode === 'ai' && (
              <p className="text-green-600 dark:text-green-300 mt-2 text-sm md:text-base">
                {winner === 'black' ? '🎊 恭喜你战胜了AI！' : '🤖 AI获胜，再接再厉！'}
              </p>
            )}
          </div>
        )}

        {/* 游戏状态提示 */}
        {gameStarted && !winner && (
          <div className="mb-4 p-2 md:p-3 bg-blue-50 dark:bg-blue-900 rounded-lg mx-4">
            <p className="text-blue-800 dark:text-blue-200 font-semibold text-sm md:text-base">
              {isThinking ? '🤔 AI思考中...' : `${currentPlayer === 'black' ? '⚫ 黑棋' : '⚪ 白棋'}回合`}
            </p>
          </div>
        )}

        {/* 操作说明 */}
        <div className="mb-4 text-xs md:text-sm text-gray-500 dark:text-gray-400 px-4">
          <p>🎯 点击棋盘上的空位下棋，先连成五子者获胜</p>
          {mode === 'ai' && <p>⚫ 你执黑棋先手，⚪ AI执白棋</p>}
        </div>
      </div>

      {/* 棋盘区域 */}
      <div className="flex justify-center mb-4 px-2">
        <div className="inline-block bg-amber-50 dark:bg-amber-950 p-2 md:p-4 rounded-lg shadow-lg">
          <div
            className="relative"
            style={{
              width: 'min(90vw, min(90vh, 600px))',
              height: 'min(90vw, min(90vh, 600px))'
            }}
          >
            {/* 绘制棋盘线条 */}
            <svg
              className="absolute inset-0 w-full h-full"
              viewBox="0 0 600 600"
              style={{ zIndex: 1 }}
            >
              {/* 横线 */}
              {Array.from({ length: BOARD_SIZE }, (_, i) => (
                <line
                  key={`h-${i}`}
                  x1="20"
                  y1={20 + (i * 560 / (BOARD_SIZE - 1))}
                  x2="580"
                  y2={20 + (i * 560 / (BOARD_SIZE - 1))}
                  stroke="currentColor"
                  strokeWidth="1"
                  className="text-amber-800 dark:text-amber-300 opacity-60"
                />
              ))}
              {/* 竖线 */}
              {Array.from({ length: BOARD_SIZE }, (_, i) => (
                <line
                  key={`v-${i}`}
                  x1={20 + (i * 560 / (BOARD_SIZE - 1))}
                  y1="20"
                  x2={20 + (i * 560 / (BOARD_SIZE - 1))}
                  y2="580"
                  stroke="currentColor"
                  strokeWidth="1"
                  className="text-amber-800 dark:text-amber-300 opacity-60"
                />
              ))}
              {/* 天元和星位 */}
              {[3, 7, 11].map(row =>
                [3, 7, 11].map(col => (
                  <circle
                    key={`star-${row}-${col}`}
                    cx={20 + (col * 560 / (BOARD_SIZE - 1))}
                    cy={20 + (row * 560 / (BOARD_SIZE - 1))}
                    r="3"
                    fill="currentColor"
                    className="text-amber-700 dark:text-amber-400 opacity-50"
                  />
                ))
              )}
            </svg>

            {/* 棋子和点击区域 */}
            <div
              className="absolute inset-0 grid gap-0"
              style={{
                gridTemplateColumns: `repeat(${BOARD_SIZE}, 1fr)`,
                zIndex: 2
              }}
            >
              {board.map((row, rowIndex) =>
                row.map((cell, colIndex) => (
                  <button
                    key={`${rowIndex}-${colIndex}`}
                    className="flex items-center justify-center hover:bg-amber-200 hover:bg-opacity-20 dark:hover:bg-amber-800 dark:hover:bg-opacity-20 transition-colors relative rounded-full"
                    onClick={() => makeMove(rowIndex, colIndex)}
                    disabled={!gameStarted || winner !== null || isThinking}
                    style={{
                      aspectRatio: '1'
                    }}
                  >
                    {cell && (
                      <div
                        className={`rounded-full shadow-md ${
                          cell === 'black'
                            ? 'bg-gray-900 border-2 border-gray-700 shadow-gray-800/50'
                            : 'bg-gray-50 border-2 border-gray-300 shadow-gray-400/30'
                        }`}
                        style={{
                          width: 'min(5vw, 32px)',
                          height: 'min(5vw, 32px)',
                          minWidth: '16px',
                          minHeight: '16px',
                          maxWidth: '32px',
                          maxHeight: '32px'
                        }}
                      />
                    )}
                    {/* 悬停提示 */}
                    {!cell && gameStarted && !winner && !isThinking && (
                      <div
                        className={`rounded-full opacity-0 hover:opacity-20 transition-opacity ${
                          currentPlayer === 'black' ? 'bg-gray-800' : 'bg-gray-200'
                        }`}
                        style={{
                          width: 'min(5vw, 32px)',
                          height: 'min(5vw, 32px)',
                          minWidth: '16px',
                          minHeight: '16px',
                          maxWidth: '32px',
                          maxHeight: '32px'
                        }}
                      />
                    )}
                  </button>
                ))
              )}
            </div>
          </div>
        </div>
      </div>


    </div>
  );
};

export default GomokuGame;
