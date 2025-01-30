import client from '@/lib/client'
import type { GetJobQueryResponse, GetJobPathParams } from '../../types/GetJob.ts'
import type { RequestConfig, ResponseErrorConfig, ResponseConfig } from '@/lib/client'
import type { InfiniteData, QueryKey, InfiniteQueryObserverOptions, UseInfiniteQueryResult } from '@tanstack/react-query'
import { infiniteQueryOptions, useInfiniteQuery } from '@tanstack/react-query'

export const getJobInfiniteQueryKey = (id: GetJobPathParams['id']) => [{ url: '/jobs/:id', params: { id: id } }] as const

export type GetJobInfiniteQueryKey = ReturnType<typeof getJobInfiniteQueryKey>

/**
 * @summary Get a job by ID
 * {@link /jobs/:id}
 */
async function getJob(id: GetJobPathParams['id'], config: Partial<RequestConfig> = {}) {
  const res = await client<GetJobQueryResponse, ResponseErrorConfig<Error>, unknown>({ method: 'GET', url: `/jobs/${id}`, ...config })
  return res
}

export function getJobInfiniteQueryOptions(id: GetJobPathParams['id'], config: Partial<RequestConfig> = {}) {
  const queryKey = getJobInfiniteQueryKey(id)
  return infiniteQueryOptions<ResponseConfig<GetJobQueryResponse>, ResponseErrorConfig<Error>, ResponseConfig<GetJobQueryResponse>, typeof queryKey>({
    enabled: !!id,
    queryKey,
    queryFn: async ({ signal }) => {
      config.signal = signal
      return getJob(id, config)
    },
    initialPageParam: 0,
    getNextPageParam: (lastPage) => lastPage['nextCursor'],
    getPreviousPageParam: (firstPage) => firstPage['nextCursor'],
  })
}

/**
 * @summary Get a job by ID
 * {@link /jobs/:id}
 */
export function useGetJobInfinite<
  TData = InfiniteData<ResponseConfig<GetJobQueryResponse>>,
  TQueryData = ResponseConfig<GetJobQueryResponse>,
  TQueryKey extends QueryKey = GetJobInfiniteQueryKey,
>(
  id: GetJobPathParams['id'],
  options: {
    query?: Partial<InfiniteQueryObserverOptions<ResponseConfig<GetJobQueryResponse>, ResponseErrorConfig<Error>, TData, TQueryData, TQueryKey>>
    client?: Partial<RequestConfig>
  } = {},
) {
  const { query: queryOptions, client: config = {} } = options ?? {}
  const queryKey = queryOptions?.queryKey ?? getJobInfiniteQueryKey(id)

  const query = useInfiniteQuery({
    ...(getJobInfiniteQueryOptions(id, config) as unknown as InfiniteQueryObserverOptions),
    queryKey,
    ...(queryOptions as unknown as Omit<InfiniteQueryObserverOptions, 'queryKey'>),
  }) as UseInfiniteQueryResult<TData, ResponseErrorConfig<Error>> & { queryKey: TQueryKey }

  query.queryKey = queryKey as TQueryKey

  return query
}