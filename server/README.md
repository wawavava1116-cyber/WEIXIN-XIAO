# Betfair Server

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
```

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
