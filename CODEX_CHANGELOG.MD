# Codex 项目变更日志

这个文件用于记录每次 Codex 或协作者对小程序做出的重要修改，方便后续在公司电脑、家里电脑或其他环境继续接手。

## 写入规则

每次修改小程序并准备提交或上传到 Git 前，必须在本文件顶部追加一条日志。

日志至少包含：

- 日期和时间。
- 修改人或环境，例如：公司电脑 Codex、家里电脑 Codex、人工修改。
- 修改目的。
- 涉及文件。
- 主要改动。
- 数据库/赛程/复盘是否变更。
- 是否需要重新上传部署云函数。
- 已做验证。
- 后续注意事项。

模板：

```markdown
## YYYY-MM-DD HH:mm - 修改标题

- 环境：
- 目的：
- 涉及文件：
- 主要改动：
- 数据库/赛程/复盘：
- 云函数：
- 验证：
- 后续注意：
```

---

## 2026-06-14 晚间 - 首页刷新、复盘归档、详情概率与交接规则

- 环境：家里电脑 Codex
- 目的：解决首页旧比赛/旧缓存展示、补充完赛复盘、增加详情页概率条，并为后续协作留下交接资料。
- 涉及文件：
  - `.codex-skills/football-match-predictor/SKILL.md`
  - `AGENTS.MD`
  - `CODEX_HANDOFF_2026-06-14.MD`
  - `CODEX_CHANGELOG.MD`
  - `utils/matches.js`
  - `utils/buildInfo.js`
  - `pages/index/index.js`
  - `pages/index/index.wxml`
  - `pages/index/index.wxss`
  - `pages/detail/detail.wxml`
  - `pages/detail/detail.wxss`
  - `pages/history/history.js`
  - `pages/history/history.wxml`
  - `cloudfunctions/liveScores/index.js`
- 主要改动：
  - 首页启动遮盖页改为 LOGO 从下往上显示，百分比在 LOGO 上方。
  - 首页进入前清理旧实时比分缓存和完赛检测缓存。
  - 首页启动阶段等待首轮实时比分同步结束后再展示列表。
  - 首页每轮刷新从完整赛程底稿合并实时比分，避免已隐藏比赛无法进入复盘。
  - 详情页在综合结论上方增加胜平负概率条和预期进球概率条。
  - 概率算法改为基于排名、身价、盘口、大小球等客观因素估计，不从预测结果反推。
  - skill 中补充赔率驱动概率算法：优先比分赔率、球队进球赔率、胜平负/亚盘/大小球。
  - 新增动态数据库更新时间工具 `utils/buildInfo.js`。
  - 新增交接文件 `CODEX_HANDOFF_2026-06-14.MD`。
- 数据库/赛程/复盘：
  - 新增北京时间 6月20日四场比赛：巴西-海地、苏格兰-摩洛哥、土耳其-巴拉圭、美国-澳大利亚。
  - 已归档完赛：卡塔尔 1-1 瑞士、巴西 1-1 摩洛哥、海地 0-1 苏格兰、澳大利亚 2-0 土耳其。
  - 当前检查时 `finishedMatches` 为 8 场，`upcomingMatches` 为 24 场。
- 云函数：
  - `cloudfunctions/liveScores/index.js` 新增 6月20日四场比赛识别映射。
  - 修改过云函数，上传小程序前需要在微信开发者工具重新上传并部署 `liveScores`。
- 验证：
  - 已运行相关 JS 语法检查。
  - 已检查首页未赛数量和复盘数量。
  - 已抽查德国-库拉索、西班牙-佛得角的弱队进球概率。
- 后续注意：
  - 每次更新预测前，必须先核对已结束比赛并写入 `finishedReviewSource`。
  - 概率数据后续应优先接入真实比分赔率和球队进球赔率。
  - 提交 Git 前继续在本文件顶部追加新的变更日志。
