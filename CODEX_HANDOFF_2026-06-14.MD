# Codex 交接记录：2026-06-14

这份文件用于明天在公司电脑继续协作时快速恢复上下文。新的 Codex 进入项目后，请先读：

1. `AGENTS.MD`
2. `README.MD`
3. `TODO.MD`
4. `.codex-skills/football-match-predictor/SKILL.md`
5. 本文件：`CODEX_HANDOFF_2026-06-14.MD`
6. `CODEX_CHANGELOG.MD`

## 今天完成的主要调整

### 1. 首页更新与启动遮盖页

目标：避免用户刚进首页时看到旧比赛预测或旧缓存状态。

涉及文件：

- `pages/index/index.js`
- `pages/index/index.wxml`
- `pages/index/index.wxss`

调整内容：

- 首页启动时显示全屏遮盖页。
- 遮盖页只显示 LOGO 和百分比。
- LOGO 居中，百分比在 LOGO 上方，白色小字号。
- LOGO 会按百分比从下往上露出。
- 进入首页前会清理：
  - `worldcup_live_score_cache`
  - `worldcup_finished_detected_at`
- 启动阶段会等待首轮实时比分同步回调结束后再展示首页。
- 普通后台刷新仍保留兜底，避免页面长期卡住。
- 遮盖页整体上移过一次，适配手机端视觉居中。

注意：

- 微信小程序无法完全无感强制用户拿到最新包。
- 当前使用的是“遮盖页 + 清缓存 + 检查小程序更新”的短期方案。
- 长期更好的方案是把预测数据库迁移到云端，由首页启动时拉云端最新数据。

### 2. 首页实时比分和归档逻辑修正

目标：已结束比赛不能继续被首页当作未开赛比赛展示。

涉及文件：

- `pages/index/index.js`
- `utils/matches.js`
- `AGENTS.MD`
- `.codex-skills/football-match-predictor/SKILL.md`

调整内容：

- 首页刷新不再只基于当前已显示列表继续滚动刷新，而是每轮从完整赛程底稿开始合并实时比分。
- 每次使用预测 skill 更新赛程或重新发布预测时，必须先核对已开始/已结束比赛。
- 已结束比赛必须写入 `finishedReviewSource`。
- 写入复盘后会通过 `isFinished` 自动从 `upcomingMatches` 移除。
- 完赛比赛首页最多保留 1 小时，之后只进复盘和历史。

今天已归档的比赛：

- 卡塔尔 1-1 瑞士，命中率 0%
- 巴西 1-1 摩洛哥，命中率 25%
- 海地 0-1 苏格兰，命中率 75%
- 澳大利亚 2-0 土耳其，命中率 0%

当前数据检查结果：

- `finishedMatches`：8 场
- `upcomingMatches`：24 场
- 澳大利亚 vs 土耳其已不在首页未赛列表里。

### 3. 比赛更新到北京时间 6月20日

涉及文件：

- `utils/matches.js`
- `cloudfunctions/liveScores/index.js`
- `pages/index/index.js`

新增的北京时间 6月20日比赛：

- 00:00 巴西 vs 海地
- 03:00 苏格兰 vs 摩洛哥
- 06:00 土耳其 vs 巴拉圭
- 09:00 美国 vs 澳大利亚

同步调整：

- 新增四场预测、分析、盘口倾向、风险点。
- 新增四场 `matchMeta`。
- 新增四场首页焦点权重。
- 新增四场云函数实时比分识别映射。

注意：

- 修改过 `cloudfunctions/liveScores/index.js` 后，需要在微信开发者工具中重新上传并部署云函数。

### 4. 数据库更新时间改为动态显示

涉及文件：

- `utils/buildInfo.js`
- `pages/index/index.js`
- `pages/index/index.wxml`
- `pages/history/history.js`
- `pages/history/history.wxml`

调整内容：

- 新增 `utils/buildInfo.js`。
- 首页和历史页不再硬编码 `数据库更新：6/13 17:21 · 版本 1.0.2`。
- 改为通过 `getDatabaseBadge()` 动态生成北京时间显示。

说明：

- 小程序前端没有可靠的真实“上传时间” API。
- 当前显示的是小程序打开时的北京时间。
- 如果以后需要真正的上传时间，建议放到云端配置里。

### 5. 详情页新增概率可视化

目标：在详情页“综合结论”上方增加概率图形。

涉及文件：

- `utils/matches.js`
- `pages/detail/detail.wxml`
- `pages/detail/detail.wxss`
- `.codex-skills/football-match-predictor/SKILL.md`

新增展示：

- 胜平负概率占比。
- 预期进球概率占比。

胜平负展示规则：

- 一条堆叠概率条。
- 只显示百分比，不显示球队名。
- 概率条颜色按概率分级：
  - 绿色：高概率
  - 黄色：中高概率
  - 橙色：中低概率
  - 红色：低概率
- 概率段过窄时，百分比自动浮到条上方。

预期进球展示规则：

