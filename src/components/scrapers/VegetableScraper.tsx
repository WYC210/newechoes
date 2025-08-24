import React, { useState, useCallback, useRef } from 'react';

interface VegetableScraperProps {
  onBack: () => void;
}

interface VegetableData {
  name: string;
  price: string;
  unit: string;
  market: string;
  date: string;
}

const VegetableScraper: React.FC<VegetableScraperProps> = ({ onBack }) => {
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [maxPages, setMaxPages] = useState(10);
  const [delay, setDelay] = useState(2000);
  const [data, setData] = useState<VegetableData[]>([]);
  const [logs, setLogs] = useState<string[]>([]);
  const [progress, setProgress] = useState(0);
  
  const abortControllerRef = useRef<AbortController | null>(null);
  const logContainerRef = useRef<HTMLDivElement>(null);

  const addLog = useCallback((message: string) => {
    const timestamp = new Date().toLocaleTimeString();
    const logMessage = `[${timestamp}] ${message}`;
    setLogs(prev => [...prev.slice(-49), logMessage]); // 保持最新50条日志
    
    // 自动滚动到底部
    setTimeout(() => {
      if (logContainerRef.current) {
        logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight;
      }
    }, 100);
  }, []);

  const generateMockData = useCallback((page: number): VegetableData[] => {
    const vegetables = [
      '白菜', '萝卜', '胡萝卜', '土豆', '洋葱', '西红柿', '黄瓜', '茄子', 
      '青椒', '韭菜', '菠菜', '芹菜', '生菜', '豆角', '冬瓜', '南瓜',
      '丝瓜', '苦瓜', '西葫芦', '花菜', '西兰花', '包菜', '油菜', '小白菜'
    ];
    
    const markets = ['新发地批发市场', '大洋路批发市场', '岳各庄批发市场', '锦绣大地批发市场'];
    const units = ['斤', '公斤', '袋', '个'];
    
    return Array.from({ length: 20 }, (_, index) => {
      const vegIndex = (page - 1) * 20 + index;
      const vegetable = vegetables[vegIndex % vegetables.length];
      const basePrice = Math.random() * 8 + 1; // 1-9元基础价格
      const variation = (Math.random() - 0.5) * 2; // -1到1的变化
      const price = Math.max(0.5, basePrice + variation).toFixed(2);
      
      return {
        name: vegetable,
        price: price,
        unit: units[Math.floor(Math.random() * units.length)],
        market: markets[Math.floor(Math.random() * markets.length)],
        date: new Date().toLocaleDateString()
      };
    });
  }, []);

  const scrapePage = useCallback(async (page: number): Promise<VegetableData[]> => {
    addLog(`开始爬取第 ${page} 页数据...`);
    
    // 模拟网络请求延迟
    await new Promise(resolve => setTimeout(resolve, Math.random() * 1000 + 500));
    
    // 检查是否被取消
    if (abortControllerRef.current?.signal.aborted) {
      throw new Error('操作已取消');
    }
    
    const pageData = generateMockData(page);
    addLog(`第 ${page} 页爬取完成，获取到 ${pageData.length} 条数据`);
    
    return pageData;
  }, [addLog, generateMockData]);

  const startScraping = useCallback(async () => {
    if (isRunning) return;
    
    setIsRunning(true);
    setIsPaused(false);
    setData([]);
    setProgress(0);
    abortControllerRef.current = new AbortController();
    
    addLog('开始爬取北京蔬菜价格数据...');
    addLog(`设置参数：最大页数 ${maxPages}，延迟 ${delay}ms`);
    
    try {
      for (let page = currentPage; page <= maxPages; page++) {
        // 检查是否暂停
        while (isPaused && !abortControllerRef.current.signal.aborted) {
          await new Promise(resolve => setTimeout(resolve, 100));
        }
        
        // 检查是否被取消
        if (abortControllerRef.current.signal.aborted) {
          addLog('爬取已被用户取消');
          break;
        }
        
        try {
          const pageData = await scrapePage(page);
          setData(prev => [...prev, ...pageData]);
          setCurrentPage(page + 1);
          setProgress(((page - currentPage + 1) / (maxPages - currentPage + 1)) * 100);
          
          // 延迟
          if (page < maxPages && delay > 0) {
            addLog(`等待 ${delay}ms 后继续...`);
            await new Promise(resolve => setTimeout(resolve, delay));
          }
        } catch (error) {
          if (error instanceof Error && error.message === '操作已取消') {
            break;
          }
          addLog(`第 ${page} 页爬取失败: ${error}`);
        }
      }
      
      if (!abortControllerRef.current.signal.aborted) {
        addLog('爬取完成！');
      }
    } catch (error) {
      addLog(`爬取过程中出现错误: ${error}`);
    } finally {
      setIsRunning(false);
      setIsPaused(false);
    }
  }, [isRunning, isPaused, currentPage, maxPages, delay, addLog, scrapePage]);

  const pauseScraping = useCallback(() => {
    if (!isRunning) return;
    setIsPaused(!isPaused);
    addLog(isPaused ? '继续爬取...' : '暂停爬取...');
  }, [isRunning, isPaused, addLog]);

  const stopScraping = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    setIsRunning(false);
    setIsPaused(false);
    addLog('爬取已停止');
  }, [addLog]);

  const clearData = useCallback(() => {
    setData([]);
    setLogs([]);
    setCurrentPage(1);
    setProgress(0);
    addLog('数据已清空');
  }, [addLog]);

  const exportData = useCallback(() => {
    if (data.length === 0) {
      addLog('没有数据可导出');
      return;
    }
    
    const csvContent = [
      '蔬菜名称,价格,单位,市场,日期',
      ...data.map(item => `${item.name},${item.price},${item.unit},${item.market},${item.date}`)
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `蔬菜价格数据_${new Date().toLocaleDateString()}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    addLog(`数据已导出，共 ${data.length} 条记录`);
  }, [data, addLog]);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 md:p-6">
      <div className="flex items-center justify-between mb-4 md:mb-6">
        <div className="flex items-center">
          <div className="text-2xl md:text-3xl mr-2 md:mr-4">🥬</div>
          <div>
            <h2 className="text-lg md:text-2xl font-bold text-gray-800 dark:text-gray-200">
              北京蔬菜价格爬取
            </h2>
            <p className="text-sm md:text-base text-gray-600 dark:text-gray-400">
              {isRunning ? (isPaused ? '已暂停' : '爬取中...') : '设置参数并开始爬取'}
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

      {/* 参数设置 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            起始页数
          </label>
          <input
            type="number"
            min="1"
            max="100"
            value={currentPage}
            onChange={(e) => setCurrentPage(parseInt(e.target.value) || 1)}
            disabled={isRunning}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            最大页数
          </label>
          <input
            type="number"
            min="1"
            max="100"
            value={maxPages}
            onChange={(e) => setMaxPages(parseInt(e.target.value) || 10)}
            disabled={isRunning}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            延迟时间 (ms)
          </label>
          <input
            type="number"
            min="0"
            max="10000"
            step="100"
            value={delay}
            onChange={(e) => setDelay(parseInt(e.target.value) || 2000)}
            disabled={isRunning}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
          />
        </div>
      </div>

      {/* 控制按钮 */}
      <div className="flex flex-wrap gap-2 mb-6">
        {!isRunning ? (
          <button
            onClick={startScraping}
            className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg font-semibold transition-colors"
          >
            开始爬取
          </button>
        ) : (
          <>
            <button
              onClick={pauseScraping}
              className={`px-4 py-2 ${isPaused ? 'bg-green-500 hover:bg-green-600' : 'bg-yellow-500 hover:bg-yellow-600'} text-white rounded-lg font-semibold transition-colors`}
            >
              {isPaused ? '继续' : '暂停'}
            </button>
            <button
              onClick={stopScraping}
              className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg font-semibold transition-colors"
            >
              停止
            </button>
          </>
        )}
        <button
          onClick={clearData}
          disabled={isRunning}
          className="px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg font-semibold transition-colors disabled:opacity-50"
        >
          清空数据
        </button>
        <button
          onClick={exportData}
          disabled={data.length === 0}
          className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-semibold transition-colors disabled:opacity-50"
        >
          导出CSV
        </button>
      </div>

      {/* 进度条 */}
      {isRunning && (
        <div className="mb-6">
          <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-2">
            <span>爬取进度</span>
            <span>{progress.toFixed(1)}%</span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <div
              className="bg-blue-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}

      {/* 统计信息 */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-blue-50 dark:bg-blue-900 p-3 rounded-lg text-center">
          <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{data.length}</div>
          <div className="text-sm text-blue-800 dark:text-blue-300">总记录数</div>
        </div>
        <div className="bg-green-50 dark:bg-green-900 p-3 rounded-lg text-center">
          <div className="text-2xl font-bold text-green-600 dark:text-green-400">{currentPage - 1}</div>
          <div className="text-sm text-green-800 dark:text-green-300">已爬页数</div>
        </div>
        <div className="bg-purple-50 dark:bg-purple-900 p-3 rounded-lg text-center">
          <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
            {data.length > 0 ? new Set(data.map(item => item.name)).size : 0}
          </div>
          <div className="text-sm text-purple-800 dark:text-purple-300">蔬菜种类</div>
        </div>
        <div className="bg-orange-50 dark:bg-orange-900 p-3 rounded-lg text-center">
          <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
            {data.length > 0 ? new Set(data.map(item => item.market)).size : 0}
          </div>
          <div className="text-sm text-orange-800 dark:text-orange-300">市场数量</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 日志区域 */}
        <div>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-3">爬取日志</h3>
          <div
            ref={logContainerRef}
            className="bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg p-3 h-64 overflow-y-auto font-mono text-sm"
          >
            {logs.map((log, index) => (
              <div key={index} className="text-gray-700 dark:text-gray-300 mb-1">
                {log}
              </div>
            ))}
            {logs.length === 0 && (
              <div className="text-gray-500 dark:text-gray-400 italic">
                暂无日志信息...
              </div>
            )}
          </div>
        </div>

        {/* 数据预览 */}
        <div>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-3">数据预览</h3>
          <div className="bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg h-64 overflow-auto">
            {data.length > 0 ? (
              <table className="w-full text-sm">
                <thead className="bg-gray-100 dark:bg-gray-800 sticky top-0">
                  <tr>
                    <th className="px-2 py-2 text-left">蔬菜</th>
                    <th className="px-2 py-2 text-left">价格</th>
                    <th className="px-2 py-2 text-left">市场</th>
                  </tr>
                </thead>
                <tbody>
                  {data.slice(-20).map((item, index) => (
                    <tr key={index} className="border-t border-gray-200 dark:border-gray-700">
                      <td className="px-2 py-2 text-gray-800 dark:text-gray-200">{item.name}</td>
                      <td className="px-2 py-2 text-gray-600 dark:text-gray-400">
                        ¥{item.price}/{item.unit}
                      </td>
                      <td className="px-2 py-2 text-gray-600 dark:text-gray-400 text-xs">
                        {item.market}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="flex items-center justify-center h-full text-gray-500 dark:text-gray-400 italic">
                暂无数据...
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VegetableScraper;
