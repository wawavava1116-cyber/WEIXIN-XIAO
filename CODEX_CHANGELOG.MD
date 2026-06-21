# Codex 项目变更日志

## 2026-06-21 14:35 - 用预测 Skill 归档 6 月 21 日完赛并补充滚动赛程
- 环境：公司电脑 Codex + football-match-predictor Skill + Betfair API + 公开赛果核对。
- 目的：按北京时间 2026-06-21 的最新赛果归档完赛，重算后续未赛预测，并把服务器 Betfair 目标扩展到新增滚动窗口比赛。
- 涉及文件：`utils/matches.js`、`utils/buildInfo.js`、`pages/schedule/schedule.js`、`server/config/targets.json`、`CODEX_CHANGELOG.MD`。
- 主要改动：新增荷兰 5-1 瑞典、德国 2-1 科特迪瓦、厄瓜多尔 0-0 库拉索、突尼斯 0-4 日本四场复盘；补充 6 月 27 日 G/H 组末轮四场赛程和预测；按最新 Betfair 同步结果补充 6 月 22 日、6 月 23 日、6 月 24 日和 6 月 27 日部分比赛盘口摘要；未赛列表导出时按 `sortTime` 排序，避免预测页或云端快照出现源数据顺序错位；赛程淘汰赛树新增 E1 德国。
- 数据库/赛程/复盘：`finishedReviewSource` 新增 4 场完赛复盘，滚动窗口未赛数量为 28 场、复盘数量为 36 场；数据库更新时间更新为 `2026-06-21 14:25`；首页仅保留突尼斯 vs 日本作为完赛 1 小时内展示。
- 云函数/服务器：未修改云函数；修改了 `server/config/targets.json`，轻量云服务器需要拉取代码并重启服务后，Betfair 定时同步才会包含新增目标。
- 验证：已运行 `node -c utils/matches.js`、`node -c pages/schedule/schedule.js`、`node -c utils/buildInfo.js`、服务器 `npm.cmd run check`、Betfair `npm.cmd run sync`、数据库快照生成检查和 `git diff --check`。
- 后续注意事项：`server/data/` 中 Betfair 运行缓存不会提交到 Git；云端同步后需确认 `/api/database/latest` 返回的首场未赛为西班牙 vs 沙特阿拉伯，复盘首场为突尼斯 vs 日本。

## 2026-06-21 14:18 - 预测详情展示必发五分钟实时变化分析
- 环境：公司电脑 Codex + 用户要求详情页展示必发成交量和赔率变动
- 目的：把详情页原“必发成交量影响”升级为“必发成交量实时分析（5分钟）”，直接展示服务器每 5 分钟记录的成交量变化、胜平负赔率变化和对打出预期/进球预期的修正。
- 涉及文件：`pages/detail/detail.js`、`pages/detail/detail.wxml`、`pages/detail/detail.wxss`、`utils/remoteBetfairMarkets.js`、`CODEX_CHANGELOG.MD`
- 主要改动：新增前端读取 `/api/betfair/history?matchIds=...&limit=2` 的工具方法；详情页加载比赛后和每 5 分钟自动刷新必发历史；页面会找出成交变化最大的一项，按 `100K（50%）` 格式展示并附成交方向箭头；胜/平/负赔率按 `1.5/3.5/4.5` 结构展示，每个赔率后带涨跌/横杠标识；当成交量上涨且赔率上涨时提示降低该方向打出预期和进球数量预期，成交上涨且赔率下跌时提示提高预期。
- 数据库/赛程/复盘：未修改比赛、预测、复盘结果或数据库快照，只新增详情页对服务器必发历史数据的读取和展示。
- 云函数/服务器：本次未再修改 `server/`；该功能依赖上一条新增的 `/api/betfair/history` 和 `apiProxy` 白名单，服务器需要已同步重启，`apiProxy` 如未部署需重新上传部署。
- 验证：已运行 `node -c pages/detail/detail.js`、`node -c utils/remoteBetfairMarkets.js`、`node -c cloudfunctions/apiProxy/index.js`、`npm.cmd run check` 和 `git diff --check`。
- 后续注意事项：服务器至少记录到两条 5 分钟样本后，详情页才会显示明确的上涨/下跌预期修正；没有可对比记录时只用黄色横杠表示暂无变化判断。

## 2026-06-21 14:20 - 服务器记录必发盘口五分钟变化历史
- 环境：公司电脑 Codex + 用户希望记录当日比赛必发成交和赔率变化
- 目的：让轻量云服务器在自动同步 Betfair 时，不只覆盖最新盘口，还能保留北京时间当日比赛的成交额、胜平负赔率、概率和变化方向历史，方便后续判断“成交额上涨但赔率变高”的反向信号。
- 涉及文件：`server/src/store.js`、`server/src/syncOnce.js`、`server/src/index.js`、`server/.env.example`、`server/README.md`、`cloudfunctions/apiProxy/index.js`、`CODEX_CHANGELOG.MD`
- 主要改动：新增 `server/data/betfair-market-history.json` 运行时历史文件；`syncBetfairMarkets()` 每次同步后会把北京时间当日且已匹配到 `marketId` 的盘口追加样本，记录总成交额、runner 最新成交价、可买/可卖、归一化概率，并计算相对上一条的成交额变化、赔率上/下/平、概率变化；新增 `GET /api/betfair/history` 支持按日期、比赛 ID 和条数读取历史曲线；云函数 `apiProxy` 白名单加入该读取接口。
- 数据库/赛程/复盘：未修改比赛、预测、复盘或小程序数据库快照内容；新增的必发历史只写入服务器运行时 `server/data/`，不会提交到 Git。
- 云函数/服务器：修改了 `server/`，需要同步轻量云服务器并重启服务；修改了 `cloudfunctions/apiProxy` 白名单，如小程序端需要读取该历史接口，需要重新上传部署 `apiProxy` 云函数。
- 验证：已运行 `npm.cmd run check`、`node -c cloudfunctions/apiProxy/index.js` 和 `git diff --check`。
- 后续注意事项：服务器需保持 `BETFAIR_SYNC_ENABLED=1` 且 `BETFAIR_SYNC_INTERVAL_MS=300000` 或同等配置，才能按 5 分钟间隔持续记录；`BETFAIR_HISTORY_RETENTION_DAYS` 默认保留 14 天。

## 2026-06-21 14:02 - 历史复盘刷新强制保持云端数据
- 环境：公司电脑 Codex + 用户历史复盘刷新反馈
- 目的：修正历史复盘页几秒一次刷新时短暂显示本地旧缓存的问题，让历史复盘和首页一样只展示云端归档后的数据。
- 涉及文件：`pages/history/history.js`、`CODEX_CHANGELOG.MD`
- 主要改动：历史复盘页移除 `reviewCache` 本地动态复盘合并逻辑，构建列表时只读取远程数据库快照里的 `finishedMatches`；刷新接口返回新云端数据后再覆盖页面，刷新失败或暂时无云端数据时继续保留上一份已显示的云端历史列表，不再回退到本地旧底稿。
- 数据库/赛程/复盘：未修改比赛、预测、复盘结果或云端数据库内容，只调整前端历史页的数据来源和刷新策略。
- 云函数/服务器：未修改云函数或 `server/`，不需要重新部署云函数或轻量云服务器服务。
- 验证：已运行 `node -c pages/history/history.js`，并确认历史页不再引用 `getDynamicReviews`、`mergeReviewLists` 或 `reviewCache`。
- 后续注意事项：该改动属于小程序前端代码，体验版/正式版仍需通过微信开发者工具上传后才会进入对应版本。

## 2026-06-20 16:05 - 删除首页微信一键登录入口
- 环境：公司电脑 Codex + 用户首页体验反馈
- 目的：移除首页进入时的一键微信登录/游客选择弹窗，避免首页被登录流程打断。
- 涉及文件：`pages/index/index.js`、`pages/index/index.wxml`、`pages/index/index.wxss`、`CODEX_CHANGELOG.MD`
- 主要改动：首页启动完成后只按原规则展示公告，不再判断或弹出微信登录提示；删除首页登录、游客进入、昵称保存相关状态/方法和对应弹窗样式。个人信息页的登录和资料修改能力保留。
- 数据库/赛程/复盘：未修改比赛、预测、复盘或远程数据库内容。
- 云函数/服务器：未修改云函数或 `server/`，不需要重新部署。
- 验证：已运行 `node -c pages/index/index.js` 和 `git diff --check`。

## 2026-06-20 15:52 - 增加主页面左右滑切换和二级页右滑返回
- 环境：公司电脑 Codex + 用户导航体验需求
- 目的：让首页、赛程页、我的预测页、个人信息页支持左右滑动切换；从这些页面进入的下层页面支持向右滑动返回上一层。
- 涉及文件：`utils/swipeNavigation.js`、`pages/index/*`、`pages/schedule/*`、`pages/prediction/*`、`pages/profile/*`、`pages/detail/*`、`pages/history/*`、`pages/favorites/*`、`pages/predictionForm/*`、`pages/predictionResult/*`、`pages/predictionGroup/*`、`CODEX_CHANGELOG.MD`
- 主要改动：新增统一手势导航工具，主 tab 页按 首页 -> 赛程 -> 我的预测 -> 信息 的顺序左右滑切换；二级页检测明确右滑后优先 `navigateBack`，无页面栈时回首页；手势阈值限制横向位移和纵向位移，减少上下滚动误触。
- 数据库/赛程/复盘：未修改比赛、预测、复盘或远程数据库内容。
- 云函数/服务器：未修改云函数或 `server/`，不需要重新部署。
- 验证：已运行相关页面 JS 语法检查和 `git diff --check`。

## 2026-06-20 15:36 - 修正个人信息头像形状和昵称自动聚焦
- 环境：公司电脑 Codex + 用户手机端截图反馈
- 目的：修正个人信息页默认头像仍被微信原生按钮撑成椭圆的问题，并让点击“修改昵称”后直接进入昵称输入状态。
- 涉及文件：`pages/profile/profile.wxml`、`pages/profile/profile.wxss`、`pages/profile/profile.js`、`CODEX_CHANGELOG.MD`
- 主要改动：头像选择按钮强制固定 86rpx 圆形宽高、去除原生按钮行高/字号影响；昵称输入框绑定 `focus` 状态，打开资料表单后自动聚焦，减少再次点击输入框的步骤。
- 数据库/赛程/复盘：未修改比赛、预测、复盘或远程数据库内容。
- 云函数/服务器：未修改云函数或 `server/`，不需要重新部署。
- 验证：已运行 `node -c pages/profile/profile.js` 和 `git diff --check`。

## 2026-06-20 15:24 - 淘汰赛树改为阶段中点对齐
- 环境：公司电脑 Codex + 用户对淘汰赛树层级间距反馈
- 目的：让赛程页淘汰赛树更接近真实对阵图，第一阶段不同对阵之间留明显距离，后续阶段节点落在上一阶段两场/两组的中间。
- 涉及文件：`pages/schedule/schedule.wxss`、`CODEX_CHANGELOG.MD`
- 主要改动：左右淘汰树轮次列改为固定高度百分比定位；32 强阶段 8 个节点按 6.25% 间隔排布，16 强/8 强/4 强节点分别居中到上一阶段两组中点；同步增加树高，保持放大后的国旗和三字母缩写不挤压。
- 数据库/赛程/复盘：未修改赛程、预测、复盘或淘汰赛种子数据。
- 云函数/服务器：未修改云函数或 `server/`，不需要重新部署。
- 验证：已运行 `node -c pages/schedule/schedule.js` 和 `git diff --check`。

## 2026-06-20 15:10 - 淘汰赛树队伍标识再放大
- 环境：公司电脑 Codex + 用户视觉反馈
- 目的：在上一版基础上继续放大赛程页淘汰赛树的国旗和三字母缩写，提高手机端可读性。
- 涉及文件：`pages/schedule/schedule.wxss`、`CODEX_CHANGELOG.MD`
- 主要改动：国旗从 27rpx x 19rpx 放大到 41rpx x 29rpx，三字母缩写从 15rpx 放大到 21rpx；修正放大后文字被切断和左右方向不一致的问题；同步缩小中心列、增加树高和行高，尽量保持 32 强到决赛完整结构不横向溢出。
- 数据库/赛程/复盘：未修改赛程、预测、复盘或淘汰赛种子数据。
- 云函数/服务器：未修改云函数或 `server/`，不需要重新部署。
- 验证：已运行 `node -c pages/schedule/schedule.js` 和 `git diff --check`。

## 2026-06-20 15:02 - 放大赛程页淘汰赛树队伍标识
- 环境：公司电脑 Codex + 用户对赛程页淘汰赛树可读性反馈
- 目的：修正淘汰赛树中国旗和三字母缩写过小、白色队伍框视觉干扰的问题，让已确定队伍更容易识别。
- 涉及文件：`pages/schedule/schedule.wxss`、`CODEX_CHANGELOG.MD`
- 主要改动：在样式末尾增加最终覆盖规则，去掉队伍行白色底框，已确定队伍改为透明行；国旗由 15rpx x 10rpx 放大到 27rpx x 19rpx，三字母缩写由 9rpx 放大到 15rpx；未确定席位保留小空框；中心区域和连线同步压缩，保持整棵树手机端可整体显示。
- 数据库/赛程/复盘：未修改赛程、预测、复盘或淘汰赛种子数据。
- 云函数：未修改云函数，不需要重新部署云函数。
- 服务器：未修改 `server/`，不需要重新部署轻量云服务器。
- 验证：已运行 `node -c pages/schedule/schedule.js` 和 `git diff --check`。

## 2026-06-20 14:45 - 淘汰赛树支持提前锁定小组名次
- 环境：公司电脑 Codex + 赛程页淘汰赛树逻辑检查
- 目的：把已经提前确定的小组名次写入赛程页淘汰赛树，不再等整个小组 3 轮全部踢完才填入。
- 涉及文件：`pages/schedule/schedule.js`、`CODEX_CHANGELOG.MD`
- 主要改动：新增 `CONFIRMED_GROUP_PLACEMENTS` 已锁定名次表，当前写入 A1 墨西哥、D1 美国；淘汰赛树构建时会优先把这些已确定席位补进对应种子位，后续每确认一个小组名次只需继续在该表新增一条。
- 数据库/赛程/复盘：未修改赛果、预测或复盘；赛程页淘汰赛树现在会把 `1A` 显示为 MEX、`1D` 显示为 USA。
- 云函数：未修改云函数，不需要重新部署云函数。
- 服务器：未修改 `server/`，不需要重新部署轻量云服务器。
- 验证：已运行 `node -c pages/schedule/schedule.js`，并用服务器数据库快照抽查淘汰赛树输出，确认 `1A MEX`、`1D USA` 已填入。

## 2026-06-20 14:28 - 修正 D 组美国锁定小组第一说明
- 环境：公司电脑 Codex + football-match-predictor Skill + FIFA/媒体规则核对
- 目的：按本届同分先看相互战绩的规则，确认美国两胜后已锁定 D 组第一，并同步修正末轮美国 vs 土耳其预测说明。
- 涉及文件：`utils/matches.js`、`CODEX_CHANGELOG.MD`
- 主要改动：把美国末轮说明从“已经出线”改为“已凭相互战绩锁定 D 组第一”；补充美国分别击败巴拉圭和澳大利亚，因此澳大利亚或巴拉圭即使末轮追到 6 分也无法超过美国。
- 数据库/赛程/复盘：未修改赛程、比分、复盘结果或结构化主选；只修正 D 组形势说明文本。
- 云函数：未修改云函数，不需要重新部署云函数。
- 服务器：需要重新生成服务器数据库快照，才能让线上详情页立即显示新说明。
- 验证：已运行 `node -c utils/matches.js` 并抽查 `turkey-usa-20260625` 的市场说明和风险说明。

## 2026-06-20 14:05 - 禁用域名直连兜底并强制走云函数代理
- 环境：公司电脑 Codex + 线上域名/服务器连通性检查
- 目的：处理当前正式版/体验版读取云端数据时 `www.ag-shield.com` HTTPS 域名超时导致本地托底数据停留时间过长的问题；新版本改为不再尝试该域名直连，避免被域名链路拖慢。
- 涉及文件：`utils/serverConfig.js`、`utils/remoteApi.js`、`CODEX_CHANGELOG.MD`
- 主要改动：`apiBaseUrl` 改为空并新增 `apiDomainFallbackEnabled: false`；`requestServerApi` 只有在显式开启域名兜底且存在可用域名时才会回退到 `wx.request`，默认强制通过 `apiProxy` 云函数访问服务器 IP。
- 数据库/赛程/复盘：未修改比赛、预测、复盘或服务器数据库内容；只调整小程序端访问云端数据库/用户预测接口的通道选择。
- 云函数：本次未修改云函数代码，但新版本依赖 `apiProxy` 已部署且可用；如果云函数未部署，页面会提示云端代理不可用而不是等待域名超时。
- 服务器：未修改 `server/`，不需要重新部署轻量云服务器；但 `www.ag-shield.com` 域名本身仍需备案/解封后才能作为直连备用通道。
- 验证：已运行 `node -c utils/remoteApi.js`、`node -c utils/serverConfig.js` 和 `git diff --check`；外部检查确认服务器 IP HTTPS 正常，`www.ag-shield.com` 域名 HTTPS 仍超时。
- 后续注意：已经上线的旧正式版包内代码无法被云端直接改写，本次改动需要随体验版审核通过后才会彻底生效；旧正式版若仍直连域名，只能通过恢复域名访问速度来改善。

## 2026-06-20 12:20 - 用预测 Skill 更新完赛归档和第二三轮小组形势
- 环境：公司电脑 Codex + football-match-predictor Skill + Betfair API + 公开赛果核对
- 目的：按用户要求归档 6 月 20 日已结束比赛，并根据第一、第二轮结果重新校准后续小组赛出线关系、保平/必须赢球等预测权重。
- 涉及文件：`utils/matches.js`、`server/config/targets.json`、`server/src/liveScoresClient.js`、`cloudfunctions/liveScores/index.js`、`CODEX_CHANGELOG.MD`
- 主要改动：新增并归档 美国 2-0 澳大利亚、苏格兰 0-1 摩洛哥、巴西 3-0 海地、土耳其 0-1 巴拉圭；新增荷兰 vs 瑞典、厄瓜多尔 vs 库拉索、突尼斯 vs 日本的 Betfair 成交快照；补充 6 月 21 日至 6 月 25 日实时比分识别名单；把 C 组、D 组、E/F 组关键第二/第三轮预测加入小组形势说明，重点处理“美国已出线可轮换”“巴拉圭/澳大利亚直接卡位”“巴西/摩洛哥保平主动”“厄瓜多尔必须赢”等因素。
- 数据库/赛程/复盘：完赛归档后首页 `upcomingMatches` 从 荷兰 vs 瑞典 开始；新增复盘命中率为 土耳其 0%、巴西 85%、摩洛哥 100%、美国 85%；复盘继续使用胜平负 50%、比分 30%、进球数 20% 加权规则。
- 云函数：修改 `cloudfunctions/liveScores` 的比赛识别名单，微信开发者工具需要重新上传并部署该云函数。
- 服务器：修改 `server/` Betfair 目标和实时比分识别逻辑，需要同步轻量云服务器并重启服务，同时重新生成 `/api/database/latest` 数据库快照。
- 验证：已运行 `node -c utils/matches.js`、`node -c server/src/liveScoresClient.js`、`node -c cloudfunctions/liveScores/index.js`、首页导出顺序检查、完赛从首页移除检查、`git diff --check`。
- 后续注意：德国 vs 科特迪瓦、西班牙 vs 沙特、比利时 vs 伊朗、乌拉圭 vs 佛得角、新西兰 vs 埃及本次 Betfair 市场暂未匹配到，后续同步时继续观察市场是否开放。

## 2026-06-20 11:58 - 前端剔除过期开赛缓存比赛
- 环境：公司电脑 Codex + 用户端截图反馈
- 目的：修正用户端每隔一段时间又短暂显示 03:00、06:00 已完成比赛的问题。
- 涉及文件：`utils/remoteMatchDatabase.js`、`pages/index/index.js`、`CODEX_CHANGELOG.MD`
- 主要改动：远程数据库从缓存读取和写入时统一做展示清洗；`upcomingMatches` 中已经超过开赛时间 3 小时但仍没有实时比分、仍不是进行中或完赛状态的比赛不再展示；`recentFinishedHomeMatches` 继续按完赛后 1 小时窗口展示；首页 10 秒刷新请求失败时，也会用上一份云端缓存重新计算一次页面，避免旧卡片继续停留。
- 数据库/赛程/复盘：未修改比赛预测、复盘或云端数据库内容；只修正前端对旧云缓存/脏快照的展示过滤。
- 云函数：未修改云函数，不需要重新部署云函数。
- 服务器：未修改 `server/`，不需要重新部署轻量云服务器服务。
- 验证：后续运行 `node -c utils/remoteMatchDatabase.js`、相关页面 JS 检查、缓存清洗模拟和 `git diff --check`。
- 后续注意：如果服务器接口长时间超时，前端会继续使用上一份云端缓存，但会自动剔除明显过期的未开赛卡片，避免旧 VS 场次闪回。

## 2026-06-20 11:28 - 云端刷新空挡保留上一份云数据
- 环境：公司电脑 Codex + 开发者工具预览反馈
- 目的：修正应用端每 10 秒拉取云端数据库时，刷新空挡里旧云缓存被 10 秒有效期判为失效，导致页面短暂没有云数据可用的问题。
- 涉及文件：`utils/remoteMatchDatabase.js`、`CODEX_CHANGELOG.MD`
- 主要改动：取消远程数据库展示缓存的 10 秒过期失效判断；10 秒频率只用于主动请求云端更新，页面展示始终继续使用上一份成功读取的云端数据库，直到新云数据返回并覆盖缓存。
- 数据库/赛程/复盘：未修改比赛、预测、复盘或远程数据库内容；只调整前端云端缓存读取策略。
- 云函数：未修改云函数，不需要重新部署云函数。
- 服务器：未修改 `server/`，不需要重新部署轻量云服务器服务。
- 验证：已运行 `node -c utils/remoteMatchDatabase.js`、相关页面 JS 检查、前端本地赛程引用检查和 `git diff --check`。
- 后续注意：首次进入小程序仍必须等云端请求成功后才关闭启动加载页；本改动只影响后续刷新空挡，不会恢复本地静态赛程兜底。

## 2026-06-20 11:18 - 修正云端完赛首页保留时间不断续命
- 环境：公司电脑 Codex + 云服务器实时数据库检查
- 目的：修正云端每 10 秒刷新比分时把 `scoreUpdatedAt` 当作完赛检测时间，导致 3 点和 6 点已完赛比赛在首页近期完赛区不断被续命的问题。
- 涉及文件：`server/src/buildDatabaseSnapshot.js`、`CODEX_CHANGELOG.MD`
- 主要改动：完赛比赛的 `finishDetectedAt` 不再使用本次比分刷新 `updatedAt`；当实时数据未提供真实终场时间时，统一按 `sortTime + 2 小时` 估算终场时间，再执行首页完赛保留 1 小时规则。
- 数据库/赛程/复盘：不修改预测内容；会影响云端快照中的 `recentFinishedHomeMatches` 过滤，3 点、6 点等超过保留窗口的完赛比赛会从首页列表移出，仍保留在复盘/历史数据中。
- 云函数：未修改云函数代码，不需要重新部署云函数。
- 服务器：修改 `server/`，需要同步并重启轻量云服务器服务。
- 验证：已运行服务端语法检查和 `npm run check`；后续同步服务器后验证 `/api/database/latest` 的 `recentFinishedHomeMatches`。
- 后续注意：如果未来实时比分源提供真实完赛时间，可优先使用真实终场时间替代当前 `sortTime + 2 小时` 估算。

## 2026-06-20 11:08 - 前端展示数据改为强依赖云端数据库
- 环境：公司电脑 Codex + 用户数据同步策略要求
- 目的：删除小程序前端页面对本地静态赛程/复盘数据的展示兜底，首页启动必须先读取云端数据库，数据加载完成后才显示首页；手机端云端数据刷新频率提高到 10 秒。
- 涉及文件：`utils/remoteMatchDatabase.js`、`utils/liveMatchScores.js`、`pages/index/index.js`、`pages/schedule/schedule.js`、`pages/history/history.js`、`pages/detail/detail.js`、`pages/prediction/prediction.js`、`pages/predictionForm/predictionForm.js`、`pages/favorites/favorites.js`、`CODEX_CHANGELOG.MD`
- 主要改动：远程数据库缓存有效期从 10 分钟压缩为 10 秒；远程数据库读取失败时不再触发完成回调或使用本地数据兜底；首页初始数据改为空，启动遮罩保持到云端数据库成功读取并完成首轮刷新后才关闭；首页 10 秒定时刷新改为先拉云端数据库再合并实时比分；赛程页定时刷新从 15 秒改为 10 秒并先读取云端；历史、详情、预测、填写预测和收藏页移除本地 `utils/matches` 展示兜底。
- 数据库/赛程/复盘：未修改比赛预测内容或复盘规则；前端读取策略改为只展示云服务器 `/api/database/latest` 返回的数据和运行时用户预测/动态复盘缓存。
- 云函数：未修改云函数代码，不需要重新部署云函数。
- 服务器：未修改 `server/`，不需要重新部署轻量云服务器服务；但手机端现在完全依赖服务器数据库接口，服务器不可用时首页会停留在加载状态并重试。
- 验证：已运行相关页面和工具 JS 语法检查、WXML 标签检查、页面 JSON 解析检查、前端本地赛程引用检查和 `git diff --check`。
- 后续注意：真机测试时必须确认云服务器 `/api/database/latest` 可稳定访问；如果服务器或 `apiProxy` 不通，首页不会再展示审核包内的旧赛程。

## 2026-06-20 10:52 - 我的预测可预测比赛固定展开
- 环境：公司电脑 Codex + 用户体验反馈
- 目的：把“我的预测”页面中的可预测比赛列表改为默认展开并固定显示，删除原来的“查看/收起可预测比赛”按钮。
- 涉及文件：`pages/prediction/prediction.js`、`pages/prediction/prediction.wxml`、`pages/prediction/prediction.wxss`、`CODEX_CHANGELOG.MD`
- 主要改动：移除 `showPredictionMatches` 状态和 `togglePredictionMatches` 方法；删除标题右侧的可预测比赛折叠按钮；可预测比赛列表不再使用条件渲染，进入页面即展示；清理无用的按钮样式。
- 数据库/赛程/复盘：未修改比赛、预测、复盘或远程数据库内容。
- 云函数：未修改云函数，不需要重新部署云函数。
- 服务器：未修改 `server/`，不需要重新部署轻量云服务器服务。
- 验证：后续运行 `node -c pages/prediction/prediction.js`、WXML 标签检查和 `git diff --check`。
- 后续注意：真机预览时确认“已预测内容”折叠按钮仍然只控制已提交记录，不影响可预测比赛列表。

## 2026-06-20 10:45 - 我的预测已提交内容改为折叠显示
- 环境：公司电脑 Codex + 手机端截图反馈
- 目的：按用户反馈把“我的预测”页面统计卡下方已经预测的单场/小组记录折叠起来，避免进入页面后红框区域直接铺满内容。
- 涉及文件：`pages/prediction/prediction.js`、`pages/prediction/prediction.wxml`、`pages/prediction/prediction.wxss`、`CODEX_CHANGELOG.MD`
- 主要改动：新增 `showSubmittedRecords` 和 `submittedRecordCount` 状态；统计卡下方增加“已预测内容”折叠条，显示记录数量；单场预测记录和小组预测记录默认收起，点击后展开，再次点击收起。
- 数据库/赛程/复盘：未修改比赛、预测、复盘或远程数据库内容。
- 云函数：未修改云函数，不需要重新部署云函数。
- 服务器：未修改 `server/`，不需要重新部署轻量云服务器服务。
- 验证：后续运行 `node -c pages/prediction/prediction.js`、WXML 标签检查和 `git diff --check`。
- 后续注意：真机预览时确认“可预测比赛”的展开按钮和“已预测内容”的展开按钮互不影响。

## 2026-06-20 10:36 - 个人信息页头像昵称行再次调整
- 环境：公司电脑 Codex + 手机端截图反馈
- 目的：修正个人信息页顶部头像被微信原生按钮样式撑成横向椭圆、昵称和“修改昵称”挤在同一行导致不易识别的问题。
- 涉及文件：`pages/profile/profile.wxml`、`pages/profile/profile.wxss`、`CODEX_CHANGELOG.MD`
- 主要改动：将“修改昵称”从昵称同一行移动到账号状态同一行；资料文字区改为占满剩余宽度；清理头像按钮的默认最小宽高和背景，让灰度头像保持圆形；昵称字号略微下调并保留整行省略空间。
- 数据库/赛程/复盘：未修改比赛、预测、复盘或远程数据库内容。
- 云函数：未修改云函数，不需要重新部署云函数。
- 服务器：未修改 `server/`，不需要重新部署轻量云服务器服务。
- 验证：已运行 `node -c pages/profile/profile.js`，后续继续做 WXML 标签检查和 `git diff --check`。
- 后续注意：真机预览时重点确认默认头像保持圆形、长昵称不会把“修改昵称”挤出屏幕。

## 2026-06-20 11:46 - 个人信息页头像和资料区压缩
- 环境：公司电脑 Codex + 手机端截图反馈
- 目的：把个人信息页默认头像从金色大圆“人”改成灰度原型小人，并缩小昵称、修改昵称入口和资料卡整体尺寸。
- 涉及文件：`pages/profile/profile.wxml`、`pages/profile/profile.wxss`、`CODEX_CHANGELOG.MD`
- 主要改动：默认头像占位改为灰色圆形小人图形；头像尺寸从 116rpx 缩到 86rpx；昵称字号下调并增加省略；“修改昵称”从账号状态卡里的大按钮移动到昵称右侧的小入口；资料卡、说明文字、奖牌格和登录/保存按钮整体缩小。
- 数据库/赛程/复盘：未修改比赛、预测、复盘或远程数据库内容。
- 云函数：未修改云函数，不需要重新部署云函数。
- 服务器：未修改 `server/`，不需要重新部署轻量云服务器服务。
- 验证：已运行 `node -c pages/profile/profile.js`、WXML 标签基础检查和 `git diff --check`。
- 后续注意：真机预览时确认长昵称旁边的“修改昵称”不会被挤出屏幕。

## 2026-06-20 11:34 - 我的预测折叠可预测场次并延后小组入档
- 环境：公司电脑 Codex + 手机端体验反馈
- 目的：让“我的预测”页面不再单独展示可预测场次，把入口折叠到“已经预测”标题区；提交预测按钮与进球数选项拉开距离；新发起的小组只有分享或提交后才进入“我的小组”列表。
- 涉及文件：`pages/prediction/prediction.js`、`pages/prediction/prediction.wxml`、`pages/prediction/prediction.wxss`、`pages/predictionForm/predictionForm.wxss`、`pages/predictionGroup/predictionGroup.js`、`server/src/index.js`、`server/src/predictionStore.js`、`utils/userPredictions.js`、`cloudfunctions/apiProxy/index.js`、`CODEX_CHANGELOG.MD`
- 主要改动：“今天和明天未开赛比赛”区块移入“已经预测”标题右侧的展开按钮；填写预测页提交按钮上边距增大；小组创建后默认作为未激活草稿，不进入 dashboard；提交小组预测或触发分享时把小组标记为 active；新增 `/api/prediction-groups/:id/share` 接口和云函数代理白名单。
- 数据库/赛程/复盘：未修改比赛、预测、复盘或远程数据库内容；小组数据新增 `active/sharedAt` 运行时字段，旧小组兼容显示。
- 云函数：修改 `cloudfunctions/apiProxy` 路由白名单，需要重新上传并部署 `apiProxy` 云函数。
- 服务器：修改 `server/` 小组预测接口，需要重新部署轻量云服务器服务。
- 验证：已运行相关 JS 语法检查、WXML 标签基础检查、服务器 `npm.cmd run check` 和 `git diff --check`。
- 后续注意：真机验证时确认未分享且未提交的小组返回我的预测后不出现在“我的小组”，分享或提交后会出现。

## 2026-06-20 11:18 - 填写预测和小组预测统一比赛标签
- 环境：公司电脑 Codex + 手机端截图反馈
- 目的：把“填写预测”顶部过小的国旗竖排队伍信息，改成与“我的预测”未开赛列表一致的横向比赛标签；小组预测详情页每场比赛头部同步统一。
- 涉及文件：`pages/predictionForm/predictionForm.wxml`、`pages/predictionForm/predictionForm.wxss`、`pages/predictionGroup/predictionGroup.wxml`、`pages/predictionGroup/predictionGroup.wxss`、`CODEX_CHANGELOG.MD`
- 主要改动：填写预测页顶部改为左队旗+三字母+中文名、中间日期时间+VS、右队名+队旗的横向结构；小组预测详情页的每场比赛展开头部和只读比赛列表也改用同款结构；队旗放大到 44rpx x 32rpx，并统一字号、间距和省略规则。
- 数据库/赛程/复盘：未修改比赛、预测、复盘或远程数据库内容。
- 云函数：未修改云函数，不需要重新部署云函数。
- 服务器：未修改 `server/`，不需要重新部署轻量云服务器服务。
- 验证：已运行相关 JS 语法检查、WXML 标签基础检查和 `git diff --check`。
- 后续注意：真机预览时确认小组预测详情页右侧“展开/收起”不会挤压球队标签。

## 2026-06-20 11:05 - 小组预测增加删除和多场收起展开
- 环境：公司电脑 Codex + 手机端反馈
- 目的：在“我的预测”的“我的小组”里支持删除自己发起的小组，并让多场次小组预测详情页支持按比赛收起/展开，避免表单过长。
- 涉及文件：`utils/userPredictions.js`、`pages/prediction/prediction.js`、`pages/prediction/prediction.wxml`、`pages/prediction/prediction.wxss`、`pages/predictionGroup/predictionGroup.js`、`pages/predictionGroup/predictionGroup.wxml`、`pages/predictionGroup/predictionGroup.wxss`、`server/src/index.js`、`server/src/predictionStore.js`、`cloudfunctions/apiProxy/index.js`、`CODEX_CHANGELOG.MD`
- 主要改动：新增小组删除接口，只有发起人可删除；“我的小组”卡片增加删除按钮，删除后刷新小组列表；小组预测详情页为每场比赛增加展开/收起状态，多场时默认第一场展开、后续场次收起；保留提交前必须完成所有场次预测的校验。
- 数据库/赛程/复盘：未修改比赛、预测、复盘或远程数据库内容；删除小组会从服务器运行时 `server/data/predictions.json` 中移除对应小组记录。
- 云函数：修改 `cloudfunctions/apiProxy` 路由白名单，需要重新上传并部署 `apiProxy` 云函数。
- 服务器：修改 `server/` 小组预测接口，需要重新部署轻量云服务器服务。
- 验证：已运行相关 JS 语法检查、WXML 标签基础检查、服务器 `npm.cmd run check` 和 `git diff --check`。
- 后续注意：真机验证时确认非发起人看不到删除入口，发起人删除后分享链接再次打开应提示小组读取失败。

## 2026-06-20 10:48 - 小组预测选择格同步改为稳定布局
- 环境：公司电脑 Codex + 手机端反馈
- 目的：修正“我的预测”里 2人/5人/10人选择框超出屏幕，以及小组预测详情页选择格和填写预测页样式不一致的问题。
- 涉及文件：`pages/prediction/prediction.wxml`、`pages/prediction/prediction.wxss`、`pages/predictionGroup/predictionGroup.wxml`、`pages/predictionGroup/predictionGroup.wxss`、`CODEX_CHANGELOG.MD`
- 主要改动：人数选择从原生 `button` 改为普通可点击格子并限制在三列内；小组预测详情页的胜平负、备选、比分和进球数选择项同样改为普通可点击格子；比分改为 5 列小格子，进球数保持 3 列，统一固定高度、文字居中、行列间距和可收缩宽度。
- 数据库/赛程/复盘：未修改比赛、预测、复盘或远程数据库内容。
- 云函数：未修改云函数，不需要重新部署云函数。
- 服务器：未修改 `server/`，不需要重新部署轻量云服务器服务。
- 验证：已运行相关 JS 语法检查、WXML 标签基础检查和 `git diff --check`。
- 后续注意：真机预览时重点确认人数选择不会横向溢出，小组预测详情页多场比赛表单仍能正常点击和提交。

## 2026-06-20 10:36 - 预测选择格改为稳定居中的普通格子
- 环境：公司电脑 Codex + 手机端截图反馈
- 目的：修正微信原生按钮导致比分格文字偏右、格子视觉不统一的问题，让所有选择格和上方区域对齐并保持空隙。
- 涉及文件：`pages/predictionForm/predictionForm.wxml`、`pages/predictionForm/predictionForm.wxss`、`CODEX_CHANGELOG.MD`
- 主要改动：将胜平负、备选胜平负、比分和进球数选择项从原生 `button` 改为普通可点击 `view` 格子；提交按钮仍保留 `button`；比分恢复为 5 列小格子，进球数保持 3 列 2 行；统一选择格固定高度、内部文字居中、列间距和行间距，避免真机按钮默认样式影响布局。
- 数据库/赛程/复盘：未修改比赛、预测、复盘或远程数据库内容。
- 云函数：未修改云函数，不需要重新部署云函数。
- 服务器：未修改 `server/`，不需要重新部署轻量云服务器服务。
- 验证：已运行 `node -c pages/predictionForm/predictionForm.js`、WXML 标签基础检查和 `git diff --check`。
- 后续注意：真机预览时重点确认比分文字是否完全居中，选择点击态是否仍正常切换。

## 2026-06-20 10:24 - 预测比分格子统一尺寸和居中
- 环境：公司电脑 Codex + 手机端截图反馈
- 目的：修正比分格子过宽、文字没有稳定居中、比分区和上方选项区观感不统一的问题。
- 涉及文件：`pages/predictionForm/predictionForm.wxss`、`CODEX_CHANGELOG.MD`
- 主要改动：比分选项从 3 列改为 4 列；统一设置比分格子宽度、高度、列间距和行间距；给比分按钮和内部文字增加明确居中规则；保证各选择区使用整页宽度并和顶部选项区域左、右边缘对齐。
- 数据库/赛程/复盘：未修改比赛、预测、复盘或远程数据库内容。
- 云函数：未修改云函数，不需要重新部署云函数。
- 服务器：未修改 `server/`，不需要重新部署轻量云服务器服务。
- 验证：已运行 `node -c pages/predictionForm/predictionForm.js` 和 `git diff --check`。
- 后续注意：真机预览时确认 4 列比分格子在小屏下仍完整显示，并且 “胜其它/平其它/负其它” 与普通比分格子宽高一致。

## 2026-06-20 10:12 - 预测填写页改为可读多行布局
- 环境：公司电脑 Codex + 手机端截图反馈
- 目的：修正上一版过度压缩后比分和进球数按钮内容几乎不可见的问题，同时保留页面左右边框距离。
- 涉及文件：`pages/predictionForm/predictionForm.wxss`、`CODEX_CHANGELOG.MD`
- 主要改动：页面左右边距恢复到 18rpx；比赛头部稍微放宽；胜平负保持 3 列；比分从 5 列改为 3 列多行；进球数从 6 列改为 3 列 2 行；按钮高度、字号和间距恢复到可读尺寸。
- 数据库/赛程/复盘：未修改比赛、预测、复盘或远程数据库内容。
- 云函数：未修改云函数，不需要重新部署云函数。
- 服务器：未修改 `server/`，不需要重新部署轻量云服务器服务。
- 验证：已运行 `node -c pages/predictionForm/predictionForm.js` 和 `git diff --check`。
- 后续注意：真机预览时重点确认比分选项文字完整显示，页面允许纵向滚动但不能横向溢出。

## 2026-06-20 10:03 - 预测填写页横向压缩适配窄屏
- 环境：公司电脑 Codex + 手机端截图反馈
- 目的：解决“填写预测”页面宽度仍然超出手机屏幕、右侧选项显示不完整的问题。
- 涉及文件：`pages/predictionForm/predictionForm.wxss`、`CODEX_CHANGELOG.MD`
- 主要改动：下调页面左右内边距、比赛头部中间列宽、队旗和字号；将胜平负、比分和进球数网格改为可收缩列；给按钮明确设置 `width: 100%` 和 `min-width: 0`；缩小按钮间距、边框、圆角和字号，避免微信按钮撑开整行。
- 数据库/赛程/复盘：未修改比赛、预测、复盘或远程数据库内容。
- 云函数：未修改云函数，不需要重新部署云函数。
- 服务器：未修改 `server/`，不需要重新部署轻量云服务器服务。
- 验证：已运行 `node -c pages/predictionForm/predictionForm.js` 和 `git diff --check`。
- 后续注意：需要在微信开发者工具或真机预览中确认最窄手机宽度下 3 列胜平负、5 列比分和 6 列进球数都完整显示。

## 2026-06-20 09:48 - 我的预测填写页压缩为一屏紧凑布局
- 环境：公司电脑 Codex + 手机端截图反馈
- 目的：让“填写预测”页面整体更紧凑，尽量在手机一屏内同时看到比赛信息、胜平负、备选、比分、进球数和提交按钮。
- 涉及文件：`pages/predictionForm/predictionForm.wxss`、`CODEX_CHANGELOG.MD`
- 主要改动：缩小比赛头部高度、队旗和字号；压缩分组标题、间距和按钮高度；比分选项从 4 列改为 5 列；进球数改为 6 列横向紧凑展示；提交按钮高度和上边距下调。
- 数据库/赛程/复盘：未修改比赛、预测、复盘或远程数据库内容。
- 云函数：未修改云函数，不需要重新部署云函数。
- 服务器：未修改 `server/`，不需要重新部署轻量云服务器服务。
- 验证：已运行 `node -c pages/predictionForm/predictionForm.js` 和 `git diff --check`。
- 后续注意：真机预览时重点看 5 列比分按钮在窄屏上是否仍清晰可点；如仍挤，可继续把比分区域改成左右两个紧凑半区。

## 2026-06-20 09:20 - 登录改为微信一键建档，资料后置编辑
- 环境：公司电脑 Codex + 微信小程序登录流程调整
- 目的：让用户进入小程序时先通过微信一键登录建立服务器用户 ID，无需先选择头像昵称；系统自动分配灰色头像和“微信用户+随机编号”，用户后续点击头像或昵称再编辑资料。
- 涉及文件：`utils/userAuth.js`、`pages/index/index.wxml`、`pages/index/index.js`、`pages/profile/profile.wxml`、`pages/profile/profile.js`、`pages/profile/profile.wxss`、`server/src/userStore.js`、`server/src/index.js`、`CODEX_CHANGELOG.MD`
- 主要改动：服务器微信登录时自动生成默认昵称；首页资料弹层改为“微信一键登录”；个人信息页头像和昵称变成编辑入口；头像通过 `chooseAvatar` 获取后压缩并经云函数代理以 base64 保存到服务器，避免直连当前被备案拦截的域名；昵称通过 `input type="nickname"` 或手动输入后更新同一用户档案。
- 数据库/赛程/复盘：未修改比赛、预测、复盘或远程数据库内容；用户档案会新增默认昵称字段。
- 云函数：继续依赖 `cloudfunctions/apiProxy` 转发用户资料保存接口；如果尚未部署，需要上传并部署该云函数。
- 服务器：修改了 `server/` 用户登录和头像保存逻辑，需要重新部署轻量云服务器服务。
- 验证：已运行 `node -c utils/userAuth.js`、`node -c pages/index/index.js`、`node -c pages/profile/profile.js`、`node -c server/src/userStore.js`、`node -c server/src/index.js`、`node -c cloudfunctions/apiProxy/index.js` 和服务器 `npm run check`。
- 后续注意：默认昵称也会被视为已完成微信用户档案，用户可以直接参与预测；如果要强制用户改名，可后续增加“默认昵称”提示，但不应阻断使用。

## 2026-06-20 00:18 - 新增云函数代理并收敛登录网络错误提示
- 环境：公司电脑 Codex + 手机端 `request:fail errcode:-101` 反馈
- 目的：绕开 `www.ag-shield.com` 当前被腾讯云备案拦截导致的小程序网络层失败，同时避免真机保存昵称时直接弹出微信底层网络错误长串。
- 涉及文件：`utils/remoteApi.js`、`utils/userAuth.js`、`utils/userPredictions.js`、`utils/remoteMatchDatabase.js`、`utils/remoteBetfairMarkets.js`、`cloudfunctions/apiProxy/`、`CODEX_CHANGELOG.MD`
- 主要改动：新增 `apiProxy` 云函数，白名单转发小程序所需的用户、预测、小组预测、远程数据库和 Betfair 接口到云服务器 IP；小程序端新增统一 `requestServerApi`，优先调用微信云函数代理，代理不可用时再回退到原域名请求；`errcode:-101`/`ERR_CONNECTION_RESET` 显示为“服务器连接失败(-101)”，超时显示为“服务器连接超时”，域名未配置显示为“服务器域名未配置”。
- 数据库/赛程/复盘：未修改比赛、预测、复盘或远程数据库内容。
- 云函数：新增 `cloudfunctions/apiProxy`，需要在微信开发者工具中右键该云函数并选择“上传并部署：云端安装依赖”。
- 服务器：未修改 `server/` 代码；云端已确认服务和 Nginx 正常，且已临时放行服务器 80/443 防火墙入口。
- 验证：已运行 `node -c utils/remoteApi.js`、`node -c utils/userAuth.js`、`node -c utils/userPredictions.js`、`node -c utils/remoteMatchDatabase.js`、`node -c utils/remoteBetfairMarkets.js`、`node -c cloudfunctions/apiProxy/index.js`、`node -c pages/index/index.js`、`node -c pages/profile/profile.js`。
- 后续注意：`www.ag-shield.com` 当前会跳到腾讯云备案拦截页，域名恢复备案前小程序正式版应依赖 `apiProxy`；长期仍建议完成域名备案/解封，再把前端切回正式域名直连。

## 2026-06-19 23:44 - 登录流程回退为昵称选择加静默微信身份
- 环境：公司电脑 Codex + 手机端 `request:fail errcode:-101` 反馈
- 目的：减少登录链路中的不稳定环节；既然当前只需要昵称和微信身份 ID，就不再从普通页面使用 `functional-page-navigator` 功能页，改为直接展示昵称选择/填写面板，保存时用 `wx.login` 静默建立用户身份。
- 涉及文件：`utils/userAuth.js`、`pages/index/index.js`、`pages/index/index.wxml`、`pages/profile/profile.js`、`pages/profile/profile.wxml`、`CODEX_CHANGELOG.MD`
- 主要改动：首页和个人信息页“选择微信昵称”按钮直接打开昵称输入面板；移除功能页组件的 success/fail/cancel 逻辑和 `saveFunctionalWechatProfile`；保存昵称时仍调用服务器 `/api/auth/wechat-login` 和 `/api/users/me/profile`，由服务器 openid/token 区分用户。
- 数据库/赛程/复盘：未修改比赛、预测、复盘或远程数据库内容。
- 云函数：未修改微信云函数代码，不需要重新上传云函数。
- 服务器：未修改 `server/` 代码，但排查过程中调整了线上 Nginx 连接参数并清空一次自动封禁链。
- 验证：已运行 `node -c utils/userAuth.js`、`node -c pages/index/index.js`、`node -c pages/profile/profile.js`、`node -c utils/userPredictions.js` 和服务器 `npm run check`。
- 后续注意：手机端如仍报 `errcode:-101`，重点排查公网 HTTPS/腾讯云安全组或证书链；该错误发生在网络层，不是昵称校验。

## 2026-06-19 23:26 - 用户资料权限改为只需要微信昵称
- 环境：公司电脑 Codex + 用户登录流程调整
- 目的：按用户要求取消头像必填，让服务器使用微信登录得到的 openid/token 区分每个用户，用户只需选择或填写昵称即可保存档案并参与预测。
- 涉及文件：`utils/userAuth.js`、`utils/userPredictions.js`、`pages/index/index.js`、`pages/index/index.wxml`、`pages/profile/profile.js`、`pages/profile/profile.wxml`、`pages/prediction/`、`pages/predictionForm/`、`pages/predictionGroup/`、`server/src/index.js`、`server/src/userStore.js`、`server/README.md`、`CODEX_CHANGELOG.MD`
- 主要改动：服务端 `hasProfile` 和预测权限改为只校验微信用户昵称，不再要求 `avatarUrl`；首页和个人信息页兜底资料表单移除头像选择和头像必填校验，只保存昵称；功能页返回资料时只要昵称有效即可保存，头像为空也允许；预测和小组预测权限提示统一改为“完成微信身份和昵称”。
- 数据库/赛程/复盘：未修改比赛、预测、复盘或远程数据库内容；用户档案结构兼容旧头像字段，头像变为可选展示字段。
- 云函数：未修改微信云函数代码，不需要重新上传云函数。
- 服务器：修改了 `server/` 运行代码，需要重新部署轻量云服务器服务。
- 验证：已运行小程序相关 JS 语法检查、服务器 `npm run check`、`git diff --check`。
- 后续注意：已存在的无头像但有昵称微信用户，在服务器重新部署后会自动被视为已完善资料。

## 2026-06-19 21:54 - 改用微信功能页插件方式获取头像昵称
- 环境：公司电脑 Codex + 微信官方功能页文档
- 目的：按用户指出的官方文档，将头像昵称获取入口从 `wx.getUserProfile` 改为 `functional-page-navigator` 的 `loginAndGetUserInfo` 功能页，调起微信原生“你的昵称、头像”选择界面。
- 涉及文件：`utils/userAuth.js`、`pages/index/index.js`、`pages/index/index.wxml`、`pages/index/index.wxss`、`pages/profile/profile.js`、`pages/profile/profile.wxml`、`pages/profile/profile.wxss`、`CODEX_CHANGELOG.MD`
- 主要改动：首页资料弹层和个人信息页登录按钮改为官方 `functional-page-navigator` 组件，传入 `withCredentials/lang/timeout` 参数并监听 `success/fail/cancel`；成功返回后使用功能页 `code` 建立微信身份，再保存返回的 `userInfo.nickName/avatarUrl`；取消或失败时回退到现有 `chooseAvatar` + `type="nickname"` 手动选择面板；移除页面入口对旧 `wx.getUserProfile` 的依赖。
- 数据库/赛程/复盘：未修改比赛、预测、复盘或远程数据库内容。
- 云函数：未修改微信云函数代码，不需要重新上传云函数。
- 服务器：未修改 `server/` 代码，不需要重新部署轻量云服务器服务。
- 验证：已运行 `node -c utils/userAuth.js`、`node -c pages/index/index.js`、`node -c pages/profile/profile.js`。
- 后续注意：微信官方文档说明 `functional-page-navigator` 仅在插件中有效，且功能页跳转不支持开发者工具调试，需要真机测试；如真机提示组件场景不支持，需要将该入口封装到插件组件内。

## 2026-06-19 21:36 - 资料登录入口优先调用微信原生头像昵称授权页
- 环境：公司电脑 Codex + 手机端截图反馈
- 目的：按用户提供的微信原生界面示例，调整“完善微信资料”流程，点击后优先调起微信自己的昵称头像授权/选择界面，而不是直接进入小程序自定义资料表单。
- 涉及文件：`utils/userAuth.js`、`pages/index/index.js`、`pages/profile/profile.js`、`CODEX_CHANGELOG.MD`
- 主要改动：新增 `requestWechatProfile()` 调用微信 `wx.getUserProfile` 原生授权页；首页首次资料提示和个人信息页登录按钮优先走微信原生授权，授权返回真实头像昵称后再静默登录并保存到服务器；如果微信只返回“微信用户”或默认头像，则自动回退到现有 `chooseAvatar` + `type="nickname"` 手动选择面板。
- 数据库/赛程/复盘：未修改比赛、预测、复盘或远程数据库内容。
- 云函数：未修改微信云函数代码，不需要重新上传云函数。
- 服务器：未修改 `server/` 代码，不需要重新部署轻量云服务器服务。
- 验证：已运行 `node -c utils/userAuth.js`、`node -c pages/profile/profile.js`、`node -c pages/index/index.js`。
- 后续注意：微信新版本可能仍会限制 `wx.getUserProfile` 返回真实头像昵称；这种情况下会自动进入兜底选择面板，属于微信能力限制。

## 2026-06-19 21:18 - 放宽微信资料保存超时并确认头像昵称必须手动选择
- 环境：公司电脑 Codex + 手机端反馈
- 目的：处理真机保存微信头像昵称时出现 `request:fail timeout` 的问题，同时确认微信官方当前不支持自动提取真实头像和昵称，只能通过原生 `chooseAvatar` 和 `type="nickname"` 由用户手动选择。
- 涉及文件：`utils/userAuth.js`、`server/src/index.js`、`CODEX_CHANGELOG.MD`
- 主要改动：小程序端普通登录/保存请求超时从 5 秒放宽到 15 秒，头像上传超时从 8 秒放宽到 30 秒，并统一把网络失败转换为可读错误；服务端访问微信 `jscode2session` 增加 10 秒超时保护和失败日志，避免服务器请求长时间悬挂。
- 数据库/赛程/复盘：未修改比赛、预测、复盘或远程数据库内容。
- 云函数：未修改微信云函数代码，不需要重新上传云函数。
- 服务器：修改了 `server/` 运行代码，需要重新部署轻量云服务器服务。
- 验证：已运行 `node -c utils/userAuth.js`、`node -c server/src/index.js`、`node -c pages/profile/profile.js`、`node -c pages/index/index.js` 和服务器 `npm run check`。
- 后续注意：真机仍需用户点击选择微信头像和昵称；如果继续超时，优先检查微信后台 request/uploadFile 合法域名和服务器日志。

## 2026-06-19 20:52 - 调整头像昵称流程为先选择后登录保存

- 环境：公司电脑 Codex + 手机端反馈
- 目的：修复手机端点击完善微信资料时被微信身份登录卡住的问题，让微信原生头像昵称选择先展示，保存资料时再静默建立微信身份并上传。
- 涉及文件：`utils/userAuth.js`、`pages/index/index.js`、`pages/index/index.wxml`、`pages/profile/profile.js`、`pages/profile/profile.wxml`、`server/src/index.js`、`CODEX_CHANGELOG.MD`
- 主要改动：新增 `ensureWechatSession()`，仅在保存资料前保证微信身份；首页和个人信息页点击完善资料时直接展示 `chooseAvatar` 与 `type="nickname"`；请求失败时保留微信/网络真实错误提示；服务端记录微信登录失败的 `errcode/errmsg`，便于继续排查。
- 数据库/赛程/复盘：未修改比赛、预测、复盘或远程数据库内容。
- 云函数：未修改微信云函数代码，不需要重新上传云函数。
- 服务器：修改了 `server/` 运行代码，需要重新部署轻量云服务器服务。
- 验证：已运行 `node -c pages/profile/profile.js`、`node -c pages/index/index.js`、`node -c utils/userAuth.js`、服务器 `npm run check`、页面 JSON 解析检查和 `git diff --check`。
- 后续注意：如果手机端仍失败，直接看手机 toast 或服务器 PM2 日志中的 `[wechat-login] errcode`。

## 2026-06-19 20:34 - 服务端启动读取微信登录配置

- 环境：公司电脑 Codex + 腾讯云服务器排查
- 目的：修复手机端点击完善微信资料时提示“微信身份暂不可用”的问题根因之一：服务端没有自动读取 `server/.env` 中的微信登录配置。
- 涉及文件：`server/src/index.js`、`server/README.md`、`CODEX_CHANGELOG.MD`
- 主要改动：服务器启动时自动读取 `server/.env` 并注入未设置的环境变量；文档明确 `WECHAT_APP_SECRET` 必须填写微信公众平台 AppSecret，否则 `/api/auth/wechat-login` 无法用 `wx.login` code 换取 openid。
- 数据库/赛程/复盘：未修改比赛、预测、复盘或远程数据库内容。
- 云函数：未修改微信云函数代码，不需要重新上传云函数。
- 服务器：修改了 `server/` 运行代码，需要重新部署轻量云服务器服务；同时服务器 `.env` 还需要补齐 `WECHAT_APP_SECRET`。
- 验证：已运行服务器 `npm run check` 和 `git diff --check`。
- 后续注意：当前云服务器检测到 `WECHAT_APP_ID` 已写入 `.env`，但 `WECHAT_APP_SECRET` 缺失；需要从微信公众平台复制 AppSecret 到服务器 `.env` 后重启服务。

## 2026-06-19 20:20 - 压缩主包图片资源并补充上传忽略

- 环境：公司电脑 Codex
- 目的：修复微信开发者工具上传检查中“主包尺寸超过 1.5M”和“图片和音频资源超过 200K”未通过的问题。
- 涉及文件：`assets/flags/*.png`、`assets/brand/worldcup26-logo.png`、`assets/brand/worldcup26-logo-black.png`、`project.config.json`、`CODEX_CHANGELOG.MD`
- 主要改动：将所有国旗 PNG 和两个世界杯 LOGO 进行调色板压缩，保持路径和页面引用不变；在 `project.config.json` 上传忽略中加入 README、TODO、AGENTS、交接日志、变更日志和 npm 包描述文件，避免非运行文件进入小程序主包。
- 数据库/赛程/复盘：未修改比赛、预测、复盘或远程数据库内容。
- 云函数：未修改微信云函数代码，不需要重新上传云函数。
- 服务器：未修改服务器运行代码，不需要重新部署轻量云服务器。
- 验证：图片资源从约 1.34M 降至 173K；估算上传包约 0.58M，图片/音频约 169K；已抽查巴西国旗和世界杯 LOGO 可正常显示；已运行关键 JS 语法检查、JSON 解析检查和 `git diff --check`。
- 后续注意：上传前在微信开发者工具重新执行一次“代码质量/体积检查”，确认主包图片资源低于 200K。

## 2026-06-19 20:08 - 按微信官方头像昵称能力调整资料完善入口

- 环境：公司电脑 Codex + 微信官方/腾讯云头像昵称能力文档
- 目的：按微信官方推荐方式拆分静默身份登录和头像昵称资料完善，避免把“登录”和“获取微信头像昵称”混为一谈。
- 涉及文件：`pages/profile/profile.js`、`pages/profile/profile.wxml`、`pages/index/index.wxml`、`CODEX_CHANGELOG.MD`
- 主要改动：个人信息页游客入口从“登录”改为“完善微信资料”；点击后先用 `wx.login` 静默建立微信身份，再使用 `button open-type="chooseAvatar"` 选择微信头像、`input type="nickname"` 选择或确认微信昵称；首页首次进入资料提示同步改为“选择微信头像和昵称”文案，并为昵称输入增加 `bindchange`。
- 数据库/赛程/复盘：未修改比赛、预测、复盘或远程数据库内容。
- 云函数：未修改微信云函数代码，不需要重新上传云函数。
- 服务器：未修改服务器运行代码，不需要重新部署轻量云服务器。
- 验证：已运行 `node -c pages/profile/profile.js`、`node -c pages/index/index.js`、`app.json`/页面 JSON 解析检查、`git diff --check`。
- 后续注意：需要在真机上确认昵称输入框弹出的微信昵称候选项；开发者工具可能无法完全还原原生键盘表现。

## 2026-06-19 19:48 - 个人信息页增加游客登录入口

- 环境：公司电脑 Codex
- 目的：按用户要求在个人信息页为游客用户增加登录按钮，点击后使用微信原生头像和昵称能力完善用户资料，不再额外做自定义确认弹窗。
- 涉及文件：`pages/profile/profile.js`、`pages/profile/profile.wxml`、`pages/profile/profile.wxss`、`CODEX_CHANGELOG.MD`
- 主要改动：游客或未完善资料用户在个人信息页显示“登录”按钮；点击后先执行微信登录，再展开 `chooseAvatar` 和 `type="nickname"` 原生控件；保存后调用现有用户资料接口并刷新个人信息和奖牌数据。
- 数据库/赛程/复盘：未修改比赛、预测、复盘或远程数据库内容。
- 云函数：未修改微信云函数代码，不需要重新上传云函数。
- 服务器：未修改服务器运行代码，不需要重新部署轻量云服务器。
- 验证：已运行 `node -c pages/profile/profile.js`、`app.json` 与 `pages/profile/profile.json` 解析检查、`git diff --check`。
- 后续注意：需要在微信开发者工具中真机预览，确认头像选择和昵称自动填充在当前基础库版本下正常弹出。

## 2026-06-19 19:34 - 增加小组预测、邀请分享和奖牌档案

- 环境：公司电脑 Codex
- 目的：按用户要求给“我的预测”增加 2 人、5 人、10 人小组预测；支持选择可预测比赛后发起小组，通过小程序分享邀请朋友加入，并把小组预测放入“已经预测”详情栏中用“（小组预测）”区分。
- 涉及文件：`app.json`、`utils/userPredictions.js`、`pages/prediction/`、`pages/predictionGroup/`、`pages/profile/`、`server/src/index.js`、`server/src/predictionStore.js`、`server/README.md`、`CODEX_CHANGELOG.MD`
- 主要改动：服务器新增小组预测创建、公开读取、加入、提交/修改接口；小程序新增小组预测详情页，支持填写和更新自己的小组预测；我的预测页新增发起小组区域，并在“已经预测”中展示已提交的小组预测，点击可回到详情页修改；个人信息页展示小组预测金银铜牌数量。
- 数据库/赛程/复盘：未修改比赛赛程和系统预测内容；小组预测与用户预测一起写入服务器运行时 `server/data/predictions.json`，按胜平负 50%、比分 30%、进球数 20% 的规则结算。
- 云函数：未修改微信云函数代码，不需要重新上传云函数。
- 服务器：修改了 `server/` 运行代码，需要重新部署轻量云服务器服务；分享落地读取小组详情依赖新的 `/api/prediction-groups/:id` 接口。
- 验证：已运行 `node -c pages/prediction/prediction.js`、`node -c pages/predictionGroup/predictionGroup.js`、`node -c pages/profile/profile.js`、`node -c utils/userPredictions.js`；已运行服务器 `npm run check`、`app.json` 与新增页面 JSON 解析检查、`git diff --check`。
- 后续注意：小程序端新增页面和交互，需要重新上传审核；服务器部署后再用体验版真机测试分享进入、加入小组、修改预测和个人信息奖牌展示。

## 2026-06-19 18:52 - 我的预测接入用户档案、云端排名和新命中率权重

- 环境：公司电脑 Codex + football-match-predictor skill
- 目的：让“我的预测”必须使用微信头像和微信名后才能提交，游客只能浏览不能预测；把用户预测迁移到云服务器用户档案，并增加近 10 次预测准确率和全站排名。
- 涉及文件：`utils/userPredictions.js`、`pages/prediction/`、`pages/predictionForm/predictionForm.js`、`pages/index/index.js`、`utils/matches.js`、`server/src/index.js`、`server/src/userStore.js`、`server/src/predictionStore.js`、`server/src/buildDatabaseSnapshot.js`、`server/package.json`、`server/README.md`、`AGENTS.MD`、`.codex-skills/football-match-predictor/SKILL.md`、`CODEX_CHANGELOG.MD`
- 主要改动：服务器新增用户预测提交、读取和排行榜接口；预测接口要求 `mode=wechat` 且已有头像昵称，游客返回 `PROFILE_REQUIRED`；预测记录写入 `server/data/predictions.json`，按最新完赛复盘结算；我的预测页展示权限提示、云端“已经预测”列表、近 10 次准确率、全站排名和已结算场次；填写页提交改为走云端接口。
- 数据库/赛程/复盘：未新增比赛或预测内容；复盘命中率权重统一改为胜平负 50%、比分 30%、进球数 20%，并同步到首页复盘、静态数据库复盘、服务器快照和用户预测排名。
- 云函数：未修改微信云函数代码，不需要重新上传云函数。
- 服务器：修改了 `server/` 运行代码，需要重新部署轻量云服务器服务；运行时新增 `server/data/predictions.json`，不要提交 Git。
- 验证：已运行小程序相关 JS 语法检查、服务器 `npm run check`、服务器预测存储语法检查；已确认复盘样例按新权重重新计算，例如墨西哥 1-0 韩国为 50%，捷克 1-1 南非为 60%。
- 后续注意：服务器部署后需重新生成或读取最新数据库快照，微信端需要重新提交体验版/审核版才能使用新的云端预测档案和排名入口。

## 2026-06-19 18:24 - 统一赛程和我的预测列表箭头样式

- 环境：公司电脑 Codex
- 目的：按用户截图反馈，让赛程页和我的预测页的详情入口箭头与首页比赛卡片保持一致。
- 涉及文件：`pages/schedule/schedule.wxml`、`pages/schedule/schedule.wxss`、`pages/prediction/prediction.wxml`、`pages/prediction/prediction.wxss`、`CODEX_CHANGELOG.MD`
- 主要改动：将赛程和我的预测列表里的普通 `>` 改为首页同款 `›` 符号，并同步首页箭头的金色、44rpx 字号和 300 字重。
- 数据库/赛程/复盘：未修改比赛、预测、复盘或远程数据库数据。
- 云函数：未修改微信云函数代码，不需要重新上传云函数。
- 服务器：未修改服务器代码，不需要重新部署轻量云服务器。
- 验证：已检查对应模板中不再使用普通 `>` 作为列表入口箭头。

## 2026-06-19 18:12 - 我的预测改为用户自选预测与可转发结果页

- 环境：公司电脑 Codex
- 目的：把“我的预测”从系统预测展示页改成用户自行预测入口，支持选择今天和明天未开赛比赛、填写预测并生成可分享结果。
- 涉及文件：`app.json`、`utils/userPredictions.js`、`pages/prediction/prediction.js`、`pages/prediction/prediction.wxml`、`pages/prediction/prediction.wxss`、`pages/predictionForm/`、`pages/predictionResult/`、`CODEX_CHANGELOG.MD`
- 主要改动：我的预测首页只展示北京时间今天和明天未开赛比赛，并复用赛程页国旗、三字母队名、日期时间和箭头样式；新增预测填写页，支持选择胜平负、可选备选胜平负、最多 2 个比分、1 个进球数区间；新增预测结果页，提交后展示用户选择，并启用转发给朋友和分享到朋友圈；本地保存最近用户预测，同时分享链接携带压缩后的预测数据，朋友打开后可直接查看结果。
- 数据库/赛程/复盘：未修改比赛预测、复盘或赛程数据；仅使用现有本地/远程未赛列表做用户预测入口。
- 云函数：未修改微信云函数代码，不需要重新上传云函数。
- 服务器：未修改服务器代码，不需要重新部署轻量云服务器。
- 验证：已运行 `pages/prediction`、`pages/predictionForm`、`pages/predictionResult` 和 `utils/userPredictions` 的 JS 语法检查；已检查 `app.json` 与新增页面 JSON 可解析。
- 后续注意：需要在微信开发者工具中真机预览，重点检查结果页右上角菜单是否能正常转发给朋友和分享到朋友圈，以及分享落地页是否能直接展示预测结果。

## 2026-06-19 17:36 - 按真实赛程压缩淘汰赛对阵表

- 环境：公司电脑 Codex
- 目的：按用户提供的真实 2026 世界杯淘汰赛程图调整赛程页对阵表，删除轮次标题，并让左右树形结构能整体显示在手机画面中。
- 涉及文件：`pages/schedule/schedule.js`、`pages/schedule/schedule.wxml`、`pages/schedule/schedule.wxss`、`CODEX_CHANGELOG.MD`
- 主要改动：将 32 强首轮种子顺序改为真实赛程图里的左右半区顺序；支持 `1E`、`2A`、`3A` 这类“名次+组别”种子别名；去掉淘汰赛面板里的 `16强/8强/4强/2强` 文字和横向滚动容器；压缩中心列、LOGO、队伍框、比分和占位文字尺寸，使整张左右对阵表保持 100% 宽度展示。
- 数据库/赛程/复盘：未修改比赛预测、复盘或小组赛数据；仅调整淘汰赛占位顺序和页面展示方式。
- 云函数：未修改微信云函数代码，不需要重新上传云函数。
- 服务器：未修改服务器代码，不需要重新部署轻量云服务器。
- 验证：已运行赛程页 JS 语法检查；已用本地 `wx/Page` 模拟加载赛程页，确认左半区外侧顺序为 `1E-3ABCDF` 到 `1G-3AEHIJ`，右半区外侧顺序为 `1C-2F` 到 `1K-3DEIJL`，左右层级分别为 `8/4/2/1` 与 `1/2/4/8`。
- 后续注意：需要在微信开发者工具中重新编译预览，重点看真实手机宽度下 `3ABCDF`、`3CEFHI` 等较长第三名组合占位是否仍需继续缩小。

## 2026-06-19 17:18 - 淘汰赛图改为半区多层晋级树

- 环境：公司电脑 Codex
- 目的：按用户要求把淘汰赛图从单层左右占位改为左右半区多层晋级树，并去掉红蓝背景。
- 涉及文件：`pages/schedule/schedule.js`、`pages/schedule/schedule.wxml`、`pages/schedule/schedule.wxss`、`CODEX_CHANGELOG.MD`
- 主要改动：左右半区分别显示 `16强 / 8强 / 4强 / 2强` 路径；左右 2 强胜者自动进入“冠军对阵”，负者自动进入“3-4名对阵”；中间 LOGO 缩小约 50%；淘汰赛面板恢复黑色背景。
- 数据库/赛程/复盘：未修改比赛、预测或复盘数据；新增通用淘汰赛读取逻辑，后续数据库中如果写入 32强、16强、8强、4强、决赛、3-4名比赛和比分，赛程页会按赛果自动填入队伍、比分和晋级路线。
- 云函数：未修改微信云函数代码，不需要重新上传云函数。
- 服务器：未修改服务器代码，不需要重新部署轻量云服务器。
- 验证：已用本地 wx/Page 模拟加载赛程页，确认左半区 `16强:8,8强:4,4强:2,2强:1`、右半区 `2强:1,4强:2,8强:4,16强:8`；已运行赛程页 JS 语法检查。
- 后续注意：需要在微信开发者工具中真机预览横向滚动树形图，必要时继续压缩每个队伍框的字号和间距。

## 2026-06-19 17:02 - 修复赛程箭头乱码并改淘汰赛为左右树

- 环境：公司电脑 Codex
- 目的：修复赛程页剩余比赛入口箭头显示成 `&gt;` 的问题，并按用户参考图把淘汰赛图从上下结构改成左右树形结构。
- 涉及文件：`pages/schedule/schedule.js`、`pages/schedule/schedule.wxml`、`pages/schedule/schedule.wxss`、`CODEX_CHANGELOG.MD`
- 主要改动：剩余比赛详情入口箭头改为真实 `>` 字符；淘汰赛数据从 `upper/lower` 改为 `left/right`；页面中间改用首页世界杯 LOGO，小队伍框改成白底黑字，并增加上红下蓝的左右树形淘汰赛背景。
- 数据库/赛程/复盘：未修改比赛、预测或复盘数据。
- 云函数：未修改微信云函数代码，不需要重新上传云函数。
- 服务器：未修改服务器代码，不需要重新部署轻量云服务器。
- 验证：已用本地 wx/Page 模拟加载赛程页，确认生成 12 个分组和左右各 8 个淘汰赛占位；已运行赛程页 JS 语法检查；已确认模板中不再含 `&gt;`、旧 `bracket.upper/lower` 或奖杯乱码。
- 后续注意：需要在微信开发者工具中重新编译预览，重点检查淘汰赛图在真机宽度下是否需要继续压缩字号或间距。

## 2026-06-19 16:47 - 放大 tabBar 图标并改预测入口名称

- 环境：公司电脑 Codex + Figma
- 目的：按用户截图红框，把底部导航图标有效尺寸继续放大，并把预测入口改为更明确的“我的预测”。
- 涉及文件：`app.json`、`assets/nav/home.png`、`assets/nav/home-active.png`、`assets/nav/schedule.png`、`assets/nav/schedule-active.png`、`assets/nav/prediction.png`、`assets/nav/prediction-active.png`、`assets/nav/profile.png`、`assets/nav/profile-active.png`、`CODEX_CHANGELOG.MD`
- 主要改动：将 8 个 tabBar PNG 的有效图形区域放大到接近红框标记大小；预测图标从拼图改为箭头射中标靶；底部导航第三项文案从“预测”改为“我的预测”；同步更新 Figma 文件中的图标画板。
- 数据库/赛程/复盘：未修改比赛、预测或复盘数据。
- 云函数：未修改微信云函数代码，不需要重新上传云函数。
- 服务器：未修改服务器代码，不需要重新部署轻量云服务器。
- 验证：已确认 `app.json` 可解析，第三个 tab 文案字符码为“我的预测”；已生成本地预览检查图标大小和标靶图标方向。
- 后续注意：需要在微信开发者工具中重新编译预览，重点看真机底部导航里图标是否仍被微信 tabBar 固定尺寸压缩。

## 2026-06-19 16:35 - 用 Figma 重新生成并放大底部导航图标

- 环境：公司电脑 Codex + Figma
- 目的：按用户反馈重新制作更精致的底部 tabBar 图标，并在确认后整体放大 20%。
- 涉及文件：`assets/nav/home.png`、`assets/nav/home-active.png`、`assets/nav/schedule.png`、`assets/nav/schedule-active.png`、`assets/nav/prediction.png`、`assets/nav/prediction-active.png`、`assets/nav/profile.png`、`assets/nav/profile-active.png`、`CODEX_CHANGELOG.MD`
- 主要改动：在 Figma 文件 `WorldCup Mini Program Tab Icons` 中生成 24px 网格线性图标方案，使用圆角端点、常态灰色和选中金色；导出为小程序 tabBar 使用的 81x81 透明 PNG，并按用户要求比初版放大约 20%。
- 数据库/赛程/复盘：未修改比赛、预测或复盘数据。
- 云函数：未修改微信云函数代码，不需要重新上传云函数。
- 服务器：未修改服务器代码，不需要重新部署轻量云服务器。
- 验证：已生成本地预览确认 4 组图标风格统一；已检查 `app.json` 可正常解析；8 个 PNG 单文件均小于 3KB。
- 后续注意：需要在微信开发者工具中重新编译预览，重点看真机 tabBar 中图标大小、文字间距和选中态颜色。

## 2026-06-19 16:18 - 修复赛程页打开失败并重做底部导航图标

- 环境：公司电脑 Codex
- 目的：修复底部导航进入赛程页时报错无法打开的问题，并替换原先观感粗糙的 tabBar 图标。
- 涉及文件：`pages/schedule/schedule.js`、`assets/nav/home.png`、`assets/nav/home-active.png`、`assets/nav/schedule.png`、`assets/nav/schedule-active.png`、`assets/nav/prediction.png`、`assets/nav/prediction-active.png`、`assets/nav/profile.png`、`assets/nav/profile-active.png`、`CODEX_CHANGELOG.MD`
- 主要改动：赛程页远程复盘数据改为统一通过 `getSourceReviews()` 获取，避免 `sourceReviews is not defined` 在页面初始化时直接中断；重新制作首页、赛程、预测、信息 4 组透明 PNG 线性图标，常态灰色、选中金色。
- 数据库/赛程/复盘：未修改比赛、预测或复盘数据。
- 云函数：未修改微信云函数代码，不需要重新上传云函数。
- 服务器：未修改服务器代码，不需要重新部署轻量云服务器。
- 验证：已用本地 wx/Page 模拟加载赛程页，确认可生成 12 个分组并默认选中 A组；已运行 `node -c` 检查赛程页、首页、详情页和远程数据库工具；已检查新图标大小均小于 4KB。
- 后续注意：需要在微信开发者工具中重新编译预览，重点确认 tabBar 图标清晰度和赛程页进入是否正常。

## 2026-06-19 16:05 - 小程序页面改为优先读取云服务器数据库

- 环境：公司电脑 Codex
- 目的：解决正式版小程序必须重新上传审核才能看到每日赛程/预测更新的问题；让首页、赛程、预测、历史和详情页优先使用云服务器 `/api/database/latest` 返回的最新数据库，包内静态数据只作为断网兜底。
- 涉及文件：`utils/remoteMatchDatabase.js`、`utils/buildInfo.js`、`pages/index/index.js`、`pages/schedule/schedule.js`、`pages/prediction/prediction.js`、`pages/history/history.js`、`pages/detail/detail.js`、`CODEX_CHANGELOG.MD`
- 主要改动：远程数据库工具新增服务器更新时间徽标和远程字段读取；首页刷新后同步显示服务器数据库时间；赛程页和预测页改为进入页面时先刷新服务器快照并用远程 `matches/upcomingMatches/finishedMatches` 构建内容；详情页支持服务器新增比赛在远程数据返回后再加载，避免审核包内没有新比赛时提示找不到。
- 数据库/赛程/复盘：未新增比赛和复盘内容；展示来源从“审核包静态数据优先”调整为“云服务器数据库优先”。
- 云函数：未修改微信云函数代码，不需要重新上传云函数。
- 服务器：未修改服务器代码；后续每日只需在服务器更新 `/api/database/latest` 快照，正式版用户重新进入或下拉刷新即可读取最新内容。
- 验证：已运行 `node -c` 检查远程数据库工具、首页、赛程页、预测页、历史页、详情页和数据库徽标工具；已确认远程 `databaseUpdatedAt` 可显示为页面数据库更新时间。
- 后续注意：这次客户端读取逻辑本身需要重新上传审核一次；审核通过后，后续每日数据库更新不再需要因为赛程/预测内容重新提交小程序审核，但微信后台必须把 `https://www.ag-shield.com` 加入 request 合法域名。

## 2026-06-19 15:29 - 用预测 Skill 刷新 6月19日数据库与必发权重

- 环境：公司电脑 Codex
- 目的：按北京时间 2026-06-19 滚动更新未来 7 天赛前数据库；用必发 API 同步 6月20日四场比赛成交数据；归档 6月19日凌晨至上午已经结束的比赛，并把成交额上涨但赔率走高的方向作为显著降权因素纳入模型。
- 涉及文件：`utils/matches.js`、`utils/buildInfo.js`、`CODEX_CHANGELOG.MD`
- 主要改动：更新美国 vs 澳大利亚、苏格兰 vs 摩洛哥、巴西 vs 海地、土耳其 vs 巴拉圭的必发成交额、赔率和归一化概率；新增 `oddsMovement` 方向判断，成交放大但主胜/客胜赔率走高时，对该方向概率和胜平负边际做额外下调；补入 6月26日北京时间厄瓜多尔 vs 德国、库拉索 vs 科特迪瓦、日本 vs 瑞典、突尼斯 vs 荷兰、土耳其 vs 美国、巴拉圭 vs 澳大利亚 6 场预测。
- 数据库/赛程/复盘：新增墨西哥 1-0 韩国、加拿大 6-0 卡塔尔、瑞士 4-1 波黑、捷克 1-1 南非 4 场复盘并从未赛首页列表移出；滚动窗口未赛场次为 32 场，数据库更新时间更新为 `6/19 15:09`。
- 云函数：未修改微信云函数代码，不需要重新上传云函数。
- 服务器：未修改服务器运行代码；已本地生成 `server/data` 数据库快照，该目录不提交 Git。线上轻量服务器如需立即提供 `/api/database/latest` 最新快照，需要拉取代码后重新生成快照或重启现有刷新流程。
- 验证：已运行小程序关键 JS 语法检查、服务端 `npm.cmd run check`、服务端 `npm.cmd run snapshot`；已确认首页排序从 `6月20日 03:00 美国 vs 澳大利亚` 开始，四场完赛不再出现在未赛列表，复盘总进球区间无跨度超过 1 球的问题。
- 后续注意：本次使用的必发 session token 和 app key 只用于本地同步，没有写入项目文件；继续发布前建议在微信开发者工具中重新编译体验版并检查首页、赛程、复盘入口显示。

## 2026-06-19 09:53 - 赛程页排名接入 LIVE 完赛数据

- 环境：公司电脑 Codex
- 目的：修正赛程页小组排名无内容、剩余比赛未读取实时状态的问题；让已经结束的比赛进入小组排名，正在进行的比赛仍保留在剩余比赛中且不显示实时比分。
- 涉及文件：`pages/schedule/schedule.js`、`pages/schedule/schedule.wxml`、`pages/schedule/schedule.wxss`、`CODEX_CHANGELOG.MD`
- 主要改动：赛程页引入 `refreshLiveScores`，进入页面、下拉刷新和定时刷新时读取 LIVE 实时状态；小组排名同时计算静态复盘、当前赛程里的 LIVE 完赛比分，以及已经归档但不在当前赛程数组中的历史复盘；剩余比赛过滤掉已完赛场次，保留进行中场次但只显示状态文字，不展示比分。
- 数据库/赛程/复盘：未修改静态比赛时间和预测内容；排名展示逻辑会把实时完赛结果临时计入小组积分榜。
- 云函数：未修改微信云函数代码，但赛程页依赖现有 `liveScores` 云函数返回最新状态。
- 服务器：未修改服务器运行代码，不需要重新部署轻量云服务器。
- 验证：已运行赛程页 JS 语法检查；已本地模拟 A 组“捷克 vs 南非完赛、墨西哥 vs 韩国进行中”，确认完赛进入排名、进行中保留在剩余比赛且不展示比分。
- 后续注意：需要在微信开发者工具中重新编译预览，并确认 `liveScores` 云函数当前能返回这些比赛的最新状态。

## 2026-06-19 09:34 - 赛程页改为 A-L 完整世界杯赛程视图

- 环境：公司电脑 Codex
- 目的：按用户要求，将底部导航里的赛程页从简版列表改为完整世界杯赛程页，并把分组标签修正为 A-L。
- 涉及文件：`pages/schedule/schedule.js`、`pages/schedule/schedule.wxml`、`pages/schedule/schedule.wxss`、`CODEX_CHANGELOG.MD`
- 主要改动：顶部复用世界杯 LOGO 并展示英文赛事名和中文完整赛程标题；新增 A-L 横向分组标签；每组先展示小组排名，包含比赛、胜/平/负、进/失、积分，并按前四名使用不同底色；剩余未开赛比赛展示国旗、三字母队名、日期和时间，有预测的比赛显示 `>` 并可进入详情；新增手机端可整体缩小查看的 32 强淘汰赛占位图，中间显示决赛奖杯，预留常规、加时、点球比分和晋级绿色路线样式。
- 数据库/赛程/复盘：未新增或重算预测数据，未修改比赛时间；赛程页基于现有 `utils/matches.js` 和 `finishedMatches` 动态生成 A-L 排名、剩余比赛和淘汰赛占位。
- 云函数：未修改微信云函数，不需要重新上传云函数。
- 服务器：未修改服务器运行代码，不需要重新部署轻量云服务器。
- 验证：已运行赛程页 JS 语法检查，并用本地数据确认可生成 A-L 12 个分组标签、默认 A 组和上下各 8 个淘汰赛对阵占位。
- 后续注意：需要在微信开发者工具中重新编译预览，重点检查赛程页横向标签、排名颜色、剩余比赛点击入口和淘汰赛图在手机端的缩放显示。

## 2026-06-19 09:18 - 新增底部四入口导航栏

- 环境：公司电脑 Codex
- 目的：按用户要求，在小程序最底部新增原生导航栏，依次为首页、赛程、预测、信息，并使用图标加小文字展示。
- 涉及文件：`app.json`、`assets/nav/`、`pages/schedule/`、`pages/prediction/`、`pages/profile/`、`CODEX_CHANGELOG.MD`
- 主要改动：启用微信小程序原生 `tabBar`；新增房子、日历、拼图和小人 4 组普通/选中 PNG 图标；新增赛程页、预测页和个人信息页，分别集中展示比赛时间表、预测倾向和当前用户状态。
- 数据库/赛程/复盘：未修改比赛数据、预测内容、赛程时间或复盘。
- 云函数：未修改微信云函数，不需要重新上传云函数。
- 服务器：未修改服务器运行代码，不需要重新部署服务器。
- 验证：已运行新增页面 JS 语法检查、首页 JS 语法检查和 `app.json` JSON 解析检查；导航图标总大小约 7KB。
- 后续注意：需要在微信开发者工具中重新编译预览，确认底部 tabBar 图标和文字在手机端显示正常。

## 2026-06-19 09:10 - 用户资料授权改为底部上滑弹层

- 环境：公司电脑 Codex
- 目的：按用户要求，避免用户资料窗口顶掉公告窗口；资料选择改为从下方上滑的手机原生界面模式，选择前首页背景保持模糊，选择完直接展示首页。
- 涉及文件：`pages/index/index.js`、`pages/index/index.wxml`、`pages/index/index.wxss`、`CODEX_CHANGELOG.MD`
- 主要改动：首页主体内容增加独立包裹层，资料选择/完善资料期间对首页内容加模糊和禁点；用户资料弹窗从居中卡片改为底部上滑面板；首次完成资料选择后不再立即弹出公告，避免两个弹层连续抢占。
- 数据库/赛程/复盘：未修改比赛数据、赛程、预测或复盘。
- 云函数：未修改微信云函数，不需要重新上传云函数。
- 服务器：未修改服务器运行代码，不需要重新部署服务器。
- 验证：待运行首页 JS 语法检查和用户工具检查。
- 后续注意：需要在微信开发者工具中重新预览手机端，确认底部弹层、安全区和背景模糊效果符合预期。

## 2026-06-19 08:33 - 新增微信用户与游客用户接口

- 环境：公司电脑 Codex
- 目的：按用户要求，在小程序进入时提示是否使用微信头像和微信名；选择同意则保存头像昵称并建立用户数据，选择否按游客用户进入。
- 涉及文件：`server/src/index.js`、`server/src/userStore.js`、`server/package.json`、`server/.env.example`、`server/README.md`、`utils/userAuth.js`、`pages/index/index.js`、`pages/index/index.wxml`、`pages/index/index.wxss`、`CODEX_CHANGELOG.MD`
- 主要改动：服务器新增游客用户、微信 code 登录、用户资料保存和头像访问接口；用户数据写入 `server/data/users.json`，头像写入 `server/data/avatars/`；小程序首页启动完成后新增用户资料选择弹窗，支持使用微信头像/微信名或游客进入。
- 数据库/赛程/复盘：未修改比赛数据、赛程、预测或复盘；不影响首页排序和历史复盘数据。
- 云函数：未修改微信云函数，不需要重新上传云函数。
- 服务器：修改了 `server/`，需要重新部署轻量云服务器服务；服务器 `.env` 需配置 `WECHAT_APP_ID`、`WECHAT_APP_SECRET`、`PUBLIC_BASE_URL`。
- 验证：已运行首页 JS、用户工具、服务器入口和用户存储语法检查；已运行 `npm.cmd run check` 通过服务器检查。
- 后续注意：小程序 request 合法域名需包含当前 `utils/serverConfig.js` 的 HTTPS 域名；微信 AppSecret 只能放服务器 `.env`，不要写入前端或 Git。

## 2026-06-18 18:45 - 修正公告关闭 X 的卡片内位置

- 环境：公司电脑 Codex
- 目的：按用户截图指示，把公告关闭 X 放到公告卡片内部右上角。
- 涉及文件：`pages/index/index.wxml`、`pages/index/index.wxss`、`CODEX_CHANGELOG.MD`
- 主要改动：关闭元素由 `button` 改为普通可点击 `view`，避免微信按钮默认样式影响位置；关闭 X 固定在公告卡片内侧右上角。
- 数据库/赛程/复盘：未修改比赛数据、赛程或复盘。
- 云函数：未修改微信云函数，不需要重新上传云函数。
- 服务器：未修改服务器运行代码，不需要重新部署服务器。
- 验证：待本地语法检查确认。
- 后续注意：本次为本地未提交改动；确认无误后再由用户决定是否提交 Git 和同步云服务器。

## 2026-06-18 18:38 - 公告关闭按钮改为红色 X 并增加 24 小时免打扰

- 环境：公司电脑 Codex
- 目的：按用户要求把公告关闭按钮改成右上角无边框红色 X，并避免用户关闭后短时间内重复弹出。
- 涉及文件：`pages/index/index.js`、`pages/index/index.wxss`、`CODEX_CHANGELOG.MD`
- 主要改动：公告关闭按钮改为右上角红色 `X`，去除边框、圆形背景和文字说明；关闭公告时写入本地时间戳，24 小时内再次进入首页不再显示公告。
- 数据库/赛程/复盘：未修改比赛数据、赛程或复盘。
- 云函数：未修改微信云函数，不需要重新上传云函数。
- 服务器：未修改服务器运行代码，不需要重新部署服务器。
- 验证：已运行首页相关 JS 语法检查和空白检查，未发现新增语法问题。
- 后续注意：本次为本地未提交改动；确认无误后再由用户决定是否提交 Git 和同步云服务器。

## 2026-06-18 18:32 - 调整公告关闭按钮和首页版本展示

- 环境：公司电脑 Codex
- 目的：按用户要求把公告关闭按钮改成醒目的 X，并调整首页标题下方文案、版本号和更新内容展示。
- 涉及文件：`pages/index/index.wxml`、`pages/index/index.wxss`、`utils/buildInfo.js`、`CODEX_CHANGELOG.MD`
- 主要改动：公告关闭按钮改为右上角红色圆形 X；首页副标题改为一行展示“近 7 天赛程、赛前判断和比分倾向，一键查看”；版本号改为 `1.1.0`；版本和预测模型之间新增“更新内容：加入必发成交量分析”。
- 数据库/赛程/复盘：赛程和复盘未新增；数据库更新时间改为 `6/18 18:32`。
- 云函数：未修改微信云函数，不需要重新上传云函数。
- 服务器：未修改服务器运行代码，不需要重新部署服务器。
- 验证：已运行首页相关 JS 语法检查、空白检查和版本徽标输出检查，版本显示为 `1.1.0`。
- 后续注意：本次为本地未提交改动；确认无误后再由用户决定是否提交 Git 和同步云服务器。

## 2026-06-18 18:24 - 公告弹窗去除黑色遮罩

- 环境：公司电脑 Codex
- 目的：修复首页公告弹出后页面发黑、用户看不到首页内容的问题。
- 涉及文件：`pages/index/index.wxss`、`CODEX_CHANGELOG.MD`
- 主要改动：公告容器去除全屏黑色蒙层，改为透明背景；公告卡片改为浅色底和深色正文；只让公告卡片本身接收点击，首页内容在公告周围保持可见。
- 数据库/赛程/复盘：未修改比赛数据、赛程或复盘。
- 云函数：未修改微信云函数，不需要重新上传云函数。
- 服务器：未修改服务器运行代码，不需要重新部署服务器。
- 验证：待本地语法检查确认。
- 后续注意：本次为本地未提交改动；确认无误后再由用户决定是否提交 Git 和同步云服务器。

## 2026-06-18 18:20 - 首页增加中部公告弹窗

- 环境：公司电脑 Codex
- 目的：按用户要求在进入首页后展示风险提示和本次版本更新说明，同时不遮满整个页面，让用户仍能看到首页部分内容。
- 涉及文件：`pages/index/index.js`、`pages/index/index.wxml`、`pages/index/index.wxss`、`utils/buildInfo.js`、`CODEX_CHANGELOG.MD`
- 主要改动：首页启动同步完成后弹出中部公告；公告提示 GPT 5.5 自动化分析仅作参考、不能作为投注意见、请勿参与非法赌博，并说明体育彩票为国内唯一正规渠道；版本更新说明加入必发交易量数据分析和场外因素分析；关闭按钮使用明显红色整宽按钮。
- 数据库/赛程/复盘：赛程和复盘未新增；数据库更新时间改为 `6/18 18:20`。
- 云函数：未修改微信云函数，不需要重新上传云函数。
- 服务器：未修改服务器运行代码，不需要重新部署服务器。
- 验证：已运行首页相关 JS 语法检查和空白检查，未发现新增语法问题。
- 后续注意：本次为本地未提交改动；确认无误后再由用户决定是否提交 Git 和同步云服务器。

## 2026-06-18 18:12 - 详情页预测信息去重并规范伤停依据

- 环境：公司电脑 Codex
- 目的：按用户要求优化详情页预测说明，避免胜平负重复展示必发成交量，补足亚盘让球依据，并把伤停与阵容影响归并成更专业的单一区块。
- 涉及文件：`utils/matches.js`、`utils/buildInfo.js`、`pages/detail/detail.wxml`、`pages/detail/detail.wxss`、`CODEX_CHANGELOG.MD`
- 主要改动：详情页删除重复的“伤停与预计阵容”卡片，改为“伤停及阵容影响”；新增公开参考标签，默认显示“无公开参考信息”；未来 48 小时内比赛的胜平负文案改为简短方向，必发成交量只在独立卡片展示；亚盘文案补充明确让球线；墨西哥、韩国、南非、加拿大、波黑、巴西、美国等相关球员伤停/红牌姓名和影响已写入详情页。
- 数据库/赛程/复盘：赛程和复盘未新增；预测展示字段和伤停影响说明已更新，数据库更新时间改为 `6/18 18:12`。
- 云函数：未修改微信云函数，不需要重新上传云函数。
- 服务器：未修改服务器运行代码，不需要重新部署服务器。
- 验证：已运行主要 JS 语法检查、服务器数据库快照生成和 48 小时内比赛字段抽查；快照仍为 52 场总比赛、30 场后续比赛、24 场复盘，胜平负、亚盘、伤停及公开参考字段均已生成。
- 后续注意：本次为本地未提交改动；确认无误后再由用户决定是否提交 Git 和同步云服务器。

## 2026-06-18 17:58 - 48小时内比赛加入必发成交量影响

- 环境：公司电脑 Codex
- 目的：按用户要求把未来 48 小时内比赛纳入 Betfair 分析，并在详情页靠前位置展示简短的必发成交量影响。
- 涉及文件：`utils/matches.js`、`utils/buildInfo.js`、`pages/detail/detail.wxml`、`pages/detail/detail.wxss`、`.codex-skills/football-match-predictor/SKILL.md`、`CODEX_CHANGELOG.MD`
- 主要改动：未来 48 小时内 8 场比赛补入/刷新 Betfair 市场快照和盘口结论；新增 `analysis.betfairImpact` 简短说明；详情页在概率卡片后、综合结论前展示“必发成交量影响”；预测 Skill 写入每日更新时 48 小时内比赛必须做 Betfair 分析的规则；数据库更新时间改为 `6/18 17:58`。
- 数据库/赛程/复盘：赛程和复盘未新增；未来 48 小时内未赛预测已按 Betfair 最新成交量重新校准。
- 云函数：未修改微信云函数，不需要重新上传云函数。
- 服务器：未修改服务器运行代码；本次 Betfair 数据只在本地用于预测，不把 SSOID 写入文件。
- 验证：已运行主要 JS 语法检查、服务器数据库快照生成和 48 小时内比赛抽查；快照仍为 52 场总比赛、30 场后续比赛、24 场复盘，未来 48 小时内 8 场均已生成 `analysis.betfairImpact`。
- 后续注意：本次为本地未提交改动；确认无误后再由用户决定是否提交 Git 和同步云服务器。

## 2026-06-18 17:50 - 使用本地 SSOID 重算今日四场 Betfair 预测

- 环境：公司电脑 Codex
- 目的：按用户提供的新 Betfair SSOID 在本地重新拉取今日/今晚四场比赛的盘口交易量，并更新本地小程序数据库。
- 涉及文件：`utils/matches.js`、`utils/buildInfo.js`、`CODEX_CHANGELOG.MD`
- 主要改动：更新捷克 vs 南非、瑞士 vs 波黑、加拿大 vs 卡塔尔、墨西哥 vs 韩国四场 Betfair 市场快照、盘口观点、风险点和伤停说明；数据库更新时间改为 `6/18 17:30`。
- 数据库/赛程/复盘：赛程和复盘未新增；四场未赛预测已按 Betfair 最新成交量和公开队伍消息重新校准。
- 云函数：未修改微信云函数，不需要重新上传云函数。
- 服务器：未修改服务器代码；本次 Betfair 数据只在本地用于预测，不把 SSOID 写入文件。
- 验证：已运行主要 JS 语法检查、服务器数据库快照生成和四场预测抽查；快照仍为 52 场总比赛、30 场后续比赛、24 场复盘，数据库更新时间显示 `6/18 17:30`。
- 后续注意：本次为本地未提交改动；确认无误后再由用户决定是否提交 Git 和同步云服务器。

## 2026-06-18 17:45 - 改为本地 SSOID 拉取 Betfair 并关闭服务器盘口同步

- 环境：公司电脑 Codex
- 目的：按用户要求改为每次本地预测时使用新 SSOID 获取 Betfair 数据，服务器不再默认维护 Betfair LIVE/盘口同步。
- 涉及文件：`server/src/index.js`、`server/src/dailyRefresh.js`、`server/src/buildDatabaseSnapshot.js`、`server/README.md`、`.codex-skills/football-match-predictor/SKILL.md`、`CODEX_CHANGELOG.MD`
- 主要改动：服务器 Betfair keepAlive/certlogin/sync 接口和定时同步默认关闭，仅在 `BETFAIR_SYNC_ENABLED=1` 时启用；数据库快照默认不再合并服务器旧 Betfair 缓存，仅在 `INCLUDE_BETFAIR_CACHE=1` 时启用；保留服务器实时比分 LIVE 更新；预测 Skill 写明 Betfair 优先由本地 Codex 使用用户当次提供的新 SSOID 拉取。
- 数据库/赛程/复盘：未修改比赛预测、赛程或复盘内容。
- 云函数：未修改微信云函数，不需要重新上传云函数。
- 服务器：修改了 `server/`，如采用本次改动需要重新部署轻量云服务器服务。
- 验证：待运行服务器和小程序主要 JS 检查、数据库快照生成。
- 后续注意：本次为本地未提交改动；不要把 SSOID、App Key、账号 token、证书或私钥写入 Git 或小程序包。

## 2026-06-18 17:30 - 兼容开发者工具缺失 Babel helper 的黑屏修复

- 环境：公司电脑 Codex
- 目的：处理微信开发者工具报 `babel_runtime_object_spread.js not found` 后首页黑屏的问题，避免小程序编译阶段依赖对象展开 helper。
- 涉及文件：`pages/index/index.js`、`pages/detail/detail.js`、`pages/history/history.js`、`utils/matches.js`、`utils/favorites.js`、`utils/remoteMatchDatabase.js`、`project.config.json`、`CODEX_CHANGELOG.MD`
- 主要改动：把小程序运行路径里的对象展开写法改为 `Object.assign`，把数组展开求最大/最小改为 `Math.min.apply` / `Math.max.apply`，移除空值合并语法；首页启动增加远程数据库阶段和总启动阶段兜底；远程数据库读取增加独立 4 秒兜底计时；小程序打包排除 `server/` 和 `.codex-skills/`，避免服务端脚本被开发者工具扫描转译。
- 数据库/赛程/复盘：未修改比赛预测、赛程或复盘内容。
- 云函数：未修改微信云函数，不需要重新上传云函数。
- 验证：已运行主要 JS 语法检查和服务器数据库快照生成；快照仍为 52 场总比赛、30 场后续比赛、24 场复盘。
- 后续注意：本次为本地未提交改动；需要在微信开发者工具重新编译验证。如仍出现同一个 `app.asar` 缺文件错误，应重装开发者工具或清理/切换基础库，因为日志已显示工具包自身文件缺失。

## 2026-06-18 17:28 - 修复开发者工具首页黑屏兜底

- 环境：公司电脑 Codex
- 目的：修复微信开发者工具中首页黑色启动遮罩可能一直停留、导致看不到页面的问题。
- 涉及文件：`pages/index/index.js`、`utils/remoteMatchDatabase.js`、`CODEX_CHANGELOG.MD`
- 主要改动：远程数据库请求增加 3.5 秒超时；首页启动阶段实时比分/球队数据同步增加 6 秒兜底，云端请求未返回时先显示本地静态数据库，避免黑屏卡死。
- 数据库/赛程/复盘：未修改比赛数据。
- 云函数：未修改微信云函数，不需要重新上传云函数。
- 验证：已运行首页、远程数据库工具和服务器快照检查；快照仍为 30 场后续比赛、24 场复盘。
- 后续注意：开发者工具重新编译或清缓存后应先看到本地 30 场后续比赛；云端恢复后会继续覆盖最新快照。

## 2026-06-18 17:18 - 明确每日预测重算规则

- 环境：公司电脑 Codex
- 目的：把每日使用预测 Skill 的规则写清楚，避免后续只追加新比赛、遗漏旧比赛重算或重复归档已复盘比赛。
- 涉及文件：`AGENTS.MD`、`.codex-skills/football-match-predictor/SKILL.md`、`CODEX_CHANGELOG.MD`
- 主要改动：明确每天先按北京时间确认当前日期；滚动 7 天窗口内所有未开赛和进行中的比赛都要按最新赔率、伤病、停赛、阵容和市场变化重新计算；每天追加新进入窗口的比赛；已归档复盘不重复处理，只归档新增完赛。
- 数据库/赛程/复盘：规则文档变更，本次不新增比赛数据。
- 云函数：未修改微信云函数，不需要重新上传云函数。
- 验证：已运行相关 JS 语法检查和服务器快照生成检查，快照仍为 30 场后续比赛、24 场复盘。
- 后续注意：每日自动任务必须按该规则执行，不能只在现有列表尾部补新比赛。

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
