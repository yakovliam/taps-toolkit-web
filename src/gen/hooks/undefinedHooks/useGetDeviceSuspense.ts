import client from '@/lib/client'
import type { GetDeviceQueryResponse, GetDevicePathParams } from '../../types/GetDevice.ts'
import type { RequestConfig, ResponseErrorConfig, ResponseConfig } from '@/lib/client'
import type { QueryKey, UseSuspenseQueryOptions, UseSuspenseQueryResult } from '@tanstack/react-query'
import { queryOptions, useSuspenseQuery } from '@tanstack/react-query'

export const getDeviceSuspenseQueryKey = (id: GetDevicePathParams['id']) => [{ url: '/devices/:id', params: { id: id } }] as const

export type GetDeviceSuspenseQueryKey = ReturnType<typeof getDeviceSuspenseQueryKey>

/**
 * @summary Get a device by ID
 * {@link /devices/:id}
 */
async function getDevice(id: GetDevicePathParams['id'], config: Partial<RequestConfig> = {}) {
  const res = await client<GetDeviceQueryResponse, ResponseErrorConfig<Error>, unknown>({ method: 'GET', url: `/devices/${id}`, ...config })
  return res
}

export function getDeviceSuspenseQueryOptions(id: GetDevicePathParams['id'], config: Partial<RequestConfig> = {}) {
  const queryKey = getDeviceSuspenseQueryKey(id)
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
export function useGetDeviceSuspense<
  TData = ResponseConfig<GetDeviceQueryResponse>,
  TQueryData = ResponseConfig<GetDeviceQueryResponse>,
  TQueryKey extends QueryKey = GetDeviceSuspenseQueryKey,
>(
  id: GetDevicePathParams['id'],
  options: {
    query?: Partial<UseSuspenseQueryOptions<ResponseConfig<GetDeviceQueryResponse>, ResponseErrorConfig<Error>, TData, TQueryKey>>
    client?: Partial<RequestConfig>
  } = {},
) {
  const { query: queryOptions, client: config = {} } = options ?? {}
  const queryKey = queryOptions?.queryKey ?? getDeviceSuspenseQueryKey(id)

  const query = useSuspenseQuery({
    ...(getDeviceSuspenseQueryOptions(id, config) as unknown as UseSuspenseQueryOptions),
    queryKey,
    ...(queryOptions as unknown as Omit<UseSuspenseQueryOptions, 'queryKey'>),
  }) as UseSuspenseQueryResult<TData, ResponseErrorConfig<Error>> & { queryKey: TQueryKey }

  query.queryKey = queryKey as TQueryKey

  return query
}