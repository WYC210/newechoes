import type { APIRoute } from 'astro';

export const prerender = false;

const REQUEST_TIMEOUT = 10000;

async function fetchWithTimeout(url: string, options: RequestInit, timeoutMs: number) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal
    });
    clearTimeout(timeout);
    return response;
  } catch (error) {
    clearTimeout(timeout);
    throw error;
  }
}

function normalizeIp(ip: string | null): string | null {
  if (!ip) return null;
  let value = ip.trim();

  if (value.startsWith('::ffff:')) {
    value = value.slice(7);
  }

  if (value.startsWith('[') && value.endsWith(']')) {
    value = value.slice(1, -1);
  }

  if (value.includes('.') && value.includes(':')) {
    value = value.split(':')[0];
  }

  return value || null;
}

function getClientIp(request: Request): string | null {
  const xForwardedFor = request.headers.get('x-forwarded-for');
  if (xForwardedFor) {
    const first = xForwardedFor.split(',')[0];
    const normalized = normalizeIp(first);
    if (normalized) return normalized;
  }

  const realIp = normalizeIp(request.headers.get('x-real-ip'));
  if (realIp) return realIp;

  const cfIp = normalizeIp(
    request.headers.get('cf-connecting-ip') || request.headers.get('true-client-ip')
  );
  if (cfIp) return cfIp;

  const forwarded = request.headers.get('forwarded');
  if (forwarded) {
    const match = forwarded.match(/for=([^;]+)/i);
    if (match && match[1]) {
      const normalized = normalizeIp(match[1].replace(/"/g, ''));
      if (normalized) return normalized;
    }
  }

  return null;
}

function isIpAddress(value: string): boolean {
  const v = value.trim();

  const ipv4Regex =
    /^(25[0-5]|2[0-4]\d|1?\d{1,2})\.(25[0-5]|2[0-4]\d|1?\d{1,2})\.(25[0-5]|2[0-4]\d|1?\d{1,2})\.(25[0-5]|2[0-4]\d|1?\d{1,2})$/;
  if (ipv4Regex.test(v)) return true;

  if (v.includes(':')) {
    return true;
  }

  return false;
}

function extractFirstIpv4(value: any): string | null {
  const ipv4Pattern =
    /\b(25[0-5]|2[0-4]\d|1?\d{1,2})\.(25[0-5]|2[0-4]\d|1?\d{1,2})\.(25[0-5]|2[0-4]\d|1?\d{1,2})\.(25[0-5]|2[0-4]\d|1?\d{1,2})\b/;

  if (typeof value === 'string') {
    const match = value.match(ipv4Pattern);
    return match ? match[0] : null;
  }

  if (Array.isArray(value)) {
    for (const item of value) {
      const ip = extractFirstIpv4(item);
      if (ip) return ip;
    }
    return null;
  }

  if (value && typeof value === 'object') {
    for (const key of Object.keys(value)) {
      const ip = extractFirstIpv4((value as any)[key]);
      if (ip) return ip;
    }
  }

  return null;
}

async function resolveInputToIp(input: string): Promise<string | null> {
  const trimmed = input.trim();

  if (!trimmed) {
    return null;
  }

  if (isIpAddress(trimmed)) {
    return trimmed;
  }

  let domain = trimmed;
  try {
    if (/^https?:\/\//i.test(trimmed)) {
      const url = new URL(trimmed);
      domain = url.hostname;
    }
  } catch {
    // ignore parse errors
  }

  try {
    const dnsUrl = `https://uapis.cn/api/v1/network/dns?domain=${encodeURIComponent(
      domain
    )}&type=A`;
    const response = await fetchWithTimeout(
      dnsUrl,
      {
        method: 'GET',
        headers: {
          'User-Agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
          'Accept': 'application/json, text/plain, */*',
          'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.8'
        }
      },
      REQUEST_TIMEOUT
    );

    if (!response.ok) {
      return null;
    }

    const data = await response.json();
    const ip = extractFirstIpv4(data);

    return ip || null;
  } catch {
    return null;
  }
}

export const GET: APIRoute = async ({ request }) => {
  try {
    const url = new URL(request.url);
    const ipParam = url.searchParams.get('ip');
    const ipInput = ipParam?.trim() || null;
    let ip: string | null = null;

    if (ipInput && ipInput.toLowerCase() !== 'auto') {
      const resolved = await resolveInputToIp(ipInput);
      ip = resolved || ipInput;
    } else {
      ip = getClientIp(request);
    }

    const preferredSource = url.searchParams.get('source') || 'auto';

    const ipinfoUrl = ip ? `https://ipinfo.io/${ip}/json` : 'https://ipinfo.io/json';
    const pconlineUrl = ip
      ? `http://whois.pconline.com.cn/ipJson.jsp?ip=${ip}&json=true`
      : 'http://whois.pconline.com.cn/ipJson.jsp?json=true';

    let apiSources = [
      {
        name: 'IPInfo.io',
        url: ipinfoUrl,
        type: 'json' as const,
        description: '国际 IP 查询服务，返回英文地理信息，无编码问题'
      },
      {
        name: '太平洋IP查询',
        url: pconlineUrl,
        type: 'jsonp' as const,
        description: '国内 IP 查询服务，返回中文地理信息，但存在编码问题'
      }
    ];

    if (preferredSource === 'pconline') {
      apiSources = [apiSources[1], apiSources[0]];
    } else if (preferredSource === 'ipinfo') {
      apiSources = [apiSources[0]];
    }

    let lastError: Error | null = null;

    for (const source of apiSources) {
      try {
        const response = await fetchWithTimeout(
          source.url,
          {
            method: 'GET',
            headers: {
              'User-Agent':
                'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
              'Accept': 'application/json, text/plain, */*',
              'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.8'
            }
          },
          REQUEST_TIMEOUT
        );

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }

        let data: any;
        let textContent: string;

        if (source.name === '太平洋IP查询') {
          const arrayBuffer = await response.arrayBuffer();
          const decoder = new TextDecoder('gbk');
          textContent = decoder.decode(arrayBuffer);
        } else {
          textContent = await response.text();
        }

        if (source.type === 'jsonp' && textContent.includes('IPCallBack')) {
          const jsonMatch = textContent.match(/IPCallBack\((.+)\)/);
          if (jsonMatch && jsonMatch[1]) {
            data = JSON.parse(jsonMatch[1]);
          } else {
            throw new Error('JSONP 格式解析失败');
          }
        } else {
          data = JSON.parse(textContent);
        }

        const result = {
          ip: data.ip || ip,
          country: data.country || data.country_name || '中国',
          region: data.region || data.pro || data.region_name || '',
          city: data.city || data.city || '',
          isp: data.org || data.addr || '',
          source: source.name,
          source_description: source.description,
          encoding_fixed: source.name === '太平洋IP查询',
          available_sources: apiSources.map((s) => ({
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
        lastError = error instanceof Error ? error : new Error('未知错误');
        continue;
      }
    }

    return new Response(
      JSON.stringify({
        error: '所有 IP 查询源都不可用',
        message: lastError?.message || '请稍后重试',
        ip
      }),
      {
        status: 502,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type'
        }
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({
        error: '服务器内部错误',
        message: error instanceof Error ? error.message : '未知错误'
      }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type'
        }
      }
    );
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

