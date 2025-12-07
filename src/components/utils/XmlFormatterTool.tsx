import React, { useState, useCallback, useEffect, useRef } from 'react';

const XmlFormatterTool: React.FC = () => {
    const [inputText, setInputText] = useState<string>('');
    const [parsedXml, setParsedXml] = useState<Document | null>(null);
    const [formattedXml, setFormattedXml] = useState<string>('');
    const [copySuccess, setCopySuccess] = useState<boolean>(false);
    const [isNotificationFadingOut, setIsNotificationFadingOut] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [indentSize, setIndentSize] = useState<number>(2);
    const [expandedPaths, setExpandedPaths] = useState<Set<string>>(new Set());

    const formatTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    // 格式化 XML 字符串
    const formatXml = (xmlString: string, indent: number = 2): string => {
        const PADDING = ' '.repeat(indent);
        const reg = /(>)(<)(\/*)/g;
        let formatted = '';
        let pad = 0;

        xmlString = xmlString.replace(reg, '$1\n$2$3');

        xmlString.split('\n').forEach((node) => {
            let indent = 0;
            if (node.match(/.+<\/\w[^>]*>$/)) {
                indent = 0;
            } else if (node.match(/^<\/\w/) && pad > 0) {
                pad -= 1;
            } else if (node.match(/^<\w[^>]*[^\/]>.*$/)) {
                indent = 1;
            } else {
                indent = 0;
            }

            formatted += PADDING.repeat(pad) + node + '\n';
            pad += indent;
        });

        return formatted.trim();
    };

    // 自动格式化函数
    const performFormat = useCallback((text: string) => {
        if (!text.trim()) {
            setParsedXml(null);
            setFormattedXml('');
            setError(null);
            return;
        }

        try {
            // 解析 XML
            const parser = new DOMParser();
            const xmlDoc = parser.parseFromString(text, 'text/xml');

            // 检查是否有解析错误
            const parserError = xmlDoc.querySelector('parsererror');
            if (parserError) {
                throw new Error(parserError.textContent || 'XML 解析错误');
            }

            setParsedXml(xmlDoc);

            // 格式化 XML 字符串
            const serializer = new XMLSerializer();
            const xmlString = serializer.serializeToString(xmlDoc);
            const formatted = formatXml(xmlString, indentSize);
            setFormattedXml(formatted);

            setError(null);
            // 默认展开第一层
            setExpandedPaths(new Set(['root']));
        } catch (err) {
            setError(err instanceof Error ? err.message : 'XML 格式错误');
            setParsedXml(null);
            setFormattedXml('');
        }
    }, [indentSize]);

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
            setParsedXml(null);
            setFormattedXml('');
            setError(null);
        }

        return () => {
            if (formatTimeoutRef.current) {
                clearTimeout(formatTimeoutRef.current);
            }
        };
    }, [inputText, performFormat]);

    const handleCopy = useCallback(() => {
        if (!formattedXml) return;
        navigator.clipboard.writeText(formattedXml).then(() => {
            setCopySuccess(true);
            setIsNotificationFadingOut(false);
            setTimeout(() => {
                setIsNotificationFadingOut(true);
            }, 1700);
            setTimeout(() => {
                setCopySuccess(false);
                setIsNotificationFadingOut(false);
            }, 2000);
        }).catch(err => {
            console.error('Failed to copy text: ', err);
        });
    }, [formattedXml]);

    const togglePath = useCallback((path: string) => {
        setExpandedPaths(prev => {
            const newSet = new Set(prev);
            if (newSet.has(path)) {
                newSet.delete(path);
            } else {
                newSet.add(path);
            }
            return newSet;
        });
    }, []);

    const expandAll = useCallback(() => {
        if (!parsedXml) return;
        const allPaths = new Set<string>();

        const collectPaths = (node: Element, path: string) => {
            allPaths.add(path);
            Array.from(node.children).forEach((child, index) => {
                collectPaths(child as Element, `${path}.${child.nodeName}[${index}]`);
            });
        };

        if (parsedXml.documentElement) {
            collectPaths(parsedXml.documentElement, 'root');
        }
        setExpandedPaths(allPaths);
    }, [parsedXml]);

    const collapseAll = useCallback(() => {
        setExpandedPaths(new Set(['root']));
    }, []);

    const renderXmlNode = useCallback((node: Element, path: string, level: number = 0): React.ReactNode => {
        const isExpanded = expandedPaths.has(path);
        const hasChildren = node.children.length > 0;
        const attributes = Array.from(node.attributes);
        const textContent = node.childNodes.length === 1 && node.childNodes[0].nodeType === Node.TEXT_NODE
            ? node.childNodes[0].textContent?.trim()
            : '';

        return (
            <div key={path} className="py-0.5">
                <div className="flex items-start gap-1">
                    {hasChildren && (
                        <button
                            onClick={() => togglePath(path)}
                            className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 flex-shrink-0 mt-0.5"
                        >
                            <span className="material-symbols-outlined text-sm">
                                {isExpanded ? 'expand_more' : 'chevron_right'}
                            </span>
                        </button>
                    )}
                    <div className="flex-1">
                        <span className="text-blue-600 dark:text-blue-400">&lt;{node.nodeName}</span>
                        {attributes.length > 0 && (
                            <span>
                                {attributes.map((attr, idx) => (
                                    <span key={idx}>
                                        {' '}
                                        <span className="text-orange-600 dark:text-orange-400">{attr.name}</span>
                                        =
                                        <span className="text-green-600 dark:text-green-400">"{attr.value}"</span>
                                    </span>
                                ))}
                            </span>
                        )}
                        {!hasChildren && textContent ? (
                            <>
                                <span className="text-blue-600 dark:text-blue-400">&gt;</span>
                                <span className="text-gray-700 dark:text-gray-300">{textContent}</span>
                                <span className="text-blue-600 dark:text-blue-400">&lt;/{node.nodeName}&gt;</span>
                            </>
                        ) : hasChildren ? (
                            <span className="text-blue-600 dark:text-blue-400">&gt;</span>
                        ) : (
                            <span className="text-blue-600 dark:text-blue-400"> /&gt;</span>
                        )}

                        {hasChildren && isExpanded && (
                            <div className="ml-4 border-l border-gray-300 dark:border-gray-600 pl-2 mt-1">
                                {Array.from(node.children).map((child, index) =>
                                    renderXmlNode(child as Element, `${path}.${child.nodeName}[${index}]`, level + 1)
                                )}
                            </div>
                        )}

                        {hasChildren && (
                            <div className={isExpanded ? '' : 'hidden'}>
                                <span className="text-blue-600 dark:text-blue-400">&lt;/{node.nodeName}&gt;</span>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        );
    }, [expandedPaths, togglePath]);

    return (
        <div className="flex w-full flex-col items-center px-4 py-10 sm:px-6 lg:px-8">
            <div className="flex w-full max-w-6xl flex-col items-center gap-2 text-center mb-8">
                <p className="text-3xl font-black leading-tight tracking-tighter text-gray-900 dark:text-white sm:text-4xl">XML 格式化工具</p>
                <p className="text-base font-normal text-gray-500 dark:text-gray-400">粘贴 XML 数据,自动格式化并以树形结构展示。</p>
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
                    {/* 左侧：原始 XML */}
                    <div className="relative flex flex-col p-4 border-b lg:border-b-0 lg:border-r border-gray-200 dark:border-gray-700/50">
                        <div className="flex items-center justify-between mb-3 min-h-[36px]">
                            <h3 className="text-gray-900 dark:text-white text-base font-semibold leading-normal flex items-center gap-2">
                                <span className="material-symbols-outlined text-xl">code</span>
                                原始 XML
                            </h3>
                            <span className="text-xs text-gray-400 dark:text-gray-500">{inputText.length} 字符</span>
                        </div>
                        <textarea
                            value={inputText}
                            onChange={(e) => setInputText(e.target.value)}
                            className="flex-1 resize-none rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50 text-gray-900 dark:text-gray-100 focus:outline-0 focus:ring-2 focus:ring-primary/20 focus:border-primary min-h-[400px] placeholder:text-gray-400 dark:placeholder:text-gray-500 p-4 text-sm leading-relaxed font-mono"
                            placeholder='在此处粘贴 XML 数据...'
                        ></textarea>
                    </div>

                    {/* 右侧：格式化后的 XML */}
                    <div className="relative flex flex-col p-4 bg-gray-50/50 dark:bg-gray-800/30">
                        <div className="flex justify-between items-start mb-3 min-h-[36px] gap-2">
                            <h3 className="text-gray-900 dark:text-white text-base font-semibold leading-normal flex items-center gap-2">
                                <span className="material-symbols-outlined text-xl">account_tree</span>
                                树形视图
                            </h3>
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={expandAll}
                                    disabled={!parsedXml}
                                    className="flex items-center gap-1 px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded text-xs font-medium hover:bg-blue-200 dark:hover:bg-blue-900/50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors whitespace-nowrap"
                                >
                                    <span className="material-symbols-outlined text-sm">unfold_more</span>
                                    展开
                                </button>
                                <button
                                    onClick={collapseAll}
                                    disabled={!parsedXml}
                                    className="flex items-center gap-1 px-2 py-1 bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400 rounded text-xs font-medium hover:bg-orange-200 dark:hover:bg-orange-900/50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors whitespace-nowrap"
                                >
                                    <span className="material-symbols-outlined text-sm">unfold_less</span>
                                    收起
                                </button>
                                <button
                                    onClick={handleCopy}
                                    disabled={!parsedXml}
                                    className="flex items-center gap-1 px-2 py-1 bg-primary/10 text-primary rounded text-xs font-medium hover:bg-primary/20 disabled:opacity-50 disabled:cursor-not-allowed transition-colors whitespace-nowrap"
                                >
                                    <span className="material-symbols-outlined text-sm">content_copy</span>
                                    复制
                                </button>
                            </div>
                        </div>
                        {error && (
                            <div className="mb-2 p-2 bg-red-100 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded text-xs text-red-600 dark:text-red-400">
                                <span className="material-symbols-outlined text-sm align-middle mr-1">error</span>
                                {error}
                            </div>
                        )}
                        <div className="relative bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 min-h-[400px] p-4 text-sm overflow-auto">
                            {parsedXml && parsedXml.documentElement ? (
                                <div className="font-mono text-xs">
                                    {renderXmlNode(parsedXml.documentElement, 'root')}
                                </div>
                            ) : !error ? (
                                <div className="flex items-center justify-center h-full text-gray-400 dark:text-gray-500">
                                    <div className="text-center">
                                        <span className="material-symbols-outlined text-5xl mb-2 block opacity-50">account_tree</span>
                                        <p className="text-sm">格式化后的 XML 将显示在此处</p>
                                    </div>
                                </div>
                            ) : null}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default XmlFormatterTool;
