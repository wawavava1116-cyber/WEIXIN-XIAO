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

本地拉取 Betfair 后上传到云服务器：

```bash
# 云服务器 .env：只需要设置接收上传的 token，继续保持 BETFAIR_SYNC_ENABLED=0。
BETFAIR_UPLOAD_TOKEN=一段随机长密钥
INCLUDE_BETFAIR_CACHE=1

# 本地 .env：使用本地可联网环境和当次有效 SSOID 拉取 Betfair，再上传到云。
BETFAIR_APP_KEY=你的 App Key
BETFAIR_SESSION_TOKEN=当前有效 SSOID
BETFAIR_UPLOAD_TOKEN=与云服务器一致的随机长密钥
BETFAIR_UPLOAD_URL=https://你的服务器域名/api/betfair/markets/import
```

执行：

```bash
npm run sync:upload
```

流程是本地执行 Betfair `listMarketCatalogue/listMarketBook`，把生成的盘口缓存上传到云端 `/api/betfair/markets/import`；云端只校验 `BETFAIR_UPLOAD_TOKEN`、写入 `server/data/betfair-markets.json`、追加 `server/data/betfair-market-history.json`，并重建 `/api/database/latest` 使用的数据库快照。不要把 `BETFAIR_UPLOAD_TOKEN`、SSOID、App Key、证书或私钥写入仓库。如果临时使用服务器 IP 或自签证书，本地可设置 `BETFAIR_UPLOAD_INSECURE=1`；正式域名证书下应保持 `0`。

读取缓存：

```bash
curl "http://127.0.0.1:8787/api/betfair/markets"
curl "http://127.0.0.1:8787/api/betfair/markets?matchIds=mexico-korea-20260618"
```

读取必发盘口变化记录：

```bash
curl "http://127.0.0.1:8787/api/betfair/history"
curl "http://127.0.0.1:8787/api/betfair/history?date=2026-06-21&matchIds=spain-saudi-20260621&limit=20"
```

服务启动后，如果 `BETFAIR_SYNC_ENABLED=1`，会按 `BETFAIR_SYNC_INTERVAL_MS` 自动同步必发盘口；默认 `300000` 毫秒，即每 5 分钟一次。每次同步会覆盖最新缓存 `server/data/betfair-markets.json`，同时把北京时间当日比赛追加到 `server/data/betfair-market-history.json`，记录成交额、胜平负赔率、概率和相对上一条的变化。`BETFAIR_HISTORY_RETENTION_DAYS` 默认保留 14 天。

如果云服务器直连 Betfair 受限，可以只给 Betfair 请求启用 HTTP/SOCKS5 代理池；小程序数据库、用户、实时比分等其它接口不会走代理。`BETFAIR_PROXY_ENABLED=1` 后默认使用 Proxifly GitHub raw HTTP/SOCKS5 列表和 ProxyScrape 免费 HTTP/SOCKS5 API；也可以手动填写代理列表或替换成返回 `ip:port`、`http://ip:port` 或 `socks5://ip:port` 文本的公开代理源：

```bash
BETFAIR_PROXY_ENABLED=1
BETFAIR_PROXY_URLS=http://1.2.3.4:8080,http://user:pass@5.6.7.8:3128
# 留空时自动使用内置公共 HTTP/SOCKS5 代理源。
BETFAIR_PROXY_SOURCES=https://example.com/socks5.txt
BETFAIR_PROXY_ATTEMPTS=5
BETFAIR_PROXY_CACHE_MS=600000
BETFAIR_PROXY_MAX_CANDIDATES=200
```

当前支持 HTTP 代理的 `CONNECT` 隧道和 `socks5://` 代理。公开代理池稳定性差，建议只作为临时尝试。默认源：

- `https://raw.githubusercontent.com/proxifly/free-proxy-list/main/proxies/protocols/http/data.txt`
- `https://raw.githubusercontent.com/proxifly/free-proxy-list/main/proxies/protocols/socks5/data.txt`
- `https://api.proxyscrape.com/v4/free-proxy-list/get?request=display_proxies&protocol=http&proxy_format=protocolipport&format=text&timeout=15000`
- `https://api.proxyscrape.com/v4/free-proxy-list/get?request=display_proxies&protocol=socks5&proxy_format=protocolipport&format=text&timeout=15000`

如果云服务器无法直连 GitHub raw，可以把 `BETFAIR_PROXY_SOURCES` 改成 GitHub raw 镜像地址，例如：

```bash
BETFAIR_PROXY_SOURCES=https://gh-proxy.com/https://raw.githubusercontent.com/proxifly/free-proxy-list/main/proxies/protocols/socks5/data.txt
BETFAIR_PROXY_ATTEMPTS=30
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
