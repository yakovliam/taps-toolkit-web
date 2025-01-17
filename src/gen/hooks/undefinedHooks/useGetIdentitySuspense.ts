import client from '@/lib/client'
import type { GetIdentityQueryResponse, GetIdentityPathParams } from '../../types/GetIdentity.ts'
import type { RequestConfig, ResponseErrorConfig, ResponseConfig } from '@/lib/client'
import type { QueryKey, UseSuspenseQueryOptions, UseSuspenseQueryResult } from '@tanstack/react-query'
import { queryOptions, useSuspenseQuery } from '@tanstack/react-query'

export const getIdentitySuspenseQueryKey = (id: GetIdentityPathParams['id']) => [{ url: '/identities/:id', params: { id: id } }] as const

export type GetIdentitySuspenseQueryKey = ReturnType<typeof getIdentitySuspenseQueryKey>

/**
 * @summary Get an identity by ID
 * {@link /identities/:id}
 */
async function getIdentity(id: GetIdentityPathParams['id'], config: Partial<RequestConfig> = {}) {
  const res = await client<GetIdentityQueryResponse, ResponseErrorConfig<Error>, unknown>({ method: 'GET', url: `/identities/${id}`, ...config })
  return res
}

export function getIdentitySuspenseQueryOptions(id: GetIdentityPathParams['id'], config: Partial<RequestConfig> = {}) {
  const queryKey = getIdentitySuspenseQueryKey(id)
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
export function useGetIdentitySuspense<
  TData = ResponseConfig<GetIdentityQueryResponse>,
  TQueryData = ResponseConfig<GetIdentityQueryResponse>,
  TQueryKey extends QueryKey = GetIdentitySuspenseQueryKey,
>(
  id: GetIdentityPathParams['id'],
  options: {
    query?: Partial<UseSuspenseQueryOptions<ResponseConfig<GetIdentityQueryResponse>, ResponseErrorConfig<Error>, TData, TQueryKey>>
    client?: Partial<RequestConfig>
  } = {},
) {
  const { query: queryOptions, client: config = {} } = options ?? {}
  const queryKey = queryOptions?.queryKey ?? getIdentitySuspenseQueryKey(id)

  const query = useSuspenseQuery({
    ...(getIdentitySuspenseQueryOptions(id, config) as unknown as UseSuspenseQueryOptions),
    queryKey,
    ...(queryOptions as unknown as Omit<UseSuspenseQueryOptions, 'queryKey'>),
  }) as UseSuspenseQueryResult<TData, ResponseErrorConfig<Error>> & { queryKey: TQueryKey }

  query.queryKey = queryKey as TQueryKey

  return query
}