const { loadDotenvFile } = require('./env')
const { loadBetfairProxyList } = require('./proxyPool')

loadDotenvFile()

loadBetfairProxyList()
  .then((proxies) => {
    console.log(JSON.stringify({
      enabled: process.env.BETFAIR_PROXY_ENABLED === '1',
      count: proxies.length,
      sample: proxies.slice(0, 5)
    }, null, 2))
  })
  .catch((error) => {
    console.error(error.message)
    process.exit(1)
  })
