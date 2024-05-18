import axios from 'axios'
import {
  APIURLNotResolvedError,
  FormValidationError,
 } from './errors'

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

  async getCurrentUser () {
    const response = await this.axios.get(
      '/users/current/',
      { validateStatus: (status) => ([200, 403].includes(status)) }
    )
    const {
      username,
      full_name: fullName,
      date_joined: dateJoined,
    } = response.data
    return {
      username,
      fullName,
      dateJoined,
      authenticated: response.status === 200,
    }
  }

  async initLogin(phoneNumber) {
    const data = { phone_number: phoneNumber }
    try {
      const response = await this.axios.post(
        '/login/',
        data
      )
      const { available_methods } = response.data
      return {
        availableMethods: available_methods
      }
    } catch (e) {
      if (e instanceof axios.AxiosError && e.response?.status === 400) {
        throw new FormValidationError({ phoneNumber: e.response.data.phone_number })
      }
      throw e
    }
  }

  async requestVerificationCode(phoneNumber) {
    const data = { phone_number: phoneNumber }
    try {
      await this.axios.post(
        '/request-verification-code/',
        data,
        { validateStatus: (status) => (status === 202) }
      )
      return true
    } catch (e) {
      if (e instanceof axios.AxiosError && e.response?.status === 400) {
        throw new FormValidationError({ phoneNumber: e.response.data.phone_number })
      }
      throw e
    }
  }

  async verifyVerificationCode(phoneNumber, code) {
    const data = {
      phone_number: phoneNumber,
      code
    }
    try {
      const response = await this.axios.post(
        '/verify-verification-code/',
        data
      )
      return response.data
    } catch (e) {
      if (e instanceof axios.AxiosError && e.response?.status === 400) {
        const {
          non_field_errors: nonFieldErrors,
          phone_number: phoneNumber,
          code,
        } = e.response.data
        throw new FormValidationError({
          nonFieldErrors,
          phoneNumber,
          code,
        })
      }
      throw e
    }
  }
}

export class LoginMethods {
  static VERIFICATION_CODE = "VERIFICATION_CODE"
  static OTP_CODE = "OTP_CODE"
}

export * from './errors'
export default Roll
