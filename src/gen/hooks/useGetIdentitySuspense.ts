import client from '@/lib/client'
import type { GetIdentityQueryResponse, GetIdentityPathParams } from '../types/GetIdentity.ts'
import type { RequestConfig, ResponseConfig } from '@/lib/client'
import type { QueryKey, UseSuspenseQueryOptions, UseSuspenseQueryResult } from '@tanstack/react-query'
import { queryOptions, useSuspenseQuery } from '@tanstack/react-query'

export const getIdentitySuspenseQueryKey = (uid: GetIdentityPathParams['uid']) => [{ url: '/identities/:uid', params: { uid: uid } }] as const

export type GetIdentitySuspenseQueryKey = ReturnType<typeof getIdentitySuspenseQueryKey>

/**
 * @summary Get an identity by UID
 * {@link /identities/:uid}
 */
async function getIdentity(uid: GetIdentityPathParams['uid'], config: Partial<RequestConfig> = {}) {
  const res = await client<GetIdentityQueryResponse, Error, unknown>({ method: 'GET', url: `/identities/${uid}`, ...config })
  return res
}

export function getIdentitySuspenseQueryOptions(uid: GetIdentityPathParams['uid'], config: Partial<RequestConfig> = {}) {
  const queryKey = getIdentitySuspenseQueryKey(uid)
  return queryOptions<ResponseConfig<GetIdentityQueryResponse>, Error, ResponseConfig<GetIdentityQueryResponse>, typeof queryKey>({
    enabled: !!uid,
    queryKey,
    queryFn: async ({ signal }) => {
      config.signal = signal
      return getIdentity(uid, config)
    },
  })
}

/**
 * @summary Get an identity by UID
 * {@link /identities/:uid}
 */
export function useGetIdentitySuspense<
  TData = ResponseConfig<GetIdentityQueryResponse>,
  TQueryData = ResponseConfig<GetIdentityQueryResponse>,
  TQueryKey extends QueryKey = GetIdentitySuspenseQueryKey,
>(
  uid: GetIdentityPathParams['uid'],
  options: {
    query?: Partial<UseSuspenseQueryOptions<ResponseConfig<GetIdentityQueryResponse>, Error, TData, TQueryKey>>
    client?: Partial<RequestConfig>
  } = {},
) {
  const { query: queryOptions, client: config = {} } = options ?? {}
  const queryKey = queryOptions?.queryKey ?? getIdentitySuspenseQueryKey(uid)

  const query = useSuspenseQuery({
    ...(getIdentitySuspenseQueryOptions(uid, config) as unknown as UseSuspenseQueryOptions),
    queryKey,
    ...(queryOptions as unknown as Omit<UseSuspenseQueryOptions, 'queryKey'>),
  }) as UseSuspenseQueryResult<TData, Error> & { queryKey: TQueryKey }

  query.queryKey = queryKey as TQueryKey

  return query
}