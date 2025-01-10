import type { IdentityWithElo } from './IdentityWithElo.ts'

export type CalculateEloPathParams = {
  /**
   * @description The UID of the identity to calculate the ELO for
   * @type string
   */
  uid: string
}

/**
 * @description The ELO of the identity
 */
export type CalculateElo200 = IdentityWithElo

export type CalculateEloQueryResponse = CalculateElo200

export type CalculateEloQuery = {
  Response: CalculateElo200
  PathParams: CalculateEloPathParams
  Errors: any
}