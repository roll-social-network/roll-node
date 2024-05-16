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

  export class APIURLNotResolvedError extends Error {}

  export default class Roll {
    constructor (options?: Options)

    getCurrentSite(): CurrentSite
  }
}
