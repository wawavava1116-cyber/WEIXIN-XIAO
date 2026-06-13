---
name: football-match-predictor
description: Football match prediction workflow for soccer/association football. Use when updating this mini program's match database, predictions, reviews, score leans, Asian handicap view, over-under view, squad news, suspensions, or World Cup fixture analysis.
---

# Football Match Predictor

## Overview

Use this skill to produce and maintain sourced football match predictions for the World Cup mini program. The output can be used in `utils/matches.js`, detail pages, review data, and history records.

## Core Rules

- Browse current sources before updating predictions when network access is available. Fixtures, odds, injuries, lineups, weather, red cards, suspensions, and team news change often.
- Prefer primary or reputable sources: FIFA/league pages for schedules and venues; established scoreboard sources for live scores; reputable sports outlets for injuries, suspensions, and lineups.
- State exact match date, kickoff time, timezone conversion, venue, and competition.
- Separate facts from judgment. Label uncertain team news as questionable, expected, or unconfirmed.
- Do not present gambling advice as certainty. Include risk points and explain what would change the pick.
- If odds are unavailable or stale, say so and base the prediction on football factors rather than inventing prices.

## Data Update Targets

When updating this mini program, keep these fields consistent:

- `dateText`: Beijing time display, such as `6月14日 周日`.
- `kickoff`: Beijing time, such as `09:00`.
- `scheduleAt`: ISO-like schedule string or cloud score source timestamp.
- `sortTime`: numeric timestamp used for homepage ordering.
- `pick.result`: homepage main result pick only.
- `pick.resultBackup`: detail-page optional result backup. Leave empty for strong favorites unless draw risk is meaningful.
- `pick.score`: main score prediction.
- `pick.backup`: backup score prediction.
- `analysis.market.oneXtwo`: 1X2 market view.
- `analysis.market.handicap`: Asian handicap view.
- `analysis.market.total`: over-under view.
- `analysis.order`: final market priority.
- `analysis.risk`: risk points.
- `finishedReviewSource`: finished match review and hit-rate fields.

## Research Checklist

Collect enough evidence for each section before deciding:

- Fixture: competition, date, kickoff, timezone conversion, venue, home/away status.
- Market: 1X2, Asian handicap, totals, and notable movement if available.
- Team form: recent 5-10 matches, goals for/against, clean sheets, opponent quality.
- Squad news: injuries, suspensions, expected goalkeeper, striker availability, tactical absences.
- Tactical matchup: possession/directness, pressing, transition threat, set pieces, defensive weaknesses.
- Context: travel, altitude, climate, home advantage, opener pressure, rotation incentives.
- Head-to-head: use only as supporting context; warn when sample size is small or old.

## Suspension And Red Card Rules

- Always check red cards and suspensions from the previous match before predicting the next fixture.
- If a team had multiple players sent off, identify which suspended players will miss the next match.
- Analyze each missing player's role importance: starter or rotation player, position, minutes, captaincy, set-piece role, defensive anchor, ball progression, pressing, or chance creation.
- Explain how suspensions affect defensive structure, pressing intensity, transition coverage, ball progression, set-piece defending, squad depth, and likely formation changes.
- Confirmed suspensions must be reflected in squad news, final pick, score lean, handicap view, total goals view, and risk points.

## Asian Handicap Discipline

- The handicap side and 1X2 wording must agree.
- A favorite or handicap-giving side should be predicted as win, cover, or scoreline; do not call the favorite "unbeaten".
- "Unbeaten" is only appropriate for an underdog or handicap-receiving side when the football and market view support win-or-draw protection.
- Avoid recommending a favorite at level ball/0 handicap when the market says that team is giving a meaningful line such as `-0.5`, `-0.75`, `-1`, or `-1.5`.
- If the line is deep, say whether the favorite can win but may not cover, or whether the handicap is too expensive.
- Do not force a draw backup for a strong favorite with a clear win edge.
- Use "no 1X2 backup" when the favorite is clearly superior.
- Keep backup only when draw probability is genuinely high or when the underdog profile supports resistance.
- Final picks must separate: 1X2 main pick, optional 1X2 backup, main score, backup score, Asian handicap lean, and over-under lean.
- Do not let score backup imply an unsupported 1X2 backup.

## Probability And Review Method

For finished matches, use this hit-rate system:

- Result main pick hit: 100.
- Result backup hit: 50.
- Result miss: 0.
- Score main pick hit: 100.
- Score backup hit: 50.
- Score miss: 0.
- Final percent is the average of result weight and score weight.

Examples:

- Result main hit + score main hit = 100%.
- Result main hit + score backup hit = 75%.
- Result backup hit + score miss = 25%.
- Result backup hit + score backup hit = 50%.
- Both miss = 0%.

Color levels:

- 100%: green.
- 75%: yellow.
- 50%: orange.
- 25% or 0%: red.

## Chinese Output Structure

When writing or updating analysis text, use concise Chinese:

```markdown
综合结论：主选胜/平/负，主比分 X-X，备用比分 X-X。总进球 X-Y。

市场观点
胜平负：
亚盘：
大小球：

球队状态
主队：
客队：

伤停与预计阵容
主队：
客队：

战术与比赛环境

交锋参考

最终倾向
胜平负首选：
胜平负备选：
主比分：
备用比分：
总进球：
市场顺序：
风险点：
```

## Mini Program Specific Rules

- Homepage should show only the main result pick, not the backup result pick.
- Detail page may show backup result and backup score.
- Finished matches stay on homepage for at most 1 hour after final whistle.
- Finished matches should always remain in review and history pages.
- History page should display the latest 10 historical predictions by end time.
- Homepage match ordering must use `sortTime`, not plain text sorting.
- If cloud live-score data returns schedule or status, it should override static schedule display.
- Every database update must also update the `数据库更新` display time on both homepage and history page. This applies to changes in `utils/matches.js`, predictions, reviews, schedule, team data, focus priority, or injury impact notes.

## Decision Heuristics

- Strong favorite at home with stable defense: lean `2-0`, `2-1`, or `1-0`; be careful with large handicaps in openers.
- Favorite with attacking absences or conservative coach: prefer win plus low total rather than aggressive handicap.
- Underdog with fast transition forwards or strong set pieces: keep `2-1` and `1-1` live only if the match-up supports it.
- High altitude, heat, travel burden, or hostile venue usually favors the home side late, but may slow tempo early.
- Tournament openers often start cagey. Avoid forcing over unless both lineups clearly support it.

## Source Handling

- Use at least 3 source categories when possible: official schedule, live score or market source, team news or form source.
- Cite source names and links when browsing was used.
- If sources conflict, prefer the more specific and timely source, and note the conflict.
- Do not overquote articles. Summarize facts and keep direct quotations short.
