import client from '@/lib/client'
import type { ListJobsQueryResponse } from '../../types/ListJobs.ts'
import type { RequestConfig, ResponseErrorConfig, ResponseConfig } from '@/lib/client'
import type { QueryKey, UseSuspenseQueryOptions, UseSuspenseQueryResult } from '@tanstack/react-query'
import { queryOptions, useSuspenseQuery } from '@tanstack/react-query'

export const listJobsSuspenseQueryKey = () => [{ url: '/jobs' }] as const

export type ListJobsSuspenseQueryKey = ReturnType<typeof listJobsSuspenseQueryKey>

/**
 * @summary List all jobs
 * {@link /jobs}
 */
async function listJobs(config: Partial<RequestConfig> = {}) {
  const res = await client<ListJobsQueryResponse, ResponseErrorConfig<Error>, unknown>({ method: 'GET', url: `/jobs`, ...config })
  return res
}

export function listJobsSuspenseQueryOptions(config: Partial<RequestConfig> = {}) {
  const queryKey = listJobsSuspenseQueryKey()
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
export function useListJobsSuspense<
  TData = ResponseConfig<ListJobsQueryResponse>,
  TQueryData = ResponseConfig<ListJobsQueryResponse>,
  TQueryKey extends QueryKey = ListJobsSuspenseQueryKey,
>(
  options: {
    query?: Partial<UseSuspenseQueryOptions<ResponseConfig<ListJobsQueryResponse>, ResponseErrorConfig<Error>, TData, TQueryKey>>
    client?: Partial<RequestConfig>
  } = {},
) {
  const { query: queryOptions, client: config = {} } = options ?? {}
  const queryKey = queryOptions?.queryKey ?? listJobsSuspenseQueryKey()

  const query = useSuspenseQuery({
    ...(listJobsSuspenseQueryOptions(config) as unknown as UseSuspenseQueryOptions),
    queryKey,
    ...(queryOptions as unknown as Omit<UseSuspenseQueryOptions, 'queryKey'>),
  }) as UseSuspenseQueryResult<TData, ResponseErrorConfig<Error>> & { queryKey: TQueryKey }

  query.queryKey = queryKey as TQueryKey

  return query
}