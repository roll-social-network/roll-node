declare module 'roll-node' {
  type Options = {
    apiUrl?: string;
    baseUrl?: string;
    rollDomain?: string;
    userToken?: string;
  };

  type CurrentSite = {
    domain: string;
    name: string;
  };

  type CurrentUser = {
    username?: string;
    fullName?: string;
    dateJoined?: string;
    authenticated: boolean;
  };

  enum LoginMethods {
    VERIFICATION_CODE = "VERIFICATION_CODE",
    OTP_CODE = "OTP_CODE",
  }

  type InitLogin = {
    availableMethods: LoginMethods[];
  };

  type Authenticated = {
    token: string;
    user: CurrentUser;
  };

  type AuthorizeParams = {
    [key: string]: string;
  };

  enum ApprovalPrompt {
    FORCE = "force",
    AUTO = "auto",
  }

  type OAuth2Application = {
    clientId: string;
    name: string;
    skipAuthorization: boolean;
  };

  type Authorize = {
    approvalPrompt: ApprovalPrompt;
    redirectUri: string;
    responseType: string;
    state: string;
    codeChallenge: string;
    codeChallengeMethod: string;
    nonce: string;
    scopes: { [scope: string]: string };
    application: OAuth2Application;
  };

  type Authorized = {
    uri: string;
  };

  export class APIURLNotResolvedError extends Error {}
  export class FormValidationError extends Error { fields: { [key: string]: string[] } }

  export default class Roll {
    constructor (options?: Options)

    getCurrentSite(): CurrentSite
    getCurrentUser(): CurrentUser
    initLogin(phoneNumber: string): InitLogin
    requestVerificationCode(phoneNumber: string): boolean
    verifyVerificationCode(phoneNumber: string, code: string): Authenticated
    authorize(params: AuthorizeParams, allow?: false): Authorize
    authorize(params: AuthorizeParams, allow: true): Authorized
  }
}
