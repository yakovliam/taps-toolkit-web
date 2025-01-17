import client from '@/lib/client'
import type { CalculateEloQueryResponse, CalculateEloPathParams } from '../../types/CalculateElo.ts'
import type { RequestConfig, ResponseErrorConfig, ResponseConfig } from '@/lib/client'
import type { QueryKey, QueryObserverOptions, UseQueryResult } from '@tanstack/react-query'
import { queryOptions, useQuery } from '@tanstack/react-query'

export const calculateEloQueryKey = (id: CalculateEloPathParams['id']) => [{ url: '/identities/:id/calculate-elo', params: { id: id } }] as const

export type CalculateEloQueryKey = ReturnType<typeof calculateEloQueryKey>

/**
 * @summary Calculate the ELO of an identity
 * {@link /identities/:id/calculate-elo}
 */
async function calculateElo(id: CalculateEloPathParams['id'], config: Partial<RequestConfig> = {}) {
  const res = await client<CalculateEloQueryResponse, ResponseErrorConfig<Error>, unknown>({ method: 'GET', url: `/identities/${id}/calculate-elo`, ...config })
  return res
}

export function calculateEloQueryOptions(id: CalculateEloPathParams['id'], config: Partial<RequestConfig> = {}) {
  const queryKey = calculateEloQueryKey(id)
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
export function useCalculateElo<
  TData = ResponseConfig<CalculateEloQueryResponse>,
  TQueryData = ResponseConfig<CalculateEloQueryResponse>,
  TQueryKey extends QueryKey = CalculateEloQueryKey,
>(
  id: CalculateEloPathParams['id'],
  options: {
    query?: Partial<QueryObserverOptions<ResponseConfig<CalculateEloQueryResponse>, ResponseErrorConfig<Error>, TData, TQueryData, TQueryKey>>
    client?: Partial<RequestConfig>
  } = {},
) {
  const { query: queryOptions, client: config = {} } = options ?? {}
  const queryKey = queryOptions?.queryKey ?? calculateEloQueryKey(id)

  const query = useQuery({
    ...(calculateEloQueryOptions(id, config) as unknown as QueryObserverOptions),
    queryKey,
    ...(queryOptions as unknown as Omit<QueryObserverOptions, 'queryKey'>),
  }) as UseQueryResult<TData, ResponseErrorConfig<Error>> & { queryKey: TQueryKey }

  query.queryKey = queryKey as TQueryKey

  return query
}