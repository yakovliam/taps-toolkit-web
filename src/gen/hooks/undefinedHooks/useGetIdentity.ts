import client from '@/lib/client'
import type { GetIdentityQueryResponse, GetIdentityPathParams } from '../../types/GetIdentity.ts'
import type { RequestConfig, ResponseErrorConfig, ResponseConfig } from '@/lib/client'
import type { QueryKey, QueryObserverOptions, UseQueryResult } from '@tanstack/react-query'
import { queryOptions, useQuery } from '@tanstack/react-query'

export const getIdentityQueryKey = (id: GetIdentityPathParams['id']) => [{ url: '/identities/:id', params: { id: id } }] as const

export type GetIdentityQueryKey = ReturnType<typeof getIdentityQueryKey>

/**
 * @summary Get an identity by ID
 * {@link /identities/:id}
 */
async function getIdentity(id: GetIdentityPathParams['id'], config: Partial<RequestConfig> = {}) {
  const res = await client<GetIdentityQueryResponse, ResponseErrorConfig<Error>, unknown>({ method: 'GET', url: `/identities/${id}`, ...config })
  return res
}

export function getIdentityQueryOptions(id: GetIdentityPathParams['id'], config: Partial<RequestConfig> = {}) {
  const queryKey = getIdentityQueryKey(id)
  return queryOptions<ResponseConfig<GetIdentityQueryResponse>, ResponseErrorConfig<Error>, ResponseConfig<GetIdentityQueryResponse>, typeof queryKey>({
    enabled: !!id,
    queryKey,
    queryFn: async ({ signal }) => {
      config.signal = signal
      return getIdentity(id, config)
    },
  })
}

/**
 * @summary Get an identity by ID
 * {@link /identities/:id}
 */
export function useGetIdentity<
  TData = ResponseConfig<GetIdentityQueryResponse>,
  TQueryData = ResponseConfig<GetIdentityQueryResponse>,
  TQueryKey extends QueryKey = GetIdentityQueryKey,
>(
  id: GetIdentityPathParams['id'],
  options: {
    query?: Partial<QueryObserverOptions<ResponseConfig<GetIdentityQueryResponse>, ResponseErrorConfig<Error>, TData, TQueryData, TQueryKey>>
    client?: Partial<RequestConfig>
  } = {},
) {
  const { query: queryOptions, client: config = {} } = options ?? {}
  const queryKey = queryOptions?.queryKey ?? getIdentityQueryKey(id)

  const query = useQuery({
    ...(getIdentityQueryOptions(id, config) as unknown as QueryObserverOptions),
    queryKey,
    ...(queryOptions as unknown as Omit<QueryObserverOptions, 'queryKey'>),
  }) as UseQueryResult<TData, ResponseErrorConfig<Error>> & { queryKey: TQueryKey }

  query.queryKey = queryKey as TQueryKey

  return query
}