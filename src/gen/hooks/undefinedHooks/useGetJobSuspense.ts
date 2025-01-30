import client from '@/lib/client'
import type { GetJobQueryResponse, GetJobPathParams } from '../../types/GetJob.ts'
import type { RequestConfig, ResponseErrorConfig, ResponseConfig } from '@/lib/client'
import type { QueryKey, UseSuspenseQueryOptions, UseSuspenseQueryResult } from '@tanstack/react-query'
import { queryOptions, useSuspenseQuery } from '@tanstack/react-query'

export const getJobSuspenseQueryKey = (id: GetJobPathParams['id']) => [{ url: '/jobs/:id', params: { id: id } }] as const

export type GetJobSuspenseQueryKey = ReturnType<typeof getJobSuspenseQueryKey>

/**
 * @summary Get a job by ID
 * {@link /jobs/:id}
 */
async function getJob(id: GetJobPathParams['id'], config: Partial<RequestConfig> = {}) {
  const res = await client<GetJobQueryResponse, ResponseErrorConfig<Error>, unknown>({ method: 'GET', url: `/jobs/${id}`, ...config })
  return res
}

export function getJobSuspenseQueryOptions(id: GetJobPathParams['id'], config: Partial<RequestConfig> = {}) {
  const queryKey = getJobSuspenseQueryKey(id)
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
export function useGetJobSuspense<
  TData = ResponseConfig<GetJobQueryResponse>,
  TQueryData = ResponseConfig<GetJobQueryResponse>,
  TQueryKey extends QueryKey = GetJobSuspenseQueryKey,
>(
  id: GetJobPathParams['id'],
  options: {
    query?: Partial<UseSuspenseQueryOptions<ResponseConfig<GetJobQueryResponse>, ResponseErrorConfig<Error>, TData, TQueryKey>>
    client?: Partial<RequestConfig>
  } = {},
) {
  const { query: queryOptions, client: config = {} } = options ?? {}
  const queryKey = queryOptions?.queryKey ?? getJobSuspenseQueryKey(id)

  const query = useSuspenseQuery({
    ...(getJobSuspenseQueryOptions(id, config) as unknown as UseSuspenseQueryOptions),
    queryKey,
    ...(queryOptions as unknown as Omit<UseSuspenseQueryOptions, 'queryKey'>),
  }) as UseSuspenseQueryResult<TData, ResponseErrorConfig<Error>> & { queryKey: TQueryKey }

  query.queryKey = queryKey as TQueryKey

  return query
}