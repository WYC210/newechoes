import type { APIRoute } from 'astro';

// 添加服务器渲染标记
export const prerender = false;

// 允许的API域名列表（安全验证）
const ALLOWED_DOMAINS = [
  'whois.pconline.com.cn',
  'www.ipplus360.com',
  'ipinfo.io',
  'freegeoip.app',
  'uapis.cn',
  'v2.xxapi.cn'
];

// 请求配置常量
const REQUEST_TIMEOUT = 15000; // 请求超时时间（毫秒）

// 带超时的 fetch 函数
async function fetchWithTimeout(url: string, options: RequestInit, timeoutMs: number) {
  const controller = new AbortController();
  const timeoutSignal = controller.signal;

  // 设置超时
  const timeout = setTimeout(() => {
    controller.abort();
  }, timeoutMs);

  try {
    const response = await fetch(url, {
      ...options,
      signal: timeoutSignal,
    });
    clearTimeout(timeout);
    return response;
  } catch (error) {
    clearTimeout(timeout);
    throw error;
  }
}

// 验证URL是否在允许的域名列表中
function isAllowedDomain(url: string): boolean {
  try {
    const urlObj = new URL(url);
    return ALLOWED_DOMAINS.includes(urlObj.hostname);
  } catch {
    return false;
  }
}

// 修复中文编码问题的函数
function fixChineseEncoding(text: string): string {
  try {
    // 检查是否包含乱码字符
    if (text.includes('�')) {
      // 尝试多种编码修复方法

      // 方法1: 尝试从Latin-1转换为UTF-8
      try {
        // 将字符串转换为字节数组
        const bytes = new Uint8Array(text.length);
        for (let i = 0; i < text.length; i++) {
          bytes[i] = text.charCodeAt(i) & 0xFF;
        }

        // 尝试用UTF-8解码
        const decoder = new TextDecoder('utf-8', { fatal: false });
        const fixed = decoder.decode(bytes);
        if (!fixed.includes('�') && fixed !== text) {
          return fixed;
        }

        // 尝试用GBK解码（模拟）
        // 由于浏览器不直接支持GBK，我们使用映射表
        const gbkBytes = Array.from(bytes);
        let result = '';
        for (let i = 0; i < gbkBytes.length; i++) {
          const byte = gbkBytes[i];
          if (byte >= 0x81 && byte <= 0xFE && i + 1 < gbkBytes.length) {
            // 可能是GBK双字节字符
            const nextByte = gbkBytes[i + 1];
            if ((nextByte >= 0x40 && nextByte <= 0x7E) || (nextByte >= 0x80 && nextByte <= 0xFE)) {
              // 这是一个GBK字符，跳过处理
              result += String.fromCharCode(byte) + String.fromCharCode(nextByte);
              i++; // 跳过下一个字节
              continue;
            }
          }
          result += String.fromCharCode(byte);
        }

        if (result !== text) {
          return result;
        }
      } catch (e) {
        // 继续尝试其他方法
      }

      // 方法2: 尝试GBK到UTF-8的常见映射
      const gbkMappings: Record<string, string> = {
        // 河北省相关
        '�ӱ�ʡ': '河北省',
        '�ػʵ���': '秦皇岛市',
        '�ӱ�ʡ�ػʵ��� ����': '河北省秦皇岛市 电信',
        '��ʯׯ': '石家庄',
        '��̨': '唐山',
        '����': '邯郸',
        '����': '保定',
        '����': '沧州',
        '����': '廊坊',
        '����': '衡水',
        '����': '邢台',
        '����': '承德',
        '����': '张家口',

        // 运营商
        '����': '电信',
        '����': '联通',
        '�ƶ�': '移动',
        '����': '铁通',
        '����': '网通',

        // 主要城市
        '����': '北京',
        '�Ϻ�': '上海',
        '�㶫': '广东',
        '����': '深圳',
        '�㶫ʡ': '广东省',
        '����ʡ': '北京市',
        '�Ϻ�ʡ': '上海市',
        '����': '天津',
        '����': '重庆',
        '����': '杭州',
        '�Ͼ�': '南京',
        '����': '武汉',
        '�ɶ�': '成都',
        '����': '西安',
        '����': '青岛',
        '����': '大连',
        '����': '厦门',
        '����': '苏州',
        '����': '无锡',
        '����': '宁波',
        '����': '合肥',
        '����': '福州',
        '����': '济南',
        '����': '长沙',
        '����': '郑州',
        '����': '昆明',
        '����': '太原',
        '����': '长春',
        '����': '哈尔滨',
        '����': '沈阳',
        '����': '南昌',
        '����': '贵阳',
        '����': '兰州',
        '����': '西宁',
        '����': '银川',
        '����': '呼和浩特'
      };

      let result = text;
      for (const [garbled, correct] of Object.entries(gbkMappings)) {
        result = result.replace(new RegExp(garbled, 'g'), correct);
      }

      if (result !== text) {
        return result;
      }
    }

    return text;
  } catch (e) {
    console.error('编码修复失败:', e);
    return text;
  }
}

// 递归修复对象中的中文编码
function fixObjectEncoding(obj: any): any {
  if (typeof obj === 'string') {
    return fixChineseEncoding(obj);
  } else if (Array.isArray(obj)) {
    return obj.map(item => fixObjectEncoding(item));
  } else if (obj && typeof obj === 'object') {
    const fixed: any = {};
    for (const [key, value] of Object.entries(obj)) {
      fixed[key] = fixObjectEncoding(value);
    }
    return fixed;
  }
  return obj;
}

export const GET: APIRoute = async ({ request }) => {
  try {
    const url = new URL(request.url);
    const targetUrl = url.searchParams.get('url');

    if (!targetUrl) {
      return new Response(JSON.stringify({ 
        error: '缺少目标URL参数',
        message: '请提供url参数'
      }), {
        status: 400,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type'
        }
      });
    }

    // 验证域名安全性
    if (!isAllowedDomain(targetUrl)) {
      return new Response(JSON.stringify({ 
        error: '不允许的域名',
        message: '只能访问预定义的API域名'
      }), {
        status: 403,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type'
        }
      });
    }

    // 设置请求头
    const headers: Record<string, string> = {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/129.0.0.0 Safari/537.36',
      'Accept': 'application/json, text/plain, */*',
      'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.8',
      'Accept-Charset': 'utf-8',
      'Cache-Control': 'no-cache',
      'Pragma': 'no-cache'
    };

    // 发起代理请求
    const response = await fetchWithTimeout(targetUrl, {
      method: 'GET',
      headers
    }, REQUEST_TIMEOUT);

    // 获取响应内容
    const contentType = response.headers.get('content-type') || '';
    let responseData;

    if (contentType.includes('application/json')) {
      responseData = await response.json();
    } else if (contentType.includes('image/')) {
      // 对于图片类型，返回二进制数据
      const arrayBuffer = await response.arrayBuffer();
      return new Response(arrayBuffer, {
        status: response.status,
        headers: {
          'Content-Type': contentType,
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type'
        }
      });
    } else {
      // 获取文本内容，确保正确处理编码
      const textContent = await response.text();

      // 特殊处理太平洋IP查询的JSONP响应
      if (targetUrl.includes('pconline.com.cn') && textContent.includes('IPCallBack')) {
        // 提取JSONP中的JSON数据
        const jsonMatch = textContent.match(/IPCallBack\((.+)\)/);
        if (jsonMatch && jsonMatch[1]) {
          try {
            let jsonData = JSON.parse(jsonMatch[1]);
            // 修复中文编码问题
            jsonData = fixObjectEncoding(jsonData);
            responseData = jsonData;
          } catch (e) {
            responseData = { error: 'JSONP解析失败', raw: textContent };
          }
        } else {
          responseData = { error: 'JSONP格式不正确', raw: textContent };
        }
      } else {
        // 尝试解析为JSON
        try {
          let jsonData = JSON.parse(textContent);
          // 修复可能的中文编码问题
          jsonData = fixObjectEncoding(jsonData);
          responseData = jsonData;
        } catch {
          // 如果不是JSON，返回原文本（也尝试修复编码）
          responseData = { text: fixChineseEncoding(textContent) };
        }
      }
    }

    return new Response(JSON.stringify(responseData), {
      status: response.status,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type'
      }
    });

  } catch (error) {
    console.error('代理请求失败:', error);
    
    let errorMessage = '代理请求失败';
    let statusCode = 500;

    if (error instanceof Error) {
      if (error.name === 'AbortError' || error.message.includes('aborted')) {
        errorMessage = '请求超时';
        statusCode = 408;
      } else if (error.message.includes('fetch')) {
        errorMessage = '网络请求失败';
        statusCode = 502;
      } else {
        errorMessage = error.message;
      }
    }

    return new Response(JSON.stringify({
      error: errorMessage,
      message: '代理服务器无法完成请求'
    }), {
      status: statusCode,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
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
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type'
    }
  });
};
