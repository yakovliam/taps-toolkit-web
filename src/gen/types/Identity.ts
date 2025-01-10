export type Identity = {
  /**
   * @type string | undefined
   */
  uid?: string
  /**
   * @type string | undefined
   */
  deviceUid?: string
  /**
   * @type boolean | undefined
   */
  isBanned?: boolean
  /**
   * @type boolean | undefined
   */
  isDeleted?: boolean
  /**
   * @type integer | undefined, int64
   */
  usdBalance?: number
  /**
   * @type integer | undefined, int64
   */
  gemsBalance?: number
}