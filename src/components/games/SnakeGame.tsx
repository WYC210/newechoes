import React, { useRef, useEffect, useState, useCallback } from 'react';

interface SnakeGameProps {
  mode: 'single' | 'double' | 'challenge';
  onBack: () => void;
}

interface Position {
  x: number;
  y: number;
}

type Direction = 'up' | 'down' | 'left' | 'right';

const SnakeGame: React.FC<SnakeGameProps> = ({ mode, onBack }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const gameEngineRef = useRef<any>(null);
  const [score, setScore] = useState(0);
  const [score1, setScore1] = useState(0);
  const [score2, setScore2] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameSpeed, setGameSpeed] = useState<'slow' | 'normal' | 'fast'>('normal');
  const [gameMessage, setGameMessage] = useState('');
  const [currentLevel, setCurrentLevel] = useState(1);
  const [currentSpeed, setCurrentSpeed] = useState(150);
  const [levelUpMessage, setLevelUpMessage] = useState('');

  // 初始化游戏引擎
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // 增强的游戏引擎类
    class EnhancedSnakeEngine {
      canvas: HTMLCanvasElement;
      ctx: CanvasRenderingContext2D;
      mode: string;
      gridSize = 20;
      
      // 单人模式
      snake: Position[] = [{ x: 400, y: 300 }];
      direction: Direction = 'right';
      nextDirection: Direction = 'right';
      previousSnake: Position[] = [{ x: 400, y: 300 }];
      
      // 双人模式
      snake1: Position[] = [{ x: 200, y: 300 }];
      snake2: Position[] = [{ x: 600, y: 300 }];
      direction1: Direction = 'right';
      direction2: Direction = 'left';
      nextDirection1: Direction = 'right';
      nextDirection2: Direction = 'left';
      previousSnake1: Position[] = [{ x: 200, y: 300 }];
      previousSnake2: Position[] = [{ x: 600, y: 300 }];
      
      food: Position = { x: 400, y: 200 };
      logicInterval: NodeJS.Timeout | null = null;
      animationFrameId: number | null = null;
      logicSpeed = 150;
      initialLogicSpeed = 150;
      lastLogicUpdateTime = 0;
      isGameOver = false;
      lastInputTime1 = 0;
      lastInputTime2 = 0;
      inputDelay = 100;

      onScoreUpdate?: (score: number, score1?: number, score2?: number) => void;
      onGameOver?: (message?: string) => void;
      onSpeedChange?: (newSpeed: number, level: number) => void;

      constructor(canvas: HTMLCanvasElement, gameMode: string) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d')!;
        this.mode = gameMode;
        this.bindControls();
      }

      generateFood(): Position {
        let x: number, y: number;
        let attempts = 0;
        const maxAttempts = 100;

        do {
          x = Math.floor(Math.random() * (this.canvas.width / this.gridSize)) * this.gridSize;
          y = Math.floor(Math.random() * (this.canvas.height / this.gridSize)) * this.gridSize;
          attempts++;
        } while (this.isFoodOnSnake(x, y) && attempts < maxAttempts);

        return { x, y };
      }

      isFoodOnSnake(x: number, y: number): boolean {
        if (this.mode === 'double') {
          return this.snake1.some(segment => segment.x === x && segment.y === y) ||
                 this.snake2.some(segment => segment.x === x && segment.y === y);
        } else {
          return this.snake.some(segment => segment.x === x && segment.y === y);
        }
      }

      bindControls() {
        document.addEventListener('keydown', (e) => {
          if (this.isGameOver) return;
          
          const currentTime = Date.now();
          const keys = ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'w', 'W', 's', 'S', 'a', 'A', 'd', 'D'];
          if (keys.includes(e.key)) {
            e.preventDefault();
          }

          if (this.mode === 'double') {
            // 双人模式控制
            switch (e.key) {
              // 玩家1 (WASD)
              case 'w':
              case 'W':
                if (currentTime - this.lastInputTime1 < this.inputDelay) return;
                if (this.direction1 !== 'down') this.nextDirection1 = 'up';
                this.lastInputTime1 = currentTime;
                break;
              case 's':
              case 'S':
                if (currentTime - this.lastInputTime1 < this.inputDelay) return;
                if (this.direction1 !== 'up') this.nextDirection1 = 'down';
                this.lastInputTime1 = currentTime;
                break;
              case 'a':
              case 'A':
                if (currentTime - this.lastInputTime1 < this.inputDelay) return;
                if (this.direction1 !== 'right') this.nextDirection1 = 'left';
                this.lastInputTime1 = currentTime;
                break;
              case 'd':
              case 'D':
                if (currentTime - this.lastInputTime1 < this.inputDelay) return;
                if (this.direction1 !== 'left') this.nextDirection1 = 'right';
                this.lastInputTime1 = currentTime;
                break;
              // 玩家2 (方向键)
              case 'ArrowUp':
                if (currentTime - this.lastInputTime2 < this.inputDelay) return;
                if (this.direction2 !== 'down') this.nextDirection2 = 'up';
                this.lastInputTime2 = currentTime;
                break;
              case 'ArrowDown':
                if (currentTime - this.lastInputTime2 < this.inputDelay) return;
                if (this.direction2 !== 'up') this.nextDirection2 = 'down';
                this.lastInputTime2 = currentTime;
                break;
              case 'ArrowLeft':
                if (currentTime - this.lastInputTime2 < this.inputDelay) return;
                if (this.direction2 !== 'right') this.nextDirection2 = 'left';
                this.lastInputTime2 = currentTime;
                break;
              case 'ArrowRight':
                if (currentTime - this.lastInputTime2 < this.inputDelay) return;
                if (this.direction2 !== 'left') this.nextDirection2 = 'right';
                this.lastInputTime2 = currentTime;
                break;
            }
          } else {
            // 单人模式控制
            if (currentTime - this.lastInputTime1 < this.inputDelay) return;
            this.lastInputTime1 = currentTime;

            switch (e.key) {
              case 'ArrowUp':
              case 'w':
              case 'W':
                if (this.direction !== 'down') this.nextDirection = 'up';
                break;
              case 'ArrowDown':
              case 's':
              case 'S':
                if (this.direction !== 'up') this.nextDirection = 'down';
                break;
              case 'ArrowLeft':
              case 'a':
              case 'A':
                if (this.direction !== 'right') this.nextDirection = 'left';
                break;
              case 'ArrowRight':
              case 'd':
              case 'D':
                if (this.direction !== 'left') this.nextDirection = 'right';
                break;
            }
          }
        });

        // 触摸控制
        let touchStartX = 0;
        let touchStartY = 0;
        const minSwipeDistance = 30;

        this.canvas.addEventListener('touchstart', (e) => {
          e.preventDefault();
          const touch = e.touches[0];
          touchStartX = touch.clientX;
          touchStartY = touch.clientY;
        }, { passive: false });

        this.canvas.addEventListener('touchend', (e) => {
          e.preventDefault();
          if (this.isGameOver) return;

          const touch = e.changedTouches[0];
          const deltaX = touch.clientX - touchStartX;
          const deltaY = touch.clientY - touchStartY;

          if (Math.abs(deltaX) > Math.abs(deltaY)) {
            if (Math.abs(deltaX) > minSwipeDistance) {
              if (deltaX > 0) {
                if (this.mode === 'double') {
                  if (this.direction1 !== 'left') this.nextDirection1 = 'right';
                } else {
                  if (this.direction !== 'left') this.nextDirection = 'right';
                }
              } else {
                if (this.mode === 'double') {
                  if (this.direction1 !== 'right') this.nextDirection1 = 'left';
                } else {
                  if (this.direction !== 'right') this.nextDirection = 'left';
                }
              }
            }
          } else {
            if (Math.abs(deltaY) > minSwipeDistance) {
              if (deltaY > 0) {
                if (this.mode === 'double') {
                  if (this.direction1 !== 'up') this.nextDirection1 = 'down';
                } else {
                  if (this.direction !== 'up') this.nextDirection = 'down';
                }
              } else {
                if (this.mode === 'double') {
                  if (this.direction1 !== 'down') this.nextDirection1 = 'up';
                } else {
                  if (this.direction !== 'down') this.nextDirection = 'up';
                }
              }
            }
          }
        }, { passive: false });
      }

      update() {
        if (this.mode === 'double') {
          this.updateDoubleModeLogic();
        } else {
          this.updateSingleModeLogic();
        }
      }

      updateSingleModeLogic() {
        this.previousSnake = JSON.parse(JSON.stringify(this.snake));
        this.direction = this.nextDirection;
        const head = { ...this.snake[0] };

        switch (this.direction) {
          case 'up': head.y -= this.gridSize; break;
          case 'down': head.y += this.gridSize; break;
          case 'left': head.x -= this.gridSize; break;
          case 'right': head.x += this.gridSize; break;
        }

        if (head.x < 0 || head.x >= this.canvas.width || head.y < 0 || head.y >= this.canvas.height ||
            this.snake.some(segment => segment.x === head.x && segment.y === head.y)) {
          this.gameOver();
          return;
        }

        this.snake.unshift(head);

        if (head.x === this.food.x && head.y === this.food.y) {
          const newScore = this.snake.length - 1;
          if (this.onScoreUpdate) this.onScoreUpdate(newScore);
          this.food = this.generateFood();

          // 闯关模式：动态调整速度
          this.adjustSpeedForChallenge(newScore);
        } else {
          this.snake.pop();
        }
      }

      updateDoubleModeLogic() {
        this.previousSnake1 = JSON.parse(JSON.stringify(this.snake1));
        this.previousSnake2 = JSON.parse(JSON.stringify(this.snake2));

        this.direction1 = this.nextDirection1;
        this.direction2 = this.nextDirection2;

        const head1 = { ...this.snake1[0] };
        switch (this.direction1) {
          case 'up': head1.y -= this.gridSize; break;
          case 'down': head1.y += this.gridSize; break;
          case 'left': head1.x -= this.gridSize; break;
          case 'right': head1.x += this.gridSize; break;
        }

        const head2 = { ...this.snake2[0] };
        switch (this.direction2) {
          case 'up': head2.y -= this.gridSize; break;
          case 'down': head2.y += this.gridSize; break;
          case 'left': head2.x -= this.gridSize; break;
          case 'right': head2.x += this.gridSize; break;
        }

        const player1Dead = this.checkCollision(head1, this.snake1, this.snake2);
        const player2Dead = this.checkCollision(head2, this.snake2, this.snake1);

        if (player1Dead && player2Dead) {
          this.gameOver('平局！');
          return;
        } else if (player1Dead) {
          this.gameOver('玩家2获胜！');
          return;
        } else if (player2Dead) {
          this.gameOver('玩家1获胜！');
          return;
        }

        this.snake1.unshift(head1);
        this.snake2.unshift(head2);

        let foodEaten = false;
        let score1 = this.snake1.length - 1;
        let score2 = this.snake2.length - 1;

        if (head1.x === this.food.x && head1.y === this.food.y) {
          score1 = this.snake1.length;
          foodEaten = true;
        } else {
          this.snake1.pop();
        }

        if (head2.x === this.food.x && head2.y === this.food.y) {
          score2 = this.snake2.length;
          foodEaten = true;
        } else {
          this.snake2.pop();
        }

        if (foodEaten) {
          this.food = this.generateFood();
          if (this.onScoreUpdate) this.onScoreUpdate(0, score1, score2);
        }
      }

      checkCollision(head: Position, ownSnake: Position[], otherSnake?: Position[]): boolean {
        if (head.x < 0 || head.x >= this.canvas.width || head.y < 0 || head.y >= this.canvas.height) {
          return true;
        }

        if (ownSnake.slice(1).some(segment => segment.x === head.x && segment.y === head.y)) {
          return true;
        }

        if (otherSnake && otherSnake.some(segment => segment.x === head.x && segment.y === head.y)) {
          return true;
        }

        return false;
      }

      render() {
        if (this.isGameOver) {
          if (this.animationFrameId) {
            cancelAnimationFrame(this.animationFrameId);
            this.animationFrameId = null;
          }
          return;
        }

        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        const currentTime = Date.now();
        let progress = (currentTime - this.lastLogicUpdateTime) / this.logicSpeed;
        progress = Math.min(1, Math.max(0, progress));

        if (this.mode === 'double') {
          this.drawInterpolatedSnake(this.snake1, this.previousSnake1, progress, '#2E7D32', '#4CAF50');
          this.drawInterpolatedSnake(this.snake2, this.previousSnake2, progress, '#1565C0', '#2196F3');
        } else {
          this.drawInterpolatedSnake(this.snake, this.previousSnake, progress, '#2E7D32', '#4CAF50');
        }

        this.ctx.fillStyle = '#FF5722';
        this.ctx.fillRect(this.food.x, this.food.y, this.gridSize - 1, this.gridSize - 1);

        this.animationFrameId = requestAnimationFrame(this.render.bind(this));
      }

      drawInterpolatedSnake(snake: Position[], previousSnake: Position[], progress: number, headColor: string, bodyColor: string) {
        snake.forEach((segment, index) => {
          let interpolatedX: number, interpolatedY: number;

          if (index < previousSnake.length) {
            const prevSegment = previousSnake[index];
            interpolatedX = prevSegment.x + (segment.x - prevSegment.x) * progress;
            interpolatedY = prevSegment.y + (segment.y - prevSegment.y) * progress;
          } else {
            interpolatedX = segment.x;
            interpolatedY = segment.y;
          }

          this.ctx.fillStyle = index === 0 ? headColor : bodyColor;
          this.ctx.fillRect(interpolatedX, interpolatedY, this.gridSize - 1, this.gridSize - 1);
        });
      }

      gameOver(message?: string) {
        this.stop();
        this.isGameOver = true;
        if (this.onGameOver) this.onGameOver(message);
      }

      start() {
        this.isGameOver = false;
        this.lastLogicUpdateTime = Date.now();

        this.logicInterval = setInterval(() => {
          if (!this.isGameOver) {
            this.update();
            this.lastLogicUpdateTime = Date.now();
          }
        }, this.logicSpeed);

        this.animationFrameId = requestAnimationFrame(this.render.bind(this));
      }

      stop() {
        if (this.logicInterval) {
          clearInterval(this.logicInterval);
          this.logicInterval = null;
        }
        if (this.animationFrameId) {
          cancelAnimationFrame(this.animationFrameId);
          this.animationFrameId = null;
        }
      }

      setSpeed(speed: 'slow' | 'normal' | 'fast') {
        const speedMap = { slow: 200, normal: 150, fast: 100 };
        this.logicSpeed = speedMap[speed];
        this.initialLogicSpeed = speedMap[speed];
      }

      // 动态调整速度（闯关模式专用）
      adjustSpeedForChallenge(score: number) {
        if (this.mode !== 'challenge') return;

        // 计算关卡：每5分一关
        const level = Math.floor(score / 5) + 1;

        // 计算速度：基础速度减去关卡加成，但不能低于最小值
        const baseSpeed = this.initialLogicSpeed;
        const speedReduction = Math.min((level - 1) * 8, baseSpeed - 50); // 每关减少8ms，最快50ms
        const newSpeed = baseSpeed - speedReduction;

        if (newSpeed !== this.logicSpeed) {
          this.logicSpeed = newSpeed;
          this.resetInterval(); // 重新设置定时器

          // 通知UI更新
          if (this.onSpeedChange) {
            this.onSpeedChange(newSpeed, level);
          }
        }
      }

      // 重新设置定时器
      resetInterval() {
        if (this.logicInterval) {
          clearInterval(this.logicInterval);
          this.logicInterval = setInterval(() => {
            if (!this.isGameOver) {
              this.update();
              this.lastLogicUpdateTime = Date.now();
            }
          }, this.logicSpeed);
        }
      }

      reset() {
        if (this.mode === 'double') {
          this.snake1 = [{ x: 200, y: 300 }];
          this.snake2 = [{ x: 600, y: 300 }];
          this.direction1 = 'right';
          this.direction2 = 'left';
          this.nextDirection1 = 'right';
          this.nextDirection2 = 'left';
          this.previousSnake1 = [{ x: 200, y: 300 }];
          this.previousSnake2 = [{ x: 600, y: 300 }];
        } else {
          this.snake = [{ x: 400, y: 300 }];
          this.direction = 'right';
          this.nextDirection = 'right';
          this.previousSnake = [{ x: 400, y: 300 }];
        }
        this.food = this.generateFood();
        this.isGameOver = false;
        this.logicSpeed = this.initialLogicSpeed;
      }
    }

    const engine = new EnhancedSnakeEngine(canvas, mode);

    engine.onScoreUpdate = (newScore: number, newScore1?: number, newScore2?: number) => {
      if (mode === 'double') {
        setScore1(newScore1 || 0);
        setScore2(newScore2 || 0);
      } else {
        setScore(newScore);
      }
    };

    engine.onGameOver = (message?: string) => {
      setGameOver(true);
      setGameMessage(message || '游戏结束！');
    };

    engine.onSpeedChange = (newSpeed: number, level: number) => {
      const prevLevel = currentLevel;
      setCurrentSpeed(newSpeed);
      setCurrentLevel(level);

      // 显示关卡升级提示
      if (level > prevLevel) {
        setLevelUpMessage(`🎉 恭喜升级到第 ${level} 关！`);
        setTimeout(() => setLevelUpMessage(''), 3000); // 3秒后消失
      }
    };

    gameEngineRef.current = engine;

    return () => {
      engine.stop();
    };
  }, [mode]);

  const startGame = useCallback(() => {
    const engine = gameEngineRef.current;
    if (engine) {
      engine.setSpeed(gameSpeed);
      engine.reset();
      engine.start();
      setGameStarted(true);
      setGameOver(false);
      setScore(0);
      setScore1(0);
      setScore2(0);
      setGameMessage('');
      setCurrentLevel(1);
      setCurrentSpeed(engine.initialLogicSpeed);
      setLevelUpMessage('');
    }
  }, [gameSpeed]);

  const resetGame = useCallback(() => {
    const engine = gameEngineRef.current;
    if (engine) {
      engine.stop();
      engine.reset();
      setGameStarted(false);
      setGameOver(false);
      setScore(0);
      setScore1(0);
      setScore2(0);
      setGameMessage('');
      setCurrentLevel(1);
      setCurrentSpeed(engine.initialLogicSpeed);
      setLevelUpMessage('');
    }
  }, []);

  const handleDirectionControl = useCallback((direction: Direction) => {
    const engine = gameEngineRef.current;
    if (engine && !engine.isGameOver) {
      if (mode === 'double') {
        switch (direction) {
          case 'up':
            if (engine.direction1 !== 'down') engine.nextDirection1 = 'up';
            break;
          case 'down':
            if (engine.direction1 !== 'up') engine.nextDirection1 = 'down';
            break;
          case 'left':
            if (engine.direction1 !== 'right') engine.nextDirection1 = 'left';
            break;
          case 'right':
            if (engine.direction1 !== 'left') engine.nextDirection1 = 'right';
            break;
        }
      } else {
        switch (direction) {
          case 'up':
            if (engine.direction !== 'down') engine.nextDirection = 'up';
            break;
          case 'down':
            if (engine.direction !== 'up') engine.nextDirection = 'down';
            break;
          case 'left':
            if (engine.direction !== 'right') engine.nextDirection = 'left';
            break;
          case 'right':
            if (engine.direction !== 'left') engine.nextDirection = 'right';
            break;
        }
      }
    }
  }, [mode]);

  return (
    <div className="max-w-4xl mx-auto">
      {/* 返回按钮 */}
      <div className="mb-4">
        <button
          onClick={onBack}
          className="flex items-center gap-2 px-4 py-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 rounded-lg transition-colors"
        >
          ← 返回游戏列表
        </button>
      </div>

      {/* 游戏标题 */}
      <div className="text-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-200 mb-2">
          🐍 贪吃蛇游戏
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          {mode === 'single' && '单人模式 - 使用方向键或WASD控制'}
          {mode === 'double' && '双人模式 - 玩家1: WASD, 玩家2: 方向键'}
          {mode === 'challenge' && '闯关模式 - 随着得分提高，游戏速度越来越快！'}
        </p>
      </div>

      {/* 分数显示 */}
      <div className="text-center mb-4">
        {mode === 'double' ? (
          <div className="text-xl font-semibold text-gray-800 dark:text-gray-200">
            <span className="text-green-600">玩家1: {score1}</span>
            <span className="mx-4">|</span>
            <span className="text-blue-600">玩家2: {score2}</span>
          </div>
        ) : (
          <div className="space-y-2">
            <div className="text-xl font-semibold text-gray-800 dark:text-gray-200">
              得分: {score}
            </div>
            {mode === 'challenge' && gameStarted && (
              <div className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                <div className="flex justify-center items-center gap-4">
                  <span className="bg-blue-100 dark:bg-blue-900 px-3 py-1 rounded-full">
                    🏆 第 {currentLevel} 关
                  </span>
                  <span className="bg-orange-100 dark:bg-orange-900 px-3 py-1 rounded-full">
                    ⚡ 速度: {Math.round(1000/currentSpeed * 10)/10}/s
                  </span>
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-500">
                  每5分升级一关，速度会越来越快！
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* 速度选择 */}
      {!gameStarted && (
        <div className="text-center mb-6">
          <div className="inline-flex bg-gray-200 dark:bg-gray-700 rounded-lg p-1">
            {(['slow', 'normal', 'fast'] as const).map((speed) => (
              <button
                key={speed}
                onClick={() => setGameSpeed(speed)}
                className={`px-4 py-2 rounded-md transition-colors ${
                  gameSpeed === speed
                    ? 'bg-blue-500 text-white'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                }`}
              >
                {speed === 'slow' && '🐌 慢速'}
                {speed === 'normal' && '🚶 正常'}
                {speed === 'fast' && '🏃 快速'}
              </button>
            ))}
          </div>
          {mode === 'challenge' && (
            <div className="mt-2 text-sm text-amber-600 dark:text-amber-400">
              ⚠️ 闯关模式：游戏会随着得分自动加速！
            </div>
          )}
        </div>
      )}

      {/* 游戏控制按钮 */}
      <div className="text-center mb-6">
        {!gameStarted ? (
          <button
            onClick={startGame}
            className="px-8 py-3 bg-green-500 hover:bg-green-600 text-white font-bold rounded-lg transition-colors text-lg"
          >
            🎮 开始游戏
          </button>
        ) : (
          <button
            onClick={resetGame}
            className="px-8 py-3 bg-blue-500 hover:bg-blue-600 text-white font-bold rounded-lg transition-colors text-lg"
          >
            🔄 重新开始
          </button>
        )}
      </div>

      {/* 关卡升级提示 */}
      {levelUpMessage && (
        <div className="mb-4 text-center">
          <div className="p-3 bg-green-100 dark:bg-green-900 rounded-lg mx-4 animate-pulse">
            <p className="text-green-800 dark:text-green-200 font-bold text-lg">{levelUpMessage}</p>
          </div>
        </div>
      )}

      {/* 游戏结束提示 */}
      {gameOver && (
        <div className="mb-4 text-center">
          <div className="p-4 bg-red-100 dark:bg-red-900 rounded-lg mx-4">
            <p className="text-red-800 dark:text-red-200 font-bold text-lg">🎯 {gameMessage}</p>
            {mode === 'double' ? (
              <p className="text-red-600 dark:text-red-300">
                玩家1: {score1} | 玩家2: {score2}
              </p>
            ) : (
              <div className="space-y-1">
                <p className="text-red-600 dark:text-red-300">最终得分: {score}</p>
                {mode === 'challenge' && (
                  <p className="text-red-500 dark:text-red-400 text-sm">
                    闯关至第 {currentLevel} 关
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* 游戏画布 */}
      <div className="flex justify-center mb-6">
        <div className="relative">
          <canvas
            ref={canvasRef}
            width={800}
            height={600}
            className="border-2 border-gray-300 dark:border-gray-600 rounded-lg bg-black"
            style={{
              maxWidth: '95vw',
              height: 'auto',
              touchAction: 'none'
            }}
          />
        </div>
      </div>

      {/* 移动端虚拟控制器 */}
      <div className="md:hidden flex justify-center mb-6">
        <div className="grid grid-cols-3 gap-2 w-48">
          <div></div>
          <button
            className="bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 p-4 rounded-lg text-xl font-bold transition-colors active:scale-95"
            onClick={() => handleDirectionControl('up')}
            onMouseDown={(e) => e.preventDefault()}
          >
            ↑
          </button>
          <div></div>

          <button
            className="bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 p-4 rounded-lg text-xl font-bold transition-colors active:scale-95"
            onClick={() => handleDirectionControl('left')}
            onMouseDown={(e) => e.preventDefault()}
          >
            ←
          </button>
          <button
            className="bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 p-4 rounded-lg text-xl font-bold transition-colors active:scale-95"
            onClick={() => handleDirectionControl('down')}
            onMouseDown={(e) => e.preventDefault()}
          >
            ↓
          </button>
          <button
            className="bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 p-4 rounded-lg text-xl font-bold transition-colors active:scale-95"
            onClick={() => handleDirectionControl('right')}
            onMouseDown={(e) => e.preventDefault()}
          >
            →
          </button>
        </div>
      </div>

      {/* 操作说明 */}
      <div className="text-center text-sm text-gray-600 dark:text-gray-400">
        <p className="mb-2">
          <strong>控制说明：</strong>
        </p>
        <div className="space-y-1">
          {mode === 'single' && (
            <>
              <p>🖥️ 电脑：方向键 或 WASD</p>
              <p>📱 手机：滑动屏幕 或 点击虚拟按键</p>
            </>
          )}
          {mode === 'double' && (
            <>
              <p>🎮 玩家1 (绿色)：WASD 键</p>
              <p>🎮 玩家2 (蓝色)：方向键</p>
              <p>📱 手机：滑动屏幕控制玩家1</p>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default SnakeGame;
