import client from '@/lib/client'
import type { GetDeviceQueryResponse, GetDevicePathParams } from '../../types/GetDevice.ts'
import type { RequestConfig, ResponseErrorConfig, ResponseConfig } from '@/lib/client'
import type { QueryKey, QueryObserverOptions, UseQueryResult } from '@tanstack/react-query'
import { queryOptions, useQuery } from '@tanstack/react-query'

export const getDeviceQueryKey = (id: GetDevicePathParams['id']) => [{ url: '/devices/:id', params: { id: id } }] as const

export type GetDeviceQueryKey = ReturnType<typeof getDeviceQueryKey>

/**
 * @summary Get a device by ID
 * {@link /devices/:id}
 */
async function getDevice(id: GetDevicePathParams['id'], config: Partial<RequestConfig> = {}) {
  const res = await client<GetDeviceQueryResponse, ResponseErrorConfig<Error>, unknown>({ method: 'GET', url: `/devices/${id}`, ...config })
  return res
}

export function getDeviceQueryOptions(id: GetDevicePathParams['id'], config: Partial<RequestConfig> = {}) {
  const queryKey = getDeviceQueryKey(id)
  return queryOptions<ResponseConfig<GetDeviceQueryResponse>, ResponseErrorConfig<Error>, ResponseConfig<GetDeviceQueryResponse>, typeof queryKey>({
    enabled: !!id,
    queryKey,
    queryFn: async ({ signal }) => {
      config.signal = signal
      return getDevice(id, config)
    },
  })
}

/**
 * @summary Get a device by ID
 * {@link /devices/:id}
 */
export function useGetDevice<
  TData = ResponseConfig<GetDeviceQueryResponse>,
  TQueryData = ResponseConfig<GetDeviceQueryResponse>,
  TQueryKey extends QueryKey = GetDeviceQueryKey,
>(
  id: GetDevicePathParams['id'],
  options: {
    query?: Partial<QueryObserverOptions<ResponseConfig<GetDeviceQueryResponse>, ResponseErrorConfig<Error>, TData, TQueryData, TQueryKey>>
    client?: Partial<RequestConfig>
  } = {},
) {
  const { query: queryOptions, client: config = {} } = options ?? {}
  const queryKey = queryOptions?.queryKey ?? getDeviceQueryKey(id)

  const query = useQuery({
    ...(getDeviceQueryOptions(id, config) as unknown as QueryObserverOptions),
    queryKey,
    ...(queryOptions as unknown as Omit<QueryObserverOptions, 'queryKey'>),
  }) as UseQueryResult<TData, ResponseErrorConfig<Error>> & { queryKey: TQueryKey }

  query.queryKey = queryKey as TQueryKey

  return query
}