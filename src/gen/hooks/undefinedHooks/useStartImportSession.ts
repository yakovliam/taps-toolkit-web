import client from '@/lib/client'
import type { StartImportSessionMutationRequest, StartImportSessionMutationResponse } from '../../types/StartImportSession.ts'
import type { RequestConfig, ResponseConfig, ResponseErrorConfig } from '@/lib/client'
import type { UseMutationOptions } from '@tanstack/react-query'
import { useMutation } from '@tanstack/react-query'

export const startImportSessionMutationKey = () => [{ url: '/identities/start-import-session' }] as const

export type StartImportSessionMutationKey = ReturnType<typeof startImportSessionMutationKey>

/**
 * @summary Start an identity import session
 * {@link /identities/start-import-session}
 */
async function startImportSession(data: StartImportSessionMutationRequest, config: Partial<RequestConfig<StartImportSessionMutationRequest>> = {}) {
  const res = await client<StartImportSessionMutationResponse, ResponseErrorConfig<Error>, StartImportSessionMutationRequest>({
    method: 'POST',
    url: `/identities/start-import-session`,
    data,
    ...config,
  })
  return res
}

/**
 * @summary Start an identity import session
 * {@link /identities/start-import-session}
 */
export function useStartImportSession(
  options: {
    mutation?: UseMutationOptions<ResponseConfig<StartImportSessionMutationResponse>, ResponseErrorConfig<Error>, { data: StartImportSessionMutationRequest }>
    client?: Partial<RequestConfig<StartImportSessionMutationRequest>>
  } = {},
) {
  const { mutation: mutationOptions, client: config = {} } = options ?? {}
  const mutationKey = mutationOptions?.mutationKey ?? startImportSessionMutationKey()

  return useMutation<ResponseConfig<StartImportSessionMutationResponse>, ResponseErrorConfig<Error>, { data: StartImportSessionMutationRequest }>({
    mutationFn: async ({ data }) => {
      return startImportSession(data, config)
    },
    mutationKey,
    ...mutationOptions,
  })
}