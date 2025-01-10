import type { Identity } from './Identity.ts'

export type GetIdentityPathParams = {
  /**
   * @description The UID of the identity to retrieve
   * @type string
   */
  uid: string
}

/**
 * @description The identity
 */
export type GetIdentity200 = Identity

export type GetIdentityQueryResponse = GetIdentity200

export type GetIdentityQuery = {
  Response: GetIdentity200
  PathParams: GetIdentityPathParams
  Errors: any
}