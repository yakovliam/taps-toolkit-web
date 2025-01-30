import client from '@/lib/client'
import type { ListGameConfigsQueryResponse } from '../../types/ListGameConfigs.ts'
import type { RequestConfig, ResponseErrorConfig, ResponseConfig } from '@/lib/client'
import type { QueryKey, UseSuspenseQueryOptions, UseSuspenseQueryResult } from '@tanstack/react-query'
import { queryOptions, useSuspenseQuery } from '@tanstack/react-query'

export const listGameConfigsSuspenseQueryKey = () => [{ url: '/game-configs' }] as const

export type ListGameConfigsSuspenseQueryKey = ReturnType<typeof listGameConfigsSuspenseQueryKey>

/**
 * @summary List all game configs
 * {@link /game-configs}
 */
async function listGameConfigs(config: Partial<RequestConfig> = {}) {
  const res = await client<ListGameConfigsQueryResponse, ResponseErrorConfig<Error>, unknown>({ method: 'GET', url: `/game-configs`, ...config })
  return res
}

export function listGameConfigsSuspenseQueryOptions(config: Partial<RequestConfig> = {}) {
  const queryKey = listGameConfigsSuspenseQueryKey()
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
export function useListGameConfigsSuspense<
  TData = ResponseConfig<ListGameConfigsQueryResponse>,
  TQueryData = ResponseConfig<ListGameConfigsQueryResponse>,
  TQueryKey extends QueryKey = ListGameConfigsSuspenseQueryKey,
>(
  options: {
    query?: Partial<UseSuspenseQueryOptions<ResponseConfig<ListGameConfigsQueryResponse>, ResponseErrorConfig<Error>, TData, TQueryKey>>
    client?: Partial<RequestConfig>
  } = {},
) {
  const { query: queryOptions, client: config = {} } = options ?? {}
  const queryKey = queryOptions?.queryKey ?? listGameConfigsSuspenseQueryKey()

  const query = useSuspenseQuery({
    ...(listGameConfigsSuspenseQueryOptions(config) as unknown as UseSuspenseQueryOptions),
    queryKey,
    ...(queryOptions as unknown as Omit<UseSuspenseQueryOptions, 'queryKey'>),
  }) as UseSuspenseQueryResult<TData, ResponseErrorConfig<Error>> & { queryKey: TQueryKey }

  query.queryKey = queryKey as TQueryKey

  return query
}