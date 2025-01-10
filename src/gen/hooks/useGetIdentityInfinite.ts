import client from '@/lib/client'
import type { GetIdentityQueryResponse, GetIdentityPathParams } from '../types/GetIdentity.ts'
import type { RequestConfig, ResponseConfig } from '@/lib/client'
import type { InfiniteData, QueryKey, InfiniteQueryObserverOptions, UseInfiniteQueryResult } from '@tanstack/react-query'
import { infiniteQueryOptions, useInfiniteQuery } from '@tanstack/react-query'

export const getIdentityInfiniteQueryKey = (uid: GetIdentityPathParams['uid']) => [{ url: '/identities/:uid', params: { uid: uid } }] as const

export type GetIdentityInfiniteQueryKey = ReturnType<typeof getIdentityInfiniteQueryKey>

/**
 * @summary Get an identity by UID
 * {@link /identities/:uid}
 */
async function getIdentity(uid: GetIdentityPathParams['uid'], config: Partial<RequestConfig> = {}) {
  const res = await client<GetIdentityQueryResponse, Error, unknown>({ method: 'GET', url: `/identities/${uid}`, ...config })
  return res
}

export function getIdentityInfiniteQueryOptions(uid: GetIdentityPathParams['uid'], config: Partial<RequestConfig> = {}) {
  const queryKey = getIdentityInfiniteQueryKey(uid)
  return infiniteQueryOptions<ResponseConfig<GetIdentityQueryResponse>, Error, ResponseConfig<GetIdentityQueryResponse>, typeof queryKey>({
    enabled: !!uid,
    queryKey,
    queryFn: async ({ signal }) => {
      config.signal = signal
      return getIdentity(uid, config)
    },
    initialPageParam: 0,
    getNextPageParam: (lastPage) => lastPage['nextCursor'],
    getPreviousPageParam: (firstPage) => firstPage['nextCursor'],
  })
}

/**
 * @summary Get an identity by UID
 * {@link /identities/:uid}
 */
export function useGetIdentityInfinite<
  TData = InfiniteData<ResponseConfig<GetIdentityQueryResponse>>,
  TQueryData = ResponseConfig<GetIdentityQueryResponse>,
  TQueryKey extends QueryKey = GetIdentityInfiniteQueryKey,
>(
  uid: GetIdentityPathParams['uid'],
  options: {
    query?: Partial<InfiniteQueryObserverOptions<ResponseConfig<GetIdentityQueryResponse>, Error, TData, TQueryData, TQueryKey>>
    client?: Partial<RequestConfig>
  } = {},
) {
  const { query: queryOptions, client: config = {} } = options ?? {}
  const queryKey = queryOptions?.queryKey ?? getIdentityInfiniteQueryKey(uid)

  const query = useInfiniteQuery({
    ...(getIdentityInfiniteQueryOptions(uid, config) as unknown as InfiniteQueryObserverOptions),
    queryKey,
    ...(queryOptions as unknown as Omit<InfiniteQueryObserverOptions, 'queryKey'>),
  }) as UseInfiniteQueryResult<TData, Error> & { queryKey: TQueryKey }

  query.queryKey = queryKey as TQueryKey

  return query
}