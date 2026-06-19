# Codex 协作说明

本项目是微信小程序“世界杯赛前播报”。任何 Codex 或协作者进入项目后，请先阅读本文件，再处理数据、页面或云函数。

## 必读文件

1. `README.MD`：项目功能、导入方式、云函数部署方式。
2. `TODO.MD`：当前待办和风险。
3. `.codex-skills/football-match-predictor/SKILL.md`：比赛预测和复盘数据更新规则。
4. `CODEX_HANDOFF_2026-06-14.MD`：2026-06-14 在家里电脑完成的调整和后续交接记录。
5. `CODEX_CHANGELOG.MD`：所有 Codex/协作者修改小程序并提交或上传 Git 前必须追加的变更日志。

## Skill 加载规则

当任务涉及以下内容时，必须先读取并遵守：

```text
.codex-skills/football-match-predictor/SKILL.md
```

触发场景：

- 更新 `utils/matches.js` 中的预测数据。
- 新增或修改比赛复盘。
- 调整胜平负、比分、亚盘、大小球、风险点。
- 根据红牌、停赛、伤病、阵容消息重做比赛分析。
- 用户要求“用预测 skill 更新数据库”或类似表述。

## 项目关键文件

- `utils/matches.js`：静态比赛、预测、复盘、历史场次、排名和身价数据。
- `utils/liveMatchScores.js`：前端调用实时比分云函数并合并到比赛列表。
- `utils/liveTeamStats.js`：球队排名和身价的可选实时覆盖逻辑。
- `cloudfunctions/liveScores/index.js`：公开比分接口抓取、状态转换、北京时间转换。
- `server/`：轻量云服务器 Betfair 同步服务，负责 keepAlive、盘口交易量同步和缓存 API。
- `utils/remoteMatchDatabase.js`：小程序端读取轻量服务器 `/api/database/latest` 数据库快照。
- `pages/index/`：首页、今日焦点、近 7 天比赛、复盘入口。
- `pages/detail/`：单场比赛详情。
- `pages/history/`：历史场次和日期筛选。
- `assets/flags/`：国家队旗帜。
- `assets/brand/`：世界杯视觉相关图片。

## 数据规则

- 每天更新预测前，必须先确认当前北京时间日期；首页/数据库的赛前预测窗口必须覆盖“从今天开始的 7 个自然日”内所有未开赛和进行中的世界杯比赛。例如北京时间 6 月 18 日更新时，赛前预测至少应覆盖 6 月 18 日至 6 月 25 日北京时间范围内的比赛，不能停留在旧的 6 月 20 日数据。
- 每天不能只追加新比赛；滚动 7 天窗口内所有未开赛和进行中的比赛都必须按最新赔率、伤病、停赛、阵容、状态和赛程重新计算预测、比分、亚盘、大小球、风险点和概率。
- 滚动 7 天窗口每天向后移动一天；每过一天都要追加新进入窗口的比赛，并移除/归档已经结束的比赛。
- 已经在前一天写入 `finishedReviewSource` 的完赛复盘不重复处理；每天只归档新增结束的比赛，再补齐和重算后续未赛预测。
- 首页比赛必须按 `sortTime` 升序排列。
- `dateText` 和 `kickoff` 为北京时间展示字段。
- 云函数返回的 `sortTime` 优先级高于静态数据。
- 完赛比赛首页最多保留 1 小时，之后只进入复盘和历史场次。
- 每次重新发布预测或补充未来赛程前，必须先核对已开赛/已结束比赛；已结束比赛必须写入 `finishedReviewSource` 并从首页静态未赛列表中移除，不能继续当作未开赛比赛展示。
- 首页启动遮盖页隐藏前，必须完成首轮实时比分同步；进行中的比赛和完赛 1 小时内的比赛应先拿到比分、状态、阶段和排序字段后再展示首页。
- 每次修改 `utils/matches.js`、预测数据、复盘数据、比赛时间、球队数据、焦点权重或任何会影响首页/详情/历史展示的数据库内容时，必须同步更新首页和历史页里的 `数据库更新` 时间。
- 比赛复盘按结束时间倒序展示，最多显示近 10 场。
- 复盘命中率规则：
  - 胜负主选命中：100，备选命中：50，未中：0。
  - 比分主选命中：100，备选命中：50，未中：0。
  - 进球数只有一项区间，跨度不能超过 1 球，例如 `2-3球`、`3-4球`；不能写 `1-3球`、`2-4球`。
  - 进球数区间命中：100，未中：0。例如预测 `2-3球`，实际总进球为 2 或 3 即命中；`1-0`、`0-0` 为错误，`1-1`、`2-1`、`2-0`、`3-0` 为正确。
  - 最终百分比为胜负 50%、比分 30%、进球数 20% 的加权结果。
  - 复盘展示使用 `胜（平）`、`1-1（2-1）`、`进球数 2-3球` 这种紧凑格式。
  - 命中的项目用绿色，未命中的项目用红色。

## 预测纪律

- 让球方不得写“不败”。
- 受让方可以在合理条件下写“不败”。
- 结构化预测只有主选和备选：`pick.result` 只写一个胜平负主选，`pick.resultBackup` 只写一个备选；不要把“不败”“优先”“小胜备选”混写在 `pick.result` 里。
- 例如“平局优先，科特迪瓦不败”应拆成主选 `平局`、备选 `科特迪瓦胜`，复盘显示为 `平（胜）`。
- 比分同样拆成主比分和备用比分，复盘显示为 `1-1（2-1）`。
- 深盘热门方要区分“赢球”和“穿盘”。
- 强热门不要机械添加平局备选。
- 比分备选不能反向暗示未支持的胜平负备选。
- 红牌和停赛必须进入下一场分析，尤其是核心后卫、中场屏障、队长、门将、定位球主罚者和关键攻击手。

## 开发规则

- 尽量保持微信小程序原生写法，不引入大型框架。
- 任何人或任何 Codex 对小程序做出修改，并准备提交或上传到 Git 前，必须在 `CODEX_CHANGELOG.MD` 顶部追加一条变更日志，写清楚时间、目的、涉及文件、主要改动、数据/复盘影响、云函数是否要重新部署、验证结果和后续注意事项。
- 修改 `cloudfunctions/liveScores` 后，需要提醒用户重新上传并部署云函数。
- 修改 `server/` 后，需要提醒用户重新部署轻量云服务器服务。
- 修改远程数据库结构后，需要同步检查首页、详情页、历史页是否仍能读取服务器快照。
- 不要提交 `cloudfunctions/liveScores/node_modules/`。
- 不要提交 `.env`、Betfair 证书、私钥、`server/data/`。
- 修改资源图片后检查小程序包体积。
- 修改页面样式后注意手机端文字不要挤压、遮挡或溢出。
- 修改时间或赛程后必须运行本地数据检查，确认首页顺序正确。

## 建议检查命令

```powershell
node -c app.js
node -c utils/matches.js
node -c pages/index/index.js
node -c pages/detail/detail.js
node -c pages/history/history.js
node -c utils/liveMatchScores.js
node -c utils/liveTeamStats.js
node -c cloudfunctions/liveScores/index.js
```

检查首页排序：

```powershell
node -e "const d=require('./utils/matches'); d.upcomingMatches.concat(d.recentFinishedHomeMatches||[]).sort((a,b)=>a.sortTime-b.sortTime).slice(0,8).forEach(m=>console.log(m.dateText+' '+m.kickoff+' '+m.home.cn+' vs '+m.away.cn))"
```
