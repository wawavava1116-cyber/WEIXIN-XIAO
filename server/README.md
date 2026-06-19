# Betfair Server

当前项目策略：Betfair 盘口/交易量优先在本地 Codex 预测流程中使用用户当次提供的新 SSOID 拉取，分析结论写入 `utils/matches.js` 后再发布。云服务器默认不维护长期 Betfair SSOID，也不自动同步 Betfair 盘口；只负责 `/api/database/latest` 数据库快照和实时比分 LIVE 更新。

如以后确需恢复服务器 Betfair 同步，需要显式设置：

```bash
BETFAIR_SYNC_ENABLED=1
INCLUDE_BETFAIR_CACHE=1
```

这个目录用于部署到轻量云服务器。小程序前端仍然通过微信开发者工具上传；服务器只负责 Betfair 会话续期、盘口交易量同步和缓存 API。

## 服务器要求

- Ubuntu 22.04 LTS 或 24.04 LTS
- Node.js 18+
- 一个可用于微信小程序 request 合法域名的 HTTPS 域名
- 可选：PM2、Nginx、SSL 证书

## 部署步骤

```bash
cd /opt/worldcup-mini/server
cp .env.example .env
nano .env
npm install
npm run check
npm start
```

`.env` 至少需要：

```bash
BETFAIR_APP_KEY=你的 App Key
BETFAIR_SESSION_TOKEN=当前有效 SSOID
WECHAT_APP_ID=你的小程序 AppID
WECHAT_APP_SECRET=你的小程序 AppSecret
PUBLIC_BASE_URL=https://你的服务器 HTTPS 域名
```

`WECHAT_APP_SECRET` 必须填写微信公众平台里当前小程序的 AppSecret。没有这个值时，`/api/auth/wechat-login` 无法用 `wx.login` 返回的 code 换取 openid，手机端会提示微信身份暂不可用。

长期稳定运行时，建议配置证书登录：

```bash
BETFAIR_USERNAME=你的 Betfair 用户名
BETFAIR_PASSWORD=你的 Betfair 密码
BETFAIR_CERT_PATH=/etc/betfair/client-2048.crt
BETFAIR_KEY_PATH=/etc/betfair/client-2048.key
```

不要把 `.env`、`.crt`、`.key` 提交到 Git。

## API

健康检查：

```bash
curl http://127.0.0.1:8787/health
```

手动续期：

```bash
curl -X POST http://127.0.0.1:8787/api/betfair/keepalive
```

手动同步：

```bash
curl -X POST http://127.0.0.1:8787/api/betfair/sync
```

读取缓存：

```bash
curl "http://127.0.0.1:8787/api/betfair/markets"
curl "http://127.0.0.1:8787/api/betfair/markets?matchIds=mexico-korea-20260618"
```

读取小程序数据库快照：

```bash
curl "http://127.0.0.1:8787/api/database/latest"
```

用户接口：

```bash
curl -X POST http://127.0.0.1:8787/api/users/guest \
  -H "Content-Type: application/json" \
  -d '{"guestId":"local-device-id"}'

curl -X POST http://127.0.0.1:8787/api/auth/wechat-login \
  -H "Content-Type: application/json" \
  -d '{"code":"wx.login 返回的 code"}'
```

小程序端保存微信昵称时会调用，头像是可选展示字段：

```text
POST /api/users/me/profile
Authorization: Bearer <token>
JSON: nickname, avatarUrl（可选）
multipart/form-data: avatar（可选）, nickname
```

用户资料保存在 `server/data/users.json`，如用户上传头像则保存在 `server/data/avatars/`。这两个路径属于运行时数据，不要提交到 Git。

用户预测接口：

```text
GET  /api/users/me/predictions
POST /api/users/me/predictions
GET  /api/predictions/rankings
Authorization: Bearer <token>
```

`/api/users/me/predictions` 只允许已经完成微信身份和昵称的微信用户使用，游客会返回 `PROFILE_REQUIRED`。预测记录保存到 `server/data/predictions.json`，服务端会按最新 `/api/database/latest` 里的完赛复盘结算近 10 次预测准确率和全站排名。命中率规则为：胜平负主选 100、备选 50；比分主选 100、备选 50；进球数命中 100；最终按胜平负 50%、比分 30%、进球数 20% 加权。

小组预测接口：

```text
POST /api/prediction-groups
GET  /api/prediction-groups/:id
POST /api/prediction-groups/:id/join
POST /api/prediction-groups/:id/predictions
Authorization: Bearer <token>（创建、加入、提交需要已完成微信身份和昵称的微信用户）
```

小组预测同样写入 `server/data/predictions.json`。支持 2 人、5 人、10 人小组；小程序通过分享链接打开 `GET /api/prediction-groups/:id` 读取小组信息，加入和提交时再校验微信身份和昵称。小组进度按 `已提交人数/小组人数` 返回；所有成员完成预测且比赛可结算后，5 人和 10 人小组按同一命中率规则发放金牌、银牌、铜牌，2 人小组不发排名奖牌。

生成数据库快照：

```bash
npm run snapshot
```

执行每日刷新：

```bash
npm run daily
```

## PM2

```bash
npm install -g pm2
pm2 start src/index.js --name worldcup-betfair
pm2 save
pm2 startup
```

## 每天中午 12 点自动刷新

服务器使用北京时间时：

```bash
crontab -e
```

加入：

```cron
0 12 * * * cd /opt/worldcup-mini/server && /usr/bin/npm run daily >> /var/log/worldcup-betfair-daily.log 2>&1
```

如果服务器是 UTC 时区，需要先设置时区：

```bash
sudo timedatectl set-timezone Asia/Shanghai
```

注意：`npm run daily` 会执行 Betfair 同步并生成 `/api/database/latest` 使用的数据库快照。它不会自动凭空生成新预测文本；新增赛程和预测内容需要接入预测生成任务或人工审核后写入快照。

## 方案 B：Codex 更新 Git，服务器拉取发布

推荐流程：

1. Codex 自动任务每天读取 `AGENTS.MD` 和预测 Skill。
2. Codex 更新 `utils/matches.js`、`utils/buildInfo.js`、`server/config/targets.json` 和 `CODEX_CHANGELOG.MD`。
3. Codex 提交并推送到 `origin/master`。
4. 服务器定时拉取 Git，并执行 `npm run daily` 生成 `/api/database/latest`。

服务器脚本：

```bash
chmod +x /opt/worldcup-mini/server/scripts/update-from-git.sh
```

如果 Codex 任务设置在每天 12:00 执行，服务器建议 12:15 拉取发布：

```cron
15 12 * * * APP_DIR=/opt/worldcup-mini BRANCH=master /opt/worldcup-mini/server/scripts/update-from-git.sh >> /var/log/worldcup-git-refresh.log 2>&1
```

## Nginx 反向代理示例

```nginx
server {
  listen 80;
  server_name api.example.com;

  location / {
    proxy_pass http://127.0.0.1:8787;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
  }
}
```

上线给小程序用时必须配置 HTTPS，并在微信公众平台后台添加 request 合法域名。

## 比赛映射

同步目标在：

```text
server/config/targets.json
```

如果 Betfair 页面里的队名和小程序队名不一致，优先调整这里的 `eventName`、`home`、`away`。
