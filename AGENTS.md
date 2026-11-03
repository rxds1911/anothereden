# AGENTS.md — anothereden 项目规范

## 项目简介

**anothereden**（另一个伊甸攻略站）是一个仿照 FGO 素材规划风格生成的《另一个伊甸》攻略查询网站。前端使用 **Vue 3 + Vite** 构建，内容逐步迁移到 **Directus + PostgreSQL**，由 Directus 提供管理后台和只读 API。迁移期间保留前端内置数据快照，作为测试 fixtures 和接口异常时的回退。

---

## 板块结构（导航）

项目包含以下 16 个板块，所有板块均在 src/pages/ 下有对应的目录和 index.html：

| ID | 中文名 | 说明 |
|---|---|---|
| index | 首页 | 项目入口 |
| characters | 角色 | 角色列表 + 角色详情 |
| battle | 战斗 | 战斗相关攻略 |
| weapons | 武器 | 武器数据/图鉴 |
| armor | 防具 | 防具数据/图鉴 |
| badges | 徽章 | 徽章数据/图鉴 |
| partner | 搭档 | 搭档数据/图鉴 |
| maps | 地图 | 地图攻略 |
| grasta | 灵晶 | 灵晶数据/图鉴 |
| bookshelf | 书架 | 书架相关 |
| cats | 猫 | 猫相关收集 |
| diary | 日记 | 日记相关 |
| personal-weapons | 专武 | 专武数据/图鉴 |
| reincarnation | 回生 | 回生相关 |
| dungeons | 迷宫 | 迷宫攻略 |
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
├── backend/
│   └── directus/           ← Directus、PostgreSQL、数据导入脚本
├── src/
│   ├── main.js             ← 应用入口 JS
│   ├── assets/
│   │   └── styles/         ← CSS 样式文件
│   ├── components/         ← 可复用 Vue 组件
│   ├── data/
│   │   ├── nav.js          ← 导航配置
│   │   └── samples/        ← 各板块示例数据
│   ├── services/           ← Directus 数据读取与前端字段映射
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
- 尚未迁移到 Directus 的板块继续使用 src/data/samples/ 下的 ES Module 数据。
- 已迁移板块通过 src/services/ 读取 Directus，不应在页面中直接请求 Directus。
- 已迁移板块的 sample 数据仍需保留，用作自动测试和接口异常时的回退。
- Directus/API 字段使用 snake_case，页面视图对象使用 camelCase，字段转换统一放在 service 层。
- 每份数据通常包含 id、name、rarity 等字段，根据板块特性增减

### 配置管理
- 所有配置统一集中写在 src/data/config.js 中，以 ES Module 方式导出
- 筛选选项、分类/类型、时代等可配置项不得写死在页面或组件中，需要时从 config.js import 使用
- 新增配置前先检查 config.js 是否已有相同项，避免重复定义

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
10. **默认打开页面**：每次修改代码后，重启 Vite 开发服务器并在浏览器中打开对应页面，方便用户即时查看效果。

---

## 数据处理注意

- characters 数据量较大（约 23KB），编辑时注意不要破坏原有结构。
- character-detail 是独立页面，有单独 main.js，与角色列表共用 src/data/samples/characters.js 数据。
- 新增任意板块数据时，建议先在 src/data/samples/ 下创建对应 板块名.js，然后在页面中导入使用。

---

## 数据迁移计划

### 目标架构

```text
Vue 页面 -> src/services -> Directus REST API -> PostgreSQL
                              ↑
                         Directus 管理后台
```

- Directus 是内容源，PostgreSQL 保存结构化数据。
- 页面只依赖 src/services/，不得直接写 `fetch()` 或引入 Directus SDK。
- Directus 公开读取权限只允许 `status = published` 的记录。
- 草稿、归档和所有写操作必须经过登录后的 Directus 后台。
- 数据服务失败时自动使用内置数据快照，并在页面上给出明确提示。
- 筛选选项仍集中维护在 src/data/config.js，不因迁移写入页面。
- 已有页面 URL 和稳定标识尽量保持不变；新增主键时使用独立 `slug` 或 UUID，并保留旧 ID 映射。

### 本地运行方式

- 后台配置位于 backend/directus/。
- 本地使用 Docker Desktop、Directus 11.17.4 和 PostgreSQL 16。
- Directus 固定为 11.17.4：当前迁移方案依赖免费版自定义权限规则，不允许无评估升级到 Directus 12。
- 本地容器只监听 `127.0.0.1:8055`，PostgreSQL 仅暴露在 Docker 内部网络。
- 前端通过根目录 `.env` 的 `VITE_DIRECTUS_URL` 连接 Directus。
- `.env`、`backend/directus/.env` 和数据库卷不得提交到 Git。

常用命令：

