# 3D 技能星云球 · 开发者作品集

零依赖的静态站点。原作品集模板改造版：保留结构与配色，把 `#skills` 平铺标签换成可拖拽旋转的 3D 技能星云球。

## 在 VS Code 里打开的三种方式

### 方式一：双击 workspace 文件（推荐）

直接双击 `skills-3d.code-workspace`，VS Code 会以本项目为工作区打开，并自动带上 Live Server 配置。

### 方式二：Live Server 热更新（开发时用）

1. 用 VS Code 打开本文件夹
2. 首次打开时 VS Code 右下角会提示「Install Recommended Extensions」，点安装 **Live Server**
   （或手动：`code --install-extension ritwickdey.liveserver`）
3. 右键 `index.html` → **Open with Live Server**
4. 浏览器自动打开 `http://localhost:5500/index.html`，改文件保存后页面自动刷新

### 方式三：不装任何扩展

本项目是纯静态、零依赖（无模块化、无 fetch），**`file://` 直接打开就能用**：

- 直接双击 `index.html`，或
- 按 `F5` 选「Open in Chrome (file://, no server)」

> 若将来改成 ES module 或要加载外部数据，就必须用方式二或起本地服务了。

## 文件说明

| 文件 | 作用 |
|---|---|
| `index.html` | 页面结构。技能区为 `#skill-stage`（canvas + 详情面板 + chip 索引） |
| `styles.css` | 沿用原站配色：黑底 `#000`、霓虹绿 `#00ffaa`、等宽字体 |
| `script.js` | 上半部是作品集数据渲染，下半部 `initSkillNebula` 是 3D 星云引擎 |

## 改内容

编辑 `script.js` 顶部的 `portfolio` 对象即可。技能是 `{ name, category, note }` 结构：

```js
skills: [
  { name: "React", category: "Frontend", note: "Component-driven UI development..." },
  ...
]
```

增减条目后，球上的点会自动重新分布（Fibonacci 球面布点），连边、chip 列表、详情面板都会同步更新，**不需要改任何渲染代码**。

## 3D 引擎要点（改动的入口）

全部在 `script.js` 的 `initSkillNebula` 里，纯 Canvas 2D 手写投影，没有引入 Three.js。

| 想改什么 | 改哪里 |
|---|---|
| 球的大小 | `resize()` 里的 `R = Math.min(W, H) * 0.31` |
| 透视强度 | `FOV = 2.6 * R`（值越小透视越夸张） |
| 自转速度 | `AUTO_Y`（设为 0 即停） |
| 拖拽灵敏度 | `pointermove` 里的 `0.006` |
| 背景尘埃数量 | `layout()` 里的 `i < 140` |
| 每个点连几条边 | `layout()` 里的 `.slice(0, 3)` |
| 舞台高度 | `styles.css` 的 `.skill-stage { height: 520px }` |

## 无障碍与性能

- canvas 设 `aria-hidden`，下方 chip 列表是键盘／屏幕阅读器通路，同时充当降级索引
- 支持 `prefers-reduced-motion`（自动关闭自转）
- `IntersectionObserver` 在技能区离屏时暂停动画帧
- devicePixelRatio 上限锁 2，避免高分屏过度绘制
