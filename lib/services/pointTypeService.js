import { pointtypeApiClient } from '../client/episode/pointtypeApiClient'

export const pointTypeService = {
    async getPointTypes(mode) {
        return await pointtypeApiClient.getAll(mode)
    },
}