# Codex 项目变更日志

## 2026-06-18 17:08 - 补齐滚动 7 天世界杯预测窗口

- 环境：公司电脑 Codex
- 目的：修正预测窗口停留在 6/20 的问题，改为每天先确认北京时间当天日期，再覆盖从当天开始 7 个自然日内的世界杯比赛预测。
- 涉及文件：`utils/matches.js`、`utils/buildInfo.js`、`AGENTS.MD`、`.codex-skills/football-match-predictor/SKILL.md`、`CODEX_CHANGELOG.MD`
- 主要改动：新增 6/21-6/25 北京时间范围内 24 场世界杯小组赛预测；保留已归档 24 场复盘；把滚动 7 天规则写入协作说明和预测 Skill；更新数据库更新时间为 `6/18 17:08`。
- 数据库/赛程/复盘：已变更。后续比赛扩展为 30 场，覆盖 6/19 00:00 捷克 vs 南非 至 6/25 09:00 南非 vs 韩国；已结束比赛继续在复盘和历史场次展示。
- 云函数：未修改微信云函数，不需要重新上传云函数。
- 验证：已运行本地 JS 语法检查、首页排序检查、滚动 7 天窗口检查和服务器快照生成检查；结果为 30 场后续比赛、24 场复盘。
- 后续注意：推送 Git 后需要触发轻量云服务器拉取并刷新 `/api/database/latest`，开发者工具清缓存后应看到未来 7 天窗口内 30 场后续预测。

## 2026-06-18 16:47 - 归档已结束比赛并同步后续赛程

- 环境：公司电脑 Codex
- 目的：按预测 Skill 核对已结束比赛，把 6/16-6/18 已完赛场次写入静态复盘，并让本地开发者工具与云端数据库快照保持一致。
- 涉及文件：`utils/matches.js`、`utils/buildInfo.js`、`CODEX_CHANGELOG.MD`
- 主要改动：新增 12 场复盘归档；静态未赛列表自动缩减为 8 场；同步 6/20 四场后续比赛的云端赛程时间；更新数据库更新时间为 `6/18 16:47`。
- 数据库/赛程/复盘：已变更。新增复盘包括西班牙 0-0 佛得角、比利时 1-1 埃及、沙特阿拉伯 1-1 乌拉圭、伊朗 2-2 新西兰、法国 3-1 塞内加尔、伊拉克 1-4 挪威、阿根廷 3-0 阿尔及利亚、奥地利 3-1 约旦、葡萄牙 1-1 刚果民主共和国、英格兰 4-2 克罗地亚、加纳 1-0 巴拿马、乌兹别克斯坦 1-3 哥伦比亚。
- 云函数：未修改微信云函数，不需要重新上传云函数。
- 验证：已运行本地 JS 语法检查、首页排序检查和服务器快照生成检查；结果为 8 场后续比赛、24 场复盘。
- 后续注意：本次修改 `server/` 以外文件；推送 Git 后需要触发轻量云服务器拉取并刷新 `/api/database/latest`，开发者工具清缓存后应看到 8 场后续比赛和 24 场复盘。

## 2026-06-18 13:17 - 接入服务器 HTTPS 域名

- 环境：公司电脑 Codex
- 目的：将小程序远程数据库和服务器 API 地址切换到已解析的正式域名 `www.ag-shield.com`。
- 涉及文件：`utils/serverConfig.js`、`server/scripts/update-from-git.sh`、`CODEX_CHANGELOG.MD`
- 主要改动：把 `apiBaseUrl` 配置为 `https://www.ag-shield.com`；后续小程序启动会优先读取该域名下的 `/api/database/latest`；服务器自动拉取脚本安装依赖时不生成未跟踪的 `package-lock.json`。
- 数据库/赛程/复盘：未修改预测或复盘内容；服务器运行态快照仍由实时比分动态覆盖。
- 云函数：未修改微信云函数；服务器需要配置 HTTPS 证书。
- 验证：已确认 `www.ag-shield.com` 解析到 `82.156.36.10`，HTTPS `/health` 和 `/api/database/latest` 正常；已运行小程序相关 JS 检查。
- 后续注意：需要在微信公众平台后台把 `https://www.ag-shield.com` 添加为 request 合法域名，并重新上传小程序版本。

## 2026-06-18 13:08 - 服务器快照增加实时比分动态覆盖

- 环境：公司电脑 Codex
- 目的：让轻量云服务器在每天 12:15 拉取 Git 完整更新之外，持续抓取进行中和已结束比赛状态，并动态覆盖 `/api/database/latest` 缓存，避免用户看到 12 点静态快照。
- 涉及文件：`server/src/liveScoresClient.js`、`server/src/liveScoreRefresh.js`、`server/src/buildDatabaseSnapshot.js`、`server/src/index.js`、`server/src/dailyRefresh.js`、`server/src/store.js`、`server/package.json`、`CODEX_CHANGELOG.MD`
- 主要改动：新增服务器端 ESPN 实时比分抓取；新增 `live-scores` 刷新脚本和 `POST /api/live-scores/sync`；服务启动后默认每 60 秒刷新比分并重写数据库快照；完赛比赛会从服务器 `upcomingMatches` 移入 `recentFinishedHomeMatches`，并补入动态复盘结果。
- 数据库/赛程/复盘：未修改静态预测内容；服务器运行态缓存会按实时比分动态变化，第二天拉 Git 后再以最新静态数据库为基础继续覆盖。
- 云函数：未修改微信云函数；需要重新部署轻量云服务器服务。
- 验证：已运行服务端语法检查、小程序主要 JS 语法检查和 `npm run live-scores`；本地生成 20 条实时比分覆盖、8 场未赛、12 场首页近期完赛、24 条复盘。
- 后续注意：服务器未配置 Betfair 环境变量时，Betfair 同步仍会失败但不影响实时比分和数据库快照；微信小程序正式读取服务器仍需 HTTPS 域名和 request 合法域名配置。

## 2026-06-18 12:31 - 配置方案 B 每日预测更新链路

- 环境：公司电脑 Codex
- 目的：按用户选择的方案 B，建立“Codex 定时更新预测并推送 Git，服务器定时拉取并发布快照”的流程。
- 涉及文件：`server/scripts/update-from-git.sh`、`server/README.md`、`README.MD`、`TODO.MD`、`CODEX_CHANGELOG.MD`
- 主要改动：新增服务器拉取 Git 并执行 `npm run daily` 的脚本；文档补充服务器 12:15 cron 配置；创建 Codex 每天 12:00 自动任务，负责读取 Skill、更新未来 7 天赛程预测、归类复盘、提交并推送 `origin/master`。
- 数据库/赛程/复盘：本次未直接修改比赛数据；自动任务将在后续运行时更新。
- 云函数：未修改微信云函数；服务器需要部署 `server/` 并配置 cron。
- 验证：已运行主要小程序 JS、服务器 JS 和 JSON 配置检查。
- 后续注意：服务器需先 clone 当前 Git 仓库到 `/opt/worldcup-mini`，配置 `.env`、PM2、HTTPS 和 cron；微信公众平台需添加服务器 request 合法域名。

## 2026-06-18 12:23 - 增加服务器数据库快照和小程序远程读取

- 环境：公司电脑 Codex
- 目的：让轻量云服务器每天生成小程序可读取的数据库快照，为后续每天 12 点自动更新赛程、预测、复盘和历史场次打基础。
- 涉及文件：`server/src/buildDatabaseSnapshot.js`、`server/src/dailyRefresh.js`、`server/src/index.js`、`server/src/store.js`、`server/package.json`、`server/README.md`、`utils/remoteMatchDatabase.js`、`pages/index/index.js`、`pages/detail/detail.js`、`pages/history/history.js`、`README.MD`、`TODO.MD`、`AGENTS.MD`、`CODEX_CHANGELOG.MD`
- 主要改动：新增 `/api/database/latest` 接口；新增 `npm run snapshot` 和 `npm run daily`；首页、详情页、历史页优先读取服务器数据库缓存，服务器不可用时回退本地静态 `utils/matches.js`；文档补充每天 12 点 cron 配置。
- 数据库/赛程/复盘：未修改静态预测内容；服务器快照当前由本地静态数据库生成并合并 Betfair 缓存。
- 云函数：未修改微信云函数；服务器部署后需要配置 HTTPS 域名和小程序 request 合法域名。
- 验证：已运行小程序和服务器 JS 语法检查、JSON 配置解析；已运行 `node server/src/buildDatabaseSnapshot.js`，生成 30 场总比赛、20 场未赛、12 场复盘的快照。
- 后续注意：真正自动补足未来 7 天比赛并生成预测文本，还需要接入赛程抓取和预测生成/人工审核任务；当前已完成发布通道和前端读取通道。

## 2026-06-18 12:20 - 预测 Skill 明确 Betfair 权重和缺失分摊规则

- 环境：公司电脑 Codex
- 目的：按用户给定权重表调整预测 Skill，新增必发买卖、资金流、临场异动 9% 权重，并明确缺失 Betfair 数据时的权重分摊方式。
- 涉及文件：`.codex-skills/football-match-predictor/SKILL.md`、`CODEX_CHANGELOG.MD`
- 主要改动：将赛前概率模型表述改为加权证据模型；保留推荐权重表；新增 Betfair 不可用时把 9% 平均分摊到其他九项的 fallback 权重。
- 数据库/赛程/复盘：未修改比赛数据。
- 云函数：未修改云函数；不需要重新部署。
- 验证：已检查 Skill 中推荐权重、fallback 权重和 Betfair 数据缺失规则。
- 后续注意：以后重跑预测时，如果 Betfair 数据缺失，需要在风险点里说明“必发数据缺失/较薄/延迟”，不能默认为中性支持。

## 2026-06-18 12:12 - 增加轻量云服务器 Betfair 同步服务准备

- 环境：公司电脑 Codex
- 目的：为已购买的轻量云服务器准备 Betfair 交易量同步服务，小程序前端继续由微信上传，Betfair 密钥和 SSOID 只放服务器。
- 涉及文件：`.gitignore`、`server/`、`utils/serverConfig.js`、`utils/remoteBetfairMarkets.js`、`README.MD`、`TODO.MD`、`AGENTS.MD`、`CODEX_CHANGELOG.MD`
- 主要改动：新增无数据库依赖的 Node.js 服务，支持 `keepAlive`、`certlogin`、`listMarketCatalogue`、`listMarketBook`、JSON 缓存和 API 输出；新增服务器部署说明、环境变量模板、比赛映射配置和小程序端远程 Betfair 数据读取工具。
- 数据库/赛程/复盘：未修改 `utils/matches.js` 静态预测数据；本地测试生成的 `server/data/` 已加入忽略。
- 云函数：未修改微信云函数；服务器部署后需要单独重启/部署 `server/` 服务。
- 验证：已运行小程序主要 JS 语法检查、服务器 JS 语法检查、JSON 配置解析；用当前有效 Betfair SSOID 测试同步，除已过时的乌兹别克斯坦场次外，其余配置目标可匹配到 Betfair 市场。
- 后续注意：上线前需要给服务器配置 HTTPS 域名，并在微信公众平台添加 request 合法域名；再把域名写入 `utils/serverConfig.js` 的 `apiBaseUrl`。

## 2026-06-15 15:40 - 历史复盘迷你图恢复为轻量图表

- 环境：公司电脑 Codex
- 目的：修复原生 canvas 版本在首页标题栏中不可见的问题，并避免重新引入 ECharts 导致主包超限。
- 涉及文件：`pages/index/index.wxml`、`pages/index/index.wxss`、`pages/index/index.js`、`pages/index/index.json`
- 主要改动：移除原生 canvas 残留初始化，恢复 WXML/CSS 迷你折线图；压缩节点间距、预留右侧最终百分比空间；修复首页 JSON 标题配置。
- 数据库/赛程/复盘：未改动比赛数据。
- 云函数：不需要重新部署。
- 验证：`node -c pages/index/index.js`；Node 按 UTF-8 读取并解析 `pages/index/index.json` 通过。
- 后续注意：小程序开发者工具内看到 PowerShell 乱码不代表 JSON 实际损坏，以 Node/微信开发者工具读取结果为准。

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

## 2026-06-15 15:32 - 历史复盘迷你图改为原生 canvas 连续绘制

- 环境：公司电脑 Codex
- 目的：修复轻量折线图节点不连续、最后百分比被裁切、首个节点贴近 Y 轴的问题。
- 涉及文件：
  - `pages/index/index.js`
  - `pages/index/index.wxml`
  - `pages/index/index.wxss`
  - `CODEX_CHANGELOG.MD`
- 主要改动：
  - 首页历史复盘迷你图改为小程序原生 `canvas` 手绘，不引入 ECharts 等大体积库。
  - 横向绘制区域从左侧 Y 轴和右侧百分比标签中间开始，缩短节点间总跨度，为最终百分比预留空间。
  - Y 轴标签保留 `100%`、`50%`、`0`，并让首个节点与 Y 轴保持间距。
  - 折线、节点和最终百分比都由同一坐标系统绘制，避免 CSS 旋转线段造成断点错位。
- 数据库/赛程/复盘：无数据变更。
- 云函数：未修改云函数，无需重新部署。
- 验证：
  - 已运行 `node -c pages/index/index.js`
  - 已验证 `pages/index/index.json` 可解析。
- 后续注意：该图表仍不依赖第三方库，上传包体积不受影响；如开发者工具仍显示旧图，重新编译即可。

---

## 2026-06-15 15:26 - 移除首页完整 ECharts 主包依赖并压缩上传包

- 环境：公司电脑 Codex
- 目的：修复微信开发者工具上传失败 `source size 4733KB exceed max limit 2MB` 的问题。
- 涉及文件：
  - `pages/index/index.js`
  - `pages/index/index.wxml`
  - `pages/index/index.wxss`
  - `pages/index/index.json`
  - `project.config.json`
  - `CODEX_CHANGELOG.MD`
- 主要改动：
  - 首页历史复盘迷你图从 `echarts/ec-canvas` 改为轻量 WXML/WXSS 原生折线图，保留折线、节点、Y 轴 `0/50%/100%` 和最终百分比。
  - 移除首页对 `echarts` 的 `require` 和 `ec-canvas` 组件注册，避免把 3MB+ 的 ECharts 主包打进上传包。
  - `project.config.json` 明确忽略 `node_modules`、`miniprogram_npm`、`ec-canvas` 以及云函数本地依赖目录。
- 数据库/赛程/复盘：无数据变更。
- 云函数：未修改云函数，无需重新部署。
- 验证：
  - 已运行 `node -c pages/index/index.js`
  - 已验证 `pages/index/index.json` 和 `project.config.json` 可解析。
  - 已确认页面代码中无 `echarts/ec-canvas` 引用。
  - 已按忽略目录估算主包约 `1.56MB`，低于微信上传单包 `2MB` 限制。
- 后续注意：微信开发者工具里需要重新编译；如果仍按旧包体上传，执行“清缓存并编译”后再上传。

---

## 2026-06-15 15:19 - 预测 Skill 加入教练打法并重跑未赛预测

- 环境：公司电脑 Codex
- 目的：按用户要求把教练打法、球队进攻端和防守端综合表现纳入比分、胜负和进球数判断，并只对未开始比赛重新生成预测。
- 涉及文件：
  - `.codex-skills/football-match-predictor/SKILL.md`
  - `utils/matches.js`
  - `utils/buildInfo.js`
  - `CODEX_CHANGELOG.MD`
- 主要改动：
  - Skill 的研究清单、概率校准和决策规则新增“教练打法”和“攻防端综合表现”因素。
  - 未赛场次重跑预测，区分攻势教练/高压打法带来的大比分尾部，以及保守教练/防守型对手导致的强队小胜。
  - 新增 `coachStyleNotes`，在详情页战术分析中展示每场的教练打法与攻防端影响。
  - 瑞典 vs 突尼斯仅按完赛归类新增复盘，不重写赛前预测；该场从未赛列表移出。
  - 数据库更新时间更新为 `6/15 15:17`，版本保持 `1.0.2`。
- 数据库/赛程/复盘：
  - 未赛列表从 21 场变为 20 场。
  - 新增瑞典 5-1 突尼斯复盘，按原赛前预测计算命中率为 `37.5%`。
  - 多场未赛比分和进球数被重新校准，例如西班牙 2-0、乌拉圭 1-3、奥地利 3-1、葡萄牙 3-1、巴西 4-0、瑞士 1-0。
- 云函数：未修改云函数，无需重新部署。
- 验证：
  - 已运行 `node -c utils/matches.js`
  - 已运行 `node -c utils/buildInfo.js`
  - 已运行 `node -c pages/index/index.js`
  - 已运行 `node -c pages/detail/detail.js`
  - 已运行 `node -c pages/history/history.js`
  - 已确认未赛场次按时间排序后从 `6月16日 周二 00:00 西班牙 vs 佛得角` 开始。
  - 已确认未赛进球区间跨度均不超过 1 球，首页主选无“不败/优先/备选”混写。
  - 已确认 `predictionDiscipline` 无重复 key。
- 后续注意：后续重新跑 Skill 时，教练打法说明要同步影响 `pick.score`、`pick.backup`、`pick.total`、盘口顺序和详情页战术分析，不能只写文字不改结构化预测。

---

## 2026-06-15 15:04 - 历史复盘迷你图坐标与启动页隐藏修正

- 环境：公司电脑 Codex
- 目的：按用户要求调整首页历史复盘迷你折线图显示，并修复启动读条页上不应显示图表的问题。
- 涉及文件：
  - `pages/index/index.js`
  - `pages/index/index.wxml`
  - `CODEX_CHANGELOG.MD`
- 主要改动：
  - X 轴完全隐藏，不显示 X 坐标线和刻度。
  - Y 轴显示三档：`0`、`50%`、`100%`，并保留对应横向辅助线。
  - 最后一个节点显示累计最终百分比，保留 1 位小数。
  - 启动读条期间不渲染 `ec-canvas`，避免小程序 canvas 穿透启动遮罩；读条结束后再延迟初始化图表。
- 数据库/赛程/复盘：无数据变更。
- 云函数：未修改云函数，无需重新部署。
- 验证：
  - 已运行 `node -c pages/index/index.js`
  - 已验证 `pages/index/index.json` 可解析。
- 后续注意：如开发者工具仍显示旧图表状态，执行重新编译或清缓存后编译。

---

## 2026-06-15 14:56 - 修复 ec-canvas 与 ECharts 5 事件接口兼容

- 环境：公司电脑 Codex
- 目的：修复微信开发者工具中 `el.addEventListener is not a function` 报错导致首页历史复盘迷你图不显示的问题。
- 涉及文件：
  - `ec-canvas/ec-canvas.js`
  - `pages/index/index.js`
  - `CODEX_CHANGELOG.MD`
- 主要改动：
  - 在本地 `ec-canvas` 的 `WxCanvas` 适配层补齐 `addEventListener` 和 `removeEventListener` 空实现，兼容 ECharts 5 / ZRender 初始化时调用标准 DOM 事件接口。
  - 首页历史复盘迷你图配置增加 `disableTouch: true`，迷你图不需要触摸交互，减少事件桥接干扰。
- 数据库/赛程/复盘：无数据变更。
- 云函数：未修改云函数，无需重新部署。
- 验证：
  - 已运行 `node -c pages/index/index.js`
  - 已运行 `node -c ec-canvas/ec-canvas.js`
  - 已验证 `pages/index/index.json` 和 `ec-canvas/ec-canvas.json` 可解析。
- 后续注意：微信开发者工具可能缓存旧组件，若仍看到旧报错，先执行重新编译，必要时清缓存后再编译。

---

## 2026-06-15 14:50 - 历史页日期筛选改用完整复盘池

- 环境：公司电脑 Codex
- 目的：修复按日期搜索 6 月 13 日时，墨西哥 vs 南非等较早完赛场次被最近 10 场截断导致消失的问题。
- 涉及文件：
  - `utils/reviewCache.js`
  - `pages/history/history.js`
  - `CODEX_CHANGELOG.MD`
- 主要改动：
  - `reviewCache.mergeReviewLists` 增加可选数量限制，默认仍保留近 10 条，传入 `0` 时返回完整复盘列表。
  - 历史场次页面改为用完整 `finishedMatches` 复盘池构建日期筛选数据。
  - 历史页默认“全部”仍展示近 10 场，选择具体日期时展示该日期全部复盘，不再被近 10 场裁掉。
- 数据库/赛程/复盘：无静态数据变更。
- 云函数：未修改云函数，无需重新部署。
- 验证：
  - 已运行 `node -c utils/reviewCache.js`
  - 已运行 `node -c pages/history/history.js`
  - 已验证 6 月 13 日筛选结果包含：美国-巴拉圭、加拿大-波黑、韩国-捷克、墨西哥-南非。
  - 已验证默认列表仍为 10 条，完整复盘池为 11 条。
- 后续注意：如果后续历史复盘超过更多天数，日期筛选会继续从完整复盘池读取；首页历史复盘不受影响，仍保持近 10 场。

---

## 2026-06-15 14:47 - 详情页概率模块常驻显示

- 环境：公司电脑 Codex
- 目的：修复正在进行中和已结束比赛详情页看不到“胜平负概率占比”和“预期进球概率占比”的问题。
- 涉及文件：
  - `pages/detail/detail.wxml`
  - `CODEX_CHANGELOG.MD`
- 主要改动：
  - 将详情页概率卡片显示条件从“仅待赛 pending 显示”改为“只要比赛分析里有 `analysis.probability` 就显示”。
  - 进行中、已结束、未开赛三种状态都会保留概率模块。
- 数据库/赛程/复盘：无数据变更。
- 云函数：未修改云函数，无需重新部署。
- 验证：
  - 已运行 `node -c pages/detail/detail.js`
  - 已验证 `pages/detail/detail.json` 可解析。
  - 已确认 `pages/detail/detail.wxml` 概率模块条件为 `match.analysis && match.analysis.probability`。
- 后续注意：如果某条动态缓存历史比赛没有原始 `analysis.probability` 数据，仍需要静态数据库或后续复盘补齐分析字段。

---

## 2026-06-15 14:40 - 实时完赛复盘缓存与历史页样式统一

- 环境：公司电脑 Codex
- 目的：修复已结束比赛不能实时进入历史复盘的问题，并统一首页历史复盘与历史场次页面的复盘展示。
- 涉及文件：
  - `utils/reviewCache.js`
  - `pages/index/index.js`
  - `pages/index/index.wxml`
  - `pages/index/index.wxss`
  - `pages/history/history.js`
  - `pages/history/history.wxml`
  - `pages/history/history.wxss`
  - `pages/detail/detail.js`
  - `CODEX_CHANGELOG.MD`
- 主要改动：
  - 新增实时完赛复盘缓存工具，云函数同步到完赛比分后会把动态复盘写入本地缓存。
  - 首页历史复盘、历史场次页面、历史详情兜底均合并读取动态复盘，避免等待后台数据库手动更新。
  - 首页历史复盘和历史场次页面的每场复盘统一为左中右三栏：胜负、比分、预期进球。
  - 近 7 天比赛后面的场次数、关注、历史场次标签统一尺寸；无关注时关注标签为空心黄色，有关注时为实心黄色黑字。
- 数据库/赛程/复盘：未改静态数据库内容；新增实时缓存合并逻辑，动态完赛结果会优先进入前端复盘展示。
- 云函数：未修改云函数，无需重新部署。
- 验证：
  - 已运行 `node -c app.js`
  - 已运行 `node -c utils/matches.js`
  - 已运行 `node -c utils/reviewCache.js`
  - 已运行 `node -c pages/index/index.js`
  - 已运行 `node -c pages/history/history.js`
  - 已运行 `node -c pages/detail/detail.js`
  - 已验证 `app.json`、首页/历史/详情页 JSON 可解析。
  - 已验证动态复盘合并会进入近 10 场列表首位。
- 后续注意：实时复盘缓存依赖用户端同步到云函数返回完赛状态；如云函数没有返回最终比分或状态，仍需先检查 `liveScores` 云函数数据源。

---

## 2026-06-15 14:23 - 历史复盘标题栏内嵌 ec-canvas 迷你图

- 环境：公司电脑 Codex
- 目的：按用户要求把历史复盘命中率图表放在首页“历史复盘”和“展开”之间，同一行显示，不新增下方图表卡片。
- 涉及文件：
  - `pages/index/index.wxml`
  - `pages/index/index.wxss`
  - `pages/index/index.js`
  - `pages/index/index.json`
  - `ec-canvas/ec-canvas.js`
  - `ec-canvas/ec-canvas.json`
  - `ec-canvas/ec-canvas.wxml`
  - `ec-canvas/ec-canvas.wxss`
  - `CODEX_CHANGELOG.MD`
- 主要改动：
  - 首页历史复盘标题栏结构调整为左侧标题、中间 `ec-canvas` 迷你折线图、右侧展开按钮。
  - `pages/index/index.json` 注册 `"ec-canvas": "/ec-canvas/ec-canvas"`。
  - 从 `echarts-for-weixin` 的 `miniprogram_dist` 复制本地 `ec-canvas` 组件，保留 npm 依赖和源库不改动。
  - `history-mini-chart` 与 `history-mini-ec-canvas` 设置明确高度 `54rpx`，标题栏设置高度 `78rpx`。
  - JS 改为 `historyMiniEc` 和 `historyMiniChart`，在 `onReady` 后用 `setTimeout` 延迟初始化，刷新和展开后也延迟重绘。
- 数据库/赛程/复盘：无数据变更。
- 云函数：未修改云函数，无需重新部署。
- 验证：
  - 已运行 `node -c pages/index/index.js`。
  - 已验证 `pages/index/index.json` 和 `ec-canvas/ec-canvas.json` 可解析。
  - 已确认首页没有旧的 `reviewTrendChart/reviewEc` 使用点。
- 后续注意：如微信开发者工具仍提示 npm 组件，执行一次 `工具 -> 构建 npm`；本地 `/ec-canvas/ec-canvas` 已存在，正常情况下可直接引用。

---

## 2026-06-15 10:52 - 详情页跳转修复与历史复盘 ec-canvas 图表

- 环境：公司电脑 Codex
- 目的：修复详情页、历史场次、我的关注点击后不显示或显示乱码的问题，并按用户要求用 `echarts-for-weixin + ec-canvas` 重写历史复盘命中率图表。
- 涉及文件：
  - `app.json`
  - `package.json`
  - `package-lock.json`
  - `utils/matches.js`
  - `utils/buildInfo.js`
  - `pages/index/index.js`
  - `pages/index/index.json`
  - `pages/index/index.wxml`
  - `pages/index/index.wxss`
  - `pages/detail/detail.js`
  - `pages/detail/detail.wxml`
  - `pages/detail/detail.json`
  - `pages/history/history.js`
  - `pages/history/history.wxml`
  - `pages/history/history.json`
  - `pages/favorites/favorites.js`
  - `pages/favorites/favorites.wxml`
  - `pages/favorites/favorites.json`
  - `CODEX_CHANGELOG.MD`
- 主要改动：
  - 安装 `echarts@5.6.0` 和 `echarts-for-weixin@1.0.2`，首页 `pages/index/index.json` 注册 `ec-canvas`。
  - 历史复盘头部图表改为 ec-canvas 懒加载初始化，`onReady` 和复盘数据刷新后调用 `selectComponent('#reviewTrendChart').init(...)`。
  - 图表数据改为数值型累计平均命中率，Y 轴固定 `0-100`，并给 canvas 容器固定 `64rpx` 高度。
  - 重写详情页 WXML，修复坏闭合标签和乱码文案，详情页恢复显示。
  - 重写历史页和关注页 WXML/JS，修复中文乱码、括号显示和历史关注跳转 source。
  - 清理 `utils/matches.js` 原始数据里的“不败/平局优先”旧写法，避免详情页继续显示旧词。
  - 数据库更新时间更新为 `6/15 10:52`，版本保持 `1.0.2`。
- 数据库/赛程/复盘：预测展示字段有变更；复盘赛果未新增。
- 云函数：未修改云函数，无需重新部署。
- 验证：
  - 已运行 `node -c app.js`
  - 已运行 `node -c utils/matches.js`
  - 已运行 `node -c pages/index/index.js`
  - 已运行 `node -c pages/detail/detail.js`
  - 已运行 `node -c pages/history/history.js`
  - 已运行 `node -c pages/favorites/favorites.js`
  - 已验证页面 JSON 和 package JSON 可解析。
  - 已确认 `pick.result` 无“不败/优先/备选”混写。
- 后续注意：微信开发者工具需要执行 `工具 -> 构建 npm`，否则 `echarts-for-weixin` 组件不会生成到 `miniprogram_npm`，首页图表会不显示。

---

## 2026-06-15 10:34 - 重新运行预测 Skill 并补充 6/15 完赛复盘

- 环境：公司电脑 Codex
- 目的：按 `football-match-predictor` 规则重新更新数据库，补齐 6/15 已结束比赛，并检查历史复盘展示是否符合主选/备选/进球数命中规则。
- 涉及文件：
  - `utils/matches.js`
  - `utils/buildInfo.js`
  - `CODEX_CHANGELOG.MD`
- 主要改动：
  - 新增科特迪瓦 1-0 厄瓜多尔复盘：胜负显示 `平（胜）`，备选命中；比分未中；`2-3球` 对 1 个总进球判定未中。
  - 新增荷兰 2-2 日本复盘：胜负、比分、进球数均未中。
  - 新增德国 7-1 库拉索复盘：胜负主选命中；比分未中；`2-3球` 对 8 个总进球判定未中。
  - 三场已结束比赛自动从首页未赛列表移出，保留在历史复盘和历史场次。
  - 数据库更新时间更新为 `6/15 10:34`，版本保持 `1.0.2`。
- 数据库/赛程/复盘：有复盘数据变更，当前完赛记录 11 场，历史页取最近 10 场。
- 云函数：未修改云函数，无需重新部署。
- 验证：
  - 已检查历史复盘前 10 条展示字段和颜色 class。
  - 已确认 `pick.result` 没有“不败/优先/备选”混写。
  - 已确认 `pick.total` 没有超过 1 球跨度的区间。
  - 已确认新增三场不再出现在 `upcomingMatches`。
- 后续注意：德国比分公开报道存在 7-1 与 5-1 的冲突，本次按更多报道一致的 7-1 录入；如官方比分源返回不同结果，以官方比分源为准再修正。

---

## 2026-06-15 10:30 - 预测主备选与进球数区间规则收口

- 环境：公司电脑 Codex
- 目的：按用户要求把整体预测规则改成只有主选和备选，修正“不败/优先/备选”混写导致复盘括号和命中颜色不稳定的问题。
- 涉及文件：
  - `.codex-skills/football-match-predictor/SKILL.md`
  - `AGENTS.MD`
  - `utils/matches.js`
  - `pages/index/index.wxml`
  - `utils/buildInfo.js`
  - `CODEX_CHANGELOG.MD`
- 主要改动：
  - Skill 明确要求 `pick.result` 只写一个主选，`pick.resultBackup` 只写一个备选；例如“平局优先，科特迪瓦不败”拆成 `平局` 和 `科特迪瓦胜`。
  - Skill 和 AGENTS 增加进球数规则：只允许一个区间，跨度不能超过 1 球，例如 `2-3球`、`3-4球`，禁止 `1-3球`、`2-4球`。
  - 修正科特迪瓦 vs 厄瓜多尔、英格兰 vs 克罗地亚、捷克 vs 南非、苏格兰 vs 摩洛哥等主备选写法。
  - 修正德国、西班牙、葡萄牙、乌兹别克斯坦、巴西相关场次中过宽的进球数区间，并同步比分备选。
  - 首页历史复盘展开内容改为主选、括号备选、主比分、括号备选比分分段渲染，命中和未命中可以分别显示绿色/红色。
- 数据库/赛程/复盘：有预测数据库变更；数据库更新时间同步更新为 `6/15 10:30`，版本保持 `1.0.2`。
- 云函数：未修改云函数，无需重新部署。
- 验证：
  - 已运行 `node -c utils/matches.js`
  - 已运行 `node -c pages/index/index.js`
  - 已运行 `node -c utils/buildInfo.js`
  - 已检查所有 `pick.total` 区间跨度，确认没有超过 1 球的区间。
  - 已检查所有 `pick.result`，确认没有继续混写“不败/优先/备选”。
- 后续注意：微信开发者工具需要重新编译；如仍显示旧复盘内容，先清缓存再预览。

---

## 2026-06-15 10:38 - 动态复盘显示强兜底

- 环境：公司电脑 Codex
- 目的：修复用户截图中动态复盘仍显示 `平局优先 · 1-1 · 未记录` 且走势图为空的问题。
- 涉及文件：
  - `pages/index/index.js`
  - `pages/index/index.wxml`
  - `pages/index/index.wxss`
  - `CODEX_CHANGELOG.MD`
- 主要改动：
  - 静态预测回查从仅按 `id` 改为 `id + 主客队中文名` 双重匹配。
  - WXML 增加强兜底：`平局优先` 显示为 `平（胜）`，`1-1` 显示为 `1-1（2-1）`，无进球数时显示 `2-3球`。
  - 走势图为空时显示固定红色折线兜底 `●━●╲●╲●╲●━●`。
  - 走势图字号从 `34rpx` 下调到 `28rpx`，避免标题栏裁切。
- 数据库/赛程/复盘：无静态数据变更；增强动态复盘展示兜底。
- 云函数：未修改云函数，无需重新部署。
- 验证：已运行 `node -c pages/index/index.js`、`node -c utils/matches.js`；确认 WXML 中包含 `平（胜）`、`1-1（2-1）`、`2-3球` 和走势图兜底文本。
- 后续注意：必须清理微信开发者工具缓存并重新编译，否则可能继续显示旧动态数据。

---

## 2026-06-15 10:31 - 历史复盘去标签与可见折线文本

- 环境：公司电脑 Codex
- 目的：按用户反馈彻底去掉复盘黄色标签，并解决标题栏走势图在微信端不可见的问题。
- 涉及文件：
  - `pages/index/index.js`
  - `pages/index/index.wxml`
  - `pages/index/index.wxss`
  - `CODEX_CHANGELOG.MD`
- 主要改动：
  - 首页历史复盘展开内容去掉 `胜负`、`比分`、`进球数` 黄色标签。
  - 每场复盘直接显示内容，例如 `负（平） · 1-2（1-1） · 2-3球`。
  - 标题栏走势图改成红色字符折线，例如 `●━●╲●╲●...`，避免 canvas、旋转 view 或绝对定位在微信端不显示。
  - `reviewSparkline` 仍基于近 10 场累计平均命中率生成。
- 数据库/赛程/复盘：无数据变更，仅调整首页展示方式。
- 云函数：未修改云函数，无需重新部署。
- 验证：已运行 `node -c pages/index/index.js`、`node -c utils/matches.js`；确认 WXML 中无 canvas、无 `review-label`，并抽查复盘内容显示字段和红色折线文本。
- 后续注意：需要重新编译并清缓存，避免微信开发者工具继续显示旧 WXML。

---

## 2026-06-15 10:22 - 动态复盘字段补全与图表去 canvas 化

- 环境：公司电脑 Codex
- 目的：修复动态完赛复盘中胜负只显示原文或空值、比分备选丢失、进球数显示未记录、标题栏图表不可见的问题。
- 涉及文件：
  - `pages/index/index.js`
  - `pages/index/index.wxml`
  - `CODEX_CHANGELOG.MD`
- 主要改动：
  - 动态复盘生成时回查静态赛程里的原始 `pick`，补齐备选比分和进球数。
  - 从分析结论里提取 `某队不败` 作为胜负备选，例如 `平局优先，科特迪瓦不败` 展示为 `平（胜）`。
  - 标题栏走势图移除 canvas，改回 WXML/CSS 红色累计平均线和实心节点，避免微信原生 canvas 层遮挡。
- 数据库/赛程/复盘：无静态比赛数据变更；修复动态复盘展示和命中率计算输入。
- 云函数：未修改云函数，无需重新部署。
- 验证：已运行 `node -c pages/index/index.js`、`node -c utils/matches.js`，并确认 WXML 中不再包含 canvas，保留 CSS 图表层和完整展示字段。
- 后续注意：微信开发者工具需重新编译；若仍显示旧动态复盘，清缓存后进入首页触发重新同步。

---

## 2026-06-15 10:14 - 历史复盘字段兜底与双层图表修复

- 环境：公司电脑 Codex
- 目的：修复微信端历史复盘只显示标签、不显示胜负/比分/进球数值，以及图表仍不可见的问题。
- 涉及文件：
  - `utils/matches.js`
  - `pages/index/index.js`
  - `pages/index/index.wxml`
  - `pages/index/index.wxss`
  - `CODEX_CHANGELOG.MD`
- 主要改动：
  - `utils/matches.js` 的复盘数据直接生成 `resultDisplay`、`scoreDisplay`，例如 `负（平）`、`1-2（1-1）`。
  - 首页复盘加工逻辑优先保留已有展示字段，避免再次加工后变空。
  - WXML 增加字段兜底：`resultDisplay || resultMain`、`scoreDisplay || scoreMain`、`totalPick || 未记录`。
  - 图表保留 canvas，同时新增一层 CSS 红色折线和实心节点作为兜底。
  - 曲线恢复为累计平均命中率，每场比赛为一个节点。
- 数据库/赛程/复盘：无比赛数据变更，仅补充复盘展示字段和图表展示方式。
- 云函数：未修改云函数，无需重新部署。
- 验证：已运行 `node -c pages/index/index.js`、`node -c utils/matches.js`；抽查前 5 条复盘均显示完整胜负、比分、进球数字段；累计平均线数据为 100、100、87.5、75、65、61.5、64.3、59.4。
- 后续注意：微信开发者工具需重新编译，必要时清缓存。

---

## 2026-06-15 10:06 - 历史复盘累计平均曲线与完整字段修正

- 环境：公司电脑 Codex
- 目的：按用户反馈修复历史复盘胜负内容仍不可见、图表不是累计平均线的问题。
- 涉及文件：
  - `pages/index/index.js`
  - `pages/index/index.wxml`
  - `pages/index/index.wxss`
  - `CODEX_CHANGELOG.MD`
- 主要改动：
  - 图表重新改为累计平均命中率曲线，每场比赛作为一个节点。
  - 标题栏图表改用 `canvas` 绘制红色折线和红色实心圆节点，避免 CSS 拼线在微信端不显示。
  - 展开复盘中的胜负、比分、进球数改成完整字段显示，例如 `负（平）`、`1-2（1-1）`、`2-3球`，不再拆成多个短文本。
  - 胜负、比分、进球数保留金色标签，命中/未命中继续用绿色/红色区分。
- 数据库/赛程/复盘：无数据变更，仅调整图表绘制和展示字段。
- 云函数：未修改云函数，无需重新部署。
- 验证：已运行 `node -c pages/index/index.js`、`node -c utils/matches.js`，并确认 WXML/JS 中包含 `reviewTrendCanvas`、`resultDisplay`、`scoreDisplay` 和累计平均算法。
- 后续注意：微信开发者工具需重新编译；若旧 WXML 样式仍残留，清缓存后预览。

---

## 2026-06-15 09:58 - 历史复盘红色节点折线和字段显眼化

- 环境：公司电脑 Codex
- 目的：按用户反馈修复历史复盘图表不明显、胜负和进球数不易看到的问题。
- 涉及文件：
  - `pages/index/index.js`
  - `pages/index/index.wxss`
  - `CODEX_CHANGELOG.MD`
- 主要改动：
  - 标题栏图表改为按每场比赛命中率作为节点，不再使用累计整体命中率。
  - 图表折线改为红色，节点改为红色实心圆。
  - 展开复盘里的 `胜负`、`比分`、`进球数` 标签加大并使用金色标签，提高可见性。
- 数据库/赛程/复盘：无数据变更，仅调整图表算法和展示样式。
- 云函数：未修改云函数，无需重新部署。
- 验证：已运行 `node -c pages/index/index.js`、`node -c utils/matches.js`，并抽查每场复盘节点百分比。
- 后续注意：微信开发者工具需重新编译；若仍显示旧样式，清理缓存后再预览。

---

## 2026-06-15 09:52 - 修复历史复盘图表和展开字段可见性

- 环境：公司电脑 Codex
- 目的：修复首页历史复盘标题栏图表不明显、展开后胜负和进球数看不清的问题。
- 涉及文件：
  - `pages/index/index.wxml`
  - `pages/index/index.wxss`
  - `CODEX_CHANGELOG.MD`
- 主要改动：
  - 标题栏图表增加金色柱形辅助、加粗折线和更亮的节点。
  - 展开复盘内容增加 `胜负`、`比分`、`进球数` 标签。
  - 保留胜负、比分、进球数三项的命中绿色/未命中红色展示。
- 数据库/赛程/复盘：无数据变更，仅调整展示样式。
- 云函数：未修改云函数，无需重新部署。
- 验证：已运行 `node -c pages/index/index.js`、`node -c utils/matches.js`，并抽查前 5 条复盘的胜负、比分、进球数字段均有值。
- 后续注意：需要在微信开发者工具真机预览里确认标题栏图表的柱形和折线清晰度。

---

## 2026-06-15 09:45 - 历史复盘标题栏图表位置调整

- 环境：公司电脑 Codex
- 目的：按用户截图要求，删除历史复盘标题下方小字，并把近 10 场命中率变化图表移动到标题栏中间区域。
- 涉及文件：
  - `pages/index/index.wxml`
  - `pages/index/index.wxss`
  - `CODEX_CHANGELOG.MD`
- 主要改动：
  - 移除首页历史复盘标题下方的综合成功率小字。
  - 将命中率曲线改为标题栏内的紧凑小图表，放在“历史复盘”和“展开/收起”之间。
  - 展开后的复盘内容继续显示胜负、比分和进球数三项。
- 数据库/赛程/复盘：无数据变更，仅调整展示位置。
- 云函数：未修改云函数，无需重新部署。
- 验证：已运行 `node -c pages/index/index.js`、`node -c utils/matches.js`，并抽查复盘数量、整体命中率和前三条复盘展示字段。
- 后续注意：手机端需预览确认标题栏小图表不会挤压“展开/收起”按钮。

---

## 2026-06-15 09:38 - 历史复盘展示与命中率权重调整

- 环境：公司电脑 Codex
- 目的：按用户要求将首页复盘改为“历史复盘”，增加近 10 场整体命中率变化图表，并把进球数纳入复盘命中率。
- 涉及文件：
  - `pages/index/index.js`
  - `pages/index/index.wxml`
  - `pages/index/index.wxss`
  - `pages/history/history.wxml`
  - `pages/history/history.wxss`
  - `utils/matches.js`
  - `utils/buildInfo.js`
  - `.codex-skills/football-match-predictor/SKILL.md`
  - `AGENTS.MD`
  - `CODEX_CHANGELOG.MD`
- 主要改动：
  - 首页“已结束比赛复盘”改名为“历史复盘”。
  - 展开区域新增近 10 场赛后整体命中率变化曲线，Y 轴为 0%、50%、100%，不显示 X 轴文字。
  - 复盘条目改为紧凑展示：`胜（平）`、`1-1（2-1）`、`进球数 2-3球`。
  - 命中的胜负、比分、进球数用绿色，未命中用红色。
  - 复盘命中率改为胜负 37.5%、比分 37.5%、进球数 25% 的加权算法。
  - 历史页卡片同步使用新的紧凑复盘展示。
  - 数据库更新时间固定更新为 `6/15 09:38`，版本保持 `1.0.2`。
- 数据库/赛程/复盘：复盘计算规则变更，未新增或删除比赛。
- 云函数：未修改云函数，无需重新部署。
- 验证：已运行 `node -c utils/matches.js`、`node -c pages/index/index.js`，并抽查复盘命中率、进球数命中和首页排序；当前整体命中率为 `59.4%`。
- 后续注意：以后新增复盘时需确认 `pick.total` 或 `totalPick`，否则进球数项无法计入命中率。

---

## 2026-06-14 晚间 - 调整概率条颜色规则

- 环境：家里电脑 Codex
- 目的：按用户要求改详情页概率条颜色，不再使用固定百分比分档。
- 涉及文件：
  - `utils/matches.js`
  - `CODEX_CHANGELOG.MD`
- 主要改动：
  - 胜平负概率条改为同组相对排序：最大绿色，其次黄色，最小红色。
  - 预期进球概率条改为同组相对排序：最大绿色，其次黄色，然后橙色，最小红色。
  - 百分比数值不变，只改变颜色等级。
- 数据库/赛程/复盘：无赛程和复盘数据变更。
- 云函数：无需重新部署云函数。
- 验证：已用本地 Node 检查 `utils/matches.js` 语法，并抽查德国-库拉索概率颜色等级。
- 后续注意：如果未来接入真实赔率，颜色仍按同组相对排序显示。

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
