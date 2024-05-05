import axios from 'axios'
import { APIURLNotResolvedError } from './errors'

class Roll {
  static resolveBaseUrlFromEnvVars () {
    if (typeof process === 'undefined') {
      return null
    }
    return process.env.ROLL_BASE_URL
  }

  static resolveBaseUrlFromLocation () {
    if (typeof location === 'undefined') {
      return null
    }
    const currentHost = location.host
    if (!currentHost.startsWith('sso.')) {
      return null
    }
    const protocol = location.protocol
    const host = currentHost.replace(/^sso./, '')
    return `${protocol}//${host}`
  }

  static resolveBaseUrl () {
    return Roll.resolveBaseUrlFromEnvVars() || Roll.resolveBaseUrlFromLocation()
  }

  static resolveApiUrlFromEnvVars () {
    if (typeof process === 'undefined') {
      return null
    }
    return process.env.ROLL_API_URL
  }

  static resolveApiUrlFromBaseUrl ({ baseUrl: baseUrlOpt }) {
    const baseUrl = baseUrlOpt || Roll.resolveBaseUrl()
    if (!baseUrl) {
      return null
    }
    const apiPath = 'api'
    const version = 'v1'
    return `${baseUrl}/${apiPath}/${version}`
  }

  static resolveApiUrl ({ baseUrl }) {
    const apiUrl = Roll.resolveApiUrlFromEnvVars() || Roll.resolveApiUrlFromBaseUrl({ baseUrl })
    if (!apiUrl) {
      throw new APIURLNotResolvedError()
    }
    return apiUrl
  }

  constructor ({ apiUrl, baseUrl } = { apiUrl: null, baseUrl: null }) {
    this.apiUrl = apiUrl || Roll.resolveApiUrl({ baseUrl })
    this.axios = axios.create({
      baseURL: this.apiUrl,
      withCredentials: true
    })
  }

  async getCurrentSite () {
    const response = await this.axios.get('/sites/current/')
    return response.data
  }

  toJSON () {
    return {
      apiUrl: this.apiUrl
    }
  }
}

export * from './errors'
export default Roll
