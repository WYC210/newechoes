import React, { useState } from 'react';
import Base64Text from './Base64Text';
import UrlEncoder from './UrlEncoder';
import NumberConverter from './NumberConverter';
import UnicodeConverter from './UnicodeConverter';
import TimeConverter from './TimeConverter';
import JwtDecoder from './JwtDecoder';

interface DeveloperToolsProps {
    onBack: () => void;
}

type DevToolType =
    | 'base64-text'
    | 'url-encoder'
    | 'number-converter'
    | 'unicode-converter'
    | 'time-converter'
    | 'jwt-decoder';

interface DevToolConfig {
    id: DevToolType;
    name: string;
    icon: string;
    description: string;
    tags: string[];
    component: React.FC;
}

const devToolConfigs: DevToolConfig[] = [
    {
        id: 'base64-text',
        name: 'Base64 文本',
        icon: '🔤',
        description: 'Base64 文本编解码',
        tags: ['Base64', '编码', '解码'],
        component: Base64Text,
    },
    {
        id: 'url-encoder',
        name: 'URL 编解码',
        icon: '🔗',
        description: 'URL 编解码转换',
        tags: ['URL', '编码', '解码'],
        component: UrlEncoder,
    },
    {
        id: 'number-converter',
        name: '进制转换',
        icon: '🔢',
        description: '二/八/十/十六进制互转',
        tags: ['进制', '转换', '数字'],
        component: NumberConverter,
    },
    {
        id: 'unicode-converter',
        name: 'Unicode 工具',
        icon: '🌐',
        description: 'Unicode 编解码转换',
        tags: ['Unicode', '编码', '解码'],
        component: UnicodeConverter,
    },
    {
        id: 'time-converter',
        name: '时间戳转换',
        icon: '⏰',
        description: '时间戳与日期时间互转',
        tags: ['时间戳', '日期', '转换'],
        component: TimeConverter,
    },
    {
        id: 'jwt-decoder',
        name: 'JWT 解析',
        icon: '🔐',
        description: '解析和验证 JWT Token',
        tags: ['JWT', 'Token', '解析'],
        component: JwtDecoder,
    },
];

const DeveloperTools: React.FC<DeveloperToolsProps> = ({ onBack }) => {
    const [selectedTool, setSelectedTool] = useState<DevToolType | null>(null);

    // 选择工具
    const selectTool = (toolId: DevToolType) => {
        setSelectedTool(toolId);
    };

    // 返回工具列表
    const backToList = () => {
        setSelectedTool(null);
    };

    if (!selectedTool) {
        // 工具列表视图
        return (
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 sm:p-6">
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center">
                        <div className="text-2xl sm:text-3xl mr-3">💻</div>
                        <div>
                            <h2 className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-gray-200">
                                开发者工具集
                            </h2>
                            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
                                选择需要使用的开发者工具
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={onBack}
                        className="px-3 sm:px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg transition-colors text-sm sm:text-base"
                    >
                        ← 返回
                    </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {devToolConfigs.map((config) => (
                        <div
                            key={config.id}
                            className="devtool-card bg-gray-50 dark:bg-gray-700 rounded-lg p-4 cursor-pointer hover:shadow-md transition-all duration-300 hover:scale-105 border-2 border-transparent hover:border-primary-500"
                            onClick={() => selectTool(config.id)}
                        >
                            <div className="text-center">
                                <div className="text-3xl sm:text-4xl mb-3">{config.icon}</div>
                                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">
                                    {config.name}
                                </h3>
                                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                                    {config.description}
                                </p>
                                <div className="flex flex-wrap gap-1 justify-center">
                                    {config.tags.map((tag, index) => (
                                        <span
                                            key={index}
                                            className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-xs"
                                        >
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    // 工具详情视图
    const currentConfig = devToolConfigs.find((c) => c.id === selectedTool);
    if (!currentConfig) return null;

    const ActiveComponent = currentConfig.component;

    return (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 sm:p-6">
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center">
                    <div className="text-2xl sm:text-3xl mr-3">{currentConfig.icon}</div>
                    <div>
                        <h2 className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-gray-200">
                            {currentConfig.name}
                        </h2>
                        <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
                            {currentConfig.description}
                        </p>
                    </div>
                </div>
                <button
                    onClick={backToList}
                    className="px-3 sm:px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg transition-colors text-sm sm:text-base"
                >
                    ← 返回
                </button>
            </div>

            <ActiveComponent />
        </div>
    );
};

export default DeveloperTools;
