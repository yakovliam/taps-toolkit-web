import client from '@/lib/client'
import type { CalculateEloQueryResponse, CalculateEloPathParams } from '../types/CalculateElo.ts'
import type { RequestConfig, ResponseConfig } from '@/lib/client'
import type { QueryKey, QueryObserverOptions, UseQueryResult } from '@tanstack/react-query'
import { queryOptions, useQuery } from '@tanstack/react-query'

export const calculateEloQueryKey = (uid: CalculateEloPathParams['uid']) => [{ url: '/identities/:uid/calculate-elo', params: { uid: uid } }] as const

export type CalculateEloQueryKey = ReturnType<typeof calculateEloQueryKey>

/**
 * @summary Calculate the ELO of an identity
 * {@link /identities/:uid/calculate-elo}
 */
async function calculateElo(uid: CalculateEloPathParams['uid'], config: Partial<RequestConfig> = {}) {
  const res = await client<CalculateEloQueryResponse, Error, unknown>({ method: 'GET', url: `/identities/${uid}/calculate-elo`, ...config })
  return res
}

export function calculateEloQueryOptions(uid: CalculateEloPathParams['uid'], config: Partial<RequestConfig> = {}) {
  const queryKey = calculateEloQueryKey(uid)
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
export function useCalculateElo<
  TData = ResponseConfig<CalculateEloQueryResponse>,
  TQueryData = ResponseConfig<CalculateEloQueryResponse>,
  TQueryKey extends QueryKey = CalculateEloQueryKey,
>(
  uid: CalculateEloPathParams['uid'],
  options: {
    query?: Partial<QueryObserverOptions<ResponseConfig<CalculateEloQueryResponse>, Error, TData, TQueryData, TQueryKey>>
    client?: Partial<RequestConfig>
  } = {},
) {
  const { query: queryOptions, client: config = {} } = options ?? {}
  const queryKey = queryOptions?.queryKey ?? calculateEloQueryKey(uid)

  const query = useQuery({
    ...(calculateEloQueryOptions(uid, config) as unknown as QueryObserverOptions),
    queryKey,
    ...(queryOptions as unknown as Omit<QueryObserverOptions, 'queryKey'>),
  }) as UseQueryResult<TData, Error> & { queryKey: TQueryKey }

  query.queryKey = queryKey as TQueryKey

  return query
}