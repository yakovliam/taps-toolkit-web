import client from '@/lib/client'
import type { ListJobsQueryResponse } from '../../types/ListJobs.ts'
import type { RequestConfig, ResponseErrorConfig, ResponseConfig } from '@/lib/client'
import type { QueryKey, QueryObserverOptions, UseQueryResult } from '@tanstack/react-query'
import { queryOptions, useQuery } from '@tanstack/react-query'

export const listJobsQueryKey = () => [{ url: '/jobs' }] as const

export type ListJobsQueryKey = ReturnType<typeof listJobsQueryKey>

/**
 * @summary List all jobs
 * {@link /jobs}
 */
async function listJobs(config: Partial<RequestConfig> = {}) {
  const res = await client<ListJobsQueryResponse, ResponseErrorConfig<Error>, unknown>({ method: 'GET', url: `/jobs`, ...config })
  return res
}

export function listJobsQueryOptions(config: Partial<RequestConfig> = {}) {
  const queryKey = listJobsQueryKey()
  return queryOptions<ResponseConfig<ListJobsQueryResponse>, ResponseErrorConfig<Error>, ResponseConfig<ListJobsQueryResponse>, typeof queryKey>({
    queryKey,
    queryFn: async ({ signal }) => {
      config.signal = signal
      return listJobs(config)
    },
  })
}

/**
 * @summary List all jobs
 * {@link /jobs}
 */
export function useListJobs<
  TData = ResponseConfig<ListJobsQueryResponse>,
  TQueryData = ResponseConfig<ListJobsQueryResponse>,
  TQueryKey extends QueryKey = ListJobsQueryKey,
>(
  options: {
    query?: Partial<QueryObserverOptions<ResponseConfig<ListJobsQueryResponse>, ResponseErrorConfig<Error>, TData, TQueryData, TQueryKey>>
    client?: Partial<RequestConfig>
  } = {},
) {
  const { query: queryOptions, client: config = {} } = options ?? {}
  const queryKey = queryOptions?.queryKey ?? listJobsQueryKey()

  const query = useQuery({
    ...(listJobsQueryOptions(config) as unknown as QueryObserverOptions),
    queryKey,
    ...(queryOptions as unknown as Omit<QueryObserverOptions, 'queryKey'>),
  }) as UseQueryResult<TData, ResponseErrorConfig<Error>> & { queryKey: TQueryKey }

  query.queryKey = queryKey as TQueryKey

  return query
}