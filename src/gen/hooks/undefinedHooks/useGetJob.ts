import client from '@/lib/client'
import type { GetJobQueryResponse, GetJobPathParams } from '../../types/GetJob.ts'
import type { RequestConfig, ResponseErrorConfig, ResponseConfig } from '@/lib/client'
import type { QueryKey, QueryObserverOptions, UseQueryResult } from '@tanstack/react-query'
import { queryOptions, useQuery } from '@tanstack/react-query'

export const getJobQueryKey = (id: GetJobPathParams['id']) => [{ url: '/jobs/:id', params: { id: id } }] as const

export type GetJobQueryKey = ReturnType<typeof getJobQueryKey>

/**
 * @summary Get a job by ID
 * {@link /jobs/:id}
 */
async function getJob(id: GetJobPathParams['id'], config: Partial<RequestConfig> = {}) {
  const res = await client<GetJobQueryResponse, ResponseErrorConfig<Error>, unknown>({ method: 'GET', url: `/jobs/${id}`, ...config })
  return res
}

export function getJobQueryOptions(id: GetJobPathParams['id'], config: Partial<RequestConfig> = {}) {
  const queryKey = getJobQueryKey(id)
  return queryOptions<ResponseConfig<GetJobQueryResponse>, ResponseErrorConfig<Error>, ResponseConfig<GetJobQueryResponse>, typeof queryKey>({
    enabled: !!id,
    queryKey,
    queryFn: async ({ signal }) => {
      config.signal = signal
      return getJob(id, config)
    },
  })
}

/**
 * @summary Get a job by ID
 * {@link /jobs/:id}
 */
export function useGetJob<
  TData = ResponseConfig<GetJobQueryResponse>,
  TQueryData = ResponseConfig<GetJobQueryResponse>,
  TQueryKey extends QueryKey = GetJobQueryKey,
>(
  id: GetJobPathParams['id'],
  options: {
    query?: Partial<QueryObserverOptions<ResponseConfig<GetJobQueryResponse>, ResponseErrorConfig<Error>, TData, TQueryData, TQueryKey>>
    client?: Partial<RequestConfig>
  } = {},
) {
  const { query: queryOptions, client: config = {} } = options ?? {}
  const queryKey = queryOptions?.queryKey ?? getJobQueryKey(id)

  const query = useQuery({
    ...(getJobQueryOptions(id, config) as unknown as QueryObserverOptions),
    queryKey,
    ...(queryOptions as unknown as Omit<QueryObserverOptions, 'queryKey'>),
  }) as UseQueryResult<TData, ResponseErrorConfig<Error>> & { queryKey: TQueryKey }

  query.queryKey = queryKey as TQueryKey

  return query
}