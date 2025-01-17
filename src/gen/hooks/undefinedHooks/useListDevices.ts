import client from '@/lib/client'
import type { ListDevicesQueryResponse } from '../../types/ListDevices.ts'
import type { RequestConfig, ResponseErrorConfig, ResponseConfig } from '@/lib/client'
import type { QueryKey, QueryObserverOptions, UseQueryResult } from '@tanstack/react-query'
import { queryOptions, useQuery } from '@tanstack/react-query'

export const listDevicesQueryKey = () => [{ url: '/devices' }] as const

export type ListDevicesQueryKey = ReturnType<typeof listDevicesQueryKey>

/**
 * @summary List all devices
 * {@link /devices}
 */
async function listDevices(config: Partial<RequestConfig> = {}) {
  const res = await client<ListDevicesQueryResponse, ResponseErrorConfig<Error>, unknown>({ method: 'GET', url: `/devices`, ...config })
  return res
}

export function listDevicesQueryOptions(config: Partial<RequestConfig> = {}) {
  const queryKey = listDevicesQueryKey()
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
export function useListDevices<
  TData = ResponseConfig<ListDevicesQueryResponse>,
  TQueryData = ResponseConfig<ListDevicesQueryResponse>,
  TQueryKey extends QueryKey = ListDevicesQueryKey,
>(
  options: {
    query?: Partial<QueryObserverOptions<ResponseConfig<ListDevicesQueryResponse>, ResponseErrorConfig<Error>, TData, TQueryData, TQueryKey>>
    client?: Partial<RequestConfig>
  } = {},
) {
  const { query: queryOptions, client: config = {} } = options ?? {}
  const queryKey = queryOptions?.queryKey ?? listDevicesQueryKey()

  const query = useQuery({
    ...(listDevicesQueryOptions(config) as unknown as QueryObserverOptions),
    queryKey,
    ...(queryOptions as unknown as Omit<QueryObserverOptions, 'queryKey'>),
  }) as UseQueryResult<TData, ResponseErrorConfig<Error>> & { queryKey: TQueryKey }

  query.queryKey = queryKey as TQueryKey

  return query
}