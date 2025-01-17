import type { Job } from './Job.ts'

/**
 * @description A list of jobs
 */
export type ListJobs200 = Job[]

export type ListJobsQueryResponse = ListJobs200

export type ListJobsQuery = {
  Response: ListJobs200
  Errors: any
}