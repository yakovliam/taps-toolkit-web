import type { Job } from './Job.ts'
import type { JobCreateRequest } from './JobCreateRequest.ts'

/**
 * @description The job
 */
export type CreateJob200 = Job

export type CreateJobMutationRequest = JobCreateRequest

export type CreateJobMutationResponse = CreateJob200

export type CreateJobMutation = {
  Response: CreateJob200
  Request: CreateJobMutationRequest
  Errors: any
}