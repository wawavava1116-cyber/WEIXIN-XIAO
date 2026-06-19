const DATABASE_VERSION = '1.1.0'
const DATABASE_UPDATED_AT = new Date('2026-06-19T15:09:00+08:00')

function pad(value) {
  return String(value).padStart(2, '0')
}

function getDatabaseUpdateText(date) {
  const beijingDate = new Date((date || DATABASE_UPDATED_AT).getTime() + 8 * 60 * 60 * 1000)
  return `${beijingDate.getUTCMonth() + 1}/${beijingDate.getUTCDate()} ${pad(beijingDate.getUTCHours())}:${pad(beijingDate.getUTCMinutes())}`
}

function getDatabaseBadge(date) {
  return `数据库更新：${getDatabaseUpdateText(date)} · 版本 ${DATABASE_VERSION}`
}

module.exports = {
  DATABASE_VERSION,
  DATABASE_UPDATED_AT,
  getDatabaseUpdateText,
  getDatabaseBadge
}
