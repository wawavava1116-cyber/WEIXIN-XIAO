#!/usr/bin/env bash
set -euo pipefail

APP_DIR="${APP_DIR:-/opt/worldcup-mini}"
BRANCH="${BRANCH:-master}"
SERVICE_NAME="${SERVICE_NAME:-worldcup-betfair}"

cd "$APP_DIR"
git fetch origin "$BRANCH"
git checkout "$BRANCH"
git pull --ff-only origin "$BRANCH"

cd "$APP_DIR/server"
npm install --omit=dev
npm run check
npm run daily

if command -v pm2 >/dev/null 2>&1; then
  pm2 describe "$SERVICE_NAME" >/dev/null 2>&1 && pm2 reload "$SERVICE_NAME" || pm2 start src/index.js --name "$SERVICE_NAME"
  pm2 save
fi
