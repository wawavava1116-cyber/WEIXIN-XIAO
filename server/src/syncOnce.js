const { loadDotenvFile } = require('./env')
const { callBettingApi, keepAlive, certLogin } = require('./betfairClient')
const { loadTargets, scoreEventMatch } = require('./targets')
const { appendMarketHistory, upsertMarkets } = require('./store')

loadDotenvFile()

function toIsoAfterDays(days) {
  return new Date(Date.now() + days * 24 * 60 * 60 * 1000).toISOString()
}

function impliedProbability(price) {
  const value = Number(price)
  if (!value || value <= 1) return 0
  return 1 / value
}

function normalizeProbabilities(runners) {
  const values = runners.map((runner) => impliedProbability(runner.lastPriceTraded))
  const total = values.reduce((sum, value) => sum + value, 0)
  if (!total) return runners.map(() => 0)
  return values.map((value) => Number((value * 100 / total).toFixed(1)))
}

function summarizeRunner(runner, catalogueRunner) {
  const back = runner.ex && runner.ex.availableToBack && runner.ex.availableToBack[0]
  const lay = runner.ex && runner.ex.availableToLay && runner.ex.availableToLay[0]
  const tradedVolume = runner.ex && Array.isArray(runner.ex.tradedVolume)
    ? runner.ex.tradedVolume.reduce((sum, item) => sum + Number(item.size || 0), 0)
    : 0
  return {
    selectionId: runner.selectionId,
    name: catalogueRunner ? catalogueRunner.runnerName : '',
    lastPriceTraded: runner.lastPriceTraded || null,
    totalMatched: runner.totalMatched || 0,
    tradedVolume,
    back: back ? { price: back.price, size: back.size } : null,
    lay: lay ? { price: lay.price, size: lay.size } : null
  }
}

async function ensureSession() {
  try {
    return await keepAlive()
  } catch (error) {
    if (process.env.BETFAIR_CERT_PATH && process.env.BETFAIR_KEY_PATH) {
      return certLogin()
    }
    throw error
  }
}

async function findMarketForTarget(target) {
  const catalogues = await callBettingApi('listMarketCatalogue', {
    filter: {
      eventTypeIds: ['1'],
      marketTypeCodes: [target.marketType || 'MATCH_ODDS'],
      marketStartTime: {
        from: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
        to: toIsoAfterDays(14)
      }
    },
    marketProjection: ['EVENT', 'COMPETITION', 'MARKET_START_TIME', 'RUNNER_DESCRIPTION'],
    sort: 'FIRST_TO_START',
    maxResults: '200'
  })

  return catalogues
    .map((item) => ({ item, score: scoreEventMatch(item.event && item.event.name, target) }))
    .filter((entry) => entry.score > 0)
    .sort((a, b) => b.score - a.score)[0]
}

async function syncBetfairMarkets() {
  await ensureSession()
  const targets = loadTargets()
  const synced = []

  for (const target of targets) {
    const match = await findMarketForTarget(target)
    if (!match) {
      synced.push({
        matchId: target.matchId,
        eventName: target.eventName,
        status: 'NOT_FOUND',
        updatedAt: new Date().toISOString()
      })
      continue
    }

    const catalogue = match.item
    const books = await callBettingApi('listMarketBook', {
      marketIds: [catalogue.marketId],
      priceProjection: {
        priceData: ['EX_BEST_OFFERS', 'EX_TRADED']
      }
    })
    const book = books && books[0]
    const runners = (book && book.runners ? book.runners : []).map((runner) => {
      const catalogueRunner = (catalogue.runners || []).find((item) => item.selectionId === runner.selectionId)
      return summarizeRunner(runner, catalogueRunner)
    })
    const probabilities = normalizeProbabilities(runners)
    runners.forEach((runner, index) => {
      runner.probability = probabilities[index]
    })

    synced.push({
      matchId: target.matchId,
      eventName: catalogue.event && catalogue.event.name,
      competition: catalogue.competition && catalogue.competition.name,
      marketId: catalogue.marketId,
      marketName: catalogue.marketName,
      marketStartTime: catalogue.marketStartTime,
      status: book && book.status,
      inplay: Boolean(book && book.inplay),
      delayed: Boolean(book && book.isMarketDataDelayed),
      totalMatched: book ? book.totalMatched : catalogue.totalMatched,
      totalAvailable: book ? book.totalAvailable : null,
      runners,
      updatedAt: new Date().toISOString()
    })
  }

  const store = upsertMarkets(synced)
  const history = appendMarketHistory(synced)
  return {
    ...store,
    history: {
      updatedAt: history.updatedAt || '',
      dateKey: history.dateKey || '',
      appended: history.appended || 0
    }
  }
}

if (require.main === module) {
  syncBetfairMarkets()
    .then((result) => {
      console.log(JSON.stringify(result, null, 2))
    })
    .catch((error) => {
      console.error(error.message)
      process.exit(1)
    })
}

module.exports = {
  syncBetfairMarkets
}
