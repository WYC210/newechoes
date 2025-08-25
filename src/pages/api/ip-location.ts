import type { APIRoute } from 'astro';

// 添加服务器渲染标记
export const prerender = false;

// 请求配置常量
const REQUEST_TIMEOUT = 10000; // 请求超时时间（毫秒）

// 带超时的 fetch 函数
async function fetchWithTimeout(url: string, options: RequestInit, timeoutMs: number) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
    });
    clearTimeout(timeout);
    return response;
  } catch (error) {
    clearTimeout(timeout);
    throw error;
  }
}

// 注意：太平洋IP查询API返回GBK编码的内容，需要特殊处理

export const GET: APIRoute = async ({ request }) => {
  try {
    const url = new URL(request.url);
    const ip = url.searchParams.get('ip');

    if (!ip) {
      return new Response(JSON.stringify({ 
        error: '缺少IP参数',
        message: '请提供ip参数'
      }), {
        status: 400,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type'
        }
      });
    }

    // 获取用户偏好的API源
    const preferredSource = url.searchParams.get('source') || 'auto';

    // 定义API源（按优先级排序）
    let apiSources = [
      {
        name: 'IPInfo.io',
        url: `https://ipinfo.io/${ip}/json`,
        type: 'json',
        description: '国际IP查询服务，返回英文地理信息，无编码问题'
      },
      {
        name: '太平洋IP查询',
        url: `http://whois.pconline.com.cn/ipJson.jsp?ip=${ip}&json=true`,
        type: 'jsonp',
        description: '国内IP查询服务，返回中文地理信息，但存在编码问题'
      }
    ];

    // 如果用户指定了特定的API源
    if (preferredSource === 'pconline') {
      apiSources = [apiSources[1], apiSources[0]]; // 优先使用太平洋
    } else if (preferredSource === 'ipinfo') {
      apiSources = [apiSources[0]]; // 只使用IPInfo.io
    }

    let lastError: Error | null = null;

    for (const source of apiSources) {
      try {
        console.log(`尝试API源: ${source.name}`);

        const response = await fetchWithTimeout(source.url, {
          method: 'GET',
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
            'Accept': 'application/json, text/plain, */*',
            'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.8'
          }
        }, REQUEST_TIMEOUT);

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }

        let data: any;
        let textContent: string;

        // 特殊处理太平洋IP查询的GBK编码
        if (source.name === '太平洋IP查询') {
          // 获取原始字节数据
          const arrayBuffer = await response.arrayBuffer();
          // 使用GBK解码器解码
          const decoder = new TextDecoder('gbk');
          textContent = decoder.decode(arrayBuffer);
          console.log('GBK解码后的内容:', textContent);
        } else {
          textContent = await response.text();
        }

        if (source.type === 'jsonp' && textContent.includes('IPCallBack')) {
          // 处理JSONP响应
          const jsonMatch = textContent.match(/IPCallBack\((.+)\)/);
          if (jsonMatch && jsonMatch[1]) {
            data = JSON.parse(jsonMatch[1]);
            // GBK解码已经处理了中文编码问题，无需额外修复
          } else {
            throw new Error('JSONP格式解析失败');
          }
        } else {
          // 处理JSON响应
          data = JSON.parse(textContent);
        }

        // 统一返回格式
        const result = {
          ip: data.ip || ip,
          country: data.country || data.country_name || '中国',
          region: data.region || data.pro || data.region_name || '',
          city: data.city || data.city || '',
          isp: data.org || data.addr || '',
          source: source.name,
          source_description: source.description,
          encoding_fixed: source.name === '太平洋IP查询', // 标识是否使用了GBK解码
          available_sources: apiSources.map(s => ({
            name: s.name,
            description: s.description,
            url_param: s.name === 'IPInfo.io' ? 'ipinfo' : 'pconline'
          })),
          raw: data
        };

        return new Response(JSON.stringify(result), {
          status: 200,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type'
          }
        });

      } catch (error) {
        console.error(`API源 ${source.name} 失败:`, error);
        lastError = error instanceof Error ? error : new Error('未知错误');
        continue;
      }
    }

    // 所有API都失败了
    return new Response(JSON.stringify({
      error: '所有IP查询源都不可用',
      message: lastError?.message || '请稍后重试',
      ip: ip
    }), {
      status: 502,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type'
      }
    });

  } catch (error) {
    console.error('IP查询服务错误:', error);
    
    return new Response(JSON.stringify({
      error: '服务器内部错误',
      message: error instanceof Error ? error.message : '未知错误'
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type'
      }
    });
  }
};

export const OPTIONS: APIRoute = async () => {
  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type'
    }
  });
};
