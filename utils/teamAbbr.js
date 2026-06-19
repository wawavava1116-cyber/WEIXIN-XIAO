const TEAM_ABBR = {
  Argentina: 'ARG',
  Australia: 'AUS',
  Austria: 'AUT',
  Belgium: 'BEL',
  'Bosnia and Herzegovina': 'BIH',
  Brazil: 'BRA',
  Canada: 'CAN',
  'Cabo Verde': 'CPV',
  Colombia: 'COL',
  'Congo DR': 'COD',
  "Cote d'Ivoire": 'CIV',
  Croatia: 'CRO',
  Curacao: 'CUW',
  Czechia: 'CZE',
  Ecuador: 'ECU',
  England: 'ENG',
  France: 'FRA',
  Germany: 'GER',
  Ghana: 'GHA',
  Haiti: 'HAI',
  Iran: 'IRN',
  Iraq: 'IRQ',
  Japan: 'JPN',
  Jordan: 'JOR',
  'Korea Republic': 'KOR',
  Mexico: 'MEX',
  Morocco: 'MAR',
  Netherlands: 'NED',
  'New Zealand': 'NZL',
  Norway: 'NOR',
  Panama: 'PAN',
  Paraguay: 'PAR',
  Portugal: 'POR',
  Qatar: 'QAT',
  'Saudi Arabia': 'KSA',
  Scotland: 'SCO',
  Senegal: 'SEN',
  'South Africa': 'RSA',
  Spain: 'ESP',
  Sweden: 'SWE',
  Switzerland: 'SUI',
  Tunisia: 'TUN',
  Turkey: 'TUR',
  'Türkiye': 'TUR',
  Uruguay: 'URU',
  Uzbekistan: 'UZB',
  'United States': 'USA'
}

function getTeamAbbr(team) {
  if (!team) return ''
  return TEAM_ABBR[team.en] || String(team.abbr || team.en || team.cn || '')
    .replace(/[^A-Za-z]/g, '')
    .slice(0, 3)
    .toUpperCase()
}

module.exports = {
  getTeamAbbr,
  TEAM_ABBR
}
