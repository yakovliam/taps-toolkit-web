import client from '@/lib/client'
import type { CalculateEloQueryResponse, CalculateEloPathParams } from '../types/CalculateElo.ts'
import type { RequestConfig, ResponseConfig } from '@/lib/client'
import type { QueryKey, UseSuspenseQueryOptions, UseSuspenseQueryResult } from '@tanstack/react-query'
import { queryOptions, useSuspenseQuery } from '@tanstack/react-query'

export const calculateEloSuspenseQueryKey = (uid: CalculateEloPathParams['uid']) => [{ url: '/identities/:uid/calculate-elo', params: { uid: uid } }] as const

export type CalculateEloSuspenseQueryKey = ReturnType<typeof calculateEloSuspenseQueryKey>

/**
 * @summary Calculate the ELO of an identity
 * {@link /identities/:uid/calculate-elo}
 */
async function calculateElo(uid: CalculateEloPathParams['uid'], config: Partial<RequestConfig> = {}) {
  const res = await client<CalculateEloQueryResponse, Error, unknown>({ method: 'GET', url: `/identities/${uid}/calculate-elo`, ...config })
  return res
}

export function calculateEloSuspenseQueryOptions(uid: CalculateEloPathParams['uid'], config: Partial<RequestConfig> = {}) {
  const queryKey = calculateEloSuspenseQueryKey(uid)
  return queryOptions<ResponseConfig<CalculateEloQueryResponse>, Error, ResponseConfig<CalculateEloQueryResponse>, typeof queryKey>({
    enabled: !!uid,
    queryKey,
    queryFn: async ({ signal }) => {
      config.signal = signal
      return calculateElo(uid, config)
    },
  })
}

/**
 * @summary Calculate the ELO of an identity
 * {@link /identities/:uid/calculate-elo}
 */
export function useCalculateEloSuspense<
  TData = ResponseConfig<CalculateEloQueryResponse>,
  TQueryData = ResponseConfig<CalculateEloQueryResponse>,
  TQueryKey extends QueryKey = CalculateEloSuspenseQueryKey,
>(
  uid: CalculateEloPathParams['uid'],
  options: {
    query?: Partial<UseSuspenseQueryOptions<ResponseConfig<CalculateEloQueryResponse>, Error, TData, TQueryKey>>
    client?: Partial<RequestConfig>
  } = {},
) {
  const { query: queryOptions, client: config = {} } = options ?? {}
  const queryKey = queryOptions?.queryKey ?? calculateEloSuspenseQueryKey(uid)

  const query = useSuspenseQuery({
    ...(calculateEloSuspenseQueryOptions(uid, config) as unknown as UseSuspenseQueryOptions),
    queryKey,
    ...(queryOptions as unknown as Omit<UseSuspenseQueryOptions, 'queryKey'>),
  }) as UseSuspenseQueryResult<TData, Error> & { queryKey: TQueryKey }

  query.queryKey = queryKey as TQueryKey

  return query
}