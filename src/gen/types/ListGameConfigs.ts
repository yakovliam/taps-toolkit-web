import type { GameConfig } from './GameConfig.ts'

/**
 * @description A list of game configs
 */
export type ListGameConfigs200 = GameConfig[]

export type ListGameConfigsQueryResponse = ListGameConfigs200

export type ListGameConfigsQuery = {
  Response: ListGameConfigs200
  Errors: any
}