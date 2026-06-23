const DATABASE_VERSION = '1.1.0'
const DATABASE_UPDATED_AT = new Date('2026-06-23T22:37:00+08:00')

function pad(value) {
  return String(value).padStart(2, '0')
}

function getValidDate(date) {
  const nextDate = date ? new Date(date) : DATABASE_UPDATED_AT
  return Number.isNaN(nextDate.getTime()) ? DATABASE_UPDATED_AT : nextDate
}

function getDatabaseUpdateText(date) {
  const beijingDate = new Date(getValidDate(date).getTime() + 8 * 60 * 60 * 1000)
  return `${beijingDate.getUTCMonth() + 1}/${beijingDate.getUTCDate()} ${pad(beijingDate.getUTCHours())}:${pad(beijingDate.getUTCMinutes())}`
}

function getDatabaseBadge(date, version) {
  return `\u6570\u636e\u5e93\u66f4\u65b0\uff1a${getDatabaseUpdateText(date)} \u00b7 \u7248\u672c ${version || DATABASE_VERSION}`
}

module.exports = {
  DATABASE_VERSION,
  DATABASE_UPDATED_AT,
  getDatabaseUpdateText,
  getDatabaseBadge
}
