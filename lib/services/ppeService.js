import { ppeApiClient } from '../client/ppe/ppeApiClient'

export const ppeService = {
    async saveRanking(season, queens, episodes, pointsMap) {
        const rows = rowsToSave(queens, episodes, pointsMap)
        const season_id = season.id
        return await ppeApiClient.saveRanking({season_id, rows});
    },
    
    async getRanking(season, pointTypes){
        const ranking = await ppeApiClient.getRanking(season.id)
        return createPPEMap(ranking, pointTypes)
    },

    async getRankingOfUser(user, season, pointTypes){
        const ranking = await ppeApiClient.getRankingUser(user.id, season.id)
        return createPPEMap(ranking, pointTypes)
    }, 
    async publishRanking(season){
        return await ppeApiClient.publishRanking(season.id)
    }
}

const createPPEMap = (ranking, pointTypes) => {
    const map = new Map()

    ranking.forEach(item => {
        const queenId = item.ppe_reference.queen_id.id
        const episodeId = item.ppe_reference.episode_id.id

        const key = `${queenId}|${episodeId}`

        const pointType = pointTypes.find(
            type => type.id === item.point_type_id.id
        )

        if (pointType) {
            map.set(key, pointType)
        }
    })

    return map
}

const rowsToSave = (queens, episodes, pointsMap) => {
    const rows = queens.flatMap(queen =>
        episodes.map(episode => {
            const key = `${queen.id}|${episode.id}`
            const point = pointsMap.get(key)

            return {
                queen_id: queen.id,
                episode_id: episode.id,
                point_type_id: point?.id ?? null
            }
        })
    )
    return rows
}