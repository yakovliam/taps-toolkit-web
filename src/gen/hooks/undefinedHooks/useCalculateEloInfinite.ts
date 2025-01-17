import client from '@/lib/client'
import type { CalculateEloQueryResponse, CalculateEloPathParams } from '../../types/CalculateElo.ts'
import type { RequestConfig, ResponseErrorConfig, ResponseConfig } from '@/lib/client'
import type { InfiniteData, QueryKey, InfiniteQueryObserverOptions, UseInfiniteQueryResult } from '@tanstack/react-query'
import { infiniteQueryOptions, useInfiniteQuery } from '@tanstack/react-query'

export const calculateEloInfiniteQueryKey = (id: CalculateEloPathParams['id']) => [{ url: '/identities/:id/calculate-elo', params: { id: id } }] as const

export type CalculateEloInfiniteQueryKey = ReturnType<typeof calculateEloInfiniteQueryKey>

/**
 * @summary Calculate the ELO of an identity
 * {@link /identities/:id/calculate-elo}
 */
async function calculateElo(id: CalculateEloPathParams['id'], config: Partial<RequestConfig> = {}) {
  const res = await client<CalculateEloQueryResponse, ResponseErrorConfig<Error>, unknown>({ method: 'GET', url: `/identities/${id}/calculate-elo`, ...config })
  return res
}

export function calculateEloInfiniteQueryOptions(id: CalculateEloPathParams['id'], config: Partial<RequestConfig> = {}) {
  const queryKey = calculateEloInfiniteQueryKey(id)
  return infiniteQueryOptions<
    ResponseConfig<CalculateEloQueryResponse>,
    ResponseErrorConfig<Error>,
    ResponseConfig<CalculateEloQueryResponse>,
    typeof queryKey
  >({
    enabled: !!id,
    queryKey,
    queryFn: async ({ signal }) => {
      config.signal = signal
      return calculateElo(id, config)
    },
    initialPageParam: 0,
    getNextPageParam: (lastPage) => lastPage['nextCursor'],
    getPreviousPageParam: (firstPage) => firstPage['nextCursor'],
  })
}

/**
 * @summary Calculate the ELO of an identity
 * {@link /identities/:id/calculate-elo}
 */
export function useCalculateEloInfinite<
  TData = InfiniteData<ResponseConfig<CalculateEloQueryResponse>>,
  TQueryData = ResponseConfig<CalculateEloQueryResponse>,
  TQueryKey extends QueryKey = CalculateEloInfiniteQueryKey,
>(
  id: CalculateEloPathParams['id'],
  options: {
    query?: Partial<InfiniteQueryObserverOptions<ResponseConfig<CalculateEloQueryResponse>, ResponseErrorConfig<Error>, TData, TQueryData, TQueryKey>>
    client?: Partial<RequestConfig>
  } = {},
) {
  const { query: queryOptions, client: config = {} } = options ?? {}
  const queryKey = queryOptions?.queryKey ?? calculateEloInfiniteQueryKey(id)

  const query = useInfiniteQuery({
    ...(calculateEloInfiniteQueryOptions(id, config) as unknown as InfiniteQueryObserverOptions),
    queryKey,
    ...(queryOptions as unknown as Omit<InfiniteQueryObserverOptions, 'queryKey'>),
  }) as UseInfiniteQueryResult<TData, ResponseErrorConfig<Error>> & { queryKey: TQueryKey }

  query.queryKey = queryKey as TQueryKey

  return query
}