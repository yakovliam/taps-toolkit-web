import client from '@/lib/client'
import type { CalculateEloQueryResponse, CalculateEloPathParams } from '../../types/CalculateElo.ts'
import type { RequestConfig, ResponseErrorConfig, ResponseConfig } from '@/lib/client'
import type { QueryKey, UseSuspenseQueryOptions, UseSuspenseQueryResult } from '@tanstack/react-query'
import { queryOptions, useSuspenseQuery } from '@tanstack/react-query'

export const calculateEloSuspenseQueryKey = (id: CalculateEloPathParams['id']) => [{ url: '/identities/:id/calculate-elo', params: { id: id } }] as const

export type CalculateEloSuspenseQueryKey = ReturnType<typeof calculateEloSuspenseQueryKey>

/**
 * @summary Calculate the ELO of an identity
 * {@link /identities/:id/calculate-elo}
 */
async function calculateElo(id: CalculateEloPathParams['id'], config: Partial<RequestConfig> = {}) {
  const res = await client<CalculateEloQueryResponse, ResponseErrorConfig<Error>, unknown>({ method: 'GET', url: `/identities/${id}/calculate-elo`, ...config })
  return res
}

export function calculateEloSuspenseQueryOptions(id: CalculateEloPathParams['id'], config: Partial<RequestConfig> = {}) {
  const queryKey = calculateEloSuspenseQueryKey(id)
  return queryOptions<ResponseConfig<CalculateEloQueryResponse>, ResponseErrorConfig<Error>, ResponseConfig<CalculateEloQueryResponse>, typeof queryKey>({
    enabled: !!id,
    queryKey,
    queryFn: async ({ signal }) => {
      config.signal = signal
      return calculateElo(id, config)
    },
  })
}

/**
 * @summary Calculate the ELO of an identity
 * {@link /identities/:id/calculate-elo}
 */
export function useCalculateEloSuspense<
  TData = ResponseConfig<CalculateEloQueryResponse>,
  TQueryData = ResponseConfig<CalculateEloQueryResponse>,
  TQueryKey extends QueryKey = CalculateEloSuspenseQueryKey,
>(
  id: CalculateEloPathParams['id'],
  options: {
    query?: Partial<UseSuspenseQueryOptions<ResponseConfig<CalculateEloQueryResponse>, ResponseErrorConfig<Error>, TData, TQueryKey>>
    client?: Partial<RequestConfig>
  } = {},
) {
  const { query: queryOptions, client: config = {} } = options ?? {}
  const queryKey = queryOptions?.queryKey ?? calculateEloSuspenseQueryKey(id)

  const query = useSuspenseQuery({
    ...(calculateEloSuspenseQueryOptions(id, config) as unknown as UseSuspenseQueryOptions),
    queryKey,
    ...(queryOptions as unknown as Omit<UseSuspenseQueryOptions, 'queryKey'>),
  }) as UseSuspenseQueryResult<TData, ResponseErrorConfig<Error>> & { queryKey: TQueryKey }

  query.queryKey = queryKey as TQueryKey

  return query
}