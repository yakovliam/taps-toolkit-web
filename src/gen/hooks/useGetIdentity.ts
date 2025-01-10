import client from '@/lib/client'
import type { GetIdentityQueryResponse, GetIdentityPathParams } from '../types/GetIdentity.ts'
import type { RequestConfig, ResponseConfig } from '@/lib/client'
import type { QueryKey, QueryObserverOptions, UseQueryResult } from '@tanstack/react-query'
import { queryOptions, useQuery } from '@tanstack/react-query'

export const getIdentityQueryKey = (uid: GetIdentityPathParams['uid']) => [{ url: '/identities/:uid', params: { uid: uid } }] as const

export type GetIdentityQueryKey = ReturnType<typeof getIdentityQueryKey>

/**
 * @summary Get an identity by UID
 * {@link /identities/:uid}
 */
async function getIdentity(uid: GetIdentityPathParams['uid'], config: Partial<RequestConfig> = {}) {
  const res = await client<GetIdentityQueryResponse, Error, unknown>({ method: 'GET', url: `/identities/${uid}`, ...config })
  return res
}

export function getIdentityQueryOptions(uid: GetIdentityPathParams['uid'], config: Partial<RequestConfig> = {}) {
  const queryKey = getIdentityQueryKey(uid)
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
export function useGetIdentity<
  TData = ResponseConfig<GetIdentityQueryResponse>,
  TQueryData = ResponseConfig<GetIdentityQueryResponse>,
  TQueryKey extends QueryKey = GetIdentityQueryKey,
>(
  uid: GetIdentityPathParams['uid'],
  options: {
    query?: Partial<QueryObserverOptions<ResponseConfig<GetIdentityQueryResponse>, Error, TData, TQueryData, TQueryKey>>
    client?: Partial<RequestConfig>
  } = {},
) {
  const { query: queryOptions, client: config = {} } = options ?? {}
  const queryKey = queryOptions?.queryKey ?? getIdentityQueryKey(uid)

  const query = useQuery({
    ...(getIdentityQueryOptions(uid, config) as unknown as QueryObserverOptions),
    queryKey,
    ...(queryOptions as unknown as Omit<QueryObserverOptions, 'queryKey'>),
  }) as UseQueryResult<TData, Error> & { queryKey: TQueryKey }

  query.queryKey = queryKey as TQueryKey

  return query
}