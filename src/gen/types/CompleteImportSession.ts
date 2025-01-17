import type { IdentityCompleteImportSessionRequest } from './IdentityCompleteImportSessionRequest.ts'
import type { IdentityCompleteImportSessionResponse } from './IdentityCompleteImportSessionResponse.ts'

/**
 * @description The import session response
 */
export type CompleteImportSession200 = IdentityCompleteImportSessionResponse

export type CompleteImportSessionMutationRequest = IdentityCompleteImportSessionRequest

export type CompleteImportSessionMutationResponse = CompleteImportSession200

export type CompleteImportSessionMutation = {
  Response: CompleteImportSession200
  Request: CompleteImportSessionMutationRequest
  Errors: any
}