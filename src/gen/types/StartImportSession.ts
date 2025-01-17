import type { IdentityStartImportSessionRequest } from './IdentityStartImportSessionRequest.ts'
import type { IdentityStartImportSessionResponse } from './IdentityStartImportSessionResponse.ts'

/**
 * @description The import session response
 */
export type StartImportSession200 = IdentityStartImportSessionResponse

export type StartImportSessionMutationRequest = IdentityStartImportSessionRequest

export type StartImportSessionMutationResponse = StartImportSession200

export type StartImportSessionMutation = {
  Response: StartImportSession200
  Request: StartImportSessionMutationRequest
  Errors: any
}