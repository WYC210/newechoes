import React, { useState, useCallback, useEffect, useRef } from 'react';

const TextFormatterTool: React.FC = () => {
    const [inputText, setInputText] = useState<string>('');
    const [formattedText, setFormattedText] = useState<string>('');
    const [copySuccess, setCopySuccess] = useState<boolean>(false);
    const [isNotificationFadingOut, setIsNotificationFadingOut] = useState<boolean>(false);

    const formatTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    // 自动格式化函数
    const performFormat = useCallback((text: string) => {
        if (!text.trim()) {
            setFormattedText('');
            return;
        }

        // 移除所有换行符、制表符和多余空格
        let result = text;

        // 移除所有换行符
        result = result.replace(/[\r\n]+/g, '');

        // 移除所有制表符
        result = result.replace(/\t+/g, '');

        // 将多个空格替换为单个空格并去除首尾空格
        result = result.replace(/\s+/g, ' ').trim();

        setFormattedText(result);
    }, []);

    // 输入文本变化时,延迟格式化
    useEffect(() => {
        if (formatTimeoutRef.current) {
            clearTimeout(formatTimeoutRef.current);
        }

        if (inputText.trim()) {
            formatTimeoutRef.current = setTimeout(() => {
                performFormat(inputText);
            }, 300);
        } else {
            setFormattedText('');
        }

        return () => {
            if (formatTimeoutRef.current) {
                clearTimeout(formatTimeoutRef.current);
            }
        };
    }, [inputText, performFormat]);

    const handleCopy = useCallback(() => {
        if (!formattedText) return;
        navigator.clipboard.writeText(formattedText).then(() => {
            setCopySuccess(true);
            setIsNotificationFadingOut(false);
            // 1.7秒后开始淡出动画
            setTimeout(() => {
                setIsNotificationFadingOut(true);
            }, 1700);
            // 2秒后完全隐藏
            setTimeout(() => {
                setCopySuccess(false);
                setIsNotificationFadingOut(false);
            }, 2000);
        }).catch(err => {
            console.error('Failed to copy text: ', err);
        });
    }, [formattedText]);

    return (
        <div className="flex w-full flex-col items-center px-4 py-10 sm:px-6 lg:px-8">
            <div className="flex w-full max-w-6xl flex-col items-center gap-2 text-center mb-8">
                <p className="text-3xl font-black leading-tight tracking-tighter text-gray-900 dark:text-white sm:text-4xl">文本格式化工具</p>
                <p className="text-base font-normal text-gray-500 dark:text-gray-400">粘贴文本,自动清除所有多余的空格、换行符和制表符。</p>
            </div>

            {/* 全局通知 - 固定在顶部中央 */}
            {copySuccess && (
                <div className={`fixed top-8 left-1/2 -translate-x-1/2 z-50 ${isNotificationFadingOut ? 'animate-fade-out-up' : 'animate-fade-in-down'}`}>
                    <div className="bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-2">
                        <span className="material-symbols-outlined text-xl">check_circle</span>
                        <span className="font-medium">已复制到剪贴板!</span>
                    </div>
                </div>
            )}

            <div className="w-full max-w-6xl rounded-xl border border-gray-200 dark:border-gray-700/50 bg-white dark:bg-gray-800/20 shadow-sm">
                <div className="grid grid-cols-1 lg:grid-cols-2">
                    {/* 左侧：原始文本 */}
                    <div className="relative flex flex-col p-4 border-b lg:border-b-0 lg:border-r border-gray-200 dark:border-gray-700/50">
                        <div className="flex items-center justify-between mb-3 min-h-[36px]">
                            <h3 className="text-gray-900 dark:text-white text-base font-semibold leading-normal flex items-center gap-2">
                                <span className="material-symbols-outlined text-xl">description</span>
                                原始文本
                            </h3>
                            <span className="text-xs text-gray-400 dark:text-gray-500">{inputText.length} 字符</span>
                        </div>
                        <textarea
                            value={inputText}
                            onChange={(e) => setInputText(e.target.value)}
                            className="flex-1 resize-none rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50 text-gray-900 dark:text-gray-100 focus:outline-0 focus:ring-2 focus:ring-primary/20 focus:border-primary min-h-[400px] placeholder:text-gray-400 dark:placeholder:text-gray-500 p-4 text-sm leading-relaxed"
                            placeholder="在此处粘贴您的文本..."
                        ></textarea>
                    </div>

                    {/* 右侧：格式化后的文本 */}
                    <div className="relative flex flex-col p-4 bg-gray-50/50 dark:bg-gray-800/30">
                        <div className="flex justify-between items-start mb-3 min-h-[36px]">
                            <h3 className="text-gray-900 dark:text-white text-base font-semibold leading-normal flex items-center gap-2">
                                <span className="material-symbols-outlined text-xl">auto_awesome</span>
                                格式化后的文本
                            </h3>
                            <button
                                onClick={handleCopy}
                                disabled={!formattedText}
                                className="flex items-center gap-1.5 px-3 py-1.5 bg-primary/10 text-primary rounded-lg text-xs font-medium hover:bg-primary/20 disabled:opacity-50 disabled:cursor-not-allowed transition-colors whitespace-nowrap"
                            >
                                <span className="material-symbols-outlined text-base">content_copy</span>
                                <span>{copySuccess ? "已复制!" : "复制文本"}</span>
                            </button>
                        </div>
                        <div className="relative bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 min-h-[400px] p-4 text-sm overflow-x-auto">
                            {formattedText ? (
                                <pre className="leading-relaxed whitespace-pre-wrap break-words text-gray-900 dark:text-gray-100">{formattedText}</pre>
                            ) : (
                                <div className="flex items-center justify-center h-full text-gray-400 dark:text-gray-500">
                                    <div className="text-center">
                                        <span className="material-symbols-outlined text-5xl mb-2 block opacity-50">lightbulb</span>
                                        <p className="text-sm">格式化后的文本将显示在此处</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TextFormatterTool;
