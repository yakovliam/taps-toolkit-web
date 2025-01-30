import client from '@/lib/client'
import type { ListGameConfigsQueryResponse } from '../../types/ListGameConfigs.ts'
import type { RequestConfig, ResponseErrorConfig, ResponseConfig } from '@/lib/client'
import type { InfiniteData, QueryKey, InfiniteQueryObserverOptions, UseInfiniteQueryResult } from '@tanstack/react-query'
import { infiniteQueryOptions, useInfiniteQuery } from '@tanstack/react-query'

export const listGameConfigsInfiniteQueryKey = () => [{ url: '/game-configs' }] as const

export type ListGameConfigsInfiniteQueryKey = ReturnType<typeof listGameConfigsInfiniteQueryKey>

/**
 * @summary List all game configs
 * {@link /game-configs}
 */
async function listGameConfigs(config: Partial<RequestConfig> = {}) {
  const res = await client<ListGameConfigsQueryResponse, ResponseErrorConfig<Error>, unknown>({ method: 'GET', url: `/game-configs`, ...config })
  return res
}

export function listGameConfigsInfiniteQueryOptions(config: Partial<RequestConfig> = {}) {
  const queryKey = listGameConfigsInfiniteQueryKey()
  return infiniteQueryOptions<
    ResponseConfig<ListGameConfigsQueryResponse>,
    ResponseErrorConfig<Error>,
    ResponseConfig<ListGameConfigsQueryResponse>,
    typeof queryKey
  >({
    queryKey,
    queryFn: async ({ signal }) => {
      config.signal = signal
      return listGameConfigs(config)
    },
    initialPageParam: 0,
    getNextPageParam: (lastPage) => lastPage['nextCursor'],
    getPreviousPageParam: (firstPage) => firstPage['nextCursor'],
  })
}

/**
 * @summary List all game configs
 * {@link /game-configs}
 */
export function useListGameConfigsInfinite<
  TData = InfiniteData<ResponseConfig<ListGameConfigsQueryResponse>>,
  TQueryData = ResponseConfig<ListGameConfigsQueryResponse>,
  TQueryKey extends QueryKey = ListGameConfigsInfiniteQueryKey,
>(
  options: {
    query?: Partial<InfiniteQueryObserverOptions<ResponseConfig<ListGameConfigsQueryResponse>, ResponseErrorConfig<Error>, TData, TQueryData, TQueryKey>>
    client?: Partial<RequestConfig>
  } = {},
) {
  const { query: queryOptions, client: config = {} } = options ?? {}
  const queryKey = queryOptions?.queryKey ?? listGameConfigsInfiniteQueryKey()

  const query = useInfiniteQuery({
    ...(listGameConfigsInfiniteQueryOptions(config) as unknown as InfiniteQueryObserverOptions),
    queryKey,
    ...(queryOptions as unknown as Omit<InfiniteQueryObserverOptions, 'queryKey'>),
  }) as UseInfiniteQueryResult<TData, ResponseErrorConfig<Error>> & { queryKey: TQueryKey }

  query.queryKey = queryKey as TQueryKey

  return query
}