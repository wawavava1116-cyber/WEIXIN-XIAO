---
name: betfair-data-refresh
description: Standalone workflow for this World Cup mini program to refresh Betfair exchange data, append a comparison history sample, package and upload server/data/betfair-markets.json plus betfair-market-history.json, and verify detail-page 5/10-minute成交量/赔率变化. Use when the user asks to update 必发数据, 必发数据对比, Betfair history, 单独跑必发, 上传必发历史, or check whether 必发变化 displays.
---

# Betfair Data Refresh

## Scope

Use this skill only for the independent Betfair data path. It does not change match predictions, reviews, fixtures, or user data unless the user also requests those tasks.

Never save Betfair session tokens, app keys, passwords, certificates, private keys, `.env`, or `server/data/` into Git. Do not print tokens in final answers.

## Workflow

1. Confirm the project root is the mini program repository and read `AGENTS.md`.
2. Run the local server syntax check when code changed or when the environment is uncertain:
   - `cd server && npm run check`
3. Run one local Betfair sync with credentials provided by the user or already present in the local server environment:
   - set `BETFAIR_APP_KEY`
   - set `BETFAIR_SESSION_TOKEN`
   - normally set `BETFAIR_PROXY_ENABLED=0` for local runs if the local network can reach Betfair
   - run `cd server && npm run sync`
4. Confirm the current market snapshot has been appended into Betfair history so the mini program can compare the latest sample against the previous one:
   - current `server/src/syncOnce.js` already calls the store history append path during `npm run sync`; if the sync output shows `history.appended > 0`, do not append a duplicate sample
   - if you only imported or edited `server/data/betfair-markets.json` without running sync, from repo root run `node .codex-skills/betfair-data-refresh/scripts/append-current-history.js`
   - this reads `server/data/betfair-markets.json` and writes `server/data/betfair-market-history.json`
   - the server store archives samples under each match's kickoff date, and `/api/betfair/history` aggregates by `matchId` across dates when no `date` is provided
5. Package only runtime Betfair data:
   - `tar -czf <temp>/betfair-data-upload.tgz -C server/data betfair-markets.json betfair-market-history.json`
   - optionally base64 encode the tarball when pasting through a browser terminal
6. Upload to the cloud server data directory:
   - target directory: `/opt/worldcup-mini/server/data`
   - extract the tarball into that directory
   - reload the server service: `pm2 reload worldcup-betfair --update-env && pm2 save`
7. Verify with the cloud API:
   - `GET /api/betfair/history?matchIds=<id1>,<id2>&limit=2`
   - success means each checked match has `samples: 2` or more and the latest sample has `changes.totalMatchedDelta`
8. Keep cloud automatic Betfair sync disabled unless the user explicitly asks to re-enable it:
   - `.env` should normally keep `BETFAIR_SYNC_ENABLED=0` when cloud access to Betfair is unreliable
   - user-facing behavior is safe when sync is disabled; the app reads the uploaded history/current data

## Display Validation

The detail page needs at least two samples for the selected match to show a real comparison. If the page still shows only static text:

- Confirm `/api/betfair/history` returns samples for that exact `matchId`.
- Confirm the WeChat `apiProxy` cloud function has the `/api/betfair/history` whitelist deployed.
- Recompile the mini program preview after frontend changes.
- If runner-level成交变化 is zero but market-level `totalMatchedDelta` is nonzero, the frontend should use market-level delta for the visible "最大变化" line.

## Reporting

Report only the useful outcome:

- whether local sync succeeded
- how many history samples were appended
- whether cloud upload/reload succeeded
- a few match examples with sample count,成交额变化, and赔率变化

Do not paste credentials, base64 payloads, or full JSON responses unless the user asks for debugging detail.
