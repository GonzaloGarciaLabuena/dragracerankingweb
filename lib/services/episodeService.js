import { episodeApiClient } from '../client/episode/episodeApiClient'

export const episodeService = {
    async createEpisode(seasonId, newEpisode ) {
        const title = newEpisode.title
        const esFinal = newEpisode.esFinal
        return await episodeApiClient.create({seasonId, title, esFinal})
    },

    async getEpisodes(seasonId) {
        if (!seasonId?.trim()) {
            throw new Error('Season for the episode is required')
        }
        return await episodeApiClient.get(seasonId)
    },

    async deleteLastEpisode(seasonId) {
        if (!seasonId?.trim()) {
            throw new Error('Season for the episode is required')
        }
        return await episodeApiClient.deleteLast(seasonId)
    },

    async updateEpisode(episode){
        const episodeId = episode.id
        const title = episode.title
        const esFinal = episode.esFinal
        return await episodeApiClient.update({episodeId, title, esFinal})
    }
}