import React, { useState } from 'react';

const NumberConverter: React.FC = () => {
    const [inputBase, setInputBase] = useState<'2' | '8' | '10' | '16'>('10');
    const [inputValue, setInputValue] = useState('');

    // 将输入转换为十进制数
    const parseInput = (value: string): number => {
        value = value.trim();
        // 移除常见的前缀
        if (value.startsWith('0x') || value.startsWith('0X')) {
            value = value.slice(2);
        } else if (value.startsWith('0b') || value.startsWith('0B')) {
            value = value.slice(2);
        } else if (value.startsWith('0o') || value.startsWith('0O')) {
            value = value.slice(2);
        }

        return parseInt(value, parseInt(inputBase));
    };

    const decimalValue = (() => {
        if (!inputValue.trim()) return NaN;
        try {
            const result = parseInput(inputValue);
            return isNaN(result) ? NaN : result;
        } catch {
            return NaN;
        }
    })();

    const binary = isNaN(decimalValue) ? '-' : decimalValue.toString(2);
    const octal = isNaN(decimalValue) ? '-' : decimalValue.toString(8);
    const decimal = isNaN(decimalValue) ? '-' : decimalValue.toString(10);
    const hex = isNaN(decimalValue) ? '-' : decimalValue.toString(16).toUpperCase();

    const getPlaceholder = () => {
        const placeholders = {
            '2': '输入二进制数字 (例如: 1010)',
            '8': '输入八进制数字 (例如: 755)',
            '10': '输入十进制数字 (例如: 123)',
            '16': '输入十六进制数字 (例如: FF)'
        };
        return placeholders[inputBase];
    };

    const loadSample = () => {
        const samples = {
            '2': '1010110',
            '8': '777',
            '10': '255',
            '16': 'FF'
        };
        setInputValue(samples[inputBase]);
    };

    const clear = () => {
        setInputValue('');
    };

    return (
        <div className="flex flex-col h-full w-full bg-white dark:bg-gray-800">
            {/* 顶部：标签导航 */}
            <div className="flex justify-between items-stretch h-7 flex-shrink-0 bg-gray-50 dark:bg-gray-700">
                <div className="flex items-stretch">
                    <button
                        className={`px-2.5 text-xs border-l border-r border-gray-300 dark:border-gray-600 transition-all ${inputBase === '2'
                                ? 'bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 font-medium'
                                : 'bg-gray-50 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-600'
                            }`}
                        onClick={() => setInputBase('2')}
                    >
                        二进制
                    </button>
                    <button
                        className={`px-2.5 text-xs border-r border-gray-300 dark:border-gray-600 transition-all ${inputBase === '8'
                                ? 'bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 font-medium'
                                : 'bg-gray-50 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-600'
                            }`}
                        onClick={() => setInputBase('8')}
                    >
                        八进制
                    </button>
                    <button
                        className={`px-2.5 text-xs border-r border-gray-300 dark:border-gray-600 transition-all ${inputBase === '10'
                                ? 'bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 font-medium'
                                : 'bg-gray-50 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-600'
                            }`}
                        onClick={() => setInputBase('10')}
                    >
                        十进制
                    </button>
                    <button
                        className={`px-2.5 text-xs border-r border-gray-300 dark:border-gray-600 transition-all ${inputBase === '16'
                                ? 'bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 font-medium'
                                : 'bg-gray-50 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-600'
                            }`}
                        onClick={() => setInputBase('16')}
                    >
                        十六进制
                    </button>
                    <button
                        className="px-2.5 text-xs border-r border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-600 transition-all"
                        onClick={loadSample}
                        title="示例"
                    >
                        示例
                    </button>
                </div>
                <div className="flex items-center">
                    <button
                        className="px-2.5 text-xs border-l border-r border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-600 transition-all"
                        onClick={clear}
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
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        placeholder={getPlaceholder()}
                        className="w-full h-full p-3 border-none outline-none font-mono text-xs leading-relaxed resize-none bg-transparent text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500"
                    />
                </div>

                {/* 输出区域 */}
                <div className="border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 p-3 overflow-y-auto">
                    <div className="space-y-2">
                        <div className="flex items-center py-2 border-b border-gray-100 dark:border-gray-700">
                            <span className="text-xs text-gray-600 dark:text-gray-400 font-medium min-w-[60px]">二进制：</span>
                            <span className="font-mono text-xs text-gray-900 dark:text-gray-100 break-all select-text">{binary}</span>
                        </div>
                        <div className="flex items-center py-2 border-b border-gray-100 dark:border-gray-700">
                            <span className="text-xs text-gray-600 dark:text-gray-400 font-medium min-w-[60px]">八进制：</span>
                            <span className="font-mono text-xs text-gray-900 dark:text-gray-100 break-all select-text">{octal}</span>
                        </div>
                        <div className="flex items-center py-2 border-b border-gray-100 dark:border-gray-700">
                            <span className="text-xs text-gray-600 dark:text-gray-400 font-medium min-w-[60px]">十进制：</span>
                            <span className="font-mono text-xs text-gray-900 dark:text-gray-100 break-all select-text">{decimal}</span>
                        </div>
                        <div className="flex items-center py-2">
                            <span className="text-xs text-gray-600 dark:text-gray-400 font-medium min-w-[60px]">十六进制：</span>
                            <span className="font-mono text-xs text-gray-900 dark:text-gray-100 break-all select-text">{hex}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default NumberConverter;
