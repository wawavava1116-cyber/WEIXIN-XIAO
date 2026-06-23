# 当前 Codex 交接记录

更新时间：2026-06-23 14:10 北京时间

本文件用于下一次进入项目时快速恢复上下文。进入项目后仍需先读：

1. `AGENTS.MD`
2. `README.MD`
3. `TODO.MD`
4. `.codex-skills/football-match-predictor/SKILL.md`
5. `CODEX_CHANGELOG.MD`

## 当前状态

本轮工作已完成，没有未提交的代码修复任务。

已提交并推送到 `origin/master`：

- `0411775 修复云端复盘稳定性`
- 前一笔数据提交：`1045d09 更新本地 Betfair 必发快照`

## 本轮完成内容

### 1. 修复云端历史复盘闪烁

用户端问题：

- 历史复盘里当天的阿根廷、法国比赛会频繁消失又出现。
- 首页可以实时同步云端数据，但历史复盘表现不稳定。

根因：

- 云端 `server/src/buildDatabaseSnapshot.js` 合并复盘时，实时比分生成的临时复盘会覆盖 `utils/matches.js` 里的已归档复盘。
- 当实时比分源或服务器快照刷新出现波动时，已归档复盘可能被临时数据覆盖，导致客户端看到复盘忽隐忽现。

修复：

- 已归档复盘优先。
- 实时比分只补充缺失的复盘。
- 不再允许实时比分覆盖本地已经写入的 `finishedReviewSource`。

涉及文件：

- `server/src/buildDatabaseSnapshot.js`
- `server/src/liveScoresClient.js`
- `CODEX_CHANGELOG.MD`

### 2. 修正云端实时比分映射

修复了部分比赛 ID 与实际赛程方向不一致的问题，并补充 6 月 26 日、6 月 27 日部分赛程映射。

重点修正包括：

- `panama-croatia-20260623`
- `england-ghana-20260623`
- `southafrica-korea-20260624`
- `czechia-mexico-20260624`
- `bosnia-qatar-20260624`
- `switzerland-canada-20260624`

新增映射包括：

- `norway-france-20260626`
- `senegal-iraq-20260626`
- `caboverde-saudi-20260626`
- `uruguay-spain-20260626`
- `newzealand-belgium-20260626`
- `egypt-iran-20260626`
- `panama-england-20260627`
- `croatia-ghana-20260627`
- `colombia-portugal-20260627`
- `congodr-uzbekistan-20260627`
- `algeria-austria-20260627`
- `jordan-argentina-20260627`

### 3. 云端已同步

已通过 Chrome 进入腾讯云 OrcaTerm，在服务器执行同步和验证。

服务器目录：

- `/opt/worldcup-mini`
- 服务目录：`/opt/worldcup-mini/server`

云端 Git 状态：

- 当前提交：`0411775 修复云端复盘稳定性`

云端数据库接口确认：

- 接口：`http://127.0.0.1:8787/api/database/latest`
- `upcomingMatches`: 28
- `finishedMatches`: 44
- 阿根廷 vs 奥地利复盘稳定存在：
  - `matchId`: `argentina-austria-20260622`
  - `score`: `2-0`
  - `percent`: `70%`
  - `reviewId`: `argentina-austria-review`
- 法国 vs 伊拉克复盘稳定存在：
  - `matchId`: `france-iraq-20260622`
  - `score`: `3-0`
  - `percent`: `100%`
  - `reviewId`: `france-iraq-review`

### 4. 停止服务器 5 分钟 Betfair 自动同步

用户之前明确要求停止服务器 5 分钟自动更新，因为 VPN 连接问题会导致异常。

已处理：

- PM2 服务已重建。
- 常驻服务进程已设置 `BETFAIR_SYNC_ENABLED=0`。
- `INCLUDE_BETFAIR_CACHE=1` 保留，云端接口仍可读取已有 Betfair 缓存。
- 已清理常驻进程环境里的 Betfair 会话变量。

当前服务：

- PM2 名称：`worldcup-betfair`
- 启动目录：`/opt/worldcup-mini/server`
- 服务在线。

注意：

- 如果以后需要重新跑 Betfair，同步方式应为本地获取最新 Betfair 数据后上传或生成快照，不要恢复服务器 5 分钟自动拉取。

## 已验证

本地验证：

- `node -c server/src/buildDatabaseSnapshot.js`
- `node -c server/src/liveScoresClient.js`
- `node -c server/src/liveScoreRefresh.js`
- `node -c utils/matches.js`
- 首页排序检查通过。
- 用错误实时比分模拟阿根廷和法国复盘，静态复盘仍保持：
  - 阿根廷 `2-0 / 70%`
  - 法国 `3-0 / 100%`

云端验证：

- `npm run check` 通过。
- `npm run daily` 生成成功。
- 云端快照文件显示：
  - `upcoming`: 28
  - `finished`: 44
- 云端 API 返回同样结果：
  - `upcoming`: 28
  - `finished`: 44
- 阿根廷、法国复盘在 API 中稳定存在。

## 后续注意事项

- 修改复盘命中率时，当前规则为：胜平负 50%、比分 30%、进球数 20%。
- 已归档复盘不要被实时比分覆盖；实时比分只能补缺。
- 每次更新比赛数据库后，必须同步更新 `utils/buildInfo.js` 的数据库更新时间。
- 服务器自动 Betfair 同步目前应保持关闭。
- 不要把 Betfair token、SSOID、证书或私钥写入仓库。
- 修改 `server/` 后需要重新部署或重启轻量服务器服务。
- 修改 `cloudfunctions/liveScores` 后需要提醒用户在微信开发者工具里重新上传部署云函数。
