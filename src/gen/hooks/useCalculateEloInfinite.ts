import client from '@/lib/client'
import type { CalculateEloQueryResponse, CalculateEloPathParams } from '../types/CalculateElo.ts'
import type { RequestConfig, ResponseConfig } from '@/lib/client'
import type { InfiniteData, QueryKey, InfiniteQueryObserverOptions, UseInfiniteQueryResult } from '@tanstack/react-query'
import { infiniteQueryOptions, useInfiniteQuery } from '@tanstack/react-query'

export const calculateEloInfiniteQueryKey = (uid: CalculateEloPathParams['uid']) => [{ url: '/identities/:uid/calculate-elo', params: { uid: uid } }] as const

export type CalculateEloInfiniteQueryKey = ReturnType<typeof calculateEloInfiniteQueryKey>

/**
 * @summary Calculate the ELO of an identity
 * {@link /identities/:uid/calculate-elo}
 */
async function calculateElo(uid: CalculateEloPathParams['uid'], config: Partial<RequestConfig> = {}) {
  const res = await client<CalculateEloQueryResponse, Error, unknown>({ method: 'GET', url: `/identities/${uid}/calculate-elo`, ...config })
  return res
}

export function calculateEloInfiniteQueryOptions(uid: CalculateEloPathParams['uid'], config: Partial<RequestConfig> = {}) {
  const queryKey = calculateEloInfiniteQueryKey(uid)
  return infiniteQueryOptions<ResponseConfig<CalculateEloQueryResponse>, Error, ResponseConfig<CalculateEloQueryResponse>, typeof queryKey>({
    enabled: !!uid,
    queryKey,
    queryFn: async ({ signal }) => {
      config.signal = signal
      return calculateElo(uid, config)
    },
    initialPageParam: 0,
    getNextPageParam: (lastPage) => lastPage['nextCursor'],
    getPreviousPageParam: (firstPage) => firstPage['nextCursor'],
  })
}

/**
 * @summary Calculate the ELO of an identity
 * {@link /identities/:uid/calculate-elo}
 */
export function useCalculateEloInfinite<
  TData = InfiniteData<ResponseConfig<CalculateEloQueryResponse>>,
  TQueryData = ResponseConfig<CalculateEloQueryResponse>,
  TQueryKey extends QueryKey = CalculateEloInfiniteQueryKey,
>(
  uid: CalculateEloPathParams['uid'],
  options: {
    query?: Partial<InfiniteQueryObserverOptions<ResponseConfig<CalculateEloQueryResponse>, Error, TData, TQueryData, TQueryKey>>
    client?: Partial<RequestConfig>
  } = {},
) {
  const { query: queryOptions, client: config = {} } = options ?? {}
  const queryKey = queryOptions?.queryKey ?? calculateEloInfiniteQueryKey(uid)

  const query = useInfiniteQuery({
    ...(calculateEloInfiniteQueryOptions(uid, config) as unknown as InfiniteQueryObserverOptions),
    queryKey,
    ...(queryOptions as unknown as Omit<InfiniteQueryObserverOptions, 'queryKey'>),
  }) as UseInfiniteQueryResult<TData, Error> & { queryKey: TQueryKey }

  query.queryKey = queryKey as TQueryKey

  return query
}