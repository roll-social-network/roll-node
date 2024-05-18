declare module 'roll-node' {
  type Options = {
    apiUrl?: string;
    baseUrl?: string;
    rollDomain?: string;
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
    user: CurrentUser;
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
  }
}
