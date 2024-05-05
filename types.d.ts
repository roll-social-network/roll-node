declare module 'roll-node' {
  type Options = {
    apiUrl?: string;
    baseUrl?: string;
  };

  export class APIURLNotResolvedError extends Error {}

  export default class Roll {
    constructor (options?: Options)

    getCurrentSite()
  }
}
