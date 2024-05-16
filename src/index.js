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
    return `${location.protocol}//${location.host}`
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
    const apiUrl = Roll.resolveApiUrlFromBaseUrl({ baseUrl }) || Roll.resolveApiUrlFromEnvVars()
    if (!apiUrl) {
      throw new APIURLNotResolvedError()
    }
    return apiUrl
  }

  constructor ({ apiUrl, baseUrl, rollDomain } = { apiUrl: null, baseUrl: null, rollDomain: undefined }) {
    const baseURL = apiUrl || Roll.resolveApiUrl({ baseUrl })
    this.axios = axios.create({
      baseURL,
      withCredentials: true,
      headers: {
        host: rollDomain
      }
    })
  }

  async getCurrentSite () {
    const response = await this.axios.get('/sites/current/')
    return response.data
  }
}

export * from './errors'
export default Roll
