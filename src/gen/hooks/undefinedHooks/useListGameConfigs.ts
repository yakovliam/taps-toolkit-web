import client from '@/lib/client'
import type { ListGameConfigsQueryResponse } from '../../types/ListGameConfigs.ts'
import type { RequestConfig, ResponseErrorConfig, ResponseConfig } from '@/lib/client'
import type { QueryKey, QueryObserverOptions, UseQueryResult } from '@tanstack/react-query'
import { queryOptions, useQuery } from '@tanstack/react-query'

export const listGameConfigsQueryKey = () => [{ url: '/game-configs' }] as const

export type ListGameConfigsQueryKey = ReturnType<typeof listGameConfigsQueryKey>

/**
 * @summary List all game configs
 * {@link /game-configs}
 */
async function listGameConfigs(config: Partial<RequestConfig> = {}) {
  const res = await client<ListGameConfigsQueryResponse, ResponseErrorConfig<Error>, unknown>({ method: 'GET', url: `/game-configs`, ...config })
  return res
}

export function listGameConfigsQueryOptions(config: Partial<RequestConfig> = {}) {
  const queryKey = listGameConfigsQueryKey()
  return queryOptions<ResponseConfig<ListGameConfigsQueryResponse>, ResponseErrorConfig<Error>, ResponseConfig<ListGameConfigsQueryResponse>, typeof queryKey>({
    queryKey,
    queryFn: async ({ signal }) => {
      config.signal = signal
      return listGameConfigs(config)
    },
  })
}

/**
 * @summary List all game configs
 * {@link /game-configs}
 */
export function useListGameConfigs<
  TData = ResponseConfig<ListGameConfigsQueryResponse>,
  TQueryData = ResponseConfig<ListGameConfigsQueryResponse>,
  TQueryKey extends QueryKey = ListGameConfigsQueryKey,
>(
  options: {
    query?: Partial<QueryObserverOptions<ResponseConfig<ListGameConfigsQueryResponse>, ResponseErrorConfig<Error>, TData, TQueryData, TQueryKey>>
    client?: Partial<RequestConfig>
  } = {},
) {
  const { query: queryOptions, client: config = {} } = options ?? {}
  const queryKey = queryOptions?.queryKey ?? listGameConfigsQueryKey()

  const query = useQuery({
    ...(listGameConfigsQueryOptions(config) as unknown as QueryObserverOptions),
    queryKey,
    ...(queryOptions as unknown as Omit<QueryObserverOptions, 'queryKey'>),
  }) as UseQueryResult<TData, ResponseErrorConfig<Error>> & { queryKey: TQueryKey }

  query.queryKey = queryKey as TQueryKey

  return query
}