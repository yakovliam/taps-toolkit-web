import client from '@/lib/client'
import type { GetDeviceQueryResponse, GetDevicePathParams } from '../../types/GetDevice.ts'
import type { RequestConfig, ResponseErrorConfig, ResponseConfig } from '@/lib/client'
import type { InfiniteData, QueryKey, InfiniteQueryObserverOptions, UseInfiniteQueryResult } from '@tanstack/react-query'
import { infiniteQueryOptions, useInfiniteQuery } from '@tanstack/react-query'

export const getDeviceInfiniteQueryKey = (id: GetDevicePathParams['id']) => [{ url: '/devices/:id', params: { id: id } }] as const

export type GetDeviceInfiniteQueryKey = ReturnType<typeof getDeviceInfiniteQueryKey>

/**
 * @summary Get a device by ID
 * {@link /devices/:id}
 */
async function getDevice(id: GetDevicePathParams['id'], config: Partial<RequestConfig> = {}) {
  const res = await client<GetDeviceQueryResponse, ResponseErrorConfig<Error>, unknown>({ method: 'GET', url: `/devices/${id}`, ...config })
  return res
}

export function getDeviceInfiniteQueryOptions(id: GetDevicePathParams['id'], config: Partial<RequestConfig> = {}) {
  const queryKey = getDeviceInfiniteQueryKey(id)
  return infiniteQueryOptions<ResponseConfig<GetDeviceQueryResponse>, ResponseErrorConfig<Error>, ResponseConfig<GetDeviceQueryResponse>, typeof queryKey>({
    enabled: !!id,
    queryKey,
    queryFn: async ({ signal }) => {
      config.signal = signal
      return getDevice(id, config)
    },
    initialPageParam: 0,
    getNextPageParam: (lastPage) => lastPage['nextCursor'],
    getPreviousPageParam: (firstPage) => firstPage['nextCursor'],
  })
}

/**
 * @summary Get a device by ID
 * {@link /devices/:id}
 */
export function useGetDeviceInfinite<
  TData = InfiniteData<ResponseConfig<GetDeviceQueryResponse>>,
  TQueryData = ResponseConfig<GetDeviceQueryResponse>,
  TQueryKey extends QueryKey = GetDeviceInfiniteQueryKey,
>(
  id: GetDevicePathParams['id'],
  options: {
    query?: Partial<InfiniteQueryObserverOptions<ResponseConfig<GetDeviceQueryResponse>, ResponseErrorConfig<Error>, TData, TQueryData, TQueryKey>>
    client?: Partial<RequestConfig>
  } = {},
) {
  const { query: queryOptions, client: config = {} } = options ?? {}
  const queryKey = queryOptions?.queryKey ?? getDeviceInfiniteQueryKey(id)

  const query = useInfiniteQuery({
    ...(getDeviceInfiniteQueryOptions(id, config) as unknown as InfiniteQueryObserverOptions),
    queryKey,
    ...(queryOptions as unknown as Omit<InfiniteQueryObserverOptions, 'queryKey'>),
  }) as UseInfiniteQueryResult<TData, ResponseErrorConfig<Error>> & { queryKey: TQueryKey }

  query.queryKey = queryKey as TQueryKey

  return query
}