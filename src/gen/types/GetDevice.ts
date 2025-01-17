import type { Device } from './Device.ts'

export type GetDevicePathParams = {
  /**
   * @description The ID of the device to retrieve
   * @type string
   */
  id: string
}

/**
 * @description The device
 */
export type GetDevice200 = Device

export type GetDeviceQueryResponse = GetDevice200

export type GetDeviceQuery = {
  Response: GetDevice200
  PathParams: GetDevicePathParams
  Errors: any
}