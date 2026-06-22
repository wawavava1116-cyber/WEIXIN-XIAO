#!/usr/bin/env node

const fs = require('fs')
const path = require('path')

function findRepoRoot() {
  let current = process.cwd()
  while (current && current !== path.dirname(current)) {
    if (fs.existsSync(path.join(current, 'server', 'src', 'store.js'))) return current
    current = path.dirname(current)
  }
  throw new Error('Run this script from the mini program repository or one of its subdirectories.')
}

const repoRoot = findRepoRoot()
const storePath = path.join(repoRoot, 'server', 'data', 'betfair-markets.json')
const { appendMarketHistory, getMarketHistory } = require(path.join(repoRoot, 'server', 'src', 'store'))

if (!fs.existsSync(storePath)) {
  throw new Error(`Missing Betfair market cache: ${storePath}`)
}

const data = JSON.parse(fs.readFileSync(storePath, 'utf8'))
const markets = Object.values(data.markets || {})
  .filter((market) => market && market.matchId && market.marketId)

const result = appendMarketHistory(markets, { now: new Date() })
const history = getMarketHistory({ limit: 2 })
const ids = Object.keys(history.markets || {})

const sampleSummary = ids.slice(0, 8).map((id) => {
  const samples = history.markets[id] || []
  const latest = samples[samples.length - 1] || {}
  return {
    id,
    samples: samples.length,
    totalMatched: latest.totalMatched || 0,
    totalMatchedDelta: latest.changes && latest.changes.totalMatchedDelta || 0,
    recordedAt: latest.recordedAt || ''
  }
})

console.log(JSON.stringify({
  ok: true,
  updatedAt: result.updatedAt,
  dateKey: result.dateKey,
  appended: result.appended,
  matchCount: ids.length,
  sampleSummary
}, null, 2))
