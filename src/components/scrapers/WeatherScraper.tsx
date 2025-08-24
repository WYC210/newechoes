import React, { useState, useCallback, useRef } from 'react';

interface WeatherScraperProps {
  onBack: () => void;
}

interface WeatherData {
  city: string;
  province: string;
  temperature: string;
  weather: string;
  humidity: string;
  windSpeed: string;
  airQuality: string;
  updateTime: string;
}

const WeatherScraper: React.FC<WeatherScraperProps> = ({ onBack }) => {
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [selectedProvince, setSelectedProvince] = useState('北京');
  const [delay, setDelay] = useState(1500);
  const [data, setData] = useState<WeatherData[]>([]);
  const [logs, setLogs] = useState<string[]>([]);
  const [progress, setProgress] = useState(0);
  
  const abortControllerRef = useRef<AbortController | null>(null);
  const logContainerRef = useRef<HTMLDivElement>(null);

  const provinces = [
    '北京', '上海', '天津', '重庆', '河北', '山西', '辽宁', '吉林', '黑龙江',
    '江苏', '浙江', '安徽', '福建', '江西', '山东', '河南', '湖北', '湖南',
    '广东', '海南', '四川', '贵州', '云南', '陕西', '甘肃', '青海', '台湾',
    '内蒙古', '广西', '西藏', '宁夏', '新疆', '香港', '澳门'
  ];

  const addLog = useCallback((message: string) => {
    const timestamp = new Date().toLocaleTimeString();
    const logMessage = `[${timestamp}] ${message}`;
    setLogs(prev => [...prev.slice(-49), logMessage]);
    
    setTimeout(() => {
      if (logContainerRef.current) {
        logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight;
      }
    }, 100);
  }, []);

  const generateMockWeatherData = useCallback((province: string): WeatherData[] => {
    const cityData: { [key: string]: string[] } = {
      '北京': ['北京', '昌平', '朝阳', '丰台', '海淀', '石景山', '西城', '东城'],
      '上海': ['上海', '浦东', '徐汇', '长宁', '静安', '普陀', '虹口', '杨浦'],
      '广东': ['广州', '深圳', '珠海', '汕头', '佛山', '韶关', '湛江', '肇庆'],
      '江苏': ['南京', '苏州', '无锡', '常州', '镇江', '南通', '泰州', '扬州'],
      '浙江': ['杭州', '宁波', '温州', '嘉兴', '湖州', '绍兴', '金华', '衢州'],
      '山东': ['济南', '青岛', '淄博', '枣庄', '东营', '烟台', '潍坊', '济宁'],
      '河南': ['郑州', '开封', '洛阳', '平顶山', '安阳', '鹤壁', '新乡', '焦作'],
      '四川': ['成都', '自贡', '攀枝花', '泸州', '德阳', '绵阳', '广元', '遂宁'],
    };

    const cities = cityData[province] || [province];
    const weathers = ['晴', '多云', '阴', '小雨', '中雨', '大雨', '雷阵雨', '雪', '雾', '霾'];
    const airQualities = ['优', '良', '轻度污染', '中度污染', '重度污染'];

    return cities.map(city => {
      const temp = Math.floor(Math.random() * 35) - 5; // -5到30度
      const humidity = Math.floor(Math.random() * 60) + 30; // 30-90%
      const wind = Math.floor(Math.random() * 8) + 1; // 1-8级
      const weather = weathers[Math.floor(Math.random() * weathers.length)];
      const aqi = airQualities[Math.floor(Math.random() * airQualities.length)];

      return {
        city,
        province,
        temperature: `${temp}°C`,
        weather,
        humidity: `${humidity}%`,
        windSpeed: `${wind}级`,
        airQuality: aqi,
        updateTime: new Date().toLocaleString()
      };
    });
  }, []);

  const scrapeProvinceWeather = useCallback(async (province: string): Promise<WeatherData[]> => {
    addLog(`开始爬取 ${province} 天气数据...`);
    
    // 模拟网络请求延迟
    await new Promise(resolve => setTimeout(resolve, Math.random() * 1000 + 800));
    
    // 检查是否被取消
    if (abortControllerRef.current?.signal.aborted) {
      throw new Error('操作已取消');
    }
    
    const weatherData = generateMockWeatherData(province);
    addLog(`${province} 天气数据爬取完成，获取到 ${weatherData.length} 个城市数据`);
    
    return weatherData;
  }, [addLog, generateMockWeatherData]);

  const startScraping = useCallback(async () => {
    if (isRunning) return;
    
    setIsRunning(true);
    setIsPaused(false);
    setData([]);
    setProgress(0);
    abortControllerRef.current = new AbortController();
    
    addLog('开始爬取天气数据...');
    addLog(`目标省份：${selectedProvince}，延迟：${delay}ms`);
    
    try {
      // 检查是否暂停
      while (isPaused && !abortControllerRef.current.signal.aborted) {
        await new Promise(resolve => setTimeout(resolve, 100));
      }
      
      // 检查是否被取消
      if (abortControllerRef.current.signal.aborted) {
        addLog('爬取已被用户取消');
        return;
      }
      
      setProgress(20);
      const weatherData = await scrapeProvinceWeather(selectedProvince);
      setProgress(60);
      
      setData(weatherData);
      setProgress(100);
      
      if (!abortControllerRef.current.signal.aborted) {
        addLog('天气数据爬取完成！');
      }
    } catch (error) {
      if (error instanceof Error && error.message === '操作已取消') {
        addLog('爬取已被用户取消');
      } else {
        addLog(`爬取过程中出现错误: ${error}`);
      }
    } finally {
      setIsRunning(false);
      setIsPaused(false);
      setProgress(0);
    }
  }, [isRunning, isPaused, selectedProvince, delay, addLog, scrapeProvinceWeather]);

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
    setProgress(0);
    addLog('数据已清空');
  }, [addLog]);

  const exportData = useCallback(() => {
    if (data.length === 0) {
      addLog('没有数据可导出');
      return;
    }
    
    const csvContent = [
      '城市,省份,温度,天气,湿度,风速,空气质量,更新时间',
      ...data.map(item => 
        `${item.city},${item.province},${item.temperature},${item.weather},${item.humidity},${item.windSpeed},${item.airQuality},${item.updateTime}`
      )
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `天气数据_${selectedProvince}_${new Date().toLocaleDateString()}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    addLog(`数据已导出，共 ${data.length} 条记录`);
  }, [data, selectedProvince, addLog]);

  const refreshData = useCallback(() => {
    if (isRunning) return;
    startScraping();
  }, [isRunning, startScraping]);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 md:p-6">
      <div className="flex items-center justify-between mb-4 md:mb-6">
        <div className="flex items-center">
          <div className="text-2xl md:text-3xl mr-2 md:mr-4">🌤️</div>
          <div>
            <h2 className="text-lg md:text-2xl font-bold text-gray-800 dark:text-gray-200">
              天气数据爬取
            </h2>
            <p className="text-sm md:text-base text-gray-600 dark:text-gray-400">
              {isRunning ? (isPaused ? '已暂停' : '爬取中...') : '选择省份并开始爬取'}
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
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            选择省份
          </label>
          <select
            value={selectedProvince}
            onChange={(e) => setSelectedProvince(e.target.value)}
            disabled={isRunning}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
          >
            {provinces.map(province => (
              <option key={province} value={province}>{province}</option>
            ))}
          </select>
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
            onChange={(e) => setDelay(parseInt(e.target.value) || 1500)}
            disabled={isRunning}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
          />
        </div>
      </div>

      {/* 控制按钮 */}
      <div className="flex flex-wrap gap-2 mb-6">
        {!isRunning ? (
          <>
            <button
              onClick={startScraping}
              className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg font-semibold transition-colors"
            >
              开始爬取
            </button>
            <button
              onClick={refreshData}
              className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-semibold transition-colors"
            >
              刷新数据
            </button>
          </>
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
          className="px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-lg font-semibold transition-colors disabled:opacity-50"
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
          <div className="text-sm text-blue-800 dark:text-blue-300">城市数量</div>
        </div>
        <div className="bg-green-50 dark:bg-green-900 p-3 rounded-lg text-center">
          <div className="text-2xl font-bold text-green-600 dark:text-green-400">{selectedProvince}</div>
          <div className="text-sm text-green-800 dark:text-green-300">目标省份</div>
        </div>
        <div className="bg-purple-50 dark:bg-purple-900 p-3 rounded-lg text-center">
          <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
            {data.length > 0 ? new Set(data.map(item => item.weather)).size : 0}
          </div>
          <div className="text-sm text-purple-800 dark:text-purple-300">天气类型</div>
        </div>
        <div className="bg-orange-50 dark:bg-orange-900 p-3 rounded-lg text-center">
          <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
            {data.length > 0 ? data.filter(item => item.airQuality === '优' || item.airQuality === '良').length : 0}
          </div>
          <div className="text-sm text-orange-800 dark:text-orange-300">空气良好</div>
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
          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-3">天气数据</h3>
          <div className="bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg h-64 overflow-auto">
            {data.length > 0 ? (
              <div className="p-3 space-y-3">
                {data.map((item, index) => (
                  <div key={index} className="bg-white dark:bg-gray-800 rounded-lg p-3 border border-gray-200 dark:border-gray-700">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h4 className="font-semibold text-gray-800 dark:text-gray-200">{item.city}</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{item.province}</p>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold text-blue-600 dark:text-blue-400">{item.temperature}</div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">{item.weather}</div>
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-2 text-xs text-gray-500 dark:text-gray-400">
                      <div>湿度: {item.humidity}</div>
                      <div>风速: {item.windSpeed}</div>
                      <div>空气: {item.airQuality}</div>
                    </div>
                  </div>
                ))}
              </div>
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

export default WeatherScraper;
