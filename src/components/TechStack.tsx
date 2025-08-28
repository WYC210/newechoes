import { useState } from 'react';

interface TechItem {
  name: string;
  icon: string;
  color: string;
  description?: string;
  category: 'core' | 'secondary' | 'supporting';
}

const techStack: TechItem[] = [
  // Core Technologies
  { name: 'Python', icon: 'PY', color: 'from-yellow-500 to-yellow-600', description: '爬虫 & AI', category: 'core' },
  { name: 'Java', icon: '☕', color: 'from-red-500 to-red-600', description: '后端开发', category: 'core' },
  { name: 'Vue.js', icon: 'V', color: 'from-green-500 to-green-600', description: '前端框架', category: 'core' },
  
  // Secondary Technologies
  { name: 'JavaScript', icon: 'JS', color: 'from-yellow-400 to-yellow-500', category: 'secondary' },
  { name: 'TypeScript', icon: 'TS', color: 'from-blue-600 to-blue-700', category: 'secondary' },
  { name: 'PyTorch', icon: 'PT', color: 'from-orange-500 to-orange-600', category: 'secondary' },
  { name: 'Spring Boot', icon: '🍃', color: 'from-green-600 to-green-700', category: 'secondary' },
  { name: 'Spring Cloud', icon: '☁️', color: 'from-blue-500 to-blue-600', category: 'secondary' },
  
  // Supporting Technologies
  { name: 'Vite', icon: '⚡', color: 'from-green-400 to-green-500', category: 'supporting' },
  { name: 'MySQL', icon: '🐬', color: 'from-blue-600 to-blue-700', category: 'supporting' },
  { name: 'Redis', icon: '📦', color: 'from-red-600 to-red-700', category: 'supporting' },
  { name: 'Docker', icon: '🐳', color: 'from-blue-500 to-blue-600', category: 'supporting' },
  { name: 'Git', icon: '🌿', color: 'from-gray-700 to-gray-800', category: 'supporting' },
  { name: 'OpenAI', icon: '🤖', color: 'from-pink-500 to-pink-600', category: 'supporting' },
];

export default function TechStack() {
  const [isExpanded, setIsExpanded] = useState(false);

  const coretech = techStack.filter(tech => tech.category === 'core');
  const allTech = techStack;

  const displayTech = isExpanded ? allTech : coretech;

  const getCardSize = (category: string) => {
    switch (category) {
      case 'core': return 'w-20 h-20';
      case 'secondary': return 'w-16 h-16';
      case 'supporting': return 'w-14 h-14';
      default: return 'w-16 h-16';
    }
  };

  const getCardRounding = (category: string) => {
    switch (category) {
      case 'core': return 'rounded-2xl';
      case 'secondary': return 'rounded-xl';
      case 'supporting': return 'rounded-lg';
      default: return 'rounded-xl';
    }
  };

  const getShadow = (category: string) => {
    switch (category) {
      case 'core': return 'shadow-xl';
      case 'secondary': return 'shadow-lg';
      case 'supporting': return 'shadow-md';
      default: return 'shadow-lg';
    }
  };

  const getTextSize = (category: string) => {
    switch (category) {
      case 'core': return 'text-sm';
      case 'secondary': return 'text-xs';
      case 'supporting': return 'text-xs';
      default: return 'text-xs';
    }
  };

  return (
    <div className="bg-[#0f172a] rounded-xl p-8 shadow-lg text-center">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">技术栈</h1>
        <p className="text-gray-600 dark:text-gray-400">我熟练掌握的技术</p>
      </div>

      {/* Tech Stack Display */}
      <div className="flex flex-wrap justify-center gap-6 max-w-4xl mx-auto mb-8">
        {displayTech.map((tech, index) => (
          <div 
            key={tech.name} 
            className={`group text-center transition-all duration-500 ${
              isExpanded ? 'animate-in fade-in slide-in-from-bottom-4' : ''
            }`}
            style={{ 
              animationDelay: isExpanded ? `${index * 50}ms` : '0ms',
              animationFillMode: 'both'
            }}
          >
            <div
              className={`${getCardSize(tech.category)} mx-auto mb-3 bg-gradient-to-br ${tech.color} ${getCardRounding(tech.category)} flex items-center justify-center text-white ${tech.category === 'core' ? 'text-xl' : 'text-lg'} group-hover:scale-110 transition-all duration-300 ${getShadow(tech.category)}`}
            >
              {tech.icon}
            </div>
            <h4 className={`font-semibold text-gray-900 dark:text-white ${getTextSize(tech.category)}`}>
              {tech.name}
            </h4>
            {tech.description && (
              <p className="text-xs text-gray-500 dark:text-gray-400">{tech.description}</p>
            )}
          </div>
        ))}
      </div>

      {/* Expand/Collapse Button */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="group relative inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-medium rounded-full hover:from-blue-600 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
      >
        <span className="mr-2">
          {isExpanded ? '收起技术栈' : '查看全部技术'}
        </span>
        <svg
          className={`w-4 h-4 transition-transform duration-300 ${
            isExpanded ? 'rotate-180' : 'rotate-0'
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Tech Count Indicator */}
      <div className="mt-4 text-sm text-gray-500 dark:text-gray-400">
        显示 {displayTech.length} / {allTech.length} 项技术
      </div>
    </div>
  );
}
