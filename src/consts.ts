export const SITE_URL = 'https://blog.lsy22.com';
export const SITE_TITLE = "echoes";
export const SITE_DESCRIPTION = "记录生活，分享所思";
// 新的导航结构 - 支持分层导航
export const NAV_STRUCTURE = [
    {
        id: 'home',
        text: '首页',
        href: '/'
    },
   
    {
        id: 'articles',
        text: '文章',
        items: [
            { id: 'filter', text: '筛选', href: '/filtered' },
            { id: 'path', text: '网格', href: '/articles' }
        ]
    },
    {
        id: 'other',
        text: '其他',
        items: [
            { id: 'about', text: '关于', href: '/about' },
            { id: 'projects', text: '项目', href: '/projects' },
            { id: 'web-scraper', text: '爬虫演示', href: '/web-scraper' }
        ]
    }
];

export const ARTICLE_EXPIRY_CONFIG = {
    enabled: true, // 是否启用文章过期提醒
    expiryDays: 365, // 文章过期天数
    warningMessage: '这篇文章已经发布超过一年了，内容可能已经过时，请谨慎参考。' // 提醒消息
};

