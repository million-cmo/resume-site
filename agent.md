# Resume Site 项目技术方向

## 项目定位

这是一个面向求职与合作展示的个人简历单页，主题为“数据开发 × AI 探索”。站点强调数据可视化、终端窗口、代码流和粒子动效等技术视觉语言，同时保持中文 / English 全站切换和专业可读性。

## 技术栈

- **前端框架**：React 19，使用 JavaScript 与 ES Modules。
- **构建工具**：Vite 6。
- **样式方案**：原生 CSS，集中维护设计 token、响应式断点、动效和无障碍媒体查询。
- **图标与静态资源**：`public/` 目录中的 SVG、PNG 和演示图片；favicon 使用 `public/favicon.svg`，Safari 主屏图标使用 `public/apple-touch-icon.png`。
- **运行形态**：静态前端应用，无后端业务依赖；`worker/` 负责 Sites 静态资源与路由回退。
- **部署方式**：代码托管在 GitHub 的 `main` 分支，Vercel 连接仓库后自动构建与部署。

## 常用命令

```bash
npm run dev       # 启动本地开发服务
npm run build     # 构建生产版本并准备 Sites 产物
npm run preview   # 预览生产构建
npm test          # 页面交互与图标资源回归测试
npm run icons:generate # 从 SVG 导出居中的 Safari 主屏图标
npm run test:sites
```

生产构建输出到 `dist/client`，同时生成 `dist/server/index.js` 和 `dist/.openai/hosting.json`。

## 现有交互基线

后续修改需要保留以下能力：滚动进入动画、终端代码流与光标、数据粒子效果、鼠标跟随的终端卡片倾斜、技能条与卡片悬停反馈、演示播放状态、全局中英文切换，以及页面内 Z Logo 的旋转动画。系统开启 `prefers-reduced-motion: reduce` 时，应关闭或明显降低非必要动画。

## 设计约束

- 沿用奶油色背景、深墨绿、紫罗兰、薰衣草和橙色点缀的现有配色。
- 视觉可以有创意和动态感，但信息层级、文字对比度、移动端布局和键盘可用性优先。
- 项目占位内容、演示图片和外链入口保持可替换，不引入真实凭据或私密配置。
- 修改后运行 `npm test`、`npm run build` 和 `npm run test:sites`；依赖变动后追加 `npm audit`。页面测试采用 Vitest + Testing Library，图标使用 sharp 从 SVG 等比例导出。
- PDF 简历尚未提供，保留原有“下载简历”的描边按钮、箭头和悬停效果；点击后明确提示“PDF 简历准备中”，不跳转到无关区块或模拟下载成功。
