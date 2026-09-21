# 翼脉相传 · 逐梦长空 —— 实践队成果展示站

纯静态站点，无需后端、无需构建步骤，双击 `index.html` 即可在浏览器中打开。

## 打开方式

1. 直接双击 `index.html`（推荐 Chrome / Edge）；
2. 或在本目录起一个本地服务：
   ```bash
   python -m http.server 8000
   ```
   然后访问 http://localhost:8000

## 目录结构

```
web/
├─ index.html                 页面结构（全部文案都在这里）
├─ css/style.css              样式与配色变量
├─ js/main.js                 动画与交互；顶部 ROSTER 数组 = 队员名录
├─ vendor/                    本地化的第三方库，断网也能跑
│   ├─ gsap.min.js            GSAP 3.13（GitHub 28.5k★）
│   ├─ ScrollTrigger.min.js   滚动驱动动画（GSAP 官方插件）
│   ├─ lenis.min.js           Lenis 平滑滚动（GitHub 15.9k★）
│   ├─ swiper-bundle.min.js   Swiper 11 画廊（GitHub 41.9k★）
│   └─ swiper-bundle.min.css
└─ assets/img/                站内图片（已压缩，Logo 为透明 PNG）
```

## 常用修改

| 想改什么 | 改哪里 |
| --- | --- |
| 队员名录 | `js/main.js` 顶部 `ROSTER` 数组 |
| 主色 / 圆角 / 字体 | `css/style.css` 顶部 `:root` 变量 |
| 文字、数据、章节 | `index.html`（每章一个 `<section id="c1">…`） |
| 图片 | 替换 `assets/img/` 中同名文件即可 |
| 数字滚动 | 元素上加 `data-count="1500" data-suffix="+"` |
| 参与入场动画 | 给元素加 `class="reveal"` |
| 卡片 3D 倾斜 | 给元素加 `data-tilt` |

## 配色来源

取自实践队队徽：深空蓝 `#050c17`、航迹天青 `#3fa9e8 / #82d6ff`、跑道金 `#f5c542`。

## 发布上线

- **GitHub Pages**：把 `web/` 内容推到仓库根目录 → Settings → Pages → Source 选 `main / root`。
- **校园服务器 / 空间**：整目录上传即可，保持相对路径不变。
- 注意：站点是纯静态的，`index.html` 与 `assets/`、`css/`、`js/`、`vendor/` 必须同级。

## 无障碍与兼容

- 已适配 `prefers-reduced-motion`（系统开启"减少动态效果"时自动关闭动画）。
- 已适配手机 / 平板 / 桌面三档断点。
- 禁用 JavaScript 时，`<noscript>` 会保证所有内容正常显示。
