# 世界杯赛前播报小程序

这是一个微信小程序项目，用来展示世界杯赛前预测、实时比分、赛后复盘和历史场次查询。页面风格走鲜艳现代的世界杯视觉方向，核心内容由项目内的 `football-match-predictor` skill 约束生成和更新。

## 主要功能

- 首页展示近 7 天世界杯比赛，按北京时间开赛时间排序。
- 每场比赛展示国家队国旗、中英文队名、FIFA 排名、球队总身价、天气和场地海拔。
- 进入页面自动同步公开实时比分，并每 10 秒刷新一次。
- 进行中比赛展示比赛时间、比分和阶段；完赛比赛展示绿色完赛状态。
- 完赛比赛在首页最多保留 1 小时，之后只出现在比赛复盘和历史场次中。
- 比赛复盘显示胜负预测、比分预测、备选预测和命中百分比。
- 历史场次独立页面支持最近 10 场历史预测和按日期筛选。
- 顶部有红色滚动违法赌博警示语。
- 详情页展示赛前分析、市场观点、阵容伤停、战术环境和风险点。

## 目录结构

```text
.
├── .codex-skills/football-match-predictor/SKILL.md
├── assets/
│   ├── brand/
│   └── flags/
├── cloudfunctions/liveScores/
├── server/
│   ├── config/targets.json
│   └── src/
├── pages/
│   ├── index/
│   ├── detail/
│   └── history/
├── utils/
│   ├── matches.js
│   ├── liveMatchScores.js
│   └── liveTeamStats.js
├── app.js
├── app.json
├── project.config.json
├── AGENTS.MD
└── TODO.MD
```

## 开发环境

- 微信开发者工具
- 小程序 AppID：见 `project.config.json`
- 云开发能力：需要启用，用于 `liveScores` 云函数
- 云函数运行时：Node.js
- 轻量云服务器：可选，用于 Betfair 交易量同步服务

## 导入项目

1. 打开微信开发者工具。
2. 选择“导入项目”。
3. 项目目录选择本仓库根目录。
4. AppID 使用 `project.config.json` 中的 AppID，或按协作账号要求替换。
5. 导入后确认云函数根目录为 `cloudfunctions/`。

## 部署实时比分云函数

1. 在微信开发者工具左侧找到 `cloudfunctions/liveScores`。
2. 右键 `liveScores`。
3. 选择“上传并部署：云端安装依赖”。
4. 部署完成后重新预览小程序。

实时比分来自公开 scoreboard 接口。前端每 10 秒调用一次云函数，云函数会返回比赛状态、实时比分、比赛时间、阶段、北京时间开赛时间和排序时间戳。

## 部署 Betfair 交易量服务器

小程序前端不能保存 Betfair App Key、SSOID、账号密码或证书。Betfair 交易量同步应部署在轻量云服务器：

```text
server/
```

推荐服务器：

- Ubuntu 22.04 LTS 或 24.04 LTS
- Node.js 18+
- Nginx + HTTPS 域名

部署入口：

```bash
cd server
cp .env.example .env
npm run check
npm start
```

`.env` 中填写：

```bash
BETFAIR_APP_KEY=你的 App Key
BETFAIR_SESSION_TOKEN=当前有效 SSOID
```

长期稳定运行时，改用证书登录：

```bash
BETFAIR_USERNAME=你的 Betfair 用户名
BETFAIR_PASSWORD=你的 Betfair 密码
BETFAIR_CERT_PATH=/etc/betfair/client-2048.crt
BETFAIR_KEY_PATH=/etc/betfair/client-2048.key
```

服务器接口：

```text
GET  /health
GET  /api/database/latest
GET  /api/betfair/markets
POST /api/betfair/keepalive
POST /api/betfair/sync
```

上线后需要：

1. 给服务器 API 配置 HTTPS 域名。
2. 在微信公众平台后台添加 request 合法域名。
3. 把域名写入 `utils/serverConfig.js` 的 `apiBaseUrl`。
4. 不要提交 `.env`、`.crt`、`.key`、`server/data/`。

服务器可以通过 `npm run daily` 每天生成数据库快照。生产环境建议用 cron 在北京时间中午 12 点执行：

```cron
0 12 * * * cd /opt/worldcup-mini/server && /usr/bin/npm run daily >> /var/log/worldcup-betfair-daily.log 2>&1
```

小程序端通过 `utils/remoteMatchDatabase.js` 读取 `/api/database/latest`。服务器不可用时，小程序自动回退到包内 `utils/matches.js` 静态数据。

如果采用“方案 B”，Codex 每天先更新并推送 Git，服务器再拉取发布。服务器可使用：

```bash
server/scripts/update-from-git.sh
```

建议服务器 cron 设为 Codex 任务之后 10-15 分钟执行。

## 数据更新方式

比赛基础数据在 `utils/matches.js` 中维护。更新预测前，协作者或 Codex 应先阅读：

```text
.codex-skills/football-match-predictor/SKILL.md
AGENTS.MD
TODO.MD
```

更新原则：

- 先核对公开赛程、开赛时间、比赛地点和时区。
- 已完赛比赛进入复盘和历史场次。
- 首页只显示未完赛比赛，以及完赛后 1 小时内的比赛。
- 每次修改 `utils/matches.js`、比赛预测、复盘结果、比赛时间、球队数据或焦点规则时，必须同步更新首页和历史页的 `数据库更新` 时间。
- 预测文案必须区分事实和判断，不得把赌博建议写成确定结果。
- 让球方不能写“不败”；不败只适合受让方且需要有合理依据。
- 强队优势明显时，不要强行给平局备选。

## 协作注意

- 不要提交 `node_modules/`。
- 修改云函数后需要重新部署云函数。
- 修改图片资源后注意小程序上传包大小。
- 修改比赛时间后必须验证首页排序。
- 变更预测模型、版本号或数据库更新时间时，同步更新首页和历史页展示。数据库内容有任何改动时，`数据库更新` 时间必须一起改。
