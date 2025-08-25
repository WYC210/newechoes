import type { APIRoute } from 'astro';

// 添加服务器渲染标记
export const prerender = false;

export const GET: APIRoute = async ({ request }) => {
  try {
    const url = new URL(request.url);
    const ip = url.searchParams.get('ip') || '123.181.200.244';

    console.log(`测试原始响应，IP: ${ip}`);
    
    // 直接调用太平洋IP查询API，不做任何处理
    const apiUrl = `http://whois.pconline.com.cn/ipJson.jsp?ip=${ip}&json=true`;
    
    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.8'
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    // 获取原始文本，不做任何编码处理
    const rawText = await response.text();
    console.log('原始响应文本:', rawText);

    // 尝试提取JSONP中的JSON部分
    let jsonData = null;
    if (rawText.includes('IPCallBack')) {
      const jsonMatch = rawText.match(/IPCallBack\((.+)\)/);
      if (jsonMatch && jsonMatch[1]) {
        try {
          jsonData = JSON.parse(jsonMatch[1]);
          console.log('解析后的JSON:', jsonData);
        } catch (e) {
          console.error('JSON解析失败:', e);
        }
      }
    }

    // 返回多种格式的数据供比较
    const result = {
      test_info: '直接返回原始响应，不做任何编码处理',
      ip: ip,
      raw_text: rawText,
      parsed_json: jsonData,
      response_headers: {
        'content-type': response.headers.get('content-type'),
        'content-encoding': response.headers.get('content-encoding'),
        'charset': response.headers.get('charset')
      }
    };

    return new Response(JSON.stringify(result, null, 2), {
      status: 200,
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type'
      }
    });

  } catch (error) {
    console.error('测试API错误:', error);
    
    return new Response(JSON.stringify({
      error: '测试失败',
      message: error instanceof Error ? error.message : '未知错误'
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'Access-Control-Allow-Origin': '*'
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
