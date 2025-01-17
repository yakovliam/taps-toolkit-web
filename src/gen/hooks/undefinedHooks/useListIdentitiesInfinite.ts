import client from '@/lib/client'
import type { ListIdentitiesQueryResponse } from '../../types/ListIdentities.ts'
import type { RequestConfig, ResponseErrorConfig, ResponseConfig } from '@/lib/client'
import type { InfiniteData, QueryKey, InfiniteQueryObserverOptions, UseInfiniteQueryResult } from '@tanstack/react-query'
import { infiniteQueryOptions, useInfiniteQuery } from '@tanstack/react-query'

export const listIdentitiesInfiniteQueryKey = () => [{ url: '/identities' }] as const

export type ListIdentitiesInfiniteQueryKey = ReturnType<typeof listIdentitiesInfiniteQueryKey>

/**
 * @summary List all identities
 * {@link /identities}
 */
async function listIdentities(config: Partial<RequestConfig> = {}) {
  const res = await client<ListIdentitiesQueryResponse, ResponseErrorConfig<Error>, unknown>({ method: 'GET', url: `/identities`, ...config })
  return res
}

export function listIdentitiesInfiniteQueryOptions(config: Partial<RequestConfig> = {}) {
  const queryKey = listIdentitiesInfiniteQueryKey()
  return infiniteQueryOptions<
    ResponseConfig<ListIdentitiesQueryResponse>,
    ResponseErrorConfig<Error>,
    ResponseConfig<ListIdentitiesQueryResponse>,
    typeof queryKey
  >({
    queryKey,
    queryFn: async ({ signal }) => {
      config.signal = signal
      return listIdentities(config)
    },
    initialPageParam: 0,
    getNextPageParam: (lastPage) => lastPage['nextCursor'],
    getPreviousPageParam: (firstPage) => firstPage['nextCursor'],
  })
}

/**
 * @summary List all identities
 * {@link /identities}
 */
export function useListIdentitiesInfinite<
  TData = InfiniteData<ResponseConfig<ListIdentitiesQueryResponse>>,
  TQueryData = ResponseConfig<ListIdentitiesQueryResponse>,
  TQueryKey extends QueryKey = ListIdentitiesInfiniteQueryKey,
>(
  options: {
    query?: Partial<InfiniteQueryObserverOptions<ResponseConfig<ListIdentitiesQueryResponse>, ResponseErrorConfig<Error>, TData, TQueryData, TQueryKey>>
    client?: Partial<RequestConfig>
  } = {},
) {
  const { query: queryOptions, client: config = {} } = options ?? {}
  const queryKey = queryOptions?.queryKey ?? listIdentitiesInfiniteQueryKey()

  const query = useInfiniteQuery({
    ...(listIdentitiesInfiniteQueryOptions(config) as unknown as InfiniteQueryObserverOptions),
    queryKey,
    ...(queryOptions as unknown as Omit<InfiniteQueryObserverOptions, 'queryKey'>),
  }) as UseInfiniteQueryResult<TData, ResponseErrorConfig<Error>> & { queryKey: TQueryKey }

  query.queryKey = queryKey as TQueryKey

  return query
}