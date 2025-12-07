import React, { useState, useCallback, useEffect } from 'react';
import { decompressFrames, parseGIF } from 'gifuct-js';

// Declare GIF global
declare global {
    interface Window {
        GIF: any;
    }
}

type ImageFormat = 'png' | 'jpeg' | 'webp' | 'gif' | 'bmp';

const ImageConverterTool: React.FC = () => {
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string>('');
    const [targetFormat, setTargetFormat] = useState<ImageFormat>('jpeg');
    const [convertedUrl, setConvertedUrl] = useState<string>('');
    const [isConverting, setIsConverting] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [quality, setQuality] = useState<number>(0.8);
    const [convertedSize, setConvertedSize] = useState<number>(0);
    const [originalSize, setOriginalSize] = useState<number>(0);
    const [gifQuality, setGifQuality] = useState<'lowest' | 'low' | 'medium' | 'high' | 'highest'>('medium'); // GIF 质量档位，默认平衡

    const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (!file.type.startsWith('image/')) {
            setError('请选择图片文件');
            return;
        }

        setSelectedFile(file);
        setOriginalSize(file.size);
        setError(null);
        setConvertedUrl('');
        setConvertedSize(0);

        const reader = new FileReader();
        reader.onload = (e) => {
            const dataUrl = e.target?.result as string;
            setPreviewUrl(dataUrl);
            // 自动触发转换
            performConversion(dataUrl, targetFormat, quality, gifQuality);
        };
        reader.readAsDataURL(file);
    }, [targetFormat, quality, gifQuality]);

    const performConversion = async (imageDataUrl: string, format: ImageFormat, qualityValue: number, gifQualityLevel: 'lowest' | 'low' | 'medium' | 'high' | 'highest' = 'high') => {
        setIsConverting(true);
        setError(null);

        // GIF 质量档位对应的参数 - 5个档位提供更细粒度的控制
        const gifSettingsMap = {
            'lowest': {
                colors: 32,        // 最少颜色
                quality: 30,       // 最低质量（最快）
                sample: 3,         // 跳过2/3的帧
                dither: false,
                description: '极限压缩'
            },
            'low': {
                colors: 64,
                quality: 20,
                sample: 2,         // 跳过一半的帧
                dither: false,
                description: '高压缩'
            },
            'medium': {
                colors: 128,
                quality: 10,
                sample: 1,         // 不跳帧
                dither: false,
                description: '平衡'
            },
            'high': {
                colors: 192,
                quality: 5,
                sample: 1,
                dither: true,      // 启用抖动
                description: '高质量'
            },
            'highest': {
                colors: 256,       // 最多颜色
                quality: 1,        // 最高质量（最慢）
                sample: 1,
                dither: true,
                description: '最高质量'
            }
        };
        const settings = gifSettingsMap[gifQualityLevel];

        // 如果目标格式是 GIF，需要检查源文件是否是 GIF
        if (format === 'gif' && selectedFile && selectedFile.type === 'image/gif') {
            // 处理 GIF 到 GIF 的压缩（动态 GIF）
            try {
                if (!window.GIF) {
                    setError('GIF 库未加载,请刷新页面重试');
                    setIsConverting(false);
                    return;
                }

                const arrayBuffer = await selectedFile.arrayBuffer();
                const gifData = parseGIF(arrayBuffer);
                const frames = decompressFrames(gifData, true);

                const gif = new window.GIF({
                    workers: 2,
                    quality: settings.quality,
                    workerScript: '/gif.worker.js',
                    width: frames[0].dims.width,
                    height: frames[0].dims.height,
                    transparent: 'rgba(0,0,0,0)',
                    dither: settings.dither,
                    colors: settings.colors
                });

                // 为每一帧创建 canvas 并添加到 GIF (支持跳帧采样)
                for (let i = 0; i < frames.length; i += settings.sample) {
                    const frame = frames[i];
                    const canvas = document.createElement('canvas');
                    canvas.width = frame.dims.width;
                    canvas.height = frame.dims.height;
                    const ctx = canvas.getContext('2d');

                    if (!ctx) continue;

                    const imageData = new ImageData(
                        new Uint8ClampedArray(frame.patch),
                        frame.dims.width,
                        frame.dims.height
                    );
                    ctx.putImageData(imageData, 0, 0);

                    gif.addFrame(ctx, {
                        copy: true,
                        delay: (frame.delay || 100) * settings.sample  // 跳帧后需要调整延迟
                    });
                }

                gif.on('finished', (blob: Blob) => {
                    // 智能优化：如果压缩后的文件比原始文件大，使用原始文件
                    if (blob.size < selectedFile.size) {
                        setConvertedSize(blob.size);
                        const url = URL.createObjectURL(blob);
                        setConvertedUrl(url);
                    } else {
                        // 使用原始文件
                        setConvertedSize(selectedFile.size);
                        const url = URL.createObjectURL(selectedFile);
                        setConvertedUrl(url);
                    }
                    setIsConverting(false);
                });

                gif.render();
                return;
            } catch (err) {
                console.error('GIF compression error:', err);
                setError('GIF 压缩失败: ' + (err instanceof Error ? err.message : '未知错误'));
                setIsConverting(false);
                return;
            }
        }

        // 其他格式转换（包括静态图片转 GIF）
        const img = new Image();
        img.onload = () => {
            const canvas = document.createElement('canvas');
            canvas.width = img.width;
            canvas.height = img.height;

            const ctx = canvas.getContext('2d');
            if (!ctx) {
                setError('Canvas 上下文创建失败');
                setIsConverting(false);
                return;
            }

            ctx.drawImage(img, 0, 0);

            // GIF 格式特殊处理
            if (format === 'gif') {
                if (!window.GIF) {
                    setError('GIF 库未加载,请刷新页面重试');
                    setIsConverting(false);
                    return;
                }

                try {
                    const gif = new window.GIF({
                        workers: 2,
                        quality: settings.quality,
                        workerScript: '/gif.worker.js',
                        width: img.width,
                        height: img.height,
                        transparent: 'rgba(0,0,0,0)',
                        background: '#fff',
                        dither: settings.dither,
                        colors: settings.colors
                    });

                    gif.addFrame(ctx, { copy: true, delay: 0 });

                    gif.on('finished', (blob: Blob) => {
                        setConvertedSize(blob.size);
                        const url = URL.createObjectURL(blob);
                        setConvertedUrl(url);
                        setIsConverting(false);
                    });

                    gif.render();
                } catch (err) {
                    console.error('GIF conversion error:', err);
                    setError('GIF 转换失败');
                    setIsConverting(false);
                }
                return;
            }

            // 其他格式使用 Canvas toBlob
            const mimeType = `image/${format === 'jpeg' ? 'jpeg' : format}`;
            // 为支持压缩的格式设置质量参数
            const useQuality = format === 'jpeg' || format === 'webp';

            canvas.toBlob((blob) => {
                if (!blob) {
                    setError('图片转换失败');
                    setIsConverting(false);
                    return;
                }

                setConvertedSize(blob.size);
                const url = URL.createObjectURL(blob);
                setConvertedUrl(url);
                setIsConverting(false);
            }, mimeType, useQuality ? qualityValue : undefined);
        };

        img.onerror = () => {
            setError('图片加载失败');
            setIsConverting(false);
        };

        img.src = imageDataUrl;
    };

    // 当格式或质量改变时,自动重新转换
    useEffect(() => {
        if (previewUrl) {
            performConversion(previewUrl, targetFormat, quality, gifQuality);
        }
    }, [targetFormat, quality, gifQuality, previewUrl]);

    const handleConvert = useCallback(async () => {
        if (!selectedFile || !previewUrl) {
            setError('请先选择图片');
            return;
        }

        performConversion(previewUrl, targetFormat, quality, gifQuality);
    }, [selectedFile, previewUrl, targetFormat, quality, gifQuality]);

    const formatFileSize = (bytes: number): string => {
        if (bytes === 0) return '0 B';
        const k = 1024;
        const sizes = ['B', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
    };

    const handleDownload = useCallback(() => {
        if (!convertedUrl || !selectedFile) return;

        const a = document.createElement('a');
        a.href = convertedUrl;
        const originalName = selectedFile.name.replace(/\.[^/.]+$/, '');
        a.download = `${originalName}.${targetFormat}`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    }, [convertedUrl, selectedFile, targetFormat]);

    return (
        <div className="flex w-full flex-col items-center px-4 py-10 sm:px-6 lg:px-8">
            <div className="flex w-full max-w-6xl flex-col items-center gap-2 text-center mb-8">
                <p className="text-3xl font-black leading-tight tracking-tighter text-gray-900 dark:text-white sm:text-4xl">在线图片格式转换</p>
                <p className="text-base font-normal text-gray-500 dark:text-gray-400">快速将您的图片转换为 JPG, PNG, WEBP 等多种格式。</p>
            </div>

            <div className="w-full max-w-6xl flex flex-col gap-10">
                {error && (
                    <div className="bg-red-100 dark:bg-red-900/50 border border-red-200 dark:border-red-800 rounded-lg p-4">
                        <p className="text-red-800 dark:text-red-300 text-sm">{error}</p>
                    </div>
                )}

                <div className="w-full rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-background-dark shadow-sm">
                    {!previewUrl ? (
                        <label className="flex flex-col items-center gap-6 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-700 p-8 sm:p-14 text-center cursor-pointer hover:border-primary dark:hover:border-primary transition-colors m-6">
                            <span className="material-symbols-outlined text-5xl text-gray-400 dark:text-gray-500">upload_file</span>
                            <div className="flex flex-col items-center gap-2">
                                <p className="text-lg font-bold text-gray-900 dark:text-white">
                                    {selectedFile ? selectedFile.name : '拖拽图片至此'}
                                </p>
                                <p className="text-sm text-gray-500 dark:text-gray-400">支持 JPG, PNG, BMP, GIF 等格式</p>
                            </div>
                            <span className="flex h-10 min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-lg bg-gray-100 dark:bg-white/10 px-4 text-sm font-bold text-gray-800 dark:text-white transition-colors hover:bg-gray-200 dark:hover:bg-white/20">
                                点击选择文件
                            </span>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleFileSelect}
                                className="hidden"
                            />
                        </label>
                    ) : (
                        <div className="grid grid-cols-1 lg:grid-cols-2">
                            {/* 左侧：图片预览 */}
                            <div className="relative flex flex-col p-6 border-b lg:border-b-0 lg:border-r border-gray-200 dark:border-gray-700/50">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-gray-900 dark:text-white text-base font-semibold leading-normal flex items-center gap-2">
                                        <span className="material-symbols-outlined text-xl">image</span>
                                        原始图片
                                    </h3>
                                    <button
                                        onClick={() => {
                                            setSelectedFile(null);
                                            setPreviewUrl('');
                                            setConvertedUrl('');
                                            setConvertedSize(0);
                                            setOriginalSize(0);
                                        }}
                                        className="text-xs text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                                    >
                                        更换图片
                                    </button>
                                </div>
                                <div className="flex-1 flex items-center justify-center bg-gray-50 dark:bg-gray-900/50 rounded-lg border border-gray-200 dark:border-gray-700 p-4 min-h-[300px]">
                                    <img
                                        src={previewUrl}
                                        alt="Preview"
                                        className="max-w-full max-h-[400px] object-contain"
                                    />
                                </div>
                                {selectedFile && (
                                    <p className="mt-2 text-xs text-gray-500 dark:text-gray-400 text-center">
                                        {selectedFile.name}
                                    </p>
                                )}
                            </div>

                            {/* 右侧：转换选项 */}
                            <div className="relative flex flex-col p-6 bg-gray-50/50 dark:bg-gray-800/30 gap-4">
                                <div className="space-y-3">
                                    <h3 className="px-1 text-base font-bold text-gray-900 dark:text-white">转换为：</h3>
                                    <div className="flex h-12 flex-1 items-center justify-center rounded-lg bg-gray-100 dark:bg-white/5 p-1.5">
                                        {(['jpeg', 'png', 'webp', 'gif'] as ImageFormat[]).map((format) => (
                                            <label
                                                key={format}
                                                className="flex h-full flex-1 cursor-pointer items-center justify-center overflow-hidden rounded-md px-2 text-sm font-medium text-gray-500 dark:text-gray-400 transition-colors has-[:checked]:bg-white has-[:checked]:text-gray-900 has-[:checked]:shadow-sm dark:has-[:checked]:bg-gray-700 dark:has-[:checked]:text-white"
                                            >
                                                <span className="truncate uppercase">{format}</span>
                                                <input
                                                    className="sr-only"
                                                    name="format-select"
                                                    type="radio"
                                                    value={format}
                                                    checked={targetFormat === format}
                                                    onChange={(e) => setTargetFormat(e.target.value as ImageFormat)}
                                                />
                                            </label>
                                        ))}
                                    </div>
                                </div>

                                {(targetFormat === 'jpeg' || targetFormat === 'webp') && (
                                    <div className="space-y-3">
                                        <div className="flex items-center justify-between px-1">
                                            <h3 className="text-sm font-semibold text-gray-900 dark:text-white">图片质量</h3>
                                            <span className="text-sm font-medium text-primary">{Math.round(quality * 100)}%</span>
                                        </div>
                                        <input
                                            type="range"
                                            min="0.1"
                                            max="1"
                                            step="0.05"
                                            value={quality}
                                            onChange={(e) => setQuality(parseFloat(e.target.value))}
                                            className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-primary"
                                        />
                                        <p className="text-xs text-gray-500 dark:text-gray-400">💡 降低质量可以减小文件大小,建议值: 70-85%</p>
                                    </div>
                                )}

                                {targetFormat === 'png' && (
                                    <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                                        <p className="text-xs text-blue-600 dark:text-blue-400">
                                            💡 PNG 是无损格式,不支持质量压缩。如需减小文件大小,建议转换为 JPEG 或 WebP 格式。
                                        </p>
                                    </div>
                                )}

                                {targetFormat === 'gif' && (
                                    <div className="space-y-2">
                                        <div className="flex items-center justify-between px-1">
                                            <h3 className="text-sm font-semibold text-gray-900 dark:text-white">压缩质量</h3>
                                            <span className="text-sm font-medium text-primary">
                                                {gifQuality === 'lowest' && '极限压缩'}
                                                {gifQuality === 'low' && '高压缩'}
                                                {gifQuality === 'medium' && '平衡'}
                                                {gifQuality === 'high' && '高质量'}
                                                {gifQuality === 'highest' && '最高质量'}
                                            </span>
                                        </div>
                                        <input
                                            type="range"
                                            min="0"
                                            max="4"
                                            step="1"
                                            value={
                                                gifQuality === 'lowest' ? 0 :
                                                gifQuality === 'low' ? 1 :
                                                gifQuality === 'medium' ? 2 :
                                                gifQuality === 'high' ? 3 : 4
                                            }
                                            onChange={(e) => {
                                                const val = parseInt(e.target.value);
                                                setGifQuality(
                                                    val === 0 ? 'lowest' :
                                                    val === 1 ? 'low' :
                                                    val === 2 ? 'medium' :
                                                    val === 3 ? 'high' : 'highest'
                                                );
                                            }}
                                            className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-primary"
                                        />
                                        <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 px-1">
                                            <span>极限</span>
                                            <span>高压</span>
                                            <span>平衡</span>
                                            <span>高质</span>
                                            <span>最高</span>
                                        </div>
                                        <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded text-xs text-gray-600 dark:text-gray-400">
                                            {gifQuality === 'lowest' && '💡 32色 + 跳2/3帧，文件极小，适合表情包'}
                                            {gifQuality === 'low' && '💡 64色 + 跳帧，文件较小，适合简单动画'}
                                            {gifQuality === 'medium' && '💡 128色，平衡质量和大小'}
                                            {gifQuality === 'high' && '💡 192色 + 抖动，高质量，文件适中'}
                                            {gifQuality === 'highest' && '💡 256色 + 抖动，质量最佳，文件最大'}
                                        </div>
                                    </div>
                                )}

                                {(originalSize > 0 || convertedSize > 0) && (
                                    <div className="flex flex-col gap-2 px-1 text-sm">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <span className="text-gray-600 dark:text-gray-400">原始大小: </span>
                                                <span className="font-semibold text-gray-900 dark:text-white">{formatFileSize(originalSize)}</span>
                                            </div>
                                            {convertedSize > 0 && (
                                                <div>
                                                    <span className="text-gray-600 dark:text-gray-400">转换后: </span>
                                                    <span className={`font-semibold ${convertedSize < originalSize ? 'text-green-600 dark:text-green-400' : 'text-orange-600 dark:text-orange-400'}`}>
                                                        {formatFileSize(convertedSize)}
                                                    </span>
                                                    <span className={`ml-1 text-xs ${convertedSize < originalSize ? 'text-green-600 dark:text-green-400' : 'text-orange-600 dark:text-orange-400'}`}>
                                                        ({convertedSize < originalSize ? '-' : '+'}{Math.abs(Math.round((convertedSize - originalSize) / originalSize * 100))}%)
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                        {convertedSize > originalSize && targetFormat === 'png' && (
                                            <p className="text-xs text-orange-600 dark:text-orange-400">
                                                ⚠️ 文件变大是因为 Canvas 导出的 PNG 未经过优化压缩。原始文件可能已经过高度压缩。
                                            </p>
                                        )}
                                        {convertedSize === originalSize && targetFormat === 'gif' && (
                                            <p className="text-xs text-blue-600 dark:text-blue-400">
                                                ℹ️ 已使用原始文件（原始文件已经是最优的）
                                            </p>
                                        )}
                                    </div>
                                )}

                                <button
                                    onClick={handleDownload}
                                    disabled={!convertedUrl || isConverting}
                                    style={{ backgroundColor: '#607AFB' }}
                                    className="flex h-11 w-full cursor-pointer items-center justify-center gap-2 overflow-hidden rounded-lg px-6 text-sm font-bold text-white shadow-lg transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                    {isConverting ? (
                                        <>
                                            <div className="spinner"></div>
                                            <span className="truncate">转换中...</span>
                                        </>
                                    ) : (
                                        <>
                                            <span className="material-symbols-outlined">download</span>
                                            <span className="truncate">下载转换后的图片</span>
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ImageConverterTool;
