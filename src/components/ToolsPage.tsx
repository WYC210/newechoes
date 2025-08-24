import React, { useState, useEffect } from 'react';
import SnakeGame from './games/SnakeGame';
import GomokuGame from './games/GomokuGame';
import VegetableScraper from './scrapers/VegetableScraper';
import WeatherScraper from './scrapers/WeatherScraper';

interface ToolsPageProps {
  className?: string;
}

type TabType = 'games' | 'scrapers';
type GameType = 'snake' | 'gomoku';
type GameMode = 'single' | 'double' | 'challenge' | 'ai' | 'pvp';
type ScraperType = 'vegetable' | 'weather';

const ToolsPage: React.FC<ToolsPageProps> = ({ className = '' }) => {
  const [activeTab, setActiveTab] = useState<TabType>('games');
  const [currentGame, setCurrentGame] = useState<GameType | null>(null);
  const [gameMode, setGameMode] = useState<GameMode | null>(null);
  const [currentScraper, setCurrentScraper] = useState<ScraperType | null>(null);

  // 重置到列表视图
  const resetToListView = () => {
    setCurrentGame(null);
    setGameMode(null);
    setCurrentScraper(null);
  };

  // 切换标签
  const switchTab = (tab: TabType) => {
    setActiveTab(tab);
    resetToListView();
  };

  // 显示游戏模式选择
  const showGame = (gameType: GameType) => {
    setCurrentGame(gameType);
    setGameMode(null); // 先显示模式选择
  };

  // 开始游戏
  const startGame = (mode: GameMode) => {
    setGameMode(mode);
  };

  // 显示爬虫
  const showScraper = (scraperType: ScraperType) => {
    setCurrentScraper(scraperType);
  };

  return (
    <div className={`min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800 no-zoom ${className}`}>
      <div className="container mx-auto px-2 sm:px-4 py-4 sm:py-6 md:py-8">
        {/* 页面标题 */}
        <div className="text-center mb-4 sm:mb-6 md:mb-8">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 dark:text-gray-200 mb-2">
            🛠️ 工具中心
          </h1>
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mb-4 px-2 sm:px-4">
            选择你需要的工具 - 游戏娱乐或实用演示
          </p>

        </div>

        {/* 分类选择器 */}
        <div className="flex justify-center mb-4 sm:mb-6 md:mb-8 px-2 sm:px-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-1 sm:p-1.5 md:p-2 flex space-x-1 sm:space-x-1.5 md:space-x-2 w-full max-w-md">
            <button
              onClick={() => switchTab('games')}
              className={`flex-1 px-2 sm:px-3 md:px-6 py-2 sm:py-2.5 md:py-3 rounded-lg font-semibold transition-all duration-300 text-xs sm:text-sm md:text-base ${
                activeTab === 'games'
                  ? 'bg-blue-500 text-white shadow-lg'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              🎮 游戏娱乐
            </button>
            <button
              onClick={() => switchTab('scrapers')}
              className={`flex-1 px-2 sm:px-3 md:px-6 py-2 sm:py-2.5 md:py-3 rounded-lg font-semibold transition-all duration-300 text-xs sm:text-sm md:text-base ${
                activeTab === 'scrapers'
                  ? 'bg-blue-500 text-white shadow-lg'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              🕷️ 爬虫演示
            </button>
          </div>
        </div>

        <div className="max-w-6xl mx-auto">
          {/* 游戏区域 */}
          {activeTab === 'games' && (
            <div className="section-content">
              {!currentGame ? (
                /* 游戏列表 */
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-6 px-2 sm:px-0">
                  {/* 贪吃蛇游戏卡片 */}
                  <div
                    className="game-card bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 sm:p-5 md:p-6 cursor-pointer hover:shadow-xl transition-all duration-300 hover:scale-105 border-2 border-transparent hover:border-blue-500 hover:-translate-y-1"
                    onClick={() => showGame('snake')}
                  >
                    <div className="text-center">
                      <div className="text-4xl sm:text-5xl md:text-6xl mb-3 md:mb-4">🐍</div>
                      <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-800 dark:text-gray-200 mb-2">
                        贪吃蛇
                      </h3>
                      <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mb-3 md:mb-4">
                        经典贪吃蛇游戏，挑战你的反应速度
                      </p>
                      <div className="flex flex-wrap gap-1.5 sm:gap-2 justify-center">
                        <span className="px-2 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded-full text-xs">
                          单人模式
                        </span>
                        <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-xs">
                          双人模式
                        </span>
                        <span className="px-2 py-1 bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 rounded-full text-xs">
                          闯关模式
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* 五子棋游戏卡片 */}
                  <div
                    className="game-card bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 sm:p-5 md:p-6 cursor-pointer hover:shadow-xl transition-all duration-300 hover:scale-105 border-2 border-transparent hover:border-blue-500 hover:-translate-y-1"
                    onClick={() => showGame('gomoku')}
                  >
                    <div className="text-center">
                      <div className="text-4xl sm:text-5xl md:text-6xl mb-3 md:mb-4">⚫</div>
                      <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-800 dark:text-gray-200 mb-2">
                        五子棋
                      </h3>
                      <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mb-3 md:mb-4">
                        经典五子棋游戏，先连成五子者获胜
                      </p>
                      <div className="flex flex-wrap gap-1.5 sm:gap-2 justify-center">
                        <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-xs">
                          人机对战
                        </span>
                        <span className="px-2 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded-full text-xs">
                          双人对战
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* 更多游戏占位符 */}
                  <div className="game-card bg-gray-100 dark:bg-gray-700 rounded-xl shadow-lg p-4 sm:p-5 md:p-6 cursor-not-allowed opacity-50">
                    <div className="text-center">
                      <div className="text-4xl sm:text-5xl md:text-6xl mb-3 md:mb-4">🎮</div>
                      <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-600 dark:text-gray-400 mb-2">
                        更多游戏
                      </h3>
                      <p className="text-sm sm:text-base text-gray-500 dark:text-gray-500 mb-3 md:mb-4">敬请期待...</p>
                      <span className="px-2 py-1 bg-gray-200 dark:bg-gray-600 text-gray-600 dark:text-gray-400 rounded-full text-xs">
                        即将推出
                      </span>
                    </div>
                  </div>
                </div>
              ) : gameMode ? (
                /* 游戏进行中 */
                <>
                  {currentGame === 'snake' && (
                    <SnakeGame
                      mode={gameMode as 'single' | 'double' | 'challenge'}
                      onBack={resetToListView}
                    />
                  )}
                  {currentGame === 'gomoku' && (
                    <GomokuGame
                      mode={gameMode as 'ai' | 'pvp'}
                      onBack={resetToListView}
                    />
                  )}
                </>
              ) : (
                /* 游戏模式选择 */
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 sm:p-5 md:p-6 mx-2 sm:mx-0">
                  <div className="flex items-center justify-between mb-4 md:mb-6">
                    <div className="flex items-center">
                      <div className="text-xl sm:text-2xl md:text-3xl mr-2 md:mr-4">
                        {currentGame === 'snake' ? '🐍' : '⚫'}
                      </div>
                      <div>
                        <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-800 dark:text-gray-200">
                          {currentGame === 'snake' ? '贪吃蛇' : '五子棋'}
                        </h2>
                        <p className="text-xs sm:text-sm md:text-base text-gray-600 dark:text-gray-400">
                          选择游戏模式开始游戏
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={resetToListView}
                      className="px-2 sm:px-3 md:px-4 py-1 sm:py-1.5 md:py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg transition-colors text-xs sm:text-sm md:text-base"
                    >
                      ← 返回
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                    {currentGame === 'snake' && (
                      <>
                        <button
                          onClick={() => startGame('single')}
                          className="p-3 sm:p-4 bg-green-50 dark:bg-green-900 hover:bg-green-100 dark:hover:bg-green-800 border-2 border-green-200 dark:border-green-700 rounded-lg transition-colors"
                        >
                          <div className="text-xl sm:text-2xl mb-2">🎮</div>
                          <h3 className="font-semibold text-sm sm:text-base text-green-800 dark:text-green-200">单人模式</h3>
                          <p className="text-xs sm:text-sm text-green-600 dark:text-green-300">经典贪吃蛇游戏</p>
                        </button>
                        <button
                          onClick={() => startGame('double')}
                          className="p-3 sm:p-4 bg-blue-50 dark:bg-blue-900 hover:bg-blue-100 dark:hover:bg-blue-800 border-2 border-blue-200 dark:border-blue-700 rounded-lg transition-colors"
                        >
                          <div className="text-xl sm:text-2xl mb-2">👥</div>
                          <h3 className="font-semibold text-sm sm:text-base text-blue-800 dark:text-blue-200">双人模式</h3>
                          <p className="text-xs sm:text-sm text-blue-600 dark:text-blue-300">两人同屏对战</p>
                        </button>
                        <button
                          onClick={() => startGame('challenge')}
                          className="p-3 sm:p-4 bg-purple-50 dark:bg-purple-900 hover:bg-purple-100 dark:hover:bg-purple-800 border-2 border-purple-200 dark:border-purple-700 rounded-lg transition-colors"
                        >
                          <div className="text-xl sm:text-2xl mb-2">🏆</div>
                          <h3 className="font-semibold text-sm sm:text-base text-purple-800 dark:text-purple-200">闯关模式</h3>
                          <p className="text-xs sm:text-sm text-purple-600 dark:text-purple-300">挑战不同关卡</p>
                        </button>
                      </>
                    )}
                    {currentGame === 'gomoku' && (
                      <>
                        <button
                          onClick={() => startGame('ai')}
                          className="p-3 sm:p-4 bg-blue-50 dark:bg-blue-900 hover:bg-blue-100 dark:hover:bg-blue-800 border-2 border-blue-200 dark:border-blue-700 rounded-lg transition-colors"
                        >
                          <div className="text-xl sm:text-2xl mb-2">🤖</div>
                          <h3 className="font-semibold text-sm sm:text-base text-blue-800 dark:text-blue-200">人机对战</h3>
                          <p className="text-xs sm:text-sm text-blue-600 dark:text-blue-300">与AI智能对弈</p>
                        </button>
                        <button
                          onClick={() => startGame('pvp')}
                          className="p-3 sm:p-4 bg-green-50 dark:bg-green-900 hover:bg-green-100 dark:hover:bg-green-800 border-2 border-green-200 dark:border-green-700 rounded-lg transition-colors"
                        >
                          <div className="text-xl sm:text-2xl mb-2">👥</div>
                          <h3 className="font-semibold text-sm sm:text-base text-green-800 dark:text-green-200">双人对战</h3>
                          <p className="text-xs sm:text-sm text-green-600 dark:text-green-300">两人轮流下棋</p>
                        </button>
                      </>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* 爬虫演示区域 */}
          {activeTab === 'scrapers' && (
            <div className="section-content">
              {!currentScraper ? (
                /* 爬虫列表 */
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {/* 蔬菜价格爬虫卡片 */}
                  <div
                    className="scraper-card bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 cursor-pointer hover:shadow-xl transition-all duration-300 hover:scale-105 border-2 border-transparent hover:border-blue-500 hover:-translate-y-1"
                    onClick={() => showScraper('vegetable')}
                  >
                    <div className="text-center">
                      <div className="text-6xl mb-4">🥬</div>
                      <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-2">
                        蔬菜价格
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400 mb-4">
                        实时获取北京地区蔬菜价格信息
                      </p>
                      <div className="flex flex-wrap gap-2 justify-center">
                        <span className="px-2 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded-full text-xs">
                          实时数据
                        </span>
                        <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-xs">
                          分页爬取
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* 天气数据爬虫卡片 */}
                  <div
                    className="scraper-card bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 cursor-pointer hover:shadow-xl transition-all duration-300 hover:scale-105 border-2 border-transparent hover:border-blue-500 hover:-translate-y-1"
                    onClick={() => showScraper('weather')}
                  >
                    <div className="text-center">
                      <div className="text-6xl mb-4">🌤️</div>
                      <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-2">
                        天气数据
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400 mb-4">
                        获取指定省份的天气信息
                      </p>
                      <div className="flex flex-wrap gap-2 justify-center">
                        <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-xs">
                          省份筛选
                        </span>
                        <span className="px-2 py-1 bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 rounded-full text-xs">
                          实时天气
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* 更多爬虫占位符 */}
                  <div className="scraper-card bg-gray-100 dark:bg-gray-700 rounded-xl shadow-lg p-6 cursor-not-allowed opacity-50">
                    <div className="text-center">
                      <div className="text-6xl mb-4">🕷️</div>
                      <h3 className="text-2xl font-bold text-gray-600 dark:text-gray-400 mb-2">
                        更多爬虫
                      </h3>
                      <p className="text-gray-500 dark:text-gray-500 mb-4">敬请期待...</p>
                      <span className="px-2 py-1 bg-gray-200 dark:bg-gray-600 text-gray-600 dark:text-gray-400 rounded-full text-xs">
                        即将推出
                      </span>
                    </div>
                  </div>
                </div>
              ) : (
                /* 爬虫界面 */
                <>
                  {currentScraper === 'vegetable' && (
                    <VegetableScraper onBack={resetToListView} />
                  )}
                  {currentScraper === 'weather' && (
                    <WeatherScraper onBack={resetToListView} />
                  )}
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ToolsPage;
