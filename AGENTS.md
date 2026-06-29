# AGENTS.md — anothereden 项目规范

## 项目简介

**anothereden**（另一个伊甸攻略站）是一个仿照 FGO 素材规划风格生成的《另一个伊甸》攻略查询网站。使用 **Vue 3 + Vite** 构建，纯静态页面，数据在前端以 JS 文件形式管理。

---

## 板块结构（导航）

项目包含以下 15 个板块，所有板块均在 src/pages/ 下有对应的目录和 index.html：

| ID | 中文名 | 说明 |
|---|---|---|
| index | 首页 | 项目入口 |
| characters | 角色 | 角色列表 + 角色详情 |
| battle | 战斗 | 战斗相关攻略 |
| weapons | 武器 | 武器数据/图鉴 |
| armor | 防具 | 防具数据/图鉴 |
| badges | 徽章 | 徽章数据/图鉴 |
| maps | 地图 | 地图攻略 |
| grasta | 灵晶 | 灵晶数据/图鉴 |
| bookshelf | 书架 | 书架相关 |
| cats | 猫 | 猫相关收集 |
| diary | 日记 | 日记相关 |
| personal-weapons | 专武 | 专武数据/图鉴 |
| reincarnation | 回生 | 回生相关 |
| dungeons | 副本 | 副本攻略 |
| events | 活动 | 活动攻略 |

板块路由 / 导航信息维护在 src/data/nav.js 中。

---

## 目录结构

`
anothereden/
├── AGENTS.md              ← 本项目规范文件（你正在看的）
├── index.html              ← 首页入口
├── package.json            ← 依赖管理
├── public/                 ← 静态资源（不会被打包处理）
├── dist/                   ← 构建产物
├── src/
│   ├── main.js             ← 应用入口 JS
│   ├── assets/
│   │   └── styles/         ← CSS 样式文件
│   ├── components/         ← 可复用 Vue 组件
│   ├── data/
│   │   ├── nav.js          ← 导航配置
│   │   └── samples/        ← 各板块示例数据
│   └── pages/              ← 各板块页面
│       ├── character-detail/ ← 角色详情页
│       └── characters/     ← 角色列表页
│       └── ...（其他板块各一个 index.html）
`

---

## 通用代码约定

### 命名规范
- **目录名 / 文件名**：全小写 kebab-case（如 personal-weapons、character-detail）
- **Vue 组件**：PascalCase（如 AppSidebar.vue、DataTable.vue）
- **JS 变量 / 函数**：camelCase
- **CSS 类名**：kebab-case
- **数据文件字段**：camelCase

### 页面结构
每个板块页面 index.html 的基本结构：
- head 中加载公共样式（src/assets/styles/ 下的 CSS）
- 左侧有 AppSidebar 导航组件
- 中间主体区显示板块数据表格或内容
- 底部面包屑导航

### 数据管理
- 各板块的示例/真实数据放在 src/data/samples/ 下
- 数据以 ES Module 方式导出 JS 对象数组
- 每份数据通常包含 id、name、rarity 等字段，根据板块特性增减

### 样式约定
- 全局变量维护在 variables.css 中
- 布局相关写在 layout.css 中
- 各板块统一使用卡片/表格形式展示数据
- 颜色主题用 CSS 变量，不要硬编码颜色值

### 构建相关
- 使用 Vite 构建，开发时运行 npm run dev
- 生产构建运行 npm run build，产物输出到 dist/
- 构建配置在 vite.config.js 或相关的 .cjs 文件中
- 不要随意修改 package-lock.json

---

## 通用行为规则

1. **不乱删文件**：不允许随意删除项目中的文件或目录，除非该文件属于明确的临时/构建产物（如 dist/、node_modules/），且用户明确要求清理。
2. **不随意修改配置**：修改 package.json、vite.config.* 等配置文件时需谨慎，确认后果后再执行。
3. **新增页面/板块**：必须同步更新 src/data/nav.js 导航配置。
4. **开发流程**：测试前先确认 Vite 开发服务器未占用端口，避免端口冲突。
5. **内容语言**：所有 UI 展示文字使用中文，代码注释/变量名使用英文。
6. **响应说明**：每次回答尽量用通俗易懂的话解释做了什么、为什么这么做，避免纯代码输出。
7. **临时脚本**：项目根目录下的 temp_*.cjs、各种 .py 脚本是历史遗留的临时工具文件。如果不再需要，需经用户确认后再清理。
8. **兼容性**：项目在 Windows 环境下开发，路径使用反斜杠或正斜杠均可，但尽可能保持一致。
9. **验证错误**：每次修改代码后，必须在浏览器中刷新页面确认没有控制台错误，确保改动不会引入新问题。
10. **默认打开页面**：每次修改代码后，默认启动 Vite 开发服务器（如未运行）并在浏览器中打开对应页面，方便用户即时查看效果。

---

## 数据处理注意

- characters 数据量较大（约 23KB），编辑时注意不要破坏原有结构。
- character-detail 是独立页面，有单独 main.js，与角色列表共用 src/data/samples/characters.js 数据。
- 新增任意板块数据时，建议先在 src/data/samples/ 下创建对应 板块名.js，然后在页面中导入使用。

---

## 版本 / 包管理

- Node.js 版本不限，建议 18+
- 依赖管理使用 npm，不要使用 yarn 或 pnpm
- 添加依赖前先确认是否已有相同功能的包
