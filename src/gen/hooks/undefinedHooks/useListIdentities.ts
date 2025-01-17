import client from '@/lib/client'
import type { ListIdentitiesQueryResponse } from '../../types/ListIdentities.ts'
import type { RequestConfig, ResponseErrorConfig, ResponseConfig } from '@/lib/client'
import type { QueryKey, QueryObserverOptions, UseQueryResult } from '@tanstack/react-query'
import { queryOptions, useQuery } from '@tanstack/react-query'

export const listIdentitiesQueryKey = () => [{ url: '/identities' }] as const

export type ListIdentitiesQueryKey = ReturnType<typeof listIdentitiesQueryKey>

/**
 * @summary List all identities
 * {@link /identities}
 */
async function listIdentities(config: Partial<RequestConfig> = {}) {
  const res = await client<ListIdentitiesQueryResponse, ResponseErrorConfig<Error>, unknown>({ method: 'GET', url: `/identities`, ...config })
  return res
}

export function listIdentitiesQueryOptions(config: Partial<RequestConfig> = {}) {
  const queryKey = listIdentitiesQueryKey()
  return queryOptions<ResponseConfig<ListIdentitiesQueryResponse>, ResponseErrorConfig<Error>, ResponseConfig<ListIdentitiesQueryResponse>, typeof queryKey>({
    queryKey,
    queryFn: async ({ signal }) => {
      config.signal = signal
      return listIdentities(config)
    },
  })
}

/**
 * @summary List all identities
 * {@link /identities}
 */
export function useListIdentities<
  TData = ResponseConfig<ListIdentitiesQueryResponse>,
  TQueryData = ResponseConfig<ListIdentitiesQueryResponse>,
  TQueryKey extends QueryKey = ListIdentitiesQueryKey,
>(
  options: {
    query?: Partial<QueryObserverOptions<ResponseConfig<ListIdentitiesQueryResponse>, ResponseErrorConfig<Error>, TData, TQueryData, TQueryKey>>
    client?: Partial<RequestConfig>
  } = {},
) {
  const { query: queryOptions, client: config = {} } = options ?? {}
  const queryKey = queryOptions?.queryKey ?? listIdentitiesQueryKey()

  const query = useQuery({
    ...(listIdentitiesQueryOptions(config) as unknown as QueryObserverOptions),
    queryKey,
    ...(queryOptions as unknown as Omit<QueryObserverOptions, 'queryKey'>),
  }) as UseQueryResult<TData, ResponseErrorConfig<Error>> & { queryKey: TQueryKey }

  query.queryKey = queryKey as TQueryKey

  return query
}