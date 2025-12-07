import React, { useState } from 'react';

const Base64Text: React.FC = () => {
    const [activeTab, setActiveTab] = useState<'encode' | 'decode'>('encode');
    const [inputText, setInputText] = useState('');
    const [outputText, setOutputText] = useState('');

    // 自动转换
    const autoConvert = (text: string) => {
        if (!text.trim()) {
            setOutputText('');
            return;
        }

        if (activeTab === 'encode') {
            try {
                setOutputText(btoa(text));
            } catch (error) {
                setOutputText('编码失败');
            }
        } else {
            try {
                setOutputText(atob(text));
            } catch (error) {
                setOutputText('解码失败：无效的 Base64 字符串');
            }
        }
    };

    // 处理输入变化
    const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const text = e.target.value;
        setInputText(text);
        autoConvert(text);
    };

    // 切换模式
    const handleTabChange = (tab: 'encode' | 'decode') => {
        setActiveTab(tab);
        // 切换后重新转换
        if (inputText.trim()) {
            if (tab === 'encode') {
                try {
                    setOutputText(btoa(inputText));
                } catch (error) {
                    setOutputText('编码失败');
                }
            } else {
                try {
                    setOutputText(atob(inputText));
                } catch (error) {
                    setOutputText('解码失败：无效的 Base64 字符串');
                }
            }
        }
    };

    // 清空所有内容
    const clearAll = () => {
        setInputText('');
        setOutputText('');
    };

    const getInputPlaceholder = () => {
        return activeTab === 'encode' ? '输入需要编码的文本...' : '输入需要解码的Base64字符串...';
    };

    const getOutputPlaceholder = () => {
        return activeTab === 'encode' ? 'Base64编码结果...' : '解码后的文本...';
    };

    return (
        <div className="flex flex-col h-full w-full bg-white dark:bg-gray-800">
            {/* 顶部：标签页按钮 */}
            <div className="flex justify-between items-stretch h-7 flex-shrink-0 bg-gray-50 dark:bg-gray-700">
                <div className="flex items-stretch">
                    <button
                        className={`px-2.5 text-xs border-l border-r border-gray-300 dark:border-gray-600 transition-all ${activeTab === 'encode'
                                ? 'bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 font-medium'
                                : 'bg-gray-50 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-600'
                            }`}
                        onClick={() => handleTabChange('encode')}
                    >
                        编码
                    </button>
                    <button
                        className={`px-2.5 text-xs border-r border-gray-300 dark:border-gray-600 transition-all ${activeTab === 'decode'
                                ? 'bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 font-medium'
                                : 'bg-gray-50 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-600'
                            }`}
                        onClick={() => handleTabChange('decode')}
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
                {/* 左侧：输入文本区域 */}
                <div className="border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900">
                    <textarea
                        value={inputText}
                        onChange={handleInputChange}
                        placeholder={getInputPlaceholder()}
                        className="w-full h-full p-3 border-none outline-none font-mono text-xs leading-relaxed resize-none bg-transparent text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500"
                        autoComplete="off"
                        spellCheck="false"
                    />
                </div>

                {/* 右侧：输出文本区域 */}
                <div className="border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900">
                    <textarea
                        value={outputText}
                        placeholder={getOutputPlaceholder()}
                        className="w-full h-full p-3 border-none outline-none font-mono text-xs leading-relaxed resize-none bg-transparent text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500"
                        readOnly
                        autoComplete="off"
                        spellCheck="false"
                    />
                </div>
            </div>
        </div>
    );
};

export default Base64Text;
