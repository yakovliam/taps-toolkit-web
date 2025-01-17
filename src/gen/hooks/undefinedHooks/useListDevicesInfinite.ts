import client from '@/lib/client'
import type { ListDevicesQueryResponse } from '../../types/ListDevices.ts'
import type { RequestConfig, ResponseErrorConfig, ResponseConfig } from '@/lib/client'
import type { InfiniteData, QueryKey, InfiniteQueryObserverOptions, UseInfiniteQueryResult } from '@tanstack/react-query'
import { infiniteQueryOptions, useInfiniteQuery } from '@tanstack/react-query'

export const listDevicesInfiniteQueryKey = () => [{ url: '/devices' }] as const

export type ListDevicesInfiniteQueryKey = ReturnType<typeof listDevicesInfiniteQueryKey>

/**
 * @summary List all devices
 * {@link /devices}
 */
async function listDevices(config: Partial<RequestConfig> = {}) {
  const res = await client<ListDevicesQueryResponse, ResponseErrorConfig<Error>, unknown>({ method: 'GET', url: `/devices`, ...config })
  return res
}

export function listDevicesInfiniteQueryOptions(config: Partial<RequestConfig> = {}) {
  const queryKey = listDevicesInfiniteQueryKey()
  return infiniteQueryOptions<ResponseConfig<ListDevicesQueryResponse>, ResponseErrorConfig<Error>, ResponseConfig<ListDevicesQueryResponse>, typeof queryKey>({
    queryKey,
    queryFn: async ({ signal }) => {
      config.signal = signal
      return listDevices(config)
    },
    initialPageParam: 0,
    getNextPageParam: (lastPage) => lastPage['nextCursor'],
    getPreviousPageParam: (firstPage) => firstPage['nextCursor'],
  })
}

/**
 * @summary List all devices
 * {@link /devices}
 */
export function useListDevicesInfinite<
  TData = InfiniteData<ResponseConfig<ListDevicesQueryResponse>>,
  TQueryData = ResponseConfig<ListDevicesQueryResponse>,
  TQueryKey extends QueryKey = ListDevicesInfiniteQueryKey,
>(
  options: {
    query?: Partial<InfiniteQueryObserverOptions<ResponseConfig<ListDevicesQueryResponse>, ResponseErrorConfig<Error>, TData, TQueryData, TQueryKey>>
    client?: Partial<RequestConfig>
  } = {},
) {
  const { query: queryOptions, client: config = {} } = options ?? {}
  const queryKey = queryOptions?.queryKey ?? listDevicesInfiniteQueryKey()

  const query = useInfiniteQuery({
    ...(listDevicesInfiniteQueryOptions(config) as unknown as InfiniteQueryObserverOptions),
    queryKey,
    ...(queryOptions as unknown as Omit<InfiniteQueryObserverOptions, 'queryKey'>),
  }) as UseInfiniteQueryResult<TData, ResponseErrorConfig<Error>> & { queryKey: TQueryKey }

  query.queryKey = queryKey as TQueryKey

  return query
}