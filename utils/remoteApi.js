const { apiBaseUrl, apiDomainFallbackEnabled } = require('./serverConfig')

const CLOUD_PROXY_NAME = 'apiProxy'
const DEFAULT_TIMEOUT_MS = 10000

function getApiBaseUrl() {
  return String(apiBaseUrl || '').replace(/\/$/, '')
}

function canUseDomainFallback() {
  return apiDomainFallbackEnabled === true && !!getApiBaseUrl()
}

function normalizeRequestError(message) {
  const text = String(message || '')
  if (text.indexOf('WECHAT_CONFIG_MISSING') >= 0) {
    return '微信登录配置缺失'
  }
  if (text.indexOf('WECHAT_LOGIN_FAILED') >= 0) {
    return '微信登录失败'
  }
  if (text.indexOf('MISSING_OPENID') >= 0) {
    return '微信身份获取失败'
  }
  if (text.indexOf('errcode:-101') >= 0 || text.indexOf('ERR_CONNECTION_RESET') >= 0) {
    return '服务器连接失败(-101)'
  }
  if (text.toLowerCase().indexOf('timeout') >= 0) {
    return '服务器连接超时'
  }
  if (text.indexOf('url not in domain list') >= 0 || text.indexOf('domain list') >= 0) {
    return '服务器域名未配置'
  }
  return text || '服务器连接失败'
}

function callCloudProxy(options) {
  return new Promise((resolve, reject) => {
    if (!wx.cloud || !wx.cloud.callFunction) {
      reject(new Error('CLOUD_PROXY_UNAVAILABLE'))
      return
    }
    wx.cloud.callFunction({
      name: CLOUD_PROXY_NAME,
      data: {
        path: options.path,
        method: options.method || 'GET',
        data: options.data || {},
        token: options.token || ''
      },
      success(response) {
        const result = response.result || {}
        const body = result.body || result
        const statusCode = result.statusCode || 200
        if (statusCode >= 200 && statusCode < 300 && body && body.ok !== false) {
          resolve(body)
          return
        }
        reject(new Error((body && body.error) || result.error || `HTTP_${statusCode}`))
      },
      fail(error) {
        const message = error && error.errMsg ? error.errMsg : 'CLOUD_PROXY_FAILED'
        reject(new Error(normalizeRequestError(message)))
      }
    })
  })
}

function callDomainApi(options) {
  return new Promise((resolve, reject) => {
    const baseUrl = getApiBaseUrl()
    if (!baseUrl) {
      reject(new Error('API_BASE_URL_MISSING'))
      return
    }
    const header = { 'content-type': 'application/json' }
    if (options.token) header.Authorization = `Bearer ${options.token}`
    wx.request({
      url: `${baseUrl}${options.path}`,
      method: options.method || 'GET',
      data: options.data || {},
      header,
      timeout: options.timeout || DEFAULT_TIMEOUT_MS,
      success(response) {
        const result = response.data || {}
        if (response.statusCode >= 200 && response.statusCode < 300 && result.ok !== false) {
          resolve(result)
          return
        }
        reject(new Error(result.error || `HTTP_${response.statusCode}`))
      },
      fail(error) {
        const message = error && error.errMsg ? error.errMsg : 'REQUEST_NETWORK_FAILED'
        reject(new Error(normalizeRequestError(message)))
      }
    })
  })
}

function requestServerApi(options) {
  const requestOptions = Object.assign({ method: 'GET', timeout: DEFAULT_TIMEOUT_MS }, options || {})
  if (wx.cloud && wx.cloud.callFunction) {
    return callCloudProxy(requestOptions).catch((error) => {
      if (String(error && error.message || '').indexOf('CLOUD_PROXY') >= 0 && canUseDomainFallback()) {
        return callDomainApi(requestOptions)
      }
      throw error
    })
  }
  return canUseDomainFallback()
    ? callDomainApi(requestOptions)
    : Promise.reject(new Error('CLOUD_PROXY_REQUIRED'))
}

module.exports = {
  normalizeRequestError,
  requestServerApi
}
