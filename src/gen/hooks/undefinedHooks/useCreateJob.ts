import client from '@/lib/client'
import type { CreateJobMutationRequest, CreateJobMutationResponse } from '../../types/CreateJob.ts'
import type { RequestConfig, ResponseConfig, ResponseErrorConfig } from '@/lib/client'
import type { UseMutationOptions } from '@tanstack/react-query'
import { useMutation } from '@tanstack/react-query'

export const createJobMutationKey = () => [{ url: '/jobs/create' }] as const

export type CreateJobMutationKey = ReturnType<typeof createJobMutationKey>

/**
 * @summary Create a job
 * {@link /jobs/create}
 */
async function createJob(data: CreateJobMutationRequest, config: Partial<RequestConfig<CreateJobMutationRequest>> = {}) {
  const res = await client<CreateJobMutationResponse, ResponseErrorConfig<Error>, CreateJobMutationRequest>({
    method: 'POST',
    url: `/jobs/create`,
    data,
    ...config,
  })
  return res
}

/**
 * @summary Create a job
 * {@link /jobs/create}
 */
export function useCreateJob(
  options: {
    mutation?: UseMutationOptions<ResponseConfig<CreateJobMutationResponse>, ResponseErrorConfig<Error>, { data: CreateJobMutationRequest }>
    client?: Partial<RequestConfig<CreateJobMutationRequest>>
  } = {},
) {
  const { mutation: mutationOptions, client: config = {} } = options ?? {}
  const mutationKey = mutationOptions?.mutationKey ?? createJobMutationKey()

  return useMutation<ResponseConfig<CreateJobMutationResponse>, ResponseErrorConfig<Error>, { data: CreateJobMutationRequest }>({
    mutationFn: async ({ data }) => {
      return createJob(data, config)
    },
    mutationKey,
    ...mutationOptions,
  })
}