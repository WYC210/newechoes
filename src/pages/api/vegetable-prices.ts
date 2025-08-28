import type { APIRoute } from 'astro';

export const prerender = false;

interface VegetablePrice {
  name: string;
  price: string;
  unit: string;
  market: string;
  date: string;
}

export const GET: APIRoute = async ({ request }) => {
  try {
    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get('page') || '1');
    const limit = parseInt(url.searchParams.get('limit') || '20');
    const market = url.searchParams.get('market') || '';

    // 获取访问者的UA 
    const clientUserAgent = request.headers.get('User-Agent');
    const userAgent = clientUserAgent || "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/129.0.0.0 Safari/537.36 Edg/129.0.0.0";

    // 定义不同市场的API配置
    const marketConfigs = [
      {
        name: '新发地',
        fullName: '新发地批发市场',
        url: 'http://www.xinfadi.com.cn/getPriceData.html',
        headers: {
          "User-Agent": userAgent,
          "Content-Type": "application/x-www-form-urlencoded",
          "Accept": "application/json, text/javascript, */*; q=0.01",
          "Accept-Language": "zh-CN,zh;q=0.9,en;q=0.8",
          "Accept-Encoding": "gzip, deflate",
          "Connection": "keep-alive",
          "Referer": "http://www.xinfadi.com.cn/marketanalysis/0/list/1.shtml"
        }
      },
      {
        name: '大洋路',
        fullName: '大洋路农产品批发市场',
        url: 'https://www.dlync.com/market/getPriceData',
        headers: {
          "User-Agent": userAgent,
          "Content-Type": "application/json",
          "Accept": "application/json",
          "Referer": "https://www.dlync.com/market"
        }
      },
      {
        name: '岳各庄',
        fullName: '岳各庄批发市场',
        url: 'https://www.ygznc.com/api/market/prices',
        headers: {
          "User-Agent": userAgent,
          "Content-Type": "application/json",
          "Accept": "application/json",
          "Referer": "https://www.ygznc.com/market"
        }
      },
      {
        name: '锦绣大地',
        fullName: '锦绣大地农产品批发市场',
        url: 'https://www.jxdadi.com/market/api/prices',
        headers: {
          "User-Agent": userAgent,
          "Content-Type": "application/json",
          "Accept": "application/json",
          "Referer": "https://www.jxdadi.com/market"
        }
      },
      {
        name: '水屯',
        fullName: '水屯农副产品批发市场',
        url: 'https://www.stncp.com/api/prices',
        headers: {
          "User-Agent": userAgent,
          "Content-Type": "application/json",
          "Accept": "application/json",
          "Referer": "https://www.stncp.com/market"
        }
      },
      {
        name: '八里桥',
        fullName: '八里桥农产品批发市场',
        url: 'https://www.blqnc.com/market/api/data',
        headers: {
          "User-Agent": userAgent,
          "Content-Type": "application/json",
          "Accept": "application/json",
          "Referer": "https://www.blqnc.com/market"
        }
      },
      {
        name: '城北回龙观',
        fullName: '城北回龙观农产品批发市场',
        url: 'https://www.cblhg.com/api/market/prices',
        headers: {
          "User-Agent": userAgent,
          "Content-Type": "application/json",
          "Accept": "application/json",
          "Referer": "https://www.cblhg.com/market"
        }
      },
      {
        name: '京深海鲜',
        fullName: '京深海鲜批发市场',
        url: 'https://www.jshx.com/seafood/api/prices',
        headers: {
          "User-Agent": userAgent,
          "Content-Type": "application/json",
          "Accept": "application/json",
          "Referer": "https://www.jshx.com/seafood"
        }
      },
      {
        name: '顺义石门',
        fullName: '顺义石门农产品批发市场',
        url: 'https://www.symnc.com/api/prices',
        headers: {
          "User-Agent": userAgent,
          "Content-Type": "application/json",
          "Accept": "application/json",
          "Referer": "https://www.symnc.com/market"
        }
      },
      {
        name: '昌平水屯',
        fullName: '昌平水屯农副产品批发市场',
        url: 'https://www.cpstnc.com/market/api/data',
        headers: {
          "User-Agent": userAgent,
          "Content-Type": "application/json",
          "Accept": "application/json",
          "Referer": "https://www.cpstnc.com/market"
        }
      },
      {
        name: '通州八里桥',
        fullName: '通州八里桥农产品批发市场',
        url: 'https://www.tzblq.com/api/market/prices',
        headers: {
          "User-Agent": userAgent,
          "Content-Type": "application/json",
          "Accept": "application/json",
          "Referer": "https://www.tzblq.com/market"
        }
      },
      {
        name: '朝阳大洋路',
        fullName: '朝阳大洋路农副产品批发市场',
        url: 'https://www.cydly.com/market/api/data',
        headers: {
          "User-Agent": userAgent,
          "Content-Type": "application/json",
          "Accept": "application/json",
          "Referer": "https://www.cydly.com/market"
        }
      },
      {
        name: '海淀清河',
        fullName: '海淀清河农产品批发市场',
        url: 'https://www.hdqhnc.com/api/prices',
        headers: {
          "User-Agent": userAgent,
          "Content-Type": "application/json",
          "Accept": "application/json",
          "Referer": "https://www.hdqhnc.com/market"
        }
      },
      {
        name: '丰台新发地',
        fullName: '丰台新发地农产品批发市场',
        url: 'https://www.ftxfd.com/market/api/prices',
        headers: {
          "User-Agent": userAgent,
          "Content-Type": "application/json",
          "Accept": "application/json",
          "Referer": "https://www.ftxfd.com/market"
        }
      },
      {
        name: '房山良乡',
        fullName: '房山良乡农产品批发市场',
        url: 'https://www.fslxnc.com/api/market/data',
        headers: {
          "User-Agent": userAgent,
          "Content-Type": "application/json",
          "Accept": "application/json",
          "Referer": "https://www.fslxnc.com/market"
        }
      }
    ];

    let allData: VegetablePrice[] = [];
    let realDataFound = false;

    try {
      // 根据市场筛选决定要查询的市场
      const targetMarkets = market 
        ? marketConfigs.filter(config => config.name === market || config.fullName.includes(market))
        : marketConfigs;

      // 逐个尝试获取真实数据
      for (const marketConfig of targetMarkets) {
        try {
          let response;
          let data;

          if (marketConfig.name === '新发地') {
            // 新发地使用特殊的POST请求
            const formData = new URLSearchParams({
              "limit": String(limit),
              "current": String(page),
              "pubDateStartTime": "",
              "pubDateEndTime": "",
              "prodPcatid": "",
              "prodCatid": "",
              "prodName": ""
            });

            response = await fetch(marketConfig.url, {
              method: 'POST',
              headers: marketConfig.headers,
              body: formData.toString()
            });

            if (response.ok) {
              data = await response.json();
              
              if (data.list && Array.isArray(data.list) && data.list.length > 0) {
                // 处理新发地数据
                const marketData: VegetablePrice[] = data.list.map((item: any) => ({
                  name: item.prodName || '未知蔬菜',
                  price: item.lowPrice || '0.00',
                  unit: item.unitInfo || '斤',
                  market: marketConfig.fullName,
                  date: item.pubDate ? new Date(item.pubDate).toLocaleDateString('zh-CN') : new Date().toLocaleDateString('zh-CN')
                }));
                
                allData = allData.concat(marketData);
                realDataFound = true;
              }
            }
          } else {
            // 其他市场使用GET请求
            response = await fetch(`${marketConfig.url}?page=${page}&limit=${limit}`, {
              method: 'GET',
              headers: marketConfig.headers
            });

            if (response.ok) {
              data = await response.json();
              
              if (data.data && Array.isArray(data.data) && data.data.length > 0) {
                // 处理其他市场数据
                const marketData: VegetablePrice[] = data.data.map((item: any) => ({
                  name: item.name || item.productName || '未知蔬菜',
                  price: item.price || item.lowPrice || '0.00',
                  unit: item.unit || item.unitInfo || '斤',
                  market: marketConfig.fullName,
                  date: item.date || item.updateTime ? new Date(item.date || item.updateTime).toLocaleDateString('zh-CN') : new Date().toLocaleDateString('zh-CN')
                }));
                
                allData = allData.concat(marketData);
                realDataFound = true;
              }
            }
          }
        } catch (marketError) {
          console.log(`${marketConfig.fullName} 数据获取失败:`, marketError);
          // 继续尝试下一个市场
        }
      }

      // 如果获取到了真实数据，进行处理和返回
      if (realDataFound && allData.length > 0) {
        // 去重处理（同一个市场的同一种蔬菜取平均价格）
        const groupedData = new Map();
        allData.forEach(item => {
          const key = `${item.market}-${item.name}`;
          if (groupedData.has(key)) {
            const existing = groupedData.get(key);
            const existingPrice = parseFloat(existing.price);
            const newPrice = parseFloat(item.price);
            existing.price = ((existingPrice + newPrice) / 2).toFixed(2);
          } else {
            groupedData.set(key, { ...item });
          }
        });

        const uniqueData = Array.from(groupedData.values());
        
        // 按页数和限制进行分页
        const startIndex = (page - 1) * limit;
        const endIndex = startIndex + limit;
        const paginatedData = uniqueData.slice(startIndex, endIndex);

        // 计算统计信息
        const avgPrice = paginatedData.reduce((sum, item) => sum + parseFloat(item.price), 0) / paginatedData.length;
        const priceRange = {
          min: Math.min(...paginatedData.map(item => parseFloat(item.price))),
          max: Math.max(...paginatedData.map(item => parseFloat(item.price)))
        };

        const response = {
          success: true,
          data: paginatedData,
          pagination: {
            page: page,
            limit: limit,
            total: uniqueData.length
          },
          statistics: {
            averagePrice: avgPrice.toFixed(2),
            priceRange: priceRange,
            vegetableTypes: new Set(paginatedData.map(item => item.name)).size,
            markets: new Set(paginatedData.map(item => item.market)).size
          },
          updateTime: new Date().toISOString(),
          source: 'real_data',
          marketsQueried: targetMarkets.map(m => m.fullName)
        };

        return new Response(JSON.stringify(response), {
          status: 200,
          headers: {
            'Content-Type': 'application/json',
            'Cache-Control': 'no-store, max-age=0'
          }
        });
      }
    } catch (realDataError) {
      console.log('所有真实数据获取失败，使用模拟数据:', realDataError);
    }

    // 如果真实数据获取失败，使用模拟数据作为备用
    const vegetables = [
      '白菜', '萝卜', '胡萝卜', '土豆', '洋葱', '西红柿', '黄瓜', '茄子', 
      '青椒', '韭菜', '菠菜', '芹菜', '生菜', '豆角', '冬瓜', '南瓜',
      '丝瓜', '苦瓜', '西葫芦', '花菜', '西兰花', '包菜', '油菜', '小白菜',
      '茭白', '莴笋', '竹笋', '莲藕', '山药', '芋头', '生姜', '大蒜',
      '黄豆芽', '绿豆芽', '平菇', '香菇', '金针菇', '木耳', '银耳', '紫菜'
    ];

    const markets = marketConfigs.map(config => config.fullName);

    const units = ['斤', '公斤', '袋', '个'];

    // 过滤市场
    const filteredMarkets = market 
      ? markets.filter(m => m.includes(market))
      : markets;

    // 生成数据
    const data: VegetablePrice[] = [];
    const startIndex = (page - 1) * limit;

    for (let i = 0; i < limit; i++) {
      const vegIndex = (startIndex + i) % vegetables.length;
      const vegetable = vegetables[vegIndex];
      const marketIndex = Math.floor(Math.random() * filteredMarkets.length);
      const selectedMarket = filteredMarkets[marketIndex];
      
      // 基础价格根据蔬菜类型设定
      const basePrices: { [key: string]: number } = {
        '白菜': 1.5, '萝卜': 2.0, '胡萝卜': 3.0, '土豆': 2.5, '洋葱': 2.8,
        '西红柿': 4.0, '黄瓜': 3.5, '茄子': 3.8, '青椒': 4.2, '韭菜': 5.0,
        '菠菜': 6.0, '芹菜': 3.2, '生菜': 4.5, '豆角': 8.0, '冬瓜': 2.0,
        '南瓜': 3.0, '丝瓜': 5.5, '苦瓜': 6.5, '西葫芦': 3.8, '花菜': 5.2,
        '西兰花': 7.0, '包菜': 2.2, '油菜': 4.8, '小白菜': 5.5, '茭白': 8.5,
        '莴笋': 4.2, '竹笋': 12.0, '莲藕': 6.8, '山药': 9.0, '芋头': 4.5,
        '生姜': 15.0, '大蒜': 8.0, '黄豆芽': 2.5, '绿豆芽': 2.8, '平菇': 6.0,
        '香菇': 12.0, '金针菇': 8.5, '木耳': 25.0, '银耳': 30.0, '紫菜': 18.0
      };

      const basePrice = basePrices[vegetable] || 4.0;
      const variation = (Math.random() - 0.5) * 1.0; // ±0.5元变化
      const price = Math.max(0.5, basePrice + variation).toFixed(2);

      data.push({
        name: vegetable,
        price: price,
        unit: units[Math.floor(Math.random() * units.length)],
        market: selectedMarket,
        date: new Date().toLocaleDateString('zh-CN')
      });
    }

    // 计算统计信息
    const avgPrice = data.reduce((sum, item) => sum + parseFloat(item.price), 0) / data.length;
    const priceRange = {
      min: Math.min(...data.map(item => parseFloat(item.price))),
      max: Math.max(...data.map(item => parseFloat(item.price)))
    };

    const response = {
      success: true,
      data: data,
      pagination: {
        page: page,
        limit: limit,
        total: vegetables.length * filteredMarkets.length
      },
      statistics: {
        averagePrice: avgPrice.toFixed(2),
        priceRange: priceRange,
        vegetableTypes: new Set(data.map(item => item.name)).size,
        markets: new Set(data.map(item => item.market)).size
      },
      updateTime: new Date().toISOString(),
      source: 'mock_data',
      marketsQueried: market ? [marketConfigs.find(m => m.name === market || m.fullName.includes(market))?.fullName || market].filter(Boolean) : markets
    };

    return new Response(JSON.stringify(response), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-store, max-age=0'
      }
    });

  } catch (error) {
    console.error('蔬菜价格API错误:', error);
    return new Response(JSON.stringify({ 
      success: false, 
      error: '获取蔬菜价格数据失败',
      details: error instanceof Error ? error.message : '未知错误'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};