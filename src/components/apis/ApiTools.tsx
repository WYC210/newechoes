import React, { useState } from 'react';

interface ApiToolsProps {
  onBack: () => void;
}

// API工具类型
type ApiToolType = 
  | 'ip-location' 
  | 'whois' 
  | 'port-scan' 
  | 'my-ip' 
  | 'phone-location' 
  | 'icp-query' 
  | 'dns-query' 
  | 'news-image' 
  | 'programmer-history' 
  | 'weather-query'
  | 'extract-images'
  | 'json-format'
  | 'web-to-markdown'
  | 'github-accelerate'
  | 'ascii-art'
  | 'vegetable-prices'

// API配置
interface ApiConfig {
  id: ApiToolType;
  name: string;
  icon: string;
  description: string;
  inputPlaceholder?: string;
  inputRequired: boolean;
  tags: string[];
}

const apiConfigs: ApiConfig[] = [
  {
    id: 'ip-location',
    name: 'IP归属地查询',
    icon: '🌍',
    description: '查询IP地址的地理位置信息（支持中文显示）',
    inputPlaceholder: '请输入IP地址，如：8.8.8.8',
    inputRequired: true,
    tags: ['地理位置', 'IP查询', '中文支持']
  },
  {
    id: 'whois',
    name: 'WHOIS查询',
    icon: '🔍',
    description: '查询域名的注册信息',
    inputPlaceholder: '请输入域名，如：example.com',
    inputRequired: true,
    tags: ['域名查询', '注册信息']
  },
  {
    id: 'port-scan',
    name: '端口扫描',
    icon: '🔌',
    description: '检测指定主机的端口开放状态',
    inputPlaceholder: '请输入主机地址，如：example.com',
    inputRequired: true,
    tags: ['端口检测', '网络安全']
  },
  {
    id: 'my-ip',
    name: '我的公网IP',
    icon: '📍',
    description: '获取您当前的公网IP地址和位置信息',
    inputRequired: false,
    tags: ['公网IP', '位置信息']
  },
  {
    id: 'phone-location',
    name: '手机号归属地',
    icon: '📱',
    description: '查询手机号码的归属地信息',
    inputPlaceholder: '请输入11位手机号码',
    inputRequired: true,
    tags: ['手机号', '归属地']
  },
  {
    id: 'icp-query',
    name: 'ICP备案查询',
    icon: '📋',
    description: '查询网站的ICP备案信息',
    inputPlaceholder: '请输入域名，如：baidu.com',
    inputRequired: true,
    tags: ['ICP备案', '网站信息']
  },
  {
    id: 'dns-query',
    name: 'DNS解析查询',
    icon: '🌐',
    description: '查询域名的DNS记录',
    inputPlaceholder: '请输入域名，如：google.com',
    inputRequired: true,
    tags: ['DNS解析', '域名记录']
  },
  {
    id: 'news-image',
    name: '每日新闻图片',
    icon: '📰',
    description: '生成当日热点新闻摘要图片',
    inputRequired: false,
    tags: ['新闻摘要', '图片生成']
  },
  {
    id: 'programmer-history',
    name: '程序员历史事件',
    icon: '👨‍💻',
    description: '获取程序员历史上的今天发生的事件',
    inputRequired: false,
    tags: ['程序员', '历史事件']
  },
  {
    id: 'weather-query',
    name: '实时天气查询',
    icon: '🌤️',
    description: '查询指定城市的实时天气信息',
    inputPlaceholder: '请输入城市名称，如：北京',
    inputRequired: true,
    tags: ['天气查询', '实时数据']
  },
  {
    id: 'extract-images',
    name: '网页图片提取',
    icon: '🖼️',
    description: '提取指定网页中的所有图片链接',
    inputPlaceholder: '请输入网页URL，如：https://example.com',
    inputRequired: true,
    tags: ['图片提取', '网页解析']
  },
  {
    id: 'json-format',
    name: 'JSON格式化',
    icon: '📝',
    description: '美化并格式化JSON字符串，让代码更易读',
    inputPlaceholder: '请输入需要格式化的JSON字符串',
    inputRequired: true,
    tags: ['JSON格式化', '代码美化']
  },
  {
    id: 'web-to-markdown',
    name: '网页转Markdown',
    icon: '📄',
    description: '深度抓取网页内容并转换为Markdown格式（限时免费）',
    inputPlaceholder: '请输入网页URL，如：https://example.com',
    inputRequired: true,
    tags: ['网页转换', 'Markdown', '限时免费']
  },
  {
    id: 'github-accelerate',
    name: 'GitHub下载加速',
    icon: '🚀',
    description: '加速GitHub文件和项目的下载速度',
    inputPlaceholder: '请输入GitHub文件或项目链接',
    inputRequired: true,
    tags: ['GitHub', '下载加速', '文件加速']
  },
  {
    id: 'ascii-art',
    name: 'ASCII艺术字生成',
    icon: '🎨',
    description: '将文本转换为ASCII艺术字体',
    inputPlaceholder: '请输入要转换的文本',
    inputRequired: true,
    tags: ['ASCII艺术', '文本转换', '艺术字体']
  },
  {
    id: 'vegetable-prices',
    name: '蔬菜价格查询',
    icon: '🥬',
    description: '查询北京地区蔬菜批发市场价格信息',
    inputRequired: false,
    tags: ['蔬菜价格', '市场行情', '批发价格']
  }
];

const ApiTools: React.FC<ApiToolsProps> = ({ onBack }) => {
  const [selectedTool, setSelectedTool] = useState<ApiToolType | null>(null);
  const [inputValue, setInputValue] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [ipApiSource, setIpApiSource] = useState<'auto' | 'ipinfo' | 'pconline'>('auto');
  const [portScanType, setPortScanType] = useState<'common' | 'custom'>('common');
  const [customPorts, setCustomPorts] = useState('80,443,8080,3306,3389');
  const [portProtocol, setPortProtocol] = useState<'tcp' | 'udp'>('tcp');
  const [githubNode, setGithubNode] = useState('ghproxy.com');
  const [asciiFont, setAsciiFont] = useState('3D Diagonal');
  const [vegetablePage, setVegetablePage] = useState(1);
  const [vegetableLimit, setVegetableLimit] = useState(20);
  const [vegetableMarket, setVegetableMarket] = useState('');

  // 重置状态
  const resetState = () => {
    setInputValue('');
    setResult(null);
    setError(null);
    setIpApiSource('auto');
    setPortScanType('common');
    setCustomPorts('80,443,8080,3306,3389');
    setPortProtocol('tcp');
    setGithubNode('ghproxy.com');
    setAsciiFont('3D Diagonal');
    setVegetablePage(1);
    setVegetableLimit(20);
    setVegetableMarket('');
  };

  // 选择工具
  const selectTool = (toolId: ApiToolType) => {
    setSelectedTool(toolId);
    resetState();
  };

  // 返回工具列表
  const backToList = () => {
    setSelectedTool(null);
    resetState();
  };

  // 构建API URL
  const buildApiUrl = (toolId: ApiToolType, input?: string): string => {
    const baseUrls: Record<ApiToolType, string> = {
      'ip-location': `https://freegeoip.app/json/${input}`, // 使用FreeGeoIP，支持中文且无编码问题
      'whois': `https://uapis.cn/api/v1/network/whois?domain=${input}&format=json`,
      'port-scan': `https://uapis.cn/api/v1/network/portscan?host=${input}&port=80&protocol=tcp`,
      'my-ip': 'https://uapis.cn/api/v1/network/myip',
      'phone-location': `https://uapis.cn/api/v1/misc/phoneinfo?phone=${input}`,
      'icp-query': `https://uapis.cn/api/v1/network/icp?domain=${input}`,
      'dns-query': `https://uapis.cn/api/v1/network/dns?domain=${input}&type=A`,
      'news-image': 'https://uapis.cn/api/v1/daily/news-image',
      'programmer-history': 'https://uapis.cn/api/v1/history/programmer/today',
      'weather-query': `https://uapis.cn/api/v1/misc/weather?city=${input}`,
      'extract-images': `https://uapis.cn/api/v1/webparse/extractimages?url=${encodeURIComponent(input || '')}`,
      'json-format': 'https://uapis.cn/api/v1/convert/json',
      'web-to-markdown': `https://uapis.cn/api/v1/web/tomarkdown?url=${encodeURIComponent(input || '')}`,
      'github-accelerate': '', // 客户端处理
      'ascii-art': `https://uapis.cn/api/v1/text/ascii?text=${encodeURIComponent(input || '')}&font=${asciiFont}`,
      'vegetable-prices': `/api/vegetable-prices?page=${vegetablePage}&limit=${vegetableLimit}&market=${encodeURIComponent(vegetableMarket)}`
    };
    return baseUrls[toolId];
  };

  // 调用API
  const callApi = async () => {
    if (!selectedTool) return;

    const config = apiConfigs.find(c => c.id === selectedTool);
    if (!config) return;

    // 验证输入
    if (config.inputRequired && !inputValue.trim()) {
      setError('请输入必要的参数');
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      // 对于IP查询，使用我们自己的API端点
      if (selectedTool === 'ip-location') {
        const sourceParam = ipApiSource !== 'auto' ? `&source=${ipApiSource}` : '';
        const response = await fetch(`/api/ip-location?ip=${encodeURIComponent(inputValue.trim())}${sourceParam}`);

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || `HTTP ${response.status}`);
        }

        const data = await response.json();
        setResult(data);
      } else if (selectedTool === 'port-scan') {
        // 端口扫描使用我们自己的API端点，支持TCP/UDP协议
        const portsParam = portScanType === 'custom' ? `&ports=${encodeURIComponent(customPorts)}` : '';
        const protocolParam = `&protocol=${portProtocol}`;
        const response = await fetch(`/api/port-scan?host=${encodeURIComponent(inputValue.trim())}&type=${portScanType}${portsParam}${protocolParam}`);

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || `HTTP ${response.status}`);
        }

        const data = await response.json();
        setResult(data);
      } else if (selectedTool === 'github-accelerate') {
        // GitHub下载加速客户端处理
        const githubNodes = {
          'ghproxy.com': (url: string) => `https://ghproxy.com/${url}`,
          'jsdelivr.net': (url: string) => {
            // 简单处理jsdelivr CDN链接转换
            const match = url.match(/github\.com\/([^/]+)\/([^/]+)\/blob\/([^/]+)\/(.+)/);
            if (match) {
              return `https://fastly.jsdelivr.net/gh/${match[1]}/${match[2]}@${match[3]}/${match[4]}`;
            }
            return `https://ghproxy.com/${url}`;
          },
          'fastgit.org': (url: string) => url.replace('github.com', 'hub.fastgit.xyz'),
          'gh.api.99988866.xyz': (url: string) => `https://gh.api.99988866.xyz/${url}`
        };
        
        const acceleratedUrl = githubNodes[githubNode as keyof typeof githubNodes](inputValue.trim());
        setResult({
          original_url: inputValue.trim(),
          accelerated_url: acceleratedUrl,
          node: githubNode,
          success: true
        });
      } else if (selectedTool === 'ascii-art') {
        // ASCII艺术字生成
        const result = generateAsciiArt(inputValue.trim(), asciiFont);
        setResult({
          text: inputValue.trim(),
          font: asciiFont,
          ascii_art: result,
          success: true
        });
      } else if (selectedTool === 'json-format') {
        // JSON格式化使用POST方法
        const response = await fetch('/api/proxy', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            url: buildApiUrl(selectedTool),
            method: 'POST',
            body: {
              content: inputValue.trim()
            }
          })
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || `HTTP ${response.status}`);
        }

        const data = await response.json();
        setResult(data);
      } else if (selectedTool === 'vegetable-prices') {
        // 蔬菜价格查询
        const apiUrl = buildApiUrl(selectedTool);
        const response = await fetch(apiUrl);

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || errorData.error || `HTTP ${response.status}`);
        }

        const data = await response.json();
        setResult(data);
      } else if (selectedTool === 'web-to-markdown') {
        // 网页转Markdown，带限时提示
        try {
          const apiUrl = buildApiUrl(selectedTool, inputValue.trim());
          const proxyUrl = `/api/proxy?url=${encodeURIComponent(apiUrl)}`;
          const response = await fetch(proxyUrl);

          if (!response.ok) {
            throw new Error('接口已关闭 - 此接口为限时免费提供，当前已停止服务');
          }

          const data = await response.json();
          if (data.error) {
            throw new Error('接口已关闭 - 此接口为限时免费提供，当前已停止服务');
          }
          setResult(data);
        } catch (err) {
          if (err instanceof Error && err.message.includes('接口已关闭')) {
            throw err;
          }
          throw new Error('接口已关闭 - 此接口为限时免费提供，当前已停止服务');
        }
      } else if (selectedTool === 'news-image') {
        // 每日新闻图片特殊处理
        const apiUrl = buildApiUrl(selectedTool, inputValue.trim());
        const proxyUrl = `/api/proxy?url=${encodeURIComponent(apiUrl)}`;
        const response = await fetch(proxyUrl);

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        // 检查是否是图片
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('image/')) {
          const blob = await response.blob();
          const imageUrl = URL.createObjectURL(blob);
          setResult({
            type: 'image',
            url: imageUrl,
            contentType: contentType,
            size: blob.size,
            downloadName: `news-${new Date().toISOString().split('T')[0]}.jpg`
          });
        } else {
          const data = await response.json();
          if (data.error) {
            throw new Error(data.message || data.error);
          }
          setResult(data);
        }
      } else {
        // 其他API使用代理
        const apiUrl = buildApiUrl(selectedTool, inputValue.trim());
        const proxyUrl = `/api/proxy?url=${encodeURIComponent(apiUrl)}`;
        const response = await fetch(proxyUrl);

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        const data = await response.json();

        // 检查是否是错误响应
        if (data.error) {
          throw new Error(data.message || data.error);
        }

        setResult(data);
      }
    } catch (err) {
      console.error('API调用失败:', err);
      setError(err instanceof Error ? err.message : '请求失败，请稍后重试');
    } finally {
      setLoading(false);
    }
  };

  // ASCII艺术字生成函数
  const generateAsciiArt = (text: string, font: string): string => {
    // 完整的ASCII字符映射
    const fontMap: Record<string, Record<string, string[]>> = {
      '3D Diagonal': {
        'A': [' ██   ', '█  █  ', '████  ', '█  █  ', '█  █  '],
        'B': ['███  ', '█  █ ', '███  ', '█  █ ', '███  '],
        'C': [' ███ ', '█    ', '█    ', '█    ', ' ███ '],
        'D': ['███  ', '█  █ ', '█  █ ', '█  █ ', '███  '],
        'E': ['████ ', '█    ', '███  ', '█    ', '████ '],
        'F': ['████ ', '█    ', '███  ', '█    ', '█    '],
        'G': [' ███ ', '█    ', '█ ██ ', '█  █ ', ' ███ '],
        'H': ['█  █ ', '█  █ ', '████ ', '█  █ ', '█  █ '],
        'I': ['███  ', ' █   ', ' █   ', ' █   ', '███  '],
        'J': ['  ██ ', '   █ ', '   █ ', '█  █ ', ' ██  '],
        'K': ['█  █ ', '█ █  ', '██   ', '█ █  ', '█  █ '],
        'L': ['█    ', '█    ', '█    ', '█    ', '████ '],
        'M': ['█  █ ', '████ ', '█  █ ', '█  █ ', '█  █ '],
        'N': ['█  █ ', '██ █ ', '█ ██ ', '█  █ ', '█  █ '],
        'O': [' ██  ', '█  █ ', '█  █ ', '█  █ ', ' ██  '],
        'P': ['███  ', '█  █ ', '███  ', '█    ', '█    '],
        'Q': [' ██  ', '█  █ ', '█ ██ ', ' ███ ', '   █ '],
        'R': ['███  ', '█  █ ', '███  ', '█ █  ', '█  █ '],
        'S': [' ███ ', '█    ', ' ██  ', '   █ ', '███  '],
        'T': ['███  ', ' █   ', ' █   ', ' █   ', ' █   '],
        'U': ['█  █ ', '█  █ ', '█  █ ', '█  █ ', ' ██  '],
        'V': ['█  █ ', '█  █ ', '█  █ ', ' ██  ', ' █   '],
        'W': ['█  █ ', '█  █ ', '█  █ ', '████ ', '█  █ '],
        'X': ['█  █ ', ' ██  ', ' █   ', ' ██  ', '█  █ '],
        'Y': ['█  █ ', '█  █ ', ' ██  ', ' █   ', ' █   '],
        'Z': ['████ ', '  █  ', ' █   ', '█    ', '████ '],
        ' ': ['     ', '     ', '     ', '     ', '     '],
        '0': [' ██  ', '█  █ ', '█  █ ', '█  █ ', ' ██  '],
        '1': [' █   ', '██   ', ' █   ', ' █   ', '███  '],
        '2': [' ██  ', '█  █ ', '  █  ', ' █   ', '████ '],
        '3': [' ██  ', '█  █ ', ' ██  ', '█  █ ', ' ██  '],
        '4': ['█  █ ', '█  █ ', '████ ', '   █ ', '   █ '],
        '5': ['████ ', '█    ', '███  ', '   █ ', '███  '],
        '6': [' ██  ', '█    ', '███  ', '█  █ ', ' ██  '],
        '7': ['████ ', '   █ ', '  █  ', ' █   ', '█    '],
        '8': [' ██  ', '█  █ ', ' ██  ', '█  █ ', ' ██  '],
        '9': [' ██  ', '█  █ ', ' ███ ', '   █ ', ' ██  ']
      },
      'Big': {
        'A': ['  ████  ', ' █    █ ', '████████', '█      █', '█      █'],
        'B': ['███████ ', '█      █', '███████ ', '█      █', '███████ '],
        'C': [' ██████ ', '█       ', '█       ', '█       ', ' ██████ '],
        'D': ['██████  ', '█     █ ', '█     █ ', '█     █ ', '██████  '],
        'E': ['████████', '█       ', '██████  ', '█       ', '████████'],
        'F': ['████████', '█       ', '██████  ', '█       ', '█       '],
        'G': [' ██████ ', '█       ', '█  ████ ', '█     █ ', ' ██████ '],
        'H': ['█      █', '█      █', '████████', '█      █', '█      █'],
        'I': ['████████', '   ██   ', '   ██   ', '   ██   ', '████████'],
        'J': ['     ███', '      ██', '      ██', '█     ██', ' ██████ '],
        'K': ['█     █ ', '█   ██  ', '████    ', '█   ██  ', '█     █ '],
        'L': ['█       ', '█       ', '█       ', '█       ', '████████'],
        'M': ['█      █', '████████', '█      █', '█      █', '█      █'],
        'N': ['█      █', '███    █', '█  ███ █', '█     ██', '█      █'],
        'O': [' ██████ ', '█      █', '█      █', '█      █', ' ██████ '],
        'P': ['███████ ', '█      █', '███████ ', '█       ', '█       '],
        'Q': [' ██████ ', '█      █', '█   ███ ', ' ██████ ', '       █'],
        'R': ['███████ ', '█      █', '███████ ', '█    █  ', '█     █ '],
        'S': [' ██████ ', '█       ', ' ██████ ', '       █', '██████  '],
        'T': ['████████', '   ██   ', '   ██   ', '   ██   ', '   ██   '],
        'U': ['█      █', '█      █', '█      █', '█      █', ' ██████ '],
        'V': ['█      █', '█      █', '█      █', ' █    █ ', '  ████  '],
        'W': ['█      █', '█      █', '█      █', '████████', '█      █'],
        'X': ['█      █', ' █    █ ', '  ████  ', ' █    █ ', '█      █'],
        'Y': ['█      █', '█      █', ' █    █ ', '  ████  ', '   ██   '],
        'Z': ['████████', '      █ ', '    ██  ', '  ██    ', '████████'],
        ' ': ['        ', '        ', '        ', '        ', '        '],
        '0': [' ██████ ', '█      █', '█      █', '█      █', ' ██████ '],
        '1': ['   ██   ', '  ███   ', '   ██   ', '   ██   ', '████████'],
        '2': [' ██████ ', '█      █', '      ██', '   ███  ', '████████'],
        '3': [' ██████ ', '█      █', '  █████ ', '█      █', ' ██████ '],
        '4': ['█      █', '█      █', '████████', '       █', '       █'],
        '5': ['████████', '█       ', '███████ ', '       █', '███████ '],
        '6': [' ██████ ', '█       ', '███████ ', '█      █', ' ██████ '],
        '7': ['████████', '       █', '      ██', '    ██  ', '   ██   '],
        '8': [' ██████ ', '█      █', ' ██████ ', '█      █', ' ██████ '],
        '9': [' ██████ ', '█      █', ' ███████', '       █', ' ██████ ']
      }
    };

    const selectedFont = fontMap[font] || fontMap['3D Diagonal'];
    const lines: string[] = ['', '', '', '', ''];
    
    for (let i = 0; i < text.length; i++) {
      const char = text[i].toUpperCase();
      const pattern = selectedFont[char];
      
      if (pattern) {
        for (let j = 0; j < 5; j++) {
          lines[j] += pattern[j] + ' ';
        }
      } else {
        // 对于未定义的字符，用问号代替
        const questionPattern = selectedFont['?'] || [' ███ ', '█   █', '  ██ ', '     ', ' ██  '];
        for (let j = 0; j < 5; j++) {
          lines[j] += questionPattern[j] + ' ';
        }
      }
    }
    
    return lines.join('\n');
  };

  // 格式化JSON显示
  const formatJson = (obj: any): string => {
    return JSON.stringify(obj, null, 2);
  };

  if (!selectedTool) {
    // 工具列表视图
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 sm:p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <div className="text-2xl sm:text-3xl mr-3">🔧</div>
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-gray-200">
                API工具
              </h2>
              <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
                选择需要使用的API工具
              </p>
            </div>
          </div>
          <button
            onClick={onBack}
            className="px-3 sm:px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg transition-colors text-sm sm:text-base"
          >
            ← 返回
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {apiConfigs.map((config) => (
            <div
              key={config.id}
              className="api-tool-card bg-gray-50 dark:bg-gray-700 rounded-lg p-4 cursor-pointer hover:shadow-md transition-all duration-300 hover:scale-105 border-2 border-transparent hover:border-blue-500"
              onClick={() => selectTool(config.id)}
            >
              <div className="text-center">
                <div className="text-3xl sm:text-4xl mb-3">{config.icon}</div>
                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">
                  {config.name}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                  {config.description}
                </p>
                <div className="flex flex-wrap gap-1 justify-center">
                  {config.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-xs"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // 工具详情视图
  const currentConfig = apiConfigs.find(c => c.id === selectedTool);
  if (!currentConfig) return null;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 sm:p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <div className="text-2xl sm:text-3xl mr-3">{currentConfig.icon}</div>
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-gray-200">
              {currentConfig.name}
            </h2>
            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
              {currentConfig.description}
            </p>
          </div>
        </div>
        <button
          onClick={backToList}
          className="px-3 sm:px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg transition-colors text-sm sm:text-base"
        >
          ← 返回
        </button>
      </div>

      {/* 输入区域 */}
      {currentConfig.inputRequired && (
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            输入参数
          </label>
          <div className="flex gap-2 mb-3">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder={currentConfig.inputPlaceholder}
              className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              disabled={loading}
            />
            <button
              onClick={callApi}
              disabled={loading || (currentConfig.inputRequired && !inputValue.trim())}
              className="px-4 py-2 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 text-white rounded-lg transition-colors"
            >
              {loading ? '查询中...' : '查询'}
            </button>
          </div>

          {/* IP查询API源选择器 */}
          {selectedTool === 'ip-location' && (
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                API数据源选择
              </label>
              <div className="space-y-2">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="ipApiSource"
                    value="auto"
                    checked={ipApiSource === 'auto'}
                    onChange={(e) => setIpApiSource(e.target.value as any)}
                    className="mr-2"
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300">
                    自动选择（推荐）- 优先使用无编码问题的API
                  </span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="ipApiSource"
                    value="ipinfo"
                    checked={ipApiSource === 'ipinfo'}
                    onChange={(e) => setIpApiSource(e.target.value as any)}
                    className="mr-2"
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300">
                    IPInfo.io - 英文地理信息，无编码问题
                  </span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="ipApiSource"
                    value="pconline"
                    checked={ipApiSource === 'pconline'}
                    onChange={(e) => setIpApiSource(e.target.value as any)}
                    className="mr-2"
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300">
                    太平洋IP查询 - 中文地理信息，但可能有编码问题
                  </span>
                </label>
              </div>
            </div>
          )}

          {/* 端口扫描选项 */}
          {selectedTool === 'port-scan' && (
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                端口扫描设置
              </label>
              <div className="space-y-3">
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="portScanType"
                      value="common"
                      checked={portScanType === 'common'}
                      onChange={(e) => setPortScanType(e.target.value as any)}
                      className="mr-2"
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300">
                      常用端口（80,443,8080,3306,3389,21,22,23,25,53,110,143,993,995）
                    </span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="portScanType"
                      value="custom"
                      checked={portScanType === 'custom'}
                      onChange={(e) => setPortScanType(e.target.value as any)}
                      className="mr-2"
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300">
                      自定义端口
                    </span>
                  </label>
                </div>
                {portScanType === 'custom' && (
                  <div>
                    <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1">
                      自定义端口（用逗号分隔，如：80,443,8080）
                    </label>
                    <input
                      type="text"
                      value={customPorts}
                      onChange={(e) => setCustomPorts(e.target.value)}
                      placeholder="80,443,8080,3306,3389"
                      className="w-full px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded focus:ring-1 focus:ring-blue-500 focus:border-transparent dark:bg-gray-600 dark:text-white"
                    />
                  </div>
                )}
                <div>
                  <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1">
                    协议类型
                  </label>
                  <div className="flex space-x-4">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="portProtocol"
                        value="tcp"
                        checked={portProtocol === 'tcp'}
                        onChange={(e) => setPortProtocol(e.target.value as any)}
                        className="mr-1"
                      />
                      <span className="text-sm text-gray-700 dark:text-gray-300">TCP</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="portProtocol"
                        value="udp"
                        checked={portProtocol === 'udp'}
                        onChange={(e) => setPortProtocol(e.target.value as any)}
                        className="mr-1"
                      />
                      <span className="text-sm text-gray-700 dark:text-gray-300">UDP</span>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* GitHub加速节点选择 */}
          {selectedTool === 'github-accelerate' && (
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                选择加速节点
              </label>
              <select
                value={githubNode}
                onChange={(e) => setGithubNode(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded focus:ring-1 focus:ring-blue-500 focus:border-transparent dark:bg-gray-600 dark:text-white"
              >
                <option value="ghproxy.com">ghproxy.com（推荐）</option>
                <option value="jsdelivr.net">jsdelivr.net CDN</option>
                <option value="fastgit.org">fastgit.org</option>
                <option value="gh.api.99988866.xyz">gh.api.99988866.xyz</option>
              </select>
            </div>
          )}

          {/* ASCII艺术字体选择 */}
          {selectedTool === 'ascii-art' && (
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                选择字体样式
              </label>
              <select
                value={asciiFont}
                onChange={(e) => setAsciiFont(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded focus:ring-1 focus:ring-blue-500 focus:border-transparent dark:bg-gray-600 dark:text-white"
              >
                <option value="3D Diagonal">3D Diagonal</option>
                <option value="Big">Big</option>
              </select>
            </div>
          )}

        </div>
      )}

      {/* 蔬菜价格查询参数 (特殊处理，因为这个工具不需要输入但需要参数设置) */}
      {selectedTool === 'vegetable-prices' && (
        <div className="mb-6">
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              查询参数
            </label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1">
                  页数
                </label>
                <input
                  type="number"
                  min="1"
                  max="10"
                  value={vegetablePage}
                  onChange={(e) => setVegetablePage(parseInt(e.target.value) || 1)}
                  className="w-full px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded focus:ring-1 focus:ring-blue-500 focus:border-transparent dark:bg-gray-600 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1">
                  每页数量
                </label>
                <select
                  value={vegetableLimit}
                  onChange={(e) => setVegetableLimit(parseInt(e.target.value))}
                  className="w-full px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded focus:ring-1 focus:ring-blue-500 focus:border-transparent dark:bg-gray-600 dark:text-white"
                >
                  <option value="10">10</option>
                  <option value="20">20</option>
                  <option value="50">50</option>
                  <option value="100">100</option>
                </select>
              </div>
              <div>
                <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1">
                  市场筛选 (可选)
                </label>
                <select
                  value={vegetableMarket}
                  onChange={(e) => setVegetableMarket(e.target.value)}
                  className="w-full px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded focus:ring-1 focus:ring-blue-500 focus:border-transparent dark:bg-gray-600 dark:text-white"
                >
                  <option value="">全部市场</option>
                  <option value="新发地">新发地批发市场</option>
                  <option value="大洋路">大洋路农产品批发市场</option>
                  <option value="岳各庄">岳各庄批发市场</option>
                  <option value="锦绣大地">锦绣大地农产品批发市场</option>
                  <option value="水屯">水屯农副产品批发市场</option>
                  <option value="八里桥">八里桥农产品批发市场</option>
                  <option value="城北回龙观">城北回龙观农产品批发市场</option>
                  <option value="京深海鲜">京深海鲜批发市场</option>
                  <option value="顺义石门">顺义石门农产品批发市场</option>
                  <option value="昌平水屯">昌平水屯农副产品批发市场</option>
                  <option value="通州八里桥">通州八里桥农产品批发市场</option>
                  <option value="朝阳大洋路">朝阳大洋路农副产品批发市场</option>
                  <option value="海淀清河">海淀清河农产品批发市场</option>
                  <option value="丰台新发地">丰台新发地农产品批发市场</option>
                  <option value="房山良乡">房山良乡农产品批发市场</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* JSON格式化输入框 */}
      {selectedTool === 'json-format' && (
        <div className="mt-3">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            JSON字符串
          </label>
          <textarea
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="请粘贴需要格式化的JSON字符串..."
            rows={6}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white font-mono text-sm"
          />
        </div>
      )}

      {/* 网页转Markdown限时提示 */}
      {selectedTool === 'web-to-markdown' && (
        <div className="bg-yellow-50 dark:bg-yellow-900 border border-yellow-200 dark:border-yellow-700 rounded-lg p-3">
          <div className="flex items-start">
            <div className="text-yellow-600 dark:text-yellow-400 mr-2 mt-0.5">⚠️</div>
            <div className="text-sm text-yellow-800 dark:text-yellow-200">
              <strong>限时免费接口：</strong>此API目前处于限时免费阶段，如果请求失败说明接口已被关闭。该接口能够智能提取网页内容并转换为高质量的Markdown格式。
            </div>
          </div>
        </div>
      )}

      {/* 无需输入的工具 */}
      {!currentConfig.inputRequired && (
        <div className="mb-6">
          <button
            onClick={callApi}
            disabled={loading}
            className="px-6 py-3 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 text-white rounded-lg transition-colors"
          >
            {loading ? '获取中...' : '获取数据'}
          </button>
        </div>
      )}

      {/* 错误信息 */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 dark:bg-red-900 border border-red-200 dark:border-red-700 rounded-lg">
          <div className="flex items-center">
            <div className="text-red-500 mr-2">❌</div>
            <div className="text-red-700 dark:text-red-300">{error}</div>
          </div>
        </div>
      )}

      {/* 结果显示 */}
      {result && (
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-3">
            查询结果
          </h3>
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 overflow-auto">
            {/* GitHub加速结果特殊显示 */}
            {selectedTool === 'github-accelerate' && result.success && (
              <div className="space-y-3">
                <div>
                  <span className="font-semibold text-gray-700 dark:text-gray-300">原始链接：</span>
                  <div className="text-sm text-gray-600 dark:text-gray-400 break-all">{result.original_url}</div>
                </div>
                <div>
                  <span className="font-semibold text-gray-700 dark:text-gray-300">加速链接：</span>
                  <div className="text-sm text-blue-600 dark:text-blue-400 break-all">
                    <a href={result.accelerated_url} target="_blank" rel="noopener noreferrer" className="hover:underline">
                      {result.accelerated_url}
                    </a>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => window.open(result.accelerated_url)}
                    className="px-3 py-1 bg-blue-500 hover:bg-blue-600 text-white text-sm rounded"
                  >
                    打开链接
                  </button>
                  <button
                    onClick={() => navigator.clipboard.writeText(result.accelerated_url)}
                    className="px-3 py-1 bg-gray-500 hover:bg-gray-600 text-white text-sm rounded"
                  >
                    复制链接
                  </button>
                </div>
              </div>
            )}
            {/* ASCII艺术字结果特殊显示 */}
            {selectedTool === 'ascii-art' && result.success && (
              <div className="space-y-3">
                <div>
                  <span className="font-semibold text-gray-700 dark:text-gray-300">原文：</span>
                  <span className="text-sm text-gray-600 dark:text-gray-400">{result.text}</span>
                </div>
                <div>
                  <span className="font-semibold text-gray-700 dark:text-gray-300">字体：</span>
                  <span className="text-sm text-gray-600 dark:text-gray-400">{result.font}</span>
                </div>
                <div className="bg-black p-4 rounded font-mono text-white text-xs overflow-x-auto">
                  <pre>{result.ascii_art}</pre>
                </div>
                <button
                  onClick={() => navigator.clipboard.writeText(result.ascii_art)}
                  className="px-3 py-1 bg-gray-500 hover:bg-gray-600 text-white text-sm rounded"
                >
                  复制ASCII艺术字
                </button>
              </div>
            )}
            {/* 蔬菜价格查询结果特殊显示 */}
            {selectedTool === 'vegetable-prices' && result.success && (
              <div className="space-y-4">
                {/* 统计信息 */}
                {result.statistics && (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
                    <div className="bg-blue-50 dark:bg-blue-900 p-3 rounded-lg text-center">
                      <div className="text-lg font-bold text-blue-600 dark:text-blue-400">{result.data.length}</div>
                      <div className="text-xs text-blue-800 dark:text-blue-300">记录数</div>
                    </div>
                    <div className="bg-green-50 dark:bg-green-900 p-3 rounded-lg text-center">
                      <div className="text-lg font-bold text-green-600 dark:text-green-400">¥{result.statistics.averagePrice}</div>
                      <div className="text-xs text-green-800 dark:text-green-300">平均价格</div>
                    </div>
                    <div className="bg-purple-50 dark:bg-purple-900 p-3 rounded-lg text-center">
                      <div className="text-lg font-bold text-purple-600 dark:text-purple-400">{result.statistics.vegetableTypes}</div>
                      <div className="text-xs text-purple-800 dark:text-purple-300">蔬菜种类</div>
                    </div>
                    <div className="bg-orange-50 dark:bg-orange-900 p-3 rounded-lg text-center">
                      <div className="text-lg font-bold text-orange-600 dark:text-orange-400">{result.statistics.markets}</div>
                      <div className="text-xs text-orange-800 dark:text-orange-300">市场数量</div>
                    </div>
                  </div>
                )}
                
                {/* 数据表格 */}
                <div className="overflow-x-auto">
                  <table className="w-full text-sm border-collapse">
                    <thead className="bg-gray-100 dark:bg-gray-800">
                      <tr>
                        <th className="border border-gray-300 dark:border-gray-600 px-3 py-2 text-left">蔬菜名称</th>
                        <th className="border border-gray-300 dark:border-gray-600 px-3 py-2 text-left">价格</th>
                        <th className="border border-gray-300 dark:border-gray-600 px-3 py-2 text-left">单位</th>
                        <th className="border border-gray-300 dark:border-gray-600 px-3 py-2 text-left">市场</th>
                        <th className="border border-gray-300 dark:border-gray-600 px-3 py-2 text-left">日期</th>
                      </tr>
                    </thead>
                    <tbody>
                      {result.data.map((item: any, index: number) => (
                        <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-600">
                          <td className="border border-gray-300 dark:border-gray-600 px-3 py-2 text-gray-800 dark:text-gray-200">{item.name}</td>
                          <td className="border border-gray-300 dark:border-gray-600 px-3 py-2 text-green-600 dark:text-green-400 font-semibold">¥{item.price}</td>
                          <td className="border border-gray-300 dark:border-gray-600 px-3 py-2 text-gray-600 dark:text-gray-400">{item.unit}</td>
                          <td className="border border-gray-300 dark:border-gray-600 px-3 py-2 text-gray-600 dark:text-gray-400 text-xs">{item.market}</td>
                          <td className="border border-gray-300 dark:border-gray-600 px-3 py-2 text-gray-600 dark:text-gray-400 text-xs">{item.date}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                
                {/* 分页信息 */}
                {result.pagination && (
                  <div className="text-xs text-gray-600 dark:text-gray-400 text-center">
                    第 {result.pagination.page} 页，每页 {result.pagination.limit} 条，共 {result.pagination.total} 条记录
                  </div>
                )}
                
                {/* 导出按钮 */}
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      const csvContent = [
                        '蔬菜名称,价格,单位,市场,日期',
                        ...result.data.map((item: any) => `${item.name},${item.price},${item.unit},${item.market},${item.date}`)
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
                    }}
                    className="px-3 py-1 bg-blue-500 hover:bg-blue-600 text-white text-sm rounded"
                  >
                    导出CSV
                  </button>
                </div>
              </div>
            )}
            {/* 默认JSON显示 */}
            {(!result.success || (selectedTool !== 'github-accelerate' && selectedTool !== 'ascii-art' && selectedTool !== 'vegetable-prices')) && (
              <pre className="text-sm text-gray-800 dark:text-gray-200 whitespace-pre-wrap">
                {formatJson(result)}
              </pre>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ApiTools;
