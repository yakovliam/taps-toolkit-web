import type { Device } from './Device.ts'

/**
 * @description A list of devices
 */
export type ListDevices200 = Device[]

export type ListDevicesQueryResponse = ListDevices200

export type ListDevicesQuery = {
  Response: ListDevices200
  Errors: any
}