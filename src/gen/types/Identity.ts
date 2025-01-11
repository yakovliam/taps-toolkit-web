export type Identity = {
  /**
   * @type string
   */
  uid: string
  /**
   * @type string
   */
  deviceUid: string
  /**
   * @type boolean
   */
  isBanned: boolean
  /**
   * @type boolean
   */
  isDeleted: boolean
  /**
   * @type integer, int64
   */
  usdBalance: number
  /**
   * @type integer, int64
   */
  gemsBalance: number
}