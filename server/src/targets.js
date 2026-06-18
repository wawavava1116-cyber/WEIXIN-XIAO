const fs = require('fs')
const path = require('path')

const TARGETS_FILE = path.resolve(__dirname, '..', 'config', 'targets.json')

function loadTargets() {
  const raw = fs.readFileSync(TARGETS_FILE, 'utf8')
  const targets = JSON.parse(raw)
  return targets.filter((target) => target && target.matchId && target.eventName)
}

function normalizeName(value) {
  return String(value || '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .trim()
}

function scoreEventMatch(eventName, target) {
  const event = normalizeName(eventName)
  const names = [
    normalizeName(target.eventName),
    `${normalizeName(target.home)} v ${normalizeName(target.away)}`,
    `${normalizeName(target.home)} vs ${normalizeName(target.away)}`,
    ...(Array.isArray(target.aliases) ? target.aliases.map(normalizeName) : [])
  ]
  if (names.some((name) => name && event === name)) return 100
  if (event.includes(normalizeName(target.home)) && event.includes(normalizeName(target.away))) return 80
  return 0
}

module.exports = {
  loadTargets,
  scoreEventMatch
}
