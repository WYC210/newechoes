import React, { useState, useEffect } from 'react';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import relativeTime from 'dayjs/plugin/relativeTime';
import 'dayjs/locale/zh-cn';

// 扩展 dayjs 插件
dayjs.extend(utc);
dayjs.extend(relativeTime);
dayjs.locale('zh-cn');

const TimeConverter: React.FC = () => {
    const [timestamp, setTimestamp] = useState('');
    const [datetime, setDatetime] = useState('');

    // 获取当前时间
    const getCurrentTime = () => {
        const ts = Math.floor(Date.now() / 1000);
        setTimestamp(ts.toString());
        const milliseconds = ts * 1000;
        setDatetime(dayjs(milliseconds).format('YYYY-MM-DD HH:mm:ss'));
    };

    // 时间戳转日期时间
    const convertToDateTime = (ts: string) => {
        if (!ts.trim()) {
            setDatetime('');
            return;
        }

        const tsNum = parseInt(ts);
        if (isNaN(tsNum)) return;

        const milliseconds = ts.length === 10 ? tsNum * 1000 : tsNum;
        setDatetime(dayjs(milliseconds).format('YYYY-MM-DD HH:mm:ss'));
    };

    // 日期时间转时间戳
    const convertToTimestamp = (dt: string) => {
        if (!dt.trim()) {
            setTimestamp('');
            return;
        }

        // 尝试解析各种日期格式
        let date = dayjs(dt);

        // 如果 dayjs 无法解析，尝试使用 Date 构造函数
        if (!date.isValid()) {
            date = dayjs(new Date(dt));
        }

        if (!date.isValid()) {
            return;
        }

        const ts = Math.floor(date.valueOf() / 1000);
        setTimestamp(ts.toString());
    };

    // 清空所有
    const clearAll = () => {
        setTimestamp('');
        setDatetime('');
    };

    // 计算 UTC 时间
    const utcTime = (() => {
        if (!timestamp) return '-';
        const ts = parseInt(timestamp);
        if (isNaN(ts)) return '-';
        const milliseconds = timestamp.length === 10 ? ts * 1000 : ts;
        return dayjs(milliseconds).utc().format('YYYY-MM-DD HH:mm:ss UTC');
    })();

    // 计算本地时间
    const localTime = (() => {
        if (!timestamp) return '-';
        const ts = parseInt(timestamp);
        if (isNaN(ts)) return '-';
        const milliseconds = timestamp.length === 10 ? ts * 1000 : ts;
        return dayjs(milliseconds).format('YYYY-MM-DD HH:mm:ss');
    })();

    // 计算相对时间
    const relativeTimeStr = (() => {
        if (!timestamp) return '-';
        const ts = parseInt(timestamp);
        if (isNaN(ts)) return '-';
        const milliseconds = timestamp.length === 10 ? ts * 1000 : ts;
        return dayjs(milliseconds).fromNow();
    })();

    return (
        <div className="flex flex-col h-full w-full bg-white dark:bg-gray-800">
            {/* 顶部导航栏 */}
            <div className="flex justify-between items-stretch h-7 flex-shrink-0 bg-gray-50 dark:bg-gray-700">
                <div className="flex items-stretch">
                    <button
                        className="px-2.5 text-xs border-l border-r border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-600 transition-all"
                        onClick={getCurrentTime}
                        title="当前时间"
                    >
                        当前时间
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

            {/* 内容区域 */}
            <div className="flex-1 p-3 flex flex-col gap-2 bg-white dark:bg-gray-800">
                {/* 时间戳输入 */}
                <div className="flex items-center gap-3 py-2">
                    <label className="min-w-[80px] w-20 text-xs text-gray-600 dark:text-gray-400 font-medium flex-shrink-0">
                        时间戳
                    </label>
                    <input
                        type="text"
                        value={timestamp}
                        onChange={(e) => {
                            setTimestamp(e.target.value);
                            convertToDateTime(e.target.value);
                        }}
                        placeholder="输入时间戳 (秒或毫秒)..."
                        className="flex-1 px-2 py-1.5 border-none outline-none font-mono text-xs bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 h-7"
                    />
                </div>

                {/* 日期时间输入 */}
                <div className="flex items-center gap-3 py-2">
                    <label className="min-w-[80px] w-20 text-xs text-gray-600 dark:text-gray-400 font-medium flex-shrink-0">
                        日期时间
                    </label>
                    <input
                        type="text"
                        value={datetime}
                        onChange={(e) => {
                            setDatetime(e.target.value);
                            convertToTimestamp(e.target.value);
                        }}
                        placeholder="2025-01-15 14:30:00"
                        className="flex-1 px-2 py-1.5 border-none outline-none font-mono text-xs bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 h-7"
                    />
                </div>

                {/* UTC 时间 */}
                <div className="flex items-center gap-3 py-2">
                    <label className="min-w-[80px] w-20 text-xs text-gray-600 dark:text-gray-400 font-medium flex-shrink-0">
                        UTC 时间
                    </label>
                    <input
                        type="text"
                        value={utcTime}
                        readOnly
                        className="flex-1 px-2 py-1.5 border-none outline-none font-mono text-xs bg-gray-100 dark:bg-gray-600 text-gray-600 dark:text-gray-300 h-7 cursor-default"
                    />
                </div>

                {/* 本地时间 */}
                <div className="flex items-center gap-3 py-2">
                    <label className="min-w-[80px] w-20 text-xs text-gray-600 dark:text-gray-400 font-medium flex-shrink-0">
                        本地时间
                    </label>
                    <input
                        type="text"
                        value={localTime}
                        readOnly
                        className="flex-1 px-2 py-1.5 border-none outline-none font-mono text-xs bg-gray-100 dark:bg-gray-600 text-gray-600 dark:text-gray-300 h-7 cursor-default"
                    />
                </div>

                {/* 相对时间 */}
                <div className="flex items-center gap-3 py-2">
                    <label className="min-w-[80px] w-20 text-xs text-gray-600 dark:text-gray-400 font-medium flex-shrink-0">
                        相对时间
                    </label>
                    <input
                        type="text"
                        value={relativeTimeStr}
                        readOnly
                        className="flex-1 px-2 py-1.5 border-none outline-none font-mono text-xs bg-gray-100 dark:bg-gray-600 text-gray-600 dark:text-gray-300 h-7 cursor-default"
                    />
                </div>
            </div>
        </div>
    );
};

export default TimeConverter;
