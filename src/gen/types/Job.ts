export type Job = {
  /**
   * @type string
   */
  id: string
  /**
   * @type string
   */
  friendlyName: string
  /**
   * @type string
   */
  description: string
  /**
   * @type string
   */
  subject: string
  /**
   * @type string, date-time
   */
  created: string
  /**
   * @type boolean
   */
  didComplete: boolean
  /**
   * @type boolean
   */
  isArchived: boolean
  /**
   * @type array
   */
  gameScoreIdList: string[]
  /**
   * @type string
   */
  identityId: string
  /**
   * @type string
   */
  gameConfigId: string
}