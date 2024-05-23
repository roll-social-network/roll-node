export class APIURLNotResolvedError extends Error {
  constructor () {
    super('API URL Not Resolved')
  }
}

export class FormValidationError extends Error {
  constructor (fields) {
    super(`Form Validation Error: ${JSON.stringify(fields)}`)
    this.fields = fields
  }
}

export class OAuth2AuthorizeError extends Error {}

export default {
  APIURLNotResolvedError,
  FormValidationError,
  OAuth2AuthorizeError
}
