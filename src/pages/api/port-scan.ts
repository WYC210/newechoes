import type { APIRoute } from 'astro';

// 添加服务器渲染标记
export const prerender = false;

// 常见端口列表
const COMMON_PORTS = [
  { port: 21, service: 'FTP', description: 'File Transfer Protocol' },
  { port: 22, service: 'SSH', description: 'Secure Shell' },
  { port: 23, service: 'Telnet', description: 'Telnet Protocol' },
  { port: 25, service: 'SMTP', description: 'Simple Mail Transfer Protocol' },
  { port: 53, service: 'DNS', description: 'Domain Name System' },
  { port: 80, service: 'HTTP', description: 'HyperText Transfer Protocol' },
  { port: 110, service: 'POP3', description: 'Post Office Protocol v3' },
  { port: 143, service: 'IMAP', description: 'Internet Message Access Protocol' },
  { port: 443, service: 'HTTPS', description: 'HTTP Secure' },
  { port: 993, service: 'IMAPS', description: 'IMAP over SSL' },
  { port: 995, service: 'POP3S', description: 'POP3 over SSL' },
  { port: 1433, service: 'MSSQL', description: 'Microsoft SQL Server' },
  { port: 3306, service: 'MySQL', description: 'MySQL Database' },
  { port: 3389, service: 'RDP', description: 'Remote Desktop Protocol' },
  { port: 5432, service: 'PostgreSQL', description: 'PostgreSQL Database' },
  { port: 6379, service: 'Redis', description: 'Redis Database' },
  { port: 8080, service: 'HTTP-Alt', description: 'HTTP Alternative' },
  { port: 8443, service: 'HTTPS-Alt', description: 'HTTPS Alternative' }
];

// 请求配置常量
const REQUEST_TIMEOUT = 3000; // 每个端口的超时时间（毫秒）
const MAX_CONCURRENT = 10; // 最大并发扫描数

// 带超时的端口检测函数
async function checkPort(host: string, port: number, timeoutMs: number): Promise<boolean> {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), timeoutMs);

    // 尝试连接到指定端口
    const response = await fetch(`http://${host}:${port}`, {
      method: 'HEAD',
      signal: controller.signal,
      mode: 'no-cors' // 避免CORS问题
    });

    clearTimeout(timeout);
    return true; // 如果能连接，说明端口开放
  } catch (error) {
    // 连接失败，端口可能关闭或被防火墙阻止
    return false;
  }
}

// 使用第三方API进行端口扫描
async function scanPortWithAPI(host: string, port: number): Promise<{ port: number; status: string; service?: string }> {
  try {
    const apiUrl = `https://uapis.cn/api/v1/network/portscan?host=${host}&port=${port}&protocol=tcp`;
    const proxyUrl = `/api/proxy?url=${encodeURIComponent(apiUrl)}`;
    
    const response = await fetch(proxyUrl);
    if (response.ok) {
      const data = await response.json();
      return {
        port: port,
        status: data.port_status || 'unknown',
        service: COMMON_PORTS.find(p => p.port === port)?.service
      };
    }
  } catch (error) {
    console.error(`扫描端口 ${port} 失败:`, error);
  }
  
  return {
    port: port,
    status: 'unknown',
    service: COMMON_PORTS.find(p => p.port === port)?.service
  };
}

// 批量扫描端口
async function scanPorts(host: string, ports: number[]): Promise<any[]> {
  const results: any[] = [];
  
  // 分批处理，避免过多并发请求
  for (let i = 0; i < ports.length; i += MAX_CONCURRENT) {
    const batch = ports.slice(i, i + MAX_CONCURRENT);
    const batchPromises = batch.map(port => scanPortWithAPI(host, port));
    
    try {
      const batchResults = await Promise.allSettled(batchPromises);
      
      batchResults.forEach((result, index) => {
        if (result.status === 'fulfilled') {
          results.push(result.value);
        } else {
          results.push({
            port: batch[index],
            status: 'error',
            service: COMMON_PORTS.find(p => p.port === batch[index])?.service,
            error: result.reason?.message || '扫描失败'
          });
        }
      });
    } catch (error) {
      console.error('批量扫描失败:', error);
    }
    
    // 添加小延迟，避免请求过于频繁
    if (i + MAX_CONCURRENT < ports.length) {
      await new Promise(resolve => setTimeout(resolve, 100));
    }
  }
  
  return results;
}

export const GET: APIRoute = async ({ request }) => {
  try {
    const url = new URL(request.url);
    const host = url.searchParams.get('host');
    const portsParam = url.searchParams.get('ports');
    const scanType = url.searchParams.get('type') || 'common'; // common, custom, all

    if (!host) {
      return new Response(JSON.stringify({ 
        error: '缺少主机参数',
        message: '请提供host参数'
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

    let portsToScan: number[] = [];

    if (scanType === 'custom' && portsParam) {
      // 自定义端口列表
      try {
        portsToScan = portsParam.split(',').map(p => parseInt(p.trim())).filter(p => p > 0 && p <= 65535);
      } catch (e) {
        return new Response(JSON.stringify({ 
          error: '端口参数格式错误',
          message: '端口参数应为逗号分隔的数字，如：80,443,8080'
        }), {
          status: 400,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
          }
        });
      }
    } else {
      // 使用常见端口
      portsToScan = COMMON_PORTS.map(p => p.port);
    }

    if (portsToScan.length === 0) {
      return new Response(JSON.stringify({ 
        error: '没有有效的端口需要扫描',
        message: '请提供有效的端口列表'
      }), {
        status: 400,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      });
    }

    console.log(`开始扫描主机 ${host} 的 ${portsToScan.length} 个端口...`);

    // 执行端口扫描
    const scanResults = await scanPorts(host, portsToScan);

    // 统计结果
    const openPorts = scanResults.filter(r => r.status === 'open');
    const closedPorts = scanResults.filter(r => r.status === 'closed');
    const unknownPorts = scanResults.filter(r => r.status === 'unknown' || r.status === 'error');

    // 构建返回结果
    const result = {
      host: host,
      scan_type: scanType,
      total_ports: portsToScan.length,
      scan_time: new Date().toISOString(),
      summary: {
        open: openPorts.length,
        closed: closedPorts.length,
        unknown: unknownPorts.length
      },
      open_ports: openPorts.map(p => ({
        port: p.port,
        service: p.service,
        description: COMMON_PORTS.find(cp => cp.port === p.port)?.description || 'Unknown service'
      })),
      all_results: scanResults.sort((a, b) => a.port - b.port)
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
    console.error('端口扫描服务错误:', error);
    
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
