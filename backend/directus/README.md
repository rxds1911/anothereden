# Directus 内容后台

本目录提供日记数据所需的 Directus + PostgreSQL 本地环境。Directus 负责管理后台和数据 API，PostgreSQL 保存数据。

## 首次启动

1. 安装并启动 Docker Desktop。
2. 将 `.env.example` 复制为 `.env`，修改数据库密码、Directus Secret 和管理员密码。
3. 在本目录运行：

   ```powershell
   docker compose up -d
   ```

4. 等 Directus 启动后，在项目根目录运行：

   ```powershell
   node backend/directus/bootstrap.mjs
   ```

   脚本会自动创建 `diary_entries` 集合、字段和公开只读权限，并导入当前 74 条日记。重复运行会更新已有记录，不会重复创建。

5. 打开 `http://localhost:8055/admin` 登录管理后台。
6. 将项目根目录的 `.env.example` 复制为 `.env`，重启 Vite：

   ```powershell
   npm run dev
   ```

以后在 Directus 中修改并发布日记，刷新网站即可看到最新内容。

## 数据规则

- `status`：只有 `published` 会展示在网站上。
- `slug`：稳定唯一标识，Excel 每行对应一个 `cat-diary-NNN`。
- `narrative`：猫咪叙述。
- `location`：地点。
- `area`：区域，使用 `config.js` 中的区域选项。导入时读取 Excel D 列，缺失时可在后台补充。
- `era`：时代。
- `sort`：列表顺序。
- `source_row`：来源 Excel 行号，便于追溯。

重新运行导入脚本只新增或更新记录。Excel 中删除的记录会保留在 Directus，方便在后台确认后归档，避免误删线上内容。

## 生产环境

- 为 Directus 使用独立域名并启用 HTTPS。
- 替换所有示例密码和 Secret。
- 把根目录 `.env` 中的 `VITE_DIRECTUS_URL` 改为正式 API 地址。
- 把 `.env` 中的 `CORS_ORIGIN` 改为正式网站地址。
- Directus 只向公开角色开放已发布日记的读取权限；管理操作必须登录。
