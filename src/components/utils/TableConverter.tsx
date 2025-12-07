import React, { useEffect, useMemo, useRef, useState } from 'react';

declare global {
    interface Window {
        DataGridXL?: any;
    }
}

type DataGridXLInstance = {
    getData?: () => any;
    destroy?: () => void;
    events: { on: (name: string, fn: (ev?: any) => void) => void };
};

function debounce<T extends (...args: any[]) => any>(fn: T, delay: number): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | undefined;
  return (...args: Parameters<T>) => {
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => fn(...args), delay);
  };
}

const loadDataGridXLScript = () =>
    new Promise<void>((resolve, reject) => {
        if (window.DataGridXL) {
            resolve();
            return;
        }
        const script = document.createElement('script');
        script.src = 'https://code.datagridxl.com/datagridxl.js';
        script.async = true;
        script.onload = () => resolve();
        script.onerror = () => reject(new Error('load_failed'));
        document.head.appendChild(script);
    });

type TableFormat = 'markdown' | 'latex' | 'word';

const createEmptyTable = (rows: number, cols: number) =>
    Array.from({ length: rows }, () => Array.from({ length: cols }, () => ''));

const clampNumber = (value: number, min: number, max: number) =>
    Math.max(min, Math.min(max, value));

const resizeMatrix = (data: string[][], rows: number, cols: number) =>
    Array.from({ length: rows }, (_, r) =>
        Array.from({ length: cols }, (_, c) => data[r]?.[c] ?? '')
    );

const sanitizeCell = (value: string) => value.replace(/\r\n/g, '\n').replace(/\r/g, '\n');

const escapeMarkdown = (value: string) =>
    value.replace(/\|/g, '\\|').replace(/\n/g, '<br>');

const escapeLatex = (value: string) =>
    value
        .replace(/\\/g, '\\textbackslash{}')
        .replace(/([{}_$&#%])/g, '\\$1')
        .replace(/\^/g, '\\^{}')
        .replace(/~/g, '\\~{}')
        .replace(/\n/g, ' ');

const TableConverter: React.FC = () => {
    const [rows, setRows] = useState<number>(4);
    const [cols, setCols] = useState<number>(4);
    const [tableData, setTableData] = useState<string[][]>(() => createEmptyTable(4, 4));
    const [activeFormat, setActiveFormat] = useState<TableFormat>('markdown');
    const [useHeader, setUseHeader] = useState<boolean>(true);
    const [gridStatus, setGridStatus] = useState<'loading' | 'ready' | 'error'>('loading');
    const [gridVersion, setGridVersion] = useState<number>(0);
    const [copySuccess, setCopySuccess] = useState<boolean>(false);
    const [isNotificationFadingOut, setIsNotificationFadingOut] = useState<boolean>(false);

    const gridContainerRef = useRef<HTMLDivElement>(null);
    const gridInstanceRef = useRef<DataGridXLInstance | null>(null);
    const latestDataRef = useRef<string[][]>(tableData);

    useEffect(() => {
        latestDataRef.current = tableData;
    }, [tableData]);

    useEffect(() => {
        let disposed = false;

        const waitForDataGridXL = () =>
            new Promise<void>((resolve, reject) => {
                if (window.DataGridXL) {
                    resolve();
                    return;
                }

                const start = Date.now();
                const interval = window.setInterval(() => {
                    if (window.DataGridXL) {
                        window.clearInterval(interval);
                        resolve();
                    } else if (Date.now() - start > 8000) {
                        window.clearInterval(interval);
                        reject(new Error('timeout'));
                    }
                }, 120);
            });

        const mountGrid = async () => {
            if (!gridContainerRef.current) return;
            setGridStatus('loading');

            try {
                await loadDataGridXLScript();
                await waitForDataGridXL();
            } catch {
                if (!disposed) {
                    setGridStatus('error');
                }
                return;
            }

            if (disposed || !gridContainerRef.current || !window.DataGridXL) return;

            const container = gridContainerRef.current;
            if (!container.id) container.id = 'dgxl-table-grid';
            const grid = new window.DataGridXL(container.id, {
                data: latestDataRef.current.map(row => [...row]),
                colHeaderLabelType: 'letters',
                rowHeaderLabelType: 'numbers',
                allowInsertRows: false,
                allowDeleteRows: false,
                allowMoveRows: false,
                allowInsertCols: false,
                allowDeleteCols: false,
                allowMoveCols: false,
                fillCellsDirection: 'xy',
                rowHeight: 38,
            });

            gridInstanceRef.current = grid;
            setGridStatus('ready');

            const syncFromGrid = (eventData?: any) => {
                if (grid.getData) {
                    const snapshot = grid.getData();
                    if (!Array.isArray(snapshot)) return;
                    setTableData(
                        snapshot.map(row => row.map(cell => sanitizeCell(cell == null ? '' : String(cell))))
                    );
                    return;
                }

                if (!eventData) return;
                const { rowIds = [], colIds = [], values = [] } = eventData;
                setTableData(prev => {
                    const next = prev.map(row => [...row]);
                    rowIds.forEach((rowId: number, rIndex: number) => {
                        const rowIdx = rowId - 1;
                        colIds.forEach((colId: number, cIndex: number) => {
                            const colIdx = colId - 1;
                            if (next[rowIdx] && typeof values[rIndex]?.[cIndex] !== 'undefined') {
                                next[rowIdx][colIdx] = sanitizeCell(String(values[rIndex][cIndex] ?? ''));
                            }
                        });
                    });
                    return next;
                });
            };

            const debouncedSync = debounce(syncFromGrid, 300);
            grid.events.on('$setcellvaluesbatch', debouncedSync);
            grid.events.on('$fillcells', debouncedSync);
            grid.events.on('$clearcells', debouncedSync);
            grid.events.on('ready', syncFromGrid);
            grid.events.on('cellvaluechange', debouncedSync);
            grid.events.on('documentchange', debouncedSync);
        };

        mountGrid();

        return () => {
            disposed = true;
            if (gridInstanceRef.current?.destroy) {
                gridInstanceRef.current.destroy();
            }
            gridInstanceRef.current = null;
        };
    }, [gridVersion]);

    const rebuildGrid = (nextData: string[][], nextRows: number, nextCols: number) => {
        setRows(nextRows);
        setCols(nextCols);
        setTableData(nextData);
        setGridVersion(v => v + 1);
    };

    const handleRowsChange = (value: number) => {
        const nextRows = clampNumber(value, 1, 20);
        if (nextRows === rows) return;
        rebuildGrid(resizeMatrix(tableData, nextRows, cols), nextRows, cols);
    };

    const handleColsChange = (value: number) => {
        const nextCols = clampNumber(value, 1, 12);
        if (nextCols === cols) return;
        rebuildGrid(resizeMatrix(tableData, rows, nextCols), rows, nextCols);
    };

    const clearTable = () => {
        rebuildGrid(createEmptyTable(rows, cols), rows, cols);
    };

    const convertToMarkdown = () => {
        const sanitized = tableData.map(row => row.map(cell => escapeMarkdown(cell.trim())));
        if (!useHeader) {
            return sanitized.map(row => `| ${row.join(' | ')} |`).join('\n');
        }
        const header = sanitized[0] ?? Array.from({ length: cols }, () => '');
        const body = sanitized.slice(1);
        const headerLine = `| ${header.join(' | ')} |`;
        const divider = `| ${header.map(() => '---').join(' | ')} |`;
        const bodyLines = body.map(row => `| ${row.join(' | ')} |`);
        return [headerLine, divider, ...bodyLines].join('\n');
    };

    const convertToLatex = () => {
        const colDef = Array.from({ length: cols }, () => 'l').join('');
        const rowsLatex = tableData
            .map((row, index) => {
                const escaped = row.map(cell => escapeLatex(cell.trim())).join(' & ');
                if (useHeader && index === 0) {
                    return `${escaped} \\\\n\\hline`;
                }
                return `${escaped} \\\\`;
            })
            .join('\n');

        return [
            '\\begin{tabular}{|' + colDef.split('').join('|') + '|}',
            '\\hline',
            rowsLatex,
            '\\hline',
            '\\end{tabular}',
        ].join('\n');
    };

    const convertToWord = () => {
        const rowsHtml = tableData
            .map((row, rowIndex) => {
                const cells = row
                    .map(cell => {
                        const tag = useHeader && rowIndex === 0 ? 'th' : 'td';
                        const content = cell.replace(/\n/g, '<br>');
                        return `<${tag} style="border:1px solid #ccc;padding:6px;">${content || '&nbsp;'}</${tag}>`;
                    })
                    .join('');
                return `<tr>${cells}</tr>`;
            })
            .join('');

        return `
<table style="border-collapse:collapse;width:100%;font-family:Arial, sans-serif;font-size:13px;">
    ${rowsHtml}
</table>`.trim();
    };

    const formattedOutput = useMemo(() => {
        switch (activeFormat) {
            case 'latex':
                return convertToLatex();
            case 'word':
                return convertToWord();
            default:
                return convertToMarkdown();
        }
    }, [activeFormat, tableData, useHeader, rows, cols]);

    const handleDownload = () => {
        const extension =
            activeFormat === 'markdown' ? 'md' : activeFormat === 'latex' ? 'tex' : 'doc';
        const blob = new Blob([formattedOutput], { type: 'text/plain;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `table-convert.${extension}`;
        a.click();
        URL.revokeObjectURL(url);
    };

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(formattedOutput);
            setCopySuccess(true);
            setIsNotificationFadingOut(false);
            window.setTimeout(() => {
                setIsNotificationFadingOut(true);
            }, 1700);
            window.setTimeout(() => {
                setCopySuccess(false);
                setIsNotificationFadingOut(false);
            }, 2000);
        } catch (error) {
            console.error('Copy failed', error);
        }
    };

    const retryGrid = () => setGridVersion(v => v + 1);

    return (
        <div className="flex w-full flex-col items-center px-4 py-10 sm:px-6 lg:px-8">
            <div className="flex w-full max-w-7xl flex-col items-center gap-2 text-center mb-8">
                <p className="text-3xl font-black leading-tight tracking-tighter text-gray-900 dark:text-white sm:text-4xl">表格格式转换</p>
                <p className="text-base font-normal text-gray-500 dark:text-gray-400">
                    基于 DataGridXL 的可编辑表格，实时导出 Markdown / LaTeX / Word。
                </p>
            </div>

            <div className="w-full max-w-7xl flex flex-col gap-6">
                {copySuccess && (
                    <div className={`fixed top-8 left-1/2 -translate-x-1/2 z-50 ${isNotificationFadingOut ? 'animate-fade-out-up' : 'animate-fade-in-down'}`}>
                        <div className="bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-2">
                            <span className="material-symbols-outlined text-xl">check_circle</span>
                            <span className="font-medium">已复制到剪贴板!</span>
                        </div>
                    </div>
                )}

                <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                <div className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-background-dark p-6 shadow-sm flex flex-col gap-4">
                    <div className="flex flex-wrap gap-4 items-center">
                        <label className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                            行数
                            <input
                                type="number"
                                min={1}
                                max={20}
                                value={rows}
                                onChange={(e) => handleRowsChange(Number(e.target.value))}
                                className="w-20 rounded-md border border-gray-300 dark:border-gray-700 bg-transparent px-3 py-1 text-sm"
                            />
                        </label>
                        <label className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                            列数
                            <input
                                type="number"
                                min={1}
                                max={12}
                                value={cols}
                                onChange={(e) => handleColsChange(Number(e.target.value))}
                                className="w-20 rounded-md border border-gray-300 dark:border-gray-700 bg-transparent px-3 py-1 text-sm"
                            />
                        </label>
                        <label className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                            <input
                                type="checkbox"
                                checked={useHeader}
                                onChange={(e) => setUseHeader(e.target.checked)}
                                className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                            />
                            第一行作为表头
                        </label>
                        <button
                            onClick={clearTable}
                            className="ml-auto text-sm font-medium text-primary hover:underline"
                        >
                            清空表格
                        </button>
                    </div>

                    <div className="relative rounded-lg border border-dashed border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/30 min-h-[360px]">
                        <div ref={gridContainerRef} className="h-[360px] w-full overflow-hidden rounded-lg" />
                        {gridStatus !== 'ready' && (
                            <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 rounded-lg bg-white/80 dark:bg-gray-900/80 text-sm text-gray-600 dark:text-gray-300">
                                {gridStatus === 'loading' ? (
                                    <>
                                        <div className="spinner" />
                                        <p>正在加载 DataGridXL...</p>
                                    </>
                                ) : (
                                    <>
                                        <p>DataGridXL 加载失败，请检查网络后重试。</p>
                                        <button
                                            onClick={retryGrid}
                                            className="text-primary font-semibold"
                                        >
                                            重新加载
                                        </button>
                                    </>
                                )}
                            </div>
                        )}
                    </div>
                </div>

                <div className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-background-dark p-6 shadow-sm flex flex-col gap-4">
                    <div className="flex items-center rounded-lg bg-gray-100 dark:bg-white/5 p-1.5">
                        {(['markdown', 'latex', 'word'] as TableFormat[]).map(format => (
                            <button
                                key={format}
                                onClick={() => setActiveFormat(format)}
                                className={`flex-1 rounded-md px-3 py-2 text-sm font-semibold capitalize transition-all ${
                                    activeFormat === format
                                        ? 'bg-white text-gray-900 shadow-sm dark:bg-gray-700 dark:text-gray-50'
                                        : 'text-gray-500 dark:text-gray-400'
                                }`}
                            >
                                {format}
                            </button>
                        ))}
                    </div>

                    <textarea
                        value={formattedOutput}
                        readOnly
                        className="min-h-[320px] flex-1 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50 px-4 py-3 text-sm font-mono text-gray-800 dark:text-gray-100"
                    />

                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                            支持直接复制或下载为 {activeFormat === 'markdown' ? '.md' : activeFormat === 'latex' ? '.tex' : '.doc'} 文件。
                        </p>
                        <div className="flex gap-3">
                            <button
                                onClick={handleCopy}
                                className="flex items-center gap-1 rounded-lg border border-gray-300 dark:border-gray-700 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800"
                            >
                                <span className="material-symbols-outlined text-base">content_copy</span>
                                <span>{copySuccess ? '已复制!' : '复制'}</span>
                            </button>
                            <button
                                onClick={handleDownload}
                                className="flex items-center gap-1 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white shadow hover:opacity-90"
                                style={{ backgroundColor: '#607AFB' }}
                            >
                                <span className="material-symbols-outlined text-base">download</span>
                                下载
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            </div>
        </div>
    );
};

export default TableConverter;
