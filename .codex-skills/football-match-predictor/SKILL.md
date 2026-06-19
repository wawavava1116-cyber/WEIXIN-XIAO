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
- `pick.result`: must contain only one main 1X2 pick, such as `巴西胜`, `平局`, or `哥伦比亚胜`. Do not write combined wording such as `平局优先，科特迪瓦不败` in this field.
- `pick.resultBackup`: detail-page optional result backup. Leave empty for strong favorites unless draw risk is meaningful. If the old wording is `平局优先，科特迪瓦不败`, split it into `pick.result: 平局` and `pick.resultBackup: 科特迪瓦胜`.
- `pick.score`: main score prediction.
- `pick.backup`: backup score prediction.
- `pick.total`: exactly one total-goals range. The range must span no more than 1 goal, such as `2-3球` or `3-4球`; invalid examples include `1-3球` and `2-4球`.
- `analysis.market.oneXtwo`: 1X2 market view.
- `analysis.market.handicap`: Asian handicap view.
- `analysis.market.total`: over-under view.
- `analysis.probability.result`: win/draw/loss percentage analysis for detail pages. Use integer percentages that total 100, with labels for home win, draw, and away win.
- `analysis.probability.goals`: expected goal-count percentage analysis for detail pages. Home side order is `3+`, `2`, `1`, `0`; away side order is `0`, `1`, `2`, `3+`. Use integer percentages and keep each side total at 100.
- Probability fields must be derived before final picks from objective inputs: market/handicap and total-goals view, FIFA or league ranking, squad market value, injuries and suspensions, recent form, head-to-head, venue/travel/context, and confirmed lineup news when available.
- Do not derive probabilities from `pick.result`, `pick.score`, or `pick.backup`. The final pick should follow the probability analysis, not the other way around.
- `analysis.order`: final market priority.
- `analysis.risk`: risk points.
- `finishedReviewSource`: finished match review and hit-rate fields.

## Research Checklist

Collect enough evidence for each section before deciding:

- Fixture: competition, date, kickoff, timezone conversion, venue, home/away status.
- Market: 1X2, Asian handicap, totals, and notable movement if available.
- Probability: estimate win/draw/loss and team goal-count percentages from market lines, ranking gap, squad value gap, injury/suspension impact, form, head-to-head, venue and travel. Record uncertainty when market or team-news sources are stale.
- Team form: recent 5-10 matches, goals for/against, clean sheets, opponent quality.
- Squad news: injuries, suspensions, expected goalkeeper, striker availability, tactical absences.
- Coach style: preferred tempo, pressing height, possession/directness, risk tolerance after taking the lead, substitution pattern, and whether the coach can keep a compact low block when outmatched.
- Attack/defense balance: chance creation quality, shot volume, conversion reliability, box defense, transition defense, goalkeeper reliability, set-piece attack/defense, and whether defensive errors snowball under pressure.
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
- The final structured pick should still be split into one main 1X2 pick and one optional backup. Do not store "unbeaten" as the final pick. Convert it into the implied backup side: for example, `平局优先，科特迪瓦不败` becomes main `平局`, backup `科特迪瓦胜`; `土耳其不败，倾向客胜` becomes main `土耳其胜`, backup `平局`.
- Avoid recommending a favorite at level ball/0 handicap when the market says that team is giving a meaningful line such as `-0.5`, `-0.75`, `-1`, or `-1.5`.
- If the line is deep, say whether the favorite can win but may not cover, or whether the handicap is too expensive.
- Do not force a draw backup for a strong favorite with a clear win edge.
- Use "no 1X2 backup" when the favorite is clearly superior.
- Keep backup only when draw probability is genuinely high or when the underdog profile supports resistance.
- Final picks must separate: 1X2 main pick, optional 1X2 backup, main score, backup score, Asian handicap lean, and over-under lean.
- Do not let score backup imply an unsupported 1X2 backup.

## Probability And Review Method

### Pre-match Probability Algorithm

When generating `analysis.probability`, build a weighted evidence model before final picks. Market-implied data remains important, but it must be calibrated against football factors such as scoring efficiency, injuries, form, coach structure, and context. Do not reverse-engineer probabilities from `pick.result`, `pick.score`, or `pick.backup`.

Evidence priority:

1. Correct-score odds.
2. Team total goals odds / team to score odds / clean-sheet odds.
3. 1X2, Asian handicap, over-under lines, and Betfair exchange market data.
4. Ranking, squad market value, injuries, suspensions, expected lineup, recent form, head-to-head, venue, travel, altitude, weather, and schedule context.

Recommended factor weights for database refreshes:

| Factor | Weight |
| --- | ---: |
| Correct-score odds | 12% |
| Goal efficiency / scoring rate / clean-sheet rate | 17% |
| 1X2 / Asian handicap / over-under market | 16% |
| Squad injuries and suspensions | 13% |
| Ranking / competition level / squad market value | 7% |
| Recent form | 10% |
| Coach style and tactical structure | 8% |
| Head-to-head | 3% |
| Venue / weather / travel / home-away context | 5% |
| Betfair back-lay book / traded volume / late market movement | 9% |

Weight handling rules:

- Use the table above as the default model whenever all source categories are available.
- If Betfair exchange data is unavailable, stale, too thin, not matched to the fixture, or access fails, remove the 9% Betfair factor and redistribute it evenly across the other nine factors.
- The no-Betfair fallback weights are:
  - Correct-score odds: 13%.
  - Goal efficiency / scoring rate / clean-sheet rate: 18%.
  - 1X2 / Asian handicap / over-under market: 17%.
  - Squad injuries and suspensions: 14%.
  - Ranking / competition level / squad market value: 8%.
  - Recent form: 11%.
  - Coach style and tactical structure: 9%.
  - Head-to-head: 4%.
  - Venue / weather / travel / home-away context: 6%.
- If another major source category is also unavailable, redistribute that category's weight across the remaining available factors in proportion to their current weights, and state the missing source in the risk notes.
- Do not silently treat missing Betfair data as neutral market support. Missing Betfair data means lower confidence, not zero market movement.

Betfair exchange data usage:

- For this project, Betfair should be fetched during local Codex prediction runs with the fresh SSOID provided by the user for that run.
- During every daily database refresh, all matches kicking off within the next 48 hours from the current Beijing time must include Betfair exchange analysis when a valid SSOID is available.
- For those next-48-hour matches, add a short `analysis.betfairImpact` sentence that explains how traded volume, back/lay probability, and delayed/thin data affected the pick. This sentence should be shown near the top of the detail page before the longer market cards.
- Do not rely on the cloud server to maintain a long-lived Betfair SSOID or to keep Betfair market sync alive by default; the server may be blocked by Betfair/Cloudflare and should not be treated as the authoritative Betfair source.
- After local Betfair analysis, write the calibrated conclusion into `utils/matches.js` and the generated database snapshot. Never persist the SSOID, App Key, account token, certificate, or secret into Git or mini program frontend code.
- Treat Betfair as a market-sentiment and liquidity signal, not a betting recommendation.
- Use only read-only market data: market catalogue, market book, back/lay prices, last traded price, total matched, in-play status, and delayed-data flag.
- Normalize best back/lay midpoint prices into implied home/draw/away probabilities after removing overround.
- Weight Betfair more when `totalMatched` is high and back/lay spreads are tight; reduce weight when data is delayed, stale, thin, or missing.
- Use Betfair to calibrate `analysis.probability.result`, `analysis.market.oneXtwo`, `analysis.order`, and risk notes.
- Do not expose App Key, SSOID, account tokens, or any secret in mini program frontend code, repository files, screenshots, or docs.
- If Betfair has no market for a fixture, explicitly treat the Betfair factor as unavailable and redistribute judgment to football factors; do not invent exchange prices.

Correct-score odds usage:

- Treat correct-score odds as the strongest direct signal for both result probability and team goal-count probability.
- Convert available correct-score odds into implied probabilities with `1 / odds`, then normalize after removing bookmaker margin when possible.
- Aggregate correct-score probabilities into win/draw/loss:
  - Home win: all scores where home goals > away goals.
  - Draw: all scores where home goals = away goals.
  - Away win: all scores where away goals > home goals.
- Aggregate the same correct-score table into team goal-count buckets:
  - Home buckets: `3+`, `2`, `1`, `0`.
  - Away buckets: `0`, `1`, `2`, `3+`.
- If exact score markets omit long-tail outcomes, distribute the missing tail carefully:
  - Strong favorite: tail mainly goes to favorite `3+` and underdog `0/1`.
  - Balanced match: tail should be spread across `1`, `2`, and draw-like outcomes.
  - Defensive/low-total match: do not over-allocate `3+`.

Team goal odds usage:

- Team total goals odds and "team to score / not score" markets are the main correction layer for expected goals.
- If underdog `team not to score` / opponent clean sheet is strongly priced, increase that team's `0` bucket and reduce `1`, `2`, `3+`.
- If a team `over 1.5 goals` is strongly priced, increase `2` and `3+`; if `under 0.5 goals` is strongly priced, increase `0`.
- Do not let a predicted backup score alone increase a team's scoring probability; only market/team-news evidence should do that.

Calibration rules:

- 1X2 and handicap should calibrate the result totals derived from correct-score odds. A deep favorite should not show high underdog unbeaten probability unless odds, injuries, red cards, or lineup news justify it.
- Over-under should calibrate the combined goal buckets. A low total line should suppress both teams' `3+`; a high total line can lift `2` and `3+`.
- Ranking and squad value adjust the market output only when odds are missing, stale, or clearly inconsistent with team news.
- Coach style and attack/defense balance must calibrate score and total-goals picks after the base result probability is set:
  - An attacking favorite plus an opponent that cannot sustain a low block can create blowout scorelines; raise the favorite `3+` bucket and consider larger main/backup scores.
  - A strong favorite with conservative match management, lower tempo, or an opponent with a compact defensive coach should not automatically be pushed to a big handicap score; prefer controlled scores such as `1-0`, `2-0`, or `2-1`.
  - If both coaches prefer aggressive pressing, vertical attacks, or loose rest-defense, increase both-teams-to-score and high-total tails.
  - If the favorite is likely to win but the opponent coach defends the box well, distinguish "win probability" from "handicap-cover probability".
  - If the underdog coach lacks the structure to defend deep and the team has weak box defense or error-prone buildup, do not understate favorite scoring volume just because the underdog is weaker on paper.
- Injury and suspension impact can override market priors when the missing player is a goalkeeper, core center back, defensive midfielder, captain, set-piece taker, or key attacker.
- Document uncertainty when score odds or team-goal odds are unavailable; do not invent odds.

For finished matches, use this hit-rate system:

- Result main pick hit: 100, result backup hit: 50, result miss: 0.
- Score main pick hit: 100, score backup hit: 50, score miss: 0.
- Total-goals range hit: 100, total-goals miss: 0. The range must be checked against the final score total. Example: `2-3球` misses `1-0` and `0-0`, but hits `1-1`, `2-1`, `2-0`, and `3-0`.
- Final percent uses weighted scoring: result weight 50%, score weight 30%, total-goals weight 20%.
- Review display should be compact: result as `胜（平）`, score as `1-1（2-1）`, and total goals as `进球数 2-3球`.
- Correct items are green; missed items are red.

Examples:

- Result main hit + score main hit + total-goals hit = 100%.
- Result main hit + score backup hit + total-goals hit = 85%.
- Result backup hit + score miss + total-goals hit = 45%.
- Result backup hit + score backup hit + total-goals hit = 60%.
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

胜平负百分比概率分析：
主胜：
平局：
客胜：

预期进球数分析：
主队 3+ / 2 / 1 / 0：
客队 0 / 1 / 2 / 3+：

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
- Before every daily refresh, determine the current Beijing date first. The prediction database must cover all World Cup matches in the rolling seven-calendar-day Beijing-time window starting today. For example, on Beijing date June 18, the static/remote prediction window should cover June 18 through June 25 Beijing time, after finished matches are archived.
- Do not let the prediction window remain anchored to an older fixture date. If the last upcoming match is earlier than today + 7 calendar days, add the missing fixtures and predictions before publishing.
- Do not merely append new fixtures during daily refreshes. Recalculate every not-started and in-play match inside the rolling seven-day window using the newest available odds, injuries, suspensions, lineups, form, weather, venue context, and market movement.
- The rolling window must move forward every day. Add newly included fixtures, remove or archive matches that have finished, and keep all retained future fixtures freshly recalculated.
- If a finished match was already archived in `finishedReviewSource` during a previous refresh, leave that review intact. Only newly finished matches should be added to the review/history data on the next refresh.
- Detail page may show backup result and backup score.
- Finished matches stay on homepage for at most 1 hour after final whistle.
- Finished matches should always remain in review and history pages.
- Before publishing refreshed predictions or adding future fixtures, audit all already-started and finished matches. Finished matches must be added to `finishedReviewSource`, marked out of `upcomingMatches` via `isFinished`, and must not remain on the homepage as not-started static fixtures.
- The homepage startup overlay should not be dismissed until the first live-score sync has completed, so live matches and matches finished within the last hour can display score, status, phase, and updated sort fields before users see the list.
- History page should display the latest 10 historical predictions by end time.
- Homepage match ordering must use `sortTime`, not plain text sorting.
- If cloud live-score data returns schedule or status, it should override static schedule display.
- Every database update must also update the `数据库更新` display time on both homepage and history page. This applies to changes in `utils/matches.js`, predictions, reviews, schedule, team data, focus priority, or injury impact notes.

## Decision Heuristics

- Strong favorite at home with stable defense: lean `2-0`, `2-1`, or `1-0`; be careful with large handicaps in openers.
- Favorite with attacking absences or conservative coach: prefer win plus low total rather than aggressive handicap.
- Favorite with an attack-minded coach, high shot volume, and opponent unable to park the bus: widen the favorite scoring tail and allow bigger main/backup scores.
- Strong favorite with conservative match management against a compact defensive coach: keep the result strong but cap the scoreline, usually `1-0`, `2-0`, or `2-1`, and avoid overstating total goals.
- If the favorite is dominant but the opponent coach is tactically mature and defends the box well, distinguish "win probability" from "handicap-cover probability".
- Underdog with fast transition forwards or strong set pieces: keep `2-1` and `1-1` live only if the match-up supports it.
- High altitude, heat, travel burden, or hostile venue usually favors the home side late, but may slow tempo early.
- Tournament openers often start cagey. Avoid forcing over unless both lineups clearly support it.

## Source Handling

- Use at least 3 source categories when possible: official schedule, live score or market source, team news or form source.
- Cite source names and links when browsing was used.
- If sources conflict, prefer the more specific and timely source, and note the conflict.
- Do not overquote articles. Summarize facts and keep direct quotations short.
