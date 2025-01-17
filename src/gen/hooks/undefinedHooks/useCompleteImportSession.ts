import client from '@/lib/client'
import type { CompleteImportSessionMutationRequest, CompleteImportSessionMutationResponse } from '../../types/CompleteImportSession.ts'
import type { RequestConfig, ResponseConfig, ResponseErrorConfig } from '@/lib/client'
import type { UseMutationOptions } from '@tanstack/react-query'
import { useMutation } from '@tanstack/react-query'

export const completeImportSessionMutationKey = () => [{ url: '/identities/complete-import-session' }] as const

export type CompleteImportSessionMutationKey = ReturnType<typeof completeImportSessionMutationKey>

/**
 * @summary Complete an identity import session
 * {@link /identities/complete-import-session}
 */
async function completeImportSession(data: CompleteImportSessionMutationRequest, config: Partial<RequestConfig<CompleteImportSessionMutationRequest>> = {}) {
  const res = await client<CompleteImportSessionMutationResponse, ResponseErrorConfig<Error>, CompleteImportSessionMutationRequest>({
    method: 'POST',
    url: `/identities/complete-import-session`,
    data,
    ...config,
  })
  return res
}

/**
 * @summary Complete an identity import session
 * {@link /identities/complete-import-session}
 */
export function useCompleteImportSession(
  options: {
    mutation?: UseMutationOptions<
      ResponseConfig<CompleteImportSessionMutationResponse>,
      ResponseErrorConfig<Error>,
      { data: CompleteImportSessionMutationRequest }
    >
    client?: Partial<RequestConfig<CompleteImportSessionMutationRequest>>
  } = {},
) {
  const { mutation: mutationOptions, client: config = {} } = options ?? {}
  const mutationKey = mutationOptions?.mutationKey ?? completeImportSessionMutationKey()

  return useMutation<ResponseConfig<CompleteImportSessionMutationResponse>, ResponseErrorConfig<Error>, { data: CompleteImportSessionMutationRequest }>({
    mutationFn: async ({ data }) => {
      return completeImportSession(data, config)
    },
    mutationKey,
    ...mutationOptions,
  })
}