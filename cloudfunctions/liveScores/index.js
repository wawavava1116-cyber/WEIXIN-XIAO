const cloud = require('wx-server-sdk')
const https = require('https')

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV })

const ESPN_LEAGUES = ['fifa.world', 'fifa.world_cup']
const KNOWN_MATCHES = [
  { id: 'canada-bosnia-20260612', home: ['canada'], away: ['bosnia', 'bosnia herzegovina', 'bosnia and herzegovina'] },
  { id: 'usa-paraguay-20260612', home: ['usa', 'united states', 'united states of america'], away: ['paraguay'] },
  { id: 'haiti-scotland-20260613', home: ['haiti'], away: ['scotland'] },
  { id: 'australia-turkey-20260613', home: ['australia'], away: ['turkey', 'turkiye', 'türkiye'] },
  { id: 'brazil-morocco-20260613', home: ['brazil'], away: ['morocco'] },
  { id: 'qatar-switzerland-20260613', home: ['qatar'], away: ['switzerland'] },
  { id: 'ivorycoast-ecuador-20260614', home: ['cote divoire', "cote d'ivoire", 'ivory coast'], away: ['ecuador'] },
  { id: 'germany-curacao-20260614', home: ['germany'], away: ['curacao', 'curaçao'] },
  { id: 'netherlands-japan-20260614', home: ['netherlands'], away: ['japan'] },
  { id: 'sweden-tunisia-20260614', home: ['sweden'], away: ['tunisia'] },
  { id: 'saudi-uruguay-20260615', home: ['saudi arabia'], away: ['uruguay'] },
  { id: 'spain-caboverde-20260615', home: ['spain'], away: ['cabo verde', 'cape verde'] },
  { id: 'iran-newzealand-20260615', home: ['iran', 'ir iran'], away: ['new zealand'] },
  { id: 'belgium-egypt-20260615', home: ['belgium'], away: ['egypt'] },
  { id: 'france-senegal-20260616', home: ['france'], away: ['senegal'] },
  { id: 'iraq-norway-20260616', home: ['iraq'], away: ['norway'] },
  { id: 'argentina-algeria-20260616', home: ['argentina'], away: ['algeria'] },
  { id: 'austria-jordan-20260616', home: ['austria'], away: ['jordan'] },
  { id: 'ghana-panama-20260617', home: ['ghana'], away: ['panama'] },
  { id: 'england-croatia-20260617', home: ['england'], away: ['croatia'] },
  { id: 'portugal-congodr-20260617', home: ['portugal'], away: ['congo dr', 'dr congo', 'congo democratic republic'] },
  { id: 'uzbekistan-colombia-20260617', home: ['uzbekistan'], away: ['colombia'] },
  { id: 'czechia-southafrica-20260618', home: ['czechia', 'czech republic'], away: ['south africa'] },
  { id: 'switzerland-bosnia-20260618', home: ['switzerland'], away: ['bosnia', 'bosnia herzegovina', 'bosnia and herzegovina'] },
  { id: 'canada-qatar-20260618', home: ['canada'], away: ['qatar'] },
  { id: 'mexico-korea-20260618', home: ['mexico'], away: ['korea republic', 'south korea', 'korea'] },
  { id: 'brazil-haiti-20260619', home: ['brazil'], away: ['haiti'] },
  { id: 'scotland-morocco-20260619', home: ['scotland'], away: ['morocco'] },
  { id: 'turkey-paraguay-20260619', home: ['turkey', 'turkiye', 't眉rkiye'], away: ['paraguay'] },
  { id: 'usa-australia-20260619', home: ['usa', 'united states', 'united states of america'], away: ['australia'] },
  { id: 'netherlands-sweden-20260620', home: ['netherlands'], away: ['sweden'] },
  { id: 'germany-ivorycoast-20260620', home: ['germany'], away: ['cote divoire', "cote d'ivoire", 'ivory coast'] },
  { id: 'ecuador-curacao-20260620', home: ['ecuador'], away: ['curacao', 'curaçao'] },
  { id: 'tunisia-japan-20260620', home: ['tunisia'], away: ['japan'] },
  { id: 'spain-saudi-20260621', home: ['spain'], away: ['saudi arabia'] },
  { id: 'belgium-iran-20260621', home: ['belgium'], away: ['iran', 'ir iran'] },
  { id: 'uruguay-caboverde-20260621', home: ['uruguay'], away: ['cabo verde', 'cape verde'] },
  { id: 'newzealand-egypt-20260621', home: ['new zealand'], away: ['egypt'] },
  { id: 'norway-senegal-20260622', home: ['norway'], away: ['senegal'] },
  { id: 'france-iraq-20260622', home: ['france'], away: ['iraq'] },
  { id: 'jordan-algeria-20260622', home: ['jordan'], away: ['algeria'] },
  { id: 'argentina-austria-20260622', home: ['argentina'], away: ['austria'] },
  { id: 'croatia-panama-20260623', home: ['croatia'], away: ['panama'] },
  { id: 'ghana-england-20260623', home: ['ghana'], away: ['england'] },
  { id: 'colombia-congodr-20260623', home: ['colombia'], away: ['congo dr', 'dr congo', 'congo democratic republic'] },
  { id: 'portugal-uzbekistan-20260623', home: ['portugal'], away: ['uzbekistan'] },
  { id: 'korea-southafrica-20260624', home: ['korea republic', 'south korea', 'korea'], away: ['south africa'] },
  { id: 'mexico-czechia-20260624', home: ['mexico'], away: ['czechia', 'czech republic'] },
  { id: 'qatar-bosnia-20260624', home: ['qatar'], away: ['bosnia', 'bosnia herzegovina', 'bosnia and herzegovina'] },
  { id: 'canada-switzerland-20260624', home: ['canada'], away: ['switzerland'] },
  { id: 'scotland-brazil-20260624', home: ['scotland'], away: ['brazil'] },
  { id: 'morocco-haiti-20260624', home: ['morocco'], away: ['haiti'] },
  { id: 'ecuador-germany-20260625', home: ['ecuador'], away: ['germany'] },
  { id: 'curacao-ivorycoast-20260625', home: ['curacao', 'curaçao'], away: ['cote divoire', "cote d'ivoire", 'ivory coast'] },
  { id: 'japan-sweden-20260625', home: ['japan'], away: ['sweden'] },
  { id: 'tunisia-netherlands-20260625', home: ['tunisia'], away: ['netherlands'] },
  { id: 'turkey-usa-20260625', home: ['turkey', 'turkiye', 'türkiye'], away: ['usa', 'united states', 'united states of america'] },
  { id: 'paraguay-australia-20260625', home: ['paraguay'], away: ['australia'] }
]

function requestJson(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (response) => {
      let body = ''
      response.on('data', (chunk) => { body += chunk })
      response.on('end', () => {
        if (response.statusCode < 200 || response.statusCode >= 300) {
          reject(new Error(`HTTP ${response.statusCode}`))
          return
        }
        try { resolve(JSON.parse(body)) } catch (error) { reject(error) }
      })
    }).on('error', reject)
  })
}

function normalizeName(name) {
  return String(name || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/&/g, 'and').replace(/[^a-z0-9]+/g, ' ').trim()
}

function nameMatches(actual, aliases) {
  const normalizedActual = normalizeName(actual)
  return aliases.some((alias) => normalizedActual === normalizeName(alias))
}

function getCompetitorName(competitor) {
  const team = competitor.team || {}
  return team.displayName || team.name || team.shortDisplayName || team.abbreviation || ''
}

function findMatchId(homeName, awayName) {
  const match = KNOWN_MATCHES.find((item) => {
    const sameOrder = nameMatches(homeName, item.home) && nameMatches(awayName, item.away)
    const reversed = nameMatches(homeName, item.away) && nameMatches(awayName, item.home)
    return sameOrder || reversed
  })
  return match && match.id
}

function getScore(homeCompetitor, awayCompetitor) {
  return `${homeCompetitor.score || '0'}-${awayCompetitor.score || '0'}`
}

function getClockText(status) {
  const clock = String(status.displayClock || '').trim()
  if (!clock) return ''
  if (/^\d+\+\d+(:00)?$/.test(clock)) return `${clock.replace(':00', '')}'`
  if (/^\d+(:00)?$/.test(clock)) return `${parseInt(clock, 10)}'`
  return clock
}

function getPhaseText(status) {
  const type = status.type || {}
  const detail = [status.detail, status.shortDetail, status.description, status.displayClock, type.name, type.detail, type.shortDetail, type.description].filter(Boolean).join(' ')
  const period = Number(status.period || 0)
  if (type.state === 'pre') return ''
  if (type.state === 'post') return '全场结束'
  if (/half\s*time|halftime|half-time|half time|\bht\b|中场/i.test(detail)) return '中场休息'
  if (period === 1 && /^45(:00)?(\+|$)/.test(String(status.displayClock || ''))) return '中场休息'
  if (/penalt/i.test(detail)) return '点球大战'
  if (/extra|加时/i.test(detail)) return period >= 4 ? '加时赛下' : '加时赛上'
  if (period >= 2 || /2nd|second|下半场/i.test(detail)) return '下半场'
  return '上半场'
}

function getMatchStatus(status) {
  const state = status.type && status.type.state
  if (state === 'pre') return 'not_started'
  if (state === 'post') return 'finished'
  return 'live'
}

function getStatusText(status) {
  const matchStatus = getMatchStatus(status)
  if (matchStatus === 'not_started') return 'VS'
  if (matchStatus === 'finished') return '完赛'
  return '进行中'
}

function formatChinaSchedule(isoDate) {
  if (!isoDate) return {}
  const date = new Date(isoDate)
  if (Number.isNaN(date.getTime())) return {}
  const chinaDate = new Date(date.toLocaleString('en-US', { timeZone: 'Asia/Shanghai' }))
  const weekday = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'][chinaDate.getDay()] || ''
  const parts = new Intl.DateTimeFormat('zh-CN', { timeZone: 'Asia/Shanghai', month: 'numeric', day: 'numeric', hour: '2-digit', minute: '2-digit', hourCycle: 'h23' }).formatToParts(date)
  const getPart = (type) => (parts.find((item) => item.type === type) || {}).value || ''
  return {
    dateText: `${getPart('month')}月${getPart('day')}日 ${weekday}`,
    kickoff: `${getPart('hour')}:${getPart('minute')}`,
    scheduleAt: date.toISOString(),
    sortTime: date.getTime()
  }
}

function getDateWindow(matchIds = []) {
  const datesFromMatches = matchIds.map((id) => {
    const match = String(id).match(/-(\d{8})$/)
    return match && match[1]
  }).filter(Boolean)
  if (datesFromMatches.length) {
    const dates = []
    datesFromMatches.forEach((dateText) => {
      dates.push(dateText)
      const year = Number(dateText.slice(0, 4))
      const month = Number(dateText.slice(4, 6))
      const day = Number(dateText.slice(6, 8))
      const nextDate = new Date(Date.UTC(year, month - 1, day + 1))
      dates.push(`${nextDate.getUTCFullYear()}${String(nextDate.getUTCMonth() + 1).padStart(2, '0')}${String(nextDate.getUTCDate()).padStart(2, '0')}`)
    })
    return Array.from(new Set(dates))
  }
  const now = new Date()
  return [-1, 0, 1].map((offset) => {
    const date = new Date(now.getTime() + offset * 24 * 60 * 60 * 1000)
    return `${date.getUTCFullYear()}${String(date.getUTCMonth() + 1).padStart(2, '0')}${String(date.getUTCDate()).padStart(2, '0')}`
  })
}

function parseEspnEvent(event) {
  const competition = event.competitions && event.competitions[0]
  if (!competition || !competition.competitors) return null
  const home = competition.competitors.find((item) => item.homeAway === 'home') || competition.competitors[0]
  const away = competition.competitors.find((item) => item.homeAway === 'away') || competition.competitors[1]
  if (!home || !away) return null
  const id = findMatchId(getCompetitorName(home), getCompetitorName(away))
  if (!id) return null
  const status = competition.status || event.status || {}
  const matchStatus = getMatchStatus(status)
  const phaseText = getPhaseText(status)
  const chinaSchedule = formatChinaSchedule(event.date || competition.date)
  return {
    id,
    value: {
      matchStatus,
      statusText: getStatusText(status),
      liveScore: matchStatus === 'not_started' ? '' : getScore(home, away),
      matchClock: matchStatus === 'live' ? getClockText(status) : '',
      liveMinute: phaseText,
      phaseText,
      dateText: chinaSchedule.dateText,
      kickoff: chinaSchedule.kickoff,
      scheduleAt: chinaSchedule.scheduleAt,
      sortTime: chinaSchedule.sortTime,
      updatedAt: new Date().toISOString(),
      source: 'ESPN public scoreboard'
    }
  }
}

async function fetchEspnScores(matchIds = []) {
  const matches = {}
  const dates = getDateWindow(matchIds)
  const requests = []
  ESPN_LEAGUES.forEach((league) => {
    dates.forEach((date) => {
      const url = `https://site.api.espn.com/apis/site/v2/sports/soccer/${league}/scoreboard?dates=${date}`
      requests.push(
        requestJson(url).then((data) => {
        ;(data.events || []).forEach((event) => {
          const parsed = parseEspnEvent(event)
          if (parsed) matches[parsed.id] = parsed.value
        })
        }).catch(() => {
          // Try every public endpoint/date; a single failure should not block updates.
        })
      )
    })
  })
  await Promise.all(requests)
  return matches
}

exports.main = async (event = {}) => {
  const requestedIds = Array.isArray(event.matchIds) ? event.matchIds : []
  const allMatches = await fetchEspnScores(requestedIds)
  const matches = requestedIds.length ? requestedIds.reduce((result, id) => {
    if (allMatches[id]) result[id] = allMatches[id]
    return result
  }, {}) : allMatches
  return { updatedAt: new Date().toISOString(), matches }
}