- 主队和客队左右两条堆叠概率条。
- 主队顺序：`3+ / 2 / 1 / 0`
- 客队顺序：`0 / 1 / 2 / 3+`
- 条内只显示百分比。
- 过窄时百分比浮到条上方。
- 条下方显示进球数标签。

只在未开始比赛详情页展示：

```text
scorePanel.mode === 'pending'
```

### 6. 概率算法调整

最重要原则：

- 概率不能从最终预测结果反推。
- 不能从 `pick.result`、`pick.score`、`pick.backup` 推导概率。
- 应先做概率分析，再得出最终预测。

已写入 skill 的算法优先级：

1. 比分赔率。
2. 球队进球数赔率 / 是否进球 / 零封赔率。
3. 胜平负、亚盘、大小球。
4. 排名、身价、伤停、阵容、状态、交锋、场地、旅行、天气等。

当前代码里的临时实现：

- 由于项目里暂时没有真实赔率数据字段，`utils/matches.js` 里先用排名、身价、盘口文字、大小球文字做基础模型。
- 加入了强热门零封压力逻辑。
- 强弱差距大、盘口深、身价/排名差距明显时，会抬高弱队 0 球概率。

已重点修正的例子：

- 德国 vs 库拉索：
  - 库拉索 0球：74%
  - 库拉索 1球：14%
  - 库拉索 2球：8%
  - 库拉索 3+：4%
  - 库拉索 1球以上：26%

- 西班牙 vs 佛得角：
  - 佛得角 0球：74%
  - 佛得角 1球：14%
  - 佛得角 2球：8%
  - 佛得角 3+：4%
  - 佛得角 1球以上：26%

后续建议：

- 给每场比赛新增真实赔率输入字段，例如：
  - `analysis.odds.correctScore`
  - `analysis.odds.teamGoals`
  - `analysis.odds.oneXtwo`
  - `analysis.odds.handicap`
  - `analysis.odds.total`
- 再用 skill 中的新算法从赔率直接聚合概率。

## 今天新增/修改过的关键文件

新增：

- `utils/buildInfo.js`
- `CODEX_HANDOFF_2026-06-14.MD`

修改：

- `.codex-skills/football-match-predictor/SKILL.md`
- `AGENTS.MD`
- `utils/matches.js`
- `pages/index/index.js`
- `pages/index/index.wxml`
- `pages/index/index.wxss`
- `pages/detail/detail.wxml`
- `pages/detail/detail.wxss`
- `pages/history/history.js`
- `pages/history/history.wxml`
- `cloudfunctions/liveScores/index.js`

## 明天继续时优先检查

1. 用微信开发者工具预览手机端首页。
2. 确认启动遮盖页视觉是否合适。
3. 确认首页不再显示已结束比赛为未开赛。
4. 确认详情页概率条在手机端不重叠、不溢出。
5. 重新上传并部署 `cloudfunctions/liveScores`。
6. 如继续更新预测，先核对完赛比赛并归档，再补新赛程。

## 建议验证命令

本机如果已安装 Node，可直接运行：

```powershell
node -c app.js
node -c utils/matches.js
node -c pages/index/index.js
node -c pages/detail/detail.js
node -c pages/history/history.js
node -c utils/liveMatchScores.js
node -c utils/liveTeamStats.js
node -c cloudfunctions/liveScores/index.js
node -c utils/buildInfo.js
```

检查首页排序：

```powershell
node -e "const d=require('./utils/matches'); d.upcomingMatches.concat(d.recentFinishedHomeMatches||[]).sort((a,b)=>a.sortTime-b.sortTime).slice(0,8).forEach(m=>console.log(m.dateText+' '+m.kickoff+' '+m.home.cn+' vs '+m.away.cn))"
```

检查完赛/未赛数量：

```powershell
node -e "const d=require('./utils/matches'); console.log('upcoming', d.upcomingMatches.length); console.log('finished', d.finishedMatches.length); d.finishedMatches.slice(0,10).forEach(m=>console.log(m.dateText, m.kickoff, m.matchId, m.score, m.percent))"
```

检查某场概率：

```powershell
node -e "const d=require('./utils/matches'); const m=d.matches.find(x=>x.id==='spain-caboverde-20260615'); console.log(m.analysis.probability.result); console.log(m.analysis.probability.goals.away.items)"
```

## 注意事项

- 当前工作区还有一些未提交修改，明天继续前先看 `git status`。
- 以后任何人或 Codex 修改小程序并准备提交/上传 Git 前，必须在 `CODEX_CHANGELOG.MD` 顶部追加一条变更日志。
- 不要提交 `cloudfunctions/liveScores/node_modules/`。
- 如果改了云函数，必须提醒用户在微信开发者工具重新上传并部署。
- 如果新增完赛复盘，命中率必须按 skill 的 100/50/0 规则计算。
- 如果新增预测概率，优先查比分赔率和球队进球赔率；没有赔率时，必须说明是基于排名、身价、盘口、大小球、伤停和状态的估计。
