import React, { useState } from 'react';
import TextFormatterTool from './TextFormatterTool';
import JsonFormatterTool from './JsonFormatterTool';
import XmlFormatterTool from './XmlFormatterTool';
import MathFormulaEditor from './MathFormulaEditor';
import ImageConverterTool from './ImageConverterTool';
import ImageEditorTool from './ImageEditorTool';
import ImageComparisonTool from './ImageComparisonTool';
import TableConverter from './TableConverter';
import VideoAspectConverter from './VideoAspectConverter';
import TextDiffTool from './TextDiffTool';

interface UtilityToolsProps {
    onBack: () => void;
}

type UtilityToolType =
    | 'text-formatter'
    | 'json-formatter'
    | 'xml-formatter'
    | 'math-formula'
    | 'image-converter'
    | 'image-editor'
    | 'image-comparison'
    | 'table-converter'
    | 'video-aspect-converter'
    | 'text-diff';

interface UtilityConfig {
    id: UtilityToolType;
    name: string;
    icon: string;
    description: string;
    tags: string[];
    component: React.FC;
}

const utilityConfigs: UtilityConfig[] = [
    {
        id: 'text-formatter',
        name: '文本格式化',
        icon: '📝',
        description: '清除换行符、制表符，合并多余空格',
        tags: ['文本', '格式化', '清理'],
        component: TextFormatterTool,
    },
    {
        id: 'json-formatter',
        name: 'JSON 格式化',
        icon: '🔧',
        description: '自动格式化JSON，树形结构展示',
        tags: ['JSON', '格式化', '树形'],
        component: JsonFormatterTool,
    },
    {
        id: 'xml-formatter',
        name: 'XML 格式化',
        icon: '📄',
        description: 'XML数据格式化，语法高亮',
        tags: ['XML', '格式化', '高亮'],
        component: XmlFormatterTool,
    },
    {
        id: 'math-formula',
        name: '数学公式编辑',
        icon: '📐',
        description: '实时预览数学公式，导出LaTeX和MathML',
        tags: ['数学', 'LaTeX', 'MathML'],
        component: MathFormulaEditor,
    },
    {
        id: 'image-converter',
        name: '图片格式转换',
        icon: '🖼️',
        description: '支持PNG、JPEG、WebP、GIF、BMP格式转换',
        tags: ['图片', '转换', '格式'],
        component: ImageConverterTool,
    },
    {
        id: 'image-editor',
        name: '图片快速编辑',
        icon: '✂️',
        description: '裁剪、调整分辨率、涂鸦、马赛克',
        tags: ['图片', '编辑', '裁剪'],
        component: ImageEditorTool,
    },
    {
        id: 'image-comparison',
        name: '多图自由拼接',
        icon: '🎨',
        description: '图层管理、图片拼接、文本图层',
        tags: ['图片', '拼接', '图层'],
        component: ImageComparisonTool,
    },
    {
        id: 'table-converter',
        name: '表格格式转换',
        icon: '📊',
        description: '导出为Markdown、LaTeX、Word格式',
        tags: ['表格', '转换', 'Markdown'],
        component: TableConverter,
    },
    {
        id: 'video-aspect-converter',
        name: '视频比例转换',
        icon: '🎬',
        description: '调整视频宽高比，支持多种常见比例',
        tags: ['视频', '比例', '转换'],
        component: VideoAspectConverter,
    },
    {
        id: 'text-diff',
        name: '文本差异对比',
        icon: '🔍',
        description: '对比两段文本，高亮显示差异',
        tags: ['文本', '对比', '差异'],
        component: TextDiffTool,
    },
];

const UtilityTools: React.FC<UtilityToolsProps> = ({ onBack }) => {
    const [selectedTool, setSelectedTool] = useState<UtilityToolType | null>(null);

    // 选择工具
    const selectTool = (toolId: UtilityToolType) => {
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
                        <div className="text-2xl sm:text-3xl mr-3">🛠️</div>
                        <div>
                            <h2 className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-gray-200">
                                实用工具集
                            </h2>
                            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
                                选择需要使用的实用工具
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
                    {utilityConfigs.map((config) => (
                        <div
                            key={config.id}
                            className="utility-tool-card bg-gray-50 dark:bg-gray-700 rounded-lg p-4 cursor-pointer hover:shadow-md transition-all duration-300 hover:scale-105 border-2 border-transparent hover:border-primary-500"
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
                                            className="px-2 py-1 bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 rounded-full text-xs"
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
    const currentConfig = utilityConfigs.find((c) => c.id === selectedTool);
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

export default UtilityTools;
