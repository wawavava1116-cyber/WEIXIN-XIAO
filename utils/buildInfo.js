const DATABASE_VERSION = '1.0.2'

function pad(value) {
  return String(value).padStart(2, '0')
}

function getDatabaseUpdateText(date) {
  const beijingDate = new Date((date || new Date()).getTime() + 8 * 60 * 60 * 1000)
  return `${beijingDate.getUTCMonth() + 1}/${beijingDate.getUTCDate()} ${pad(beijingDate.getUTCHours())}:${pad(beijingDate.getUTCMinutes())}`
}

function getDatabaseBadge(date) {
  return `数据库更新：${getDatabaseUpdateText(date)} · 版本 ${DATABASE_VERSION}`
}

module.exports = {
  DATABASE_VERSION,
  getDatabaseUpdateText,
  getDatabaseBadge
}
