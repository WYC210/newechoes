# NewEchoes - 现代化个人博客系统

<div align="center">

![Astro](https://img.shields.io/badge/Astro-5.9.2-FF5D01?style=for-the-badge&logo=astro&logoColor=white)
![React](https://img.shields.io/badge/React-19.1.0-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Rust](https://img.shields.io/badge/Rust-WASM-000000?style=for-the-badge&logo=rust&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-4.1.10-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)

一个基于 Astro + React + Rust WASM 构建的现代化静态博客系统，具有强大的搜索功能、地图可视化、主题切换等特性。

[在线演示](https://www.wyc21.com/) • [使用教程](https://blog.lsy22.com/articles/echoes博客使用说明) • [原作者项目](https://github.com/lsy2246/newechoes)

</div>

## ✨ 主要特性

### 🚀 现代化技术栈

- **Astro 5.9.2** - 现代化静态站点生成器，支持多框架集成
- **React 19.1.0** - 用于交互式组件开发
- **TypeScript** - 类型安全的开发体验
- **Rust + WASM** - 高性能的搜索和地理数据处理
- **TailwindCSS 4.1.10** - 现代化的 CSS 框架

### 📝 内容管理

- **MDX 支持** - 支持在 Markdown 中使用 React 组件
- **文章分类** - 支持多级目录结构的文章组织
- **标签系统** - 灵活的文章标签管理
- **草稿功能** - 支持文章草稿状态
- **自动索引** - 自动生成文章索引和站点地图

### 🔍 强大搜索功能

- **全文搜索** - 基于 Rust WASM 的高性能全文搜索
- **实时建议** - 搜索时提供实时建议和自动完成
- **智能筛选** - 支持按标签、日期等条件筛选文章
- **搜索高亮** - 搜索结果关键词高亮显示

### 🎨 用户体验

- **响应式设计** - 完美适配桌面端和移动端
- **暗黑模式** - 支持明暗主题切换，带有流畅的过渡动画
- **页面过渡** - 使用 Swup 实现流畅的页面切换效果
- **代码高亮** - 支持多种编程语言的语法高亮
- **Mermaid 图表** - 支持流程图、时序图等图表渲染

### 🗺️ 地图可视化

- **世界地图** - 基于 Three.js 的 3D 地球可视化
- **访问足迹** - 展示个人旅行足迹和访问过的地点
- **交互式地图** - 支持鼠标交互和地点信息展示

### ⚡ 性能优化

- **静态生成** - 构建时预渲染所有页面，极快的加载速度
- **图片优化** - 自动图片压缩和格式转换
- **代码分割** - 按需加载 JavaScript 代码
- **缓存策略** - 智能的浏览器缓存策略
- **WASM 加速** - 关键功能使用 Rust WASM 提升性能

## 🛠️ 技术架构

### 前端技术栈

```
├── Astro 5.9.2          # 静态站点生成器
├── React 19.1.0         # UI组件库
├── TypeScript           # 类型系统
├── TailwindCSS 4.1.10   # CSS框架
├── Three.js             # 3D图形库
├── Swup                 # 页面过渡动画
└── Mermaid              # 图表渲染
```

### 后端/构建工具

```
├── Rust + WASM          # 高性能计算模块
│   ├── article-filter   # 文章筛选
│   ├── article-indexer  # 文章索引
│   ├── search          # 搜索引擎
│   └── geo             # 地理数据处理
├── Vercel              # 部署平台
└── Node.js             # 构建环境
```

## 📁 项目结构

```
newechoes/
├── src/
│   ├── components/     # React组件
│   │   ├── Search.tsx         # 搜索组件
│   │   ├── WorldHeatmap.tsx   # 地图组件
│   │   ├── ThemeToggle.astro  # 主题切换
│   │   └── ...
│   ├── content/        # 文章内容
│   │   ├── Code/       # 编程相关文章
│   │   ├── Web/        # 前端相关文章
│   │   └── ...
│   ├── pages/          # 页面路由
│   ├── plugins/        # 自定义插件
│   └── styles/         # 样式文件
├── wasm/              # Rust WASM模块
│   ├── search/        # 搜索引擎
│   ├── geo/           # 地理处理
│   └── ...
├── public/            # 静态资源
└── dist/              # 构建输出
```

## 🚀 快速开始

### 环境要求

- Node.js 18+
- Rust 1.70+
- pnpm (推荐) 或 npm

### 安装依赖

```bash
# 克隆项目
git clone https://github.com/WYC210/newechoes.git
cd newechoes

# 安装前端依赖
pnpm install

# 构建WASM模块
cd wasm
cargo build --release --target wasm32-unknown-unknown
cd ..
```

### 开发模式

```bash
# 启动开发服务器
pnpm dev

# 访问 http://localhost:4321
```

### 构建部署

```bash
# 构建生产版本
pnpm build

# 预览构建结果
pnpm preview
```

### 创建文章

```bash
# 使用脚本创建新文章
./create_post.sh "文章标题" "分类/路径"

# 或者交互式创建
./create_post.sh
```

## 📖 使用指南

### 文章管理

1. 在 `src/content/` 目录下按分类创建文章
2. 使用 Markdown 或 MDX 格式编写内容
3. 在文章头部添加元数据（标题、日期、标签等）
4. 支持草稿功能，设置 `draft: true` 即可

### 配置自定义

- 修改 `src/consts.ts` 配置站点信息
- 在 `astro.config.mjs` 中调整构建配置
- 自定义主题样式在 `src/styles/` 目录

### 地图数据

- 在 `public/city.json` 中配置访问过的城市
- 地图数据文件位于 `public/maps/` 目录

## 🎯 核心功能

### 搜索系统

基于 Rust WASM 实现的高性能搜索引擎，支持：

- 全文搜索和关键词匹配
- 实时搜索建议
- 搜索结果高亮
- 按标签和日期筛选

### 主题系统

- 支持明暗两种主题
- 跟随系统主题设置
- 流畅的切换动画效果
- 主题状态持久化

### 地图可视化

- 基于 Three.js 的 3D 地球
- 展示个人足迹和访问记录
- 交互式地点信息展示
- 支持世界地图和中国地图

## 🔧 自定义开发

### 添加新组件

```typescript
// src/components/MyComponent.tsx
import React from "react";

export default function MyComponent() {
  return <div>Hello World</div>;
}
```

### 扩展 WASM 功能

```rust
// wasm/my-module/src/lib.rs
use wasm_bindgen::prelude::*;

#[wasm_bindgen]
pub fn my_function(input: &str) -> String {
    // 你的逻辑
    format!("Hello, {}", input)
}
```

## 📊 性能特性

- **构建时间**: < 30 秒 (取决于文章数量)
- **首屏加载**: < 1 秒 (静态资源)
- **搜索响应**: < 100ms (WASM 加速)
- **SEO 友好**: 完整的 SSG 支持
- **移动端优化**: 响应式设计

## 🤝 贡献指南

欢迎提交 Issue 和 Pull Request！

1. Fork 本项目
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启 Pull Request

## 📄 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情

## 🙏 致谢

- **原作者**: [lsy2246](https://github.com/lsy2246) - 感谢提供了优秀的基础框架
- **Astro 团队** - 提供了出色的静态站点生成器
- **Rust 社区** - 提供了高性能的 WASM 支持

## 📞 联系方式

- **GitHub**: [WYC210/newechoes](https://github.com/WYC210/newechoes)
- **在线演示**: [www.wyc21.com](https://www.wyc21.com/)
- **使用教程**: [点击查看](https://blog.lsy22.com/articles/echoes博客使用说明)

---

<div align="center">

**如果这个项目对你有帮助，请给个 ⭐ Star 支持一下！**

Made with ❤️ by [WYC210](https://github.com/WYC210)

</div>
