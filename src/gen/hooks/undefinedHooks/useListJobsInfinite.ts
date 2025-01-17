import client from '@/lib/client'
import type { ListJobsQueryResponse } from '../../types/ListJobs.ts'
import type { RequestConfig, ResponseErrorConfig, ResponseConfig } from '@/lib/client'
import type { InfiniteData, QueryKey, InfiniteQueryObserverOptions, UseInfiniteQueryResult } from '@tanstack/react-query'
import { infiniteQueryOptions, useInfiniteQuery } from '@tanstack/react-query'

export const listJobsInfiniteQueryKey = () => [{ url: '/jobs' }] as const

export type ListJobsInfiniteQueryKey = ReturnType<typeof listJobsInfiniteQueryKey>

/**
 * @summary List all jobs
 * {@link /jobs}
 */
async function listJobs(config: Partial<RequestConfig> = {}) {
  const res = await client<ListJobsQueryResponse, ResponseErrorConfig<Error>, unknown>({ method: 'GET', url: `/jobs`, ...config })
  return res
}

export function listJobsInfiniteQueryOptions(config: Partial<RequestConfig> = {}) {
  const queryKey = listJobsInfiniteQueryKey()
  return infiniteQueryOptions<ResponseConfig<ListJobsQueryResponse>, ResponseErrorConfig<Error>, ResponseConfig<ListJobsQueryResponse>, typeof queryKey>({
    queryKey,
    queryFn: async ({ signal }) => {
      config.signal = signal
      return listJobs(config)
    },
    initialPageParam: 0,
    getNextPageParam: (lastPage) => lastPage['nextCursor'],
    getPreviousPageParam: (firstPage) => firstPage['nextCursor'],
  })
}

/**
 * @summary List all jobs
 * {@link /jobs}
 */
export function useListJobsInfinite<
  TData = InfiniteData<ResponseConfig<ListJobsQueryResponse>>,
  TQueryData = ResponseConfig<ListJobsQueryResponse>,
  TQueryKey extends QueryKey = ListJobsInfiniteQueryKey,
>(
  options: {
    query?: Partial<InfiniteQueryObserverOptions<ResponseConfig<ListJobsQueryResponse>, ResponseErrorConfig<Error>, TData, TQueryData, TQueryKey>>
    client?: Partial<RequestConfig>
  } = {},
) {
  const { query: queryOptions, client: config = {} } = options ?? {}
  const queryKey = queryOptions?.queryKey ?? listJobsInfiniteQueryKey()

  const query = useInfiniteQuery({
    ...(listJobsInfiniteQueryOptions(config) as unknown as InfiniteQueryObserverOptions),
    queryKey,
    ...(queryOptions as unknown as Omit<InfiniteQueryObserverOptions, 'queryKey'>),
  }) as UseInfiniteQueryResult<TData, ResponseErrorConfig<Error>> & { queryKey: TQueryKey }

  query.queryKey = queryKey as TQueryKey

  return query
}