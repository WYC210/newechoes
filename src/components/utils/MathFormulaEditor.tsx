import React, { useState, useCallback, useEffect, useRef } from 'react';

// Declare KaTeX global
declare global {
    interface Window {
        katex: any;
    }
}

// 符号分类
const SYMBOL_CATEGORIES = {
    '基本运算': [
        { symbol: '+', latex: '+' },
        { symbol: '-', latex: '-' },
        { symbol: '×', latex: '\\times' },
        { symbol: '÷', latex: '\\div' },
        { symbol: '±', latex: '\\pm' },
        { symbol: '∓', latex: '\\mp' },
        { symbol: '·', latex: '\\cdot' },
        { symbol: '∗', latex: '\\ast' },
        { symbol: '⊕', latex: '\\oplus' },
        { symbol: '⊗', latex: '\\otimes' },
    ],
    '关系符号': [
        { symbol: '=', latex: '=' },
        { symbol: '≠', latex: '\\neq' },
        { symbol: '<', latex: '<' },
        { symbol: '>', latex: '>' },
        { symbol: '≤', latex: '\\leq' },
        { symbol: '≥', latex: '\\geq' },
        { symbol: '≈', latex: '\\approx' },
        { symbol: '≡', latex: '\\equiv' },
        { symbol: '∼', latex: '\\sim' },
        { symbol: '∈', latex: '\\in' },
        { symbol: '∉', latex: '\\notin' },
        { symbol: '⊂', latex: '\\subset' },
        { symbol: '⊃', latex: '\\supset' },
        { symbol: '⊆', latex: '\\subseteq' },
        { symbol: '⊇', latex: '\\supseteq' },
        { symbol: '∝', latex: '\\propto' },
    ],
    '希腊字母': [
        { symbol: 'α', latex: '\\alpha' },
        { symbol: 'β', latex: '\\beta' },
        { symbol: 'γ', latex: '\\gamma' },
        { symbol: 'δ', latex: '\\delta' },
        { symbol: 'ε', latex: '\\epsilon' },
        { symbol: 'ζ', latex: '\\zeta' },
        { symbol: 'η', latex: '\\eta' },
        { symbol: 'θ', latex: '\\theta' },
        { symbol: 'ι', latex: '\\iota' },
        { symbol: 'κ', latex: '\\kappa' },
        { symbol: 'λ', latex: '\\lambda' },
        { symbol: 'μ', latex: '\\mu' },
        { symbol: 'ν', latex: '\\nu' },
        { symbol: 'ξ', latex: '\\xi' },
        { symbol: 'π', latex: '\\pi' },
        { symbol: 'ρ', latex: '\\rho' },
        { symbol: 'σ', latex: '\\sigma' },
        { symbol: 'τ', latex: '\\tau' },
        { symbol: 'υ', latex: '\\upsilon' },
        { symbol: 'φ', latex: '\\phi' },
        { symbol: 'χ', latex: '\\chi' },
        { symbol: 'ψ', latex: '\\psi' },
        { symbol: 'ω', latex: '\\omega' },
        { symbol: 'Γ', latex: '\\Gamma' },
        { symbol: 'Δ', latex: '\\Delta' },
        { symbol: 'Θ', latex: '\\Theta' },
        { symbol: 'Λ', latex: '\\Lambda' },
        { symbol: 'Ξ', latex: '\\Xi' },
        { symbol: 'Π', latex: '\\Pi' },
        { symbol: 'Σ', latex: '\\Sigma' },
        { symbol: 'Φ', latex: '\\Phi' },
        { symbol: 'Ψ', latex: '\\Psi' },
        { symbol: 'Ω', latex: '\\Omega' },
    ],
    '上下标': [
        { symbol: 'x²', latex: 'x^2' },
        { symbol: 'x³', latex: 'x^3' },
        { symbol: 'xⁿ', latex: 'x^{n}' },
        { symbol: 'x₁', latex: 'x_1' },
        { symbol: 'x₂', latex: 'x_2' },
        { symbol: 'xᵢ', latex: 'x_{i}' },
        { symbol: 'x^y_z', latex: 'x^{y}_{z}' },
    ],
    '分数根号': [
        { symbol: '√x', latex: '\\sqrt{x}' },
        { symbol: 'ⁿ√x', latex: '\\sqrt[n]{x}' },
        { symbol: 'a/b', latex: '\\frac{a}{b}' },
        { symbol: 'ᵃ⁄ᵦ', latex: '\\dfrac{a}{b}' },
        { symbol: '∛', latex: '\\sqrt[3]{x}' },
    ],
    '求和积分': [
        { symbol: '∑', latex: '\\sum' },
        { symbol: '∑ⁿᵢ₌₁', latex: '\\sum_{i=1}^{n}' },
        { symbol: '∫', latex: '\\int' },
        { symbol: '∫ᵇₐ', latex: '\\int_{a}^{b}' },
        { symbol: '∬', latex: '\\iint' },
        { symbol: '∭', latex: '\\iiint' },
        { symbol: '∮', latex: '\\oint' },
        { symbol: '∏', latex: '\\prod' },
        { symbol: '∏ⁿᵢ₌₁', latex: '\\prod_{i=1}^{n}' },
        { symbol: 'lim', latex: '\\lim_{x \\to \\infty}' },
        { symbol: 'lim→0', latex: '\\lim_{x \\to 0}' },
    ],
    '箭头': [
        { symbol: '→', latex: '\\rightarrow' },
        { symbol: '←', latex: '\\leftarrow' },
        { symbol: '↔', latex: '\\leftrightarrow' },
        { symbol: '⇒', latex: '\\Rightarrow' },
        { symbol: '⇐', latex: '\\Leftarrow' },
        { symbol: '⇔', latex: '\\Leftrightarrow' },
        { symbol: '↑', latex: '\\uparrow' },
        { symbol: '↓', latex: '\\downarrow' },
        { symbol: '⟶', latex: '\\longrightarrow' },
        { symbol: '⟵', latex: '\\longleftarrow' },
    ],
    '特殊符号': [
        { symbol: '∞', latex: '\\infty' },
        { symbol: '∂', latex: '\\partial' },
        { symbol: '∇', latex: '\\nabla' },
        { symbol: '∀', latex: '\\forall' },
        { symbol: '∃', latex: '\\exists' },
        { symbol: '∅', latex: '\\emptyset' },
        { symbol: '∪', latex: '\\cup' },
        { symbol: '∩', latex: '\\cap' },
        { symbol: '∧', latex: '\\land' },
        { symbol: '∨', latex: '\\lor' },
        { symbol: '¬', latex: '\\lnot' },
        { symbol: '⊥', latex: '\\perp' },
        { symbol: '∥', latex: '\\parallel' },
        { symbol: '∠', latex: '\\angle' },
        { symbol: '°', latex: '^\\circ' },
        { symbol: '…', latex: '\\ldots' },
        { symbol: '⋯', latex: '\\cdots' },
        { symbol: '⋮', latex: '\\vdots' },
        { symbol: '⋱', latex: '\\ddots' },
    ],
    '括号': [
        { symbol: '( )', latex: '\\left( \\right)' },
        { symbol: '[ ]', latex: '\\left[ \\right]' },
        { symbol: '{ }', latex: '\\left\\{ \\right\\}' },
        { symbol: '⟨ ⟩', latex: '\\langle \\rangle' },
        { symbol: '| |', latex: '\\left| \\right|' },
        { symbol: '|| ||', latex: '\\left\\| \\right\\|' },
        { symbol: '⌊ ⌋', latex: '\\lfloor \\rfloor' },
        { symbol: '⌈ ⌉', latex: '\\lceil \\rceil' },
    ],
    '矩阵': [
        { symbol: '2×2', latex: '\\begin{pmatrix} a & b \\\\ c & d \\end{pmatrix}' },
        { symbol: '3×3', latex: '\\begin{pmatrix} a & b & c \\\\ d & e & f \\\\ g & h & i \\end{pmatrix}' },
        { symbol: '[2×2]', latex: '\\begin{bmatrix} a & b \\\\ c & d \\end{bmatrix}' },
        { symbol: '[3×3]', latex: '\\begin{bmatrix} a & b & c \\\\ d & e & f \\\\ g & h & i \\end{bmatrix}' },
        { symbol: '|2��2|', latex: '\\begin{vmatrix} a & b \\\\ c & d \\end{vmatrix}' },
        { symbol: 'cases', latex: '\\begin{cases} x & x > 0 \\\\ -x & x \\leq 0 \\end{cases}' },
    ],
    '文本': [
        { symbol: '文本', latex: '\\text{文本}' },
        { symbol: '中文', latex: '\\text{中文}' },
        { symbol: '加粗', latex: '\\textbf{粗体}' },
        { symbol: '斜体', latex: '\\textit{斜体}' },
        { symbol: '空格', latex: '\\quad' },
        { symbol: '大空格', latex: '\\qquad' },
        { symbol: '小空格', latex: '\\,' },
    ],
};

// 常用公式模板
const FORMULA_TEMPLATES = [
    { name: '二次公式', latex: 'x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}', category: '代数' },
    { name: '勾股定理', latex: 'a^2 + b^2 = c^2', category: '几何' },
    { name: '欧拉公式', latex: 'e^{i\\pi} + 1 = 0', category: '数学' },
    { name: '导数定义', latex: 'f\'(x) = \\lim_{h \\to 0} \\frac{f(x+h) - f(x)}{h}', category: '微积分' },
    { name: '泰勒展开', latex: 'f(x) = \\sum_{n=0}^{\\infty} \\frac{f^{(n)}(a)}{n!}(x-a)^n', category: '微积分' },
    { name: '正态分布', latex: 'f(x) = \\frac{1}{\\sigma\\sqrt{2\\pi}} e^{-\\frac{(x-\\mu)^2}{2\\sigma^2}}', category: '统计' },
    { name: '麦克斯韦方程', latex: '\\nabla \\cdot \\vec{E} = \\frac{\\rho}{\\epsilon_0}', category: '物理' },
    { name: '薛定谔方程', latex: 'i\\hbar\\frac{\\partial}{\\partial t}\\Psi = \\hat{H}\\Psi', category: '物理' },
    { name: '矩阵乘法', latex: '\\begin{pmatrix} a & b \\\\ c & d \\end{pmatrix} \\begin{pmatrix} e & f \\\\ g & h \\end{pmatrix} = \\begin{pmatrix} ae+bg & af+bh \\\\ ce+dg & cf+dh \\end{pmatrix}', category: '线性代数' },
    { name: '行列式', latex: '\\begin{vmatrix} a & b \\\\ c & d \\end{vmatrix} = ad - bc', category: '线性代数' },
    { name: '分部积分', latex: '\\int u \\, dv = uv - \\int v \\, du', category: '微积分' },
    { name: '柯西不等式', latex: '\\left(\\sum_{i=1}^n a_i b_i\\right)^2 \\leq \\left(\\sum_{i=1}^n a_i^2\\right) \\left(\\sum_{i=1}^n b_i^2\\right)', category: '代数' },
];

type LatexWrapperType = 'none' | '$$' | '$' | 'equation';

const MathFormulaEditor: React.FC = () => {
    const [latexInput, setLatexInput] = useState<string>('');
    const [renderedHtml, setRenderedHtml] = useState<string>('');
    const [mathmlOutput, setMathmlOutput] = useState<string>('');
    const [error, setError] = useState<string | null>(null);
    const [copyLatexSuccess, setCopyLatexSuccess] = useState<boolean>(false);
    const [copyMathmlSuccess, setCopyMathmlSuccess] = useState<boolean>(false);
    const [isNotificationFadingOut, setIsNotificationFadingOut] = useState<boolean>(false);
    const [notificationMessage, setNotificationMessage] = useState<string>('');
    const [activeTab, setActiveTab] = useState<'symbols' | 'templates'>('symbols');
    const [activeCategory, setActiveCategory] = useState<string>('基本运算');
    const [latexWrapper, setLatexWrapper] = useState<LatexWrapperType>('none');

    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const renderTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    const performRender = useCallback((latex: string) => {
        if (!latex.trim()) {
            setRenderedHtml('');
            setMathmlOutput('');
            setError(null);
            return;
        }

        if (!window.katex) {
            setError('KaTeX 库未加载,请刷新页面重试。');
            return;
        }

        try {
            const html = window.katex.renderToString(latex, {
                throwOnError: false,
                displayMode: true,
                output: 'html',
                strict: false,
                trust: true
            });
            setRenderedHtml(html);

            const mathml = window.katex.renderToString(latex, {
                throwOnError: false,
                displayMode: true,
                output: 'mathml',
                strict: false,
                trust: true
            });
            setMathmlOutput(mathml);

            setError(null);
        } catch (err: any) {
            console.error('KaTeX render error:', err);
            setError(err.message || '公式渲染失败');
            setRenderedHtml('');
            setMathmlOutput('');
        }
    }, []);

    useEffect(() => {
        if (renderTimeoutRef.current) {
            clearTimeout(renderTimeoutRef.current);
        }

        renderTimeoutRef.current = setTimeout(() => {
            performRender(latexInput);
        }, 300);

        return () => {
            if (renderTimeoutRef.current) {
                clearTimeout(renderTimeoutRef.current);
            }
        };
    }, [latexInput, performRender]);

    const showNotification = useCallback((message: string) => {
        setNotificationMessage(message);
        setCopyLatexSuccess(message.includes('LaTeX') || message.includes('Word'));
        setCopyMathmlSuccess(message.includes('MathML'));
        setIsNotificationFadingOut(false);

        setTimeout(() => setIsNotificationFadingOut(true), 1700);
        setTimeout(() => {
            setCopyLatexSuccess(false);
            setCopyMathmlSuccess(false);
            setIsNotificationFadingOut(false);
        }, 2000);
    }, []);

    const handleCopyLatex = useCallback(() => {
        if (!latexInput) return;

        let textToCopy = latexInput;

        // 根据选择的包裹方式处理 LaTeX 代码
        switch (latexWrapper) {
            case '$$':
                textToCopy = `$$${latexInput}$$`;
                break;
            case '$':
                textToCopy = `$${latexInput}$`;
                break;
            case 'equation':
                textToCopy = `\\begin{equation}\n${latexInput}\n\\end{equation}`;
                break;
            case 'none':
            default:
                textToCopy = latexInput;
                break;
        }

        navigator.clipboard.writeText(textToCopy).then(() => {
            showNotification('已复制 LaTeX 格式到剪贴板!');
        }).catch(err => console.error('Failed to copy LaTeX: ', err));
    }, [latexInput, latexWrapper, showNotification]);

    const handleCopyForWord = useCallback(async () => {
        if (!mathmlOutput) return;

        try {
            // 为 Word 兼容性，同时复制 HTML 和纯文本格式
            const blob = new Blob([mathmlOutput], { type: 'text/html' });
            const clipboardItem = new ClipboardItem({
                'text/html': blob,
                'text/plain': new Blob([mathmlOutput], { type: 'text/plain' })
            });

            await navigator.clipboard.write([clipboardItem]);
            showNotification('已复制到 Word 格式!');
        } catch (err) {
            // 如果浏览器不支持 ClipboardItem，回退到普通复制
            console.error('Failed to copy for Word with ClipboardItem: ', err);
            try {
                await navigator.clipboard.writeText(mathmlOutput);
                showNotification('已复制到 Word 格式!');
            } catch (fallbackErr) {
                console.error('Failed to copy for Word: ', fallbackErr);
            }
        }
    }, [mathmlOutput, showNotification]);

    const insertSymbol = useCallback((latex: string) => {
        if (!textareaRef.current) return;

        const textarea = textareaRef.current;
        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const text = latexInput;

        const newText = text.substring(0, start) + latex + text.substring(end);
        setLatexInput(newText);

        setTimeout(() => {
            const cursorPos = start + latex.length;
            textarea.setSelectionRange(cursorPos, cursorPos);
            textarea.focus();
        }, 0);
    }, [latexInput]);

    const handleClear = useCallback(() => {
        setLatexInput('');
        setRenderedHtml('');
        setMathmlOutput('');
        setError(null);
    }, []);

    return (
        <div className="flex w-full flex-col items-center px-4 py-6 sm:px-6 lg:px-8">
            <div className="flex w-full max-w-7xl flex-col items-center gap-2 text-center mb-6">
                <p className="text-3xl font-black leading-tight tracking-tighter text-gray-900 dark:text-white sm:text-4xl">LaTeX 数学公式编辑器</p>
                <p className="text-base font-normal text-gray-500 dark:text-gray-400">在线编辑 LaTeX 数学公式,实时预览并支持复制为多种格式。</p>
            </div>

            {(copyLatexSuccess || copyMathmlSuccess) && (
                <div className={`fixed top-8 left-1/2 -translate-x-1/2 z-50 ${isNotificationFadingOut ? 'animate-fade-out-up' : 'animate-fade-in-down'}`}>
                    <div className="bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-2">
                        <span className="material-symbols-outlined text-xl">check_circle</span>
                        <span className="font-medium">{notificationMessage}</span>
                    </div>
                </div>
            )}

            <div className="w-full max-w-7xl">
                {/* 符号/模板切换标签 */}
                <div className="bg-white dark:bg-gray-800 rounded-t-xl border border-gray-200 dark:border-gray-700 flex items-center">
                    <button
                        onClick={() => setActiveTab('symbols')}
                        style={activeTab === 'symbols' ? { backgroundColor: '#607AFB', color: 'white' } : {}}
                        className={`px-6 py-3 text-sm font-medium transition-colors ${
                            activeTab === 'symbols'
                                ? 'rounded-tl-xl'
                                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                        }`}
                    >
                        快捷符号
                    </button>
                    <button
                        onClick={() => setActiveTab('templates')}
                        style={activeTab === 'templates' ? { backgroundColor: '#607AFB', color: 'white' } : {}}
                        className={`px-6 py-3 text-sm font-medium transition-colors ${
                            activeTab === 'templates'
                                ? ''
                                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                        }`}
                    >
                        公式模板
                    </button>
                    <button
                        onClick={handleClear}
                        className="ml-auto mr-3 flex items-center gap-1 px-3 py-1.5 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded text-sm hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                    >
                        <span className="material-symbols-outlined text-base">delete</span>清空
                    </button>
                </div>

                {/* 符号面板 */}
                {activeTab === 'symbols' && (
                    <div className="bg-white dark:bg-gray-800 border-x border-gray-200 dark:border-gray-700">
                        <div className="flex overflow-x-auto border-b border-gray-200 dark:border-gray-700 scrollbar-thin">
                            {Object.keys(SYMBOL_CATEGORIES).map((category) => (
                                <button
                                    key={category}
                                    onClick={() => setActiveCategory(category)}
                                    className={`px-4 py-2 text-sm font-medium whitespace-nowrap transition-colors ${
                                        activeCategory === category
                                            ? 'bg-blue-50 dark:bg-blue-900/30 text-primary border-b-2 border-primary'
                                            : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                                    }`}
                                >
                                    {category}
                                </button>
                            ))}
                        </div>
                        <div className="p-4 grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-12 gap-2 max-h-[200px] overflow-y-auto">
                            {SYMBOL_CATEGORIES[activeCategory as keyof typeof SYMBOL_CATEGORIES].map((item, index) => (
                                <button
                                    key={index}
                                    onClick={() => insertSymbol(item.latex)}
                                    className="h-10 flex items-center justify-center bg-gray-50 dark:bg-gray-700 hover:bg-primary/10 dark:hover:bg-primary/20 border border-gray-200 dark:border-gray-600 rounded text-lg transition-colors"
                                    title={item.latex}
                                >
                                    {item.symbol}
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {/* 公式模板 */}
                {activeTab === 'templates' && (
                    <div className="bg-white dark:bg-gray-800 border-x border-gray-200 dark:border-gray-700 p-4 max-h-[300px] overflow-y-auto">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                            {FORMULA_TEMPLATES.map((template, index) => {
                                // 渲染每个模板的预览
                                let renderedPreview = '';
                                try {
                                    if (window.katex) {
                                        renderedPreview = window.katex.renderToString(template.latex, {
                                            throwOnError: false,
                                            displayMode: true,
                                            output: 'html',
                                            strict: false,
                                            trust: true
                                        });
                                    }
                                } catch (err) {
                                    console.error('Template render error:', err);
                                }

                                return (
                                    <button
                                        key={index}
                                        onClick={() => setLatexInput(template.latex)}
                                        className="text-left p-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded hover:border-primary dark:hover:border-primary transition-colors group"
                                        title={template.latex}
                                    >
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="text-xs font-semibold text-gray-900 dark:text-gray-100">{template.name}</span>
                                            <span className="text-xs px-2 py-0.5 bg-primary/10 text-primary rounded">{template.category}</span>
                                        </div>
                                        {/* 渲染的公式预览 */}
                                        <div className="bg-white dark:bg-gray-800 rounded p-2 flex items-center justify-center min-h-[60px] overflow-x-auto">
                                            {renderedPreview ? (
                                                <div className="text-gray-900 dark:text-gray-100" style={{ fontSize: '0.9rem' }} dangerouslySetInnerHTML={{ __html: renderedPreview }} />
                                            ) : (
                                                <span className="text-xs text-gray-400">预览加载中...</span>
                                            )}
                                        </div>
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                )}

                {/* 主编辑区域 */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 border border-gray-200 dark:border-gray-700">
                    <div className="bg-white dark:bg-gray-800 p-4 border-b lg:border-b-0 lg:border-r border-gray-200 dark:border-gray-700">
                        <div className="flex items-center justify-between mb-2">
                            <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">LaTeX 代码</h3>
                            <span className="text-xs text-gray-400">{latexInput.length} 字符</span>
                        </div>
                        <textarea
                            ref={textareaRef}
                            value={latexInput}
                            onChange={(e) => setLatexInput(e.target.value)}
                            className="w-full h-64 resize-none rounded border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary/50 p-3 text-sm font-mono"
                            placeholder="在此输入 LaTeX 代码..."
                        ></textarea>
                    </div>

                    <div className="bg-gray-50 dark:bg-gray-900/50 p-4">
                        <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">实时预览</h3>
                        <div className="w-full h-64 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 flex items-center justify-center overflow-auto p-4">
                            {error ? (
                                <div className="text-red-500 text-sm text-center">
                                    <span className="material-symbols-outlined text-3xl block mb-2">error</span>
                                    {error}
                                </div>
                            ) : renderedHtml ? (
                                <div className="text-gray-900 dark:text-gray-100" style={{ fontSize: '1.5rem' }} dangerouslySetInnerHTML={{ __html: renderedHtml }} />
                            ) : (
                                <div className="text-gray-400 text-sm text-center">
                                    <span className="material-symbols-outlined text-4xl block mb-2 opacity-50">calculate</span>
                                    输入公式后将在此处显示预览
                                </div>
                            )}
                        </div>
                        <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                            <p>💡 提示: 输入中文请使用 \text{'{'}中文{'}'} 格式,或点击"文本"分类中的模板</p>
                        </div>
                    </div>
                </div>

                {/* 复制按钮区域 */}
                <div className="bg-white dark:bg-gray-800 rounded-b-xl border-x border-b border-gray-200 dark:border-gray-700 p-3 flex flex-wrap items-center gap-2">
                    <div className="flex items-center gap-2">
                        <select
                            value={latexWrapper}
                            onChange={(e) => setLatexWrapper(e.target.value as LatexWrapperType)}
                            className="text-xs px-2 py-1.5 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-primary/50"
                        >
                            <option value="none">无包裹</option>
                            <option value="$$">$$ 包裹</option>
                            <option value="$">$ 包裹</option>
                            <option value="equation">\begin{'{'}equation{'}'} 包裹</option>
                        </select>
                        <button
                            onClick={handleCopyLatex}
                            disabled={!latexInput}
                            className="flex items-center gap-1 px-4 py-2 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded text-sm font-medium hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <span className="material-symbols-outlined text-base">content_copy</span>
                            复制 LaTeX 代码
                        </button>
                    </div>
                    <button
                        onClick={handleCopyForWord}
                        disabled={!mathmlOutput}
                        className="flex items-center gap-1 px-4 py-2 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded text-sm font-medium hover:bg-green-200 dark:hover:bg-green-900/50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <span className="material-symbols-outlined text-base">content_copy</span>
                        复制到 Word
                    </button>
                </div>
            </div>
        </div>
    );
};

export default MathFormulaEditor;