```powershell
docker compose -f backend/directus/docker-compose.yml up -d
node backend/directus/bootstrap.mjs
npm run dev
```

初始化脚本必须可重复执行：新增缺失记录、更新内容变化、不重复创建，也不自动删除源文件中已经移除的记录。

### 当前迁移状态

| 模块 | 状态 | 说明 |
|---|---|---|
| diary | 已完成 | 74 条数据，Directus 集合 `diary_entries`，保留时代和区域筛选 |
| characters | 待迁移 | 优先迁移角色列表和角色详情 |
| weapons / armor / badges / grasta | 待迁移 | 数据结构相近，可统一样式和 service 模式 |
| personal-weapons / partner | 待迁移 | 包含列表、详情和关联角色 |
| maps / dungeons / battle | 待迁移 | 包含详情、嵌套技能/怪物/队伍数据 |
| bookshelf / reincarnation / events / cats | 待迁移 | 按详情复杂度和运营更新频率安排 |
| index | 最后处理 | 首页统计应改为读取各集合汇总，不继续导入全部 sample 数据 |

### 后续迁移顺序

1. **characters**：先迁移角色主表，再拆分技能、天冥奖励和星导觉醒数据，同时保持角色列表/详情 ID 兼容。
2. **equipment**：迁移 weapons、armor、badges、grasta 和 personal-weapons，优先复用列表筛选和详情组件。
3. **partner / maps**：迁移搭档和地图，保留名称显示模式及术语表关系。
4. **bookshelf / reincarnation**：迁移带详情数据的收集和挑战内容。
5. **battle / dungeons / events**：迁移嵌套内容较多的攻略模块，并处理用户攻略投稿和审核。
6. **cats / index**：完成剩余数据和首页动态统计。

每个阶段必须先完成一个可上线的完整模块，再开始下一阶段，不建议同时改造多个页面。

### 单个模块迁移步骤

1. **盘点数据**：统计来源文件行数、字段、空值、重复 ID、枚举值和关联字段。
2. **设计集合**：稳定字段使用普通数据库列，不稳定的嵌套内容第一阶段可使用 JSONB；可筛选、排序和关联的字段不得藏在 JSONB 中。
3. **定义公共字段**：至少包含 `status`、`slug` 或稳定 ID、`sort` 和来源追溯字段；如需时间线可增加 `published_at`。
4. **生成快照**：把来源数据同步到 src/data/samples/，保留为测试 fixture 和故障回退。
5. **实现 service**：在 src/services/ 中提供列表、详情和字段映射函数，处理超时、取消请求、状态码和数据格式错误。
6. **拆分页面逻辑**：页面主逻辑放到独立 main.js，导出可注入 loader 的 `create*AppOptions()`，便于离线测试。
7. **实现页面状态**：必须包含 loading、empty、error/fallback 状态；接口失败时不能让页面直接空白。
8. **配置 Directus**：更新 backend/directus/bootstrap.mjs，创建集合、字段、公开读取权限并导入数据。
9. **补充测试**：覆盖字段映射、来源行对照、筛选、搜索、加载失败回退和完整模板渲染。
10. **完整验证**：运行 `npm test` 和 `npm run build`，刷新页面确认无控制台错误，并重新打开对应页面。

### 数据与关联规则

- 源文件中的顺序和行号必须保存，便于追溯；不得因导入顺序改变页面默认排序。
- 来源中缺失的字段保持 null/空值，不推测填充；需要运营补录的字段应在 Directus 中标明。
- 多值字段使用独立子表或结构清晰的 JSONB；不得使用逗号拼接字符串保存关联关系。
- 名称、时代、区域、类型等筛选值必须来自 src/data/config.js 或 Directus 中的受控选项。
- 删除源记录时只标记 archived；是否删除必须由人工确认。
- 公开 API 必须通过 Directus Policy 限制为已发布数据，并在迁移测试中验证草稿不可见。
- 用户投稿、战斗视频和图片等可写数据不得继续只存 localStorage；迁移时应进入带审核状态的数据库集合。

### 完成标准

一个板块只有同时满足以下条件才算迁移完成：

- 来源记录数量和非空字段与源数据逐条一致。
- Directus 后台可新增、编辑、排序、发布和归档。
- 前端优先读取 Directus，接口失败时可回退到内置快照并显示提示。
- 原有筛选、搜索、名称显示、详情跳转和 URL 参数保持可用。
- 公开 API 不包含草稿或归档记录。
- 单元测试、页面测试和生产构建全部通过。
- Vite 页面已在浏览器中实际打开，并确认没有控制台错误。

---

## 版本 / 包管理

- Node.js 版本不限，建议 18+
- 依赖管理使用 npm，不要使用 yarn 或 pnpm
- 添加依赖前先确认是否已有相同功能的包
