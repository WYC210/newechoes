import React, { useState, useEffect } from 'react';

interface JwtData {
    header: any;
    payload: any;
    signature: string;
}

const JwtDecoder: React.FC = () => {
    const [jwtToken, setJwtToken] = useState('');
    const [jwtData, setJwtData] = useState<JwtData | null>(null);
    const [error, setError] = useState('');

    // 解析 JWT Token
    const decodeJwt = (token: string) => {
        setError('');
        setJwtData(null);

        if (!token.trim()) {
            setError('请输入JWT Token');
            return;
        }

        try {
            const parts = token.trim().split('.');

            if (parts.length !== 3) {
                setError('无效的JWT格式，JWT应该包含3个部分（header.payload.signature）');
                return;
            }

            // 解析 Header
            const header = JSON.parse(atob(parts[0].replace(/-/g, '+').replace(/_/g, '/')));

            // 解析 Payload
            const payload = JSON.parse(atob(parts[1].replace(/-/g, '+').replace(/_/g, '/')));

            // 保存原始签名
            const signature = parts[2];

            setJwtData({
                header,
                payload,
                signature,
            });
        } catch (err) {
            setError('JWT解析失败：' + (err instanceof Error ? err.message : '未知错误'));
        }
    };

    // 加载示例
    const loadSample = () => {
        const sampleToken =
            'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpbmZvIjp7InV1aWQiOiI1NDEzMjA4ODIyMTYyODc3OTgiLCJzZXNzaW9uX2lkIjoiZjA1NGIxMjQtZTZmNy00NGM1LTk2NmUtMzdiNWVhMDc4Y2M3IiwidGVhbV9pZCI6OX0sImV4cCI6MTc1MDgxNjExNX0.-EkJqr10jm_YmkMc0pmjuIq-hV51dthXOaJ0ClpUWsQ';
        setJwtToken(sampleToken);
        decodeJwt(sampleToken);
    };

    // 清空所有
    const clearAll = () => {
        setJwtToken('');
        setJwtData(null);
        setError('');
    };

    // 自动解析（当输入变化时）
    const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const token = e.target.value;
        setJwtToken(token);

        if (token.trim() && token.split('.').length === 3) {
            // 延迟解析，避免频繁解析
            setTimeout(() => decodeJwt(token), 500);
        } else if (!token.trim()) {
            setJwtData(null);
            setError('');
        }
    };

    return (
        <div className="flex flex-col h-full w-full bg-white dark:bg-gray-800">
            {/* 顶部：标签导航 */}
            <div className="flex justify-between items-stretch h-7 flex-shrink-0 bg-gray-50 dark:bg-gray-700">
                <div className="flex items-stretch">
                    <button
                        className="px-2.5 text-xs border-l border-r border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-600 transition-all"
                        onClick={loadSample}
                        title="示例"
                    >
                        示例
                    </button>
                </div>
                <div className="flex items-center">
                    <button
                        className="px-2.5 text-xs border-l border-r border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-600 transition-all"
                        onClick={clearAll}
                        title="清空"
                    >
                        × 清空
                    </button>
                </div>
            </div>

            {/* 底部：内容区域 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-1 p-4">
                {/* 输入区域 */}
                <div className="border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900">
                    <textarea
                        value={jwtToken}
                        onChange={handleInputChange}
                        placeholder="粘贴JWT Token..."
                        className="w-full h-full p-3 border-none outline-none font-mono text-xs leading-relaxed resize-none bg-transparent text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500"
                        autoComplete="off"
                        spellCheck="false"
                    />
                </div>

                {/* 输出区域 */}
                <div className="border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 overflow-auto">
                    {error ? (
                        <div className="flex items-center gap-3 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg m-4">
                            <div className="text-xl">⚠️</div>
                            <div className="text-xs text-red-600 dark:text-red-400 font-medium">{error}</div>
                        </div>
                    ) : jwtData ? (
                        <div className="p-3">
                            <pre className="font-mono text-xs leading-relaxed text-gray-900 dark:text-gray-100 whitespace-pre-wrap break-words">
                                {JSON.stringify(jwtData, null, 2)}
                            </pre>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center h-full gap-3 text-gray-400 dark:text-gray-500">
                            <div className="text-5xl opacity-50">🔍</div>
                            <div className="text-xs font-medium">输入JWT Token开始解析</div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default JwtDecoder;
