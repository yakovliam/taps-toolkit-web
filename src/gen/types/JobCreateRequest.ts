export type JobCreateRequest = {
  /**
   * @type string
   */
  friendlyName: string
  /**
   * @type string
   */
  description: string
  /**
   * @type integer, int64
   */
  targetFinalScore: number
  /**
   * @type string
   */
  gameConfigId: string
  /**
   * @type string
   */
  identityId: string
}