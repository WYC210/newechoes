import React, { useState, useEffect } from 'react';

const UrlEncoder: React.FC = () => {
    const [currentMode, setCurrentMode] = useState<'encode' | 'decode'>('encode');
    const [rawText, setRawText] = useState('');
    const [result, setResult] = useState('');

    // 编码
    const encode = (text: string) => {
        try {
            if (!text.trim()) {
                setResult('');
                return;
            }
            setResult(encodeURIComponent(text));
        } catch (error) {
            setResult('编码失败');
        }
    };

    // 解码
    const decode = (text: string) => {
        try {
            if (!text.trim()) {
                setResult('');
                return;
            }
            setResult(decodeURIComponent(text));
        } catch (error) {
            setResult('解码失败：无效的编码字符串');
        }
    };

    // 自动转换
    const autoConvert = (text: string) => {
        if (currentMode === 'encode') {
            encode(text);
        } else {
            decode(text);
        }
    };

    // 处理输入变化
    const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const text = e.target.value;
        setRawText(text);
        autoConvert(text);
    };

    // 切换模式
    const handleModeChange = (mode: 'encode' | 'decode') => {
        setCurrentMode(mode);
        if (rawText) {
            if (mode === 'encode') {
                encode(rawText);
            } else {
                decode(rawText);
            }
        }
    };

    // 清空所有
    const clearAll = () => {
        setRawText('');
        setResult('');
    };

    return (
        <div className="flex flex-col h-full w-full bg-white dark:bg-gray-800">
            {/* 顶部：标签导航 */}
            <div className="flex justify-between items-stretch h-7 flex-shrink-0 bg-gray-50 dark:bg-gray-700">
                <div className="flex items-stretch">
                    <button
                        className={`px-2.5 text-xs border-l border-r border-gray-300 dark:border-gray-600 transition-all ${currentMode === 'encode'
                                ? 'bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 font-medium'
                                : 'bg-gray-50 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-600'
                            }`}
                        onClick={() => handleModeChange('encode')}
                    >
                        编码
                    </button>
                    <button
                        className={`px-2.5 text-xs border-r border-gray-300 dark:border-gray-600 transition-all ${currentMode === 'decode'
                                ? 'bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 font-medium'
                                : 'bg-gray-50 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-600'
                            }`}
                        onClick={() => handleModeChange('decode')}
                    >
                        解码
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
                        value={rawText}
                        onChange={handleInputChange}
                        placeholder="输入需要编码/解码的URL文本..."
                        className="w-full h-full p-3 border-none outline-none font-mono text-xs leading-relaxed resize-none bg-transparent text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500"
                        autoComplete="off"
                        spellCheck="false"
                    />
                </div>

                {/* 输出区域 */}
                <div className="border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900">
                    <textarea
                        value={result}
                        readOnly
                        placeholder="转换结果将显示在这里..."
                        className="w-full h-full p-3 border-none outline-none font-mono text-xs leading-relaxed resize-none bg-transparent text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500"
                        autoComplete="off"
                        spellCheck="false"
                    />
                </div>
            </div>
        </div>
    );
};

export default UrlEncoder;
