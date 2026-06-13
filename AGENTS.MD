# Codex 协作说明

本项目是微信小程序“世界杯赛前播报”。任何 Codex 或协作者进入项目后，请先阅读本文件，再处理数据、页面或云函数。

## 必读文件

1. `README.MD`：项目功能、导入方式、云函数部署方式。
2. `TODO.MD`：当前待办和风险。
3. `.codex-skills/football-match-predictor/SKILL.md`：比赛预测和复盘数据更新规则。

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
- `pages/index/`：首页、今日焦点、近 7 天比赛、复盘入口。
- `pages/detail/`：单场比赛详情和打赏入口。
- `pages/history/`：历史场次和日期筛选。
- `assets/flags/`：国家队旗帜。
- `assets/brand/`：世界杯视觉相关图片。

## 数据规则

- 首页比赛必须按 `sortTime` 升序排列。
- `dateText` 和 `kickoff` 为北京时间展示字段。
- 云函数返回的 `sortTime` 优先级高于静态数据。
- 完赛比赛首页最多保留 12 小时，之后只进入复盘和历史场次。
- 比赛复盘按结束时间倒序展示，最多显示近 10 场。
- 复盘命中率规则：
  - 胜负主选命中：100。
  - 胜负备选命中：50。
  - 比分主选命中：100。
  - 比分备选命中：50。
  - 最终百分比为胜负权重和比分权重的平均值。
  - 100% 绿色，75% 黄色，50% 橙色，25% 或 0% 红色。

## 预测纪律

- 让球方不得写“不败”。
- 受让方可以在合理条件下写“不败”。
- 深盘热门方要区分“赢球”和“穿盘”。
- 强热门不要机械添加平局备选。
- 比分备选不能反向暗示未支持的胜平负备选。
- 红牌和停赛必须进入下一场分析，尤其是核心后卫、中场屏障、队长、门将、定位球主罚者和关键攻击手。

## 开发规则

- 尽量保持微信小程序原生写法，不引入大型框架。
- 修改 `cloudfunctions/liveScores` 后，需要提醒用户重新上传并部署云函数。
- 不要提交 `cloudfunctions/liveScores/node_modules/`。
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
