import client from '@/lib/client'
import type { ListDevicesQueryResponse } from '../../types/ListDevices.ts'
import type { RequestConfig, ResponseErrorConfig, ResponseConfig } from '@/lib/client'
import type { QueryKey, UseSuspenseQueryOptions, UseSuspenseQueryResult } from '@tanstack/react-query'
import { queryOptions, useSuspenseQuery } from '@tanstack/react-query'

export const listDevicesSuspenseQueryKey = () => [{ url: '/devices' }] as const

export type ListDevicesSuspenseQueryKey = ReturnType<typeof listDevicesSuspenseQueryKey>

/**
 * @summary List all devices
 * {@link /devices}
 */
async function listDevices(config: Partial<RequestConfig> = {}) {
  const res = await client<ListDevicesQueryResponse, ResponseErrorConfig<Error>, unknown>({ method: 'GET', url: `/devices`, ...config })
  return res
}

export function listDevicesSuspenseQueryOptions(config: Partial<RequestConfig> = {}) {
  const queryKey = listDevicesSuspenseQueryKey()
  return queryOptions<ResponseConfig<ListDevicesQueryResponse>, ResponseErrorConfig<Error>, ResponseConfig<ListDevicesQueryResponse>, typeof queryKey>({
    queryKey,
    queryFn: async ({ signal }) => {
      config.signal = signal
      return listDevices(config)
    },
  })
}

/**
 * @summary List all devices
 * {@link /devices}
 */
export function useListDevicesSuspense<
  TData = ResponseConfig<ListDevicesQueryResponse>,
  TQueryData = ResponseConfig<ListDevicesQueryResponse>,
  TQueryKey extends QueryKey = ListDevicesSuspenseQueryKey,
>(
  options: {
    query?: Partial<UseSuspenseQueryOptions<ResponseConfig<ListDevicesQueryResponse>, ResponseErrorConfig<Error>, TData, TQueryKey>>
    client?: Partial<RequestConfig>
  } = {},
) {
  const { query: queryOptions, client: config = {} } = options ?? {}
  const queryKey = queryOptions?.queryKey ?? listDevicesSuspenseQueryKey()

  const query = useSuspenseQuery({
    ...(listDevicesSuspenseQueryOptions(config) as unknown as UseSuspenseQueryOptions),
    queryKey,
    ...(queryOptions as unknown as Omit<UseSuspenseQueryOptions, 'queryKey'>),
  }) as UseSuspenseQueryResult<TData, ResponseErrorConfig<Error>> & { queryKey: TQueryKey }

  query.queryKey = queryKey as TQueryKey

  return query
}