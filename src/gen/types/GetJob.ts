import type { Job } from './Job.ts'

export type GetJobPathParams = {
  /**
   * @description The ID of the job to retrieve
   * @type string
   */
  id: string
}

/**
 * @description The job
 */
export type GetJob200 = Job

export type GetJobQueryResponse = GetJob200

export type GetJobQuery = {
  Response: GetJob200
  PathParams: GetJobPathParams
  Errors: any
}