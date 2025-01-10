import type { Identity } from './Identity.ts'

/**
 * @description A list of identities
 */
export type ListIdentities200 = Identity[]

export type ListIdentitiesQueryResponse = ListIdentities200

export type ListIdentitiesQuery = {
  Response: ListIdentities200
  Errors: any
}