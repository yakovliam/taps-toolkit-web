import client from '@/lib/client'
import type { ListIdentitiesQueryResponse } from '../../types/ListIdentities.ts'
import type { RequestConfig, ResponseErrorConfig, ResponseConfig } from '@/lib/client'
import type { QueryKey, UseSuspenseQueryOptions, UseSuspenseQueryResult } from '@tanstack/react-query'
import { queryOptions, useSuspenseQuery } from '@tanstack/react-query'

export const listIdentitiesSuspenseQueryKey = () => [{ url: '/identities' }] as const

export type ListIdentitiesSuspenseQueryKey = ReturnType<typeof listIdentitiesSuspenseQueryKey>

/**
 * @summary List all identities
 * {@link /identities}
 */
async function listIdentities(config: Partial<RequestConfig> = {}) {
  const res = await client<ListIdentitiesQueryResponse, ResponseErrorConfig<Error>, unknown>({ method: 'GET', url: `/identities`, ...config })
  return res
}

export function listIdentitiesSuspenseQueryOptions(config: Partial<RequestConfig> = {}) {
  const queryKey = listIdentitiesSuspenseQueryKey()
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
export function useListIdentitiesSuspense<
  TData = ResponseConfig<ListIdentitiesQueryResponse>,
  TQueryData = ResponseConfig<ListIdentitiesQueryResponse>,
  TQueryKey extends QueryKey = ListIdentitiesSuspenseQueryKey,
>(
  options: {
    query?: Partial<UseSuspenseQueryOptions<ResponseConfig<ListIdentitiesQueryResponse>, ResponseErrorConfig<Error>, TData, TQueryKey>>
    client?: Partial<RequestConfig>
  } = {},
) {
  const { query: queryOptions, client: config = {} } = options ?? {}
  const queryKey = queryOptions?.queryKey ?? listIdentitiesSuspenseQueryKey()

  const query = useSuspenseQuery({
    ...(listIdentitiesSuspenseQueryOptions(config) as unknown as UseSuspenseQueryOptions),
    queryKey,
    ...(queryOptions as unknown as Omit<UseSuspenseQueryOptions, 'queryKey'>),
  }) as UseSuspenseQueryResult<TData, ResponseErrorConfig<Error>> & { queryKey: TQueryKey }

  query.queryKey = queryKey as TQueryKey

  return query
}