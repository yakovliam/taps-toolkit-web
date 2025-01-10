import type { Identity } from './Identity.ts'

export type IdentityWithElo = Identity & {
  /**
   * @type number | undefined, double
   */
  elo?: number
}