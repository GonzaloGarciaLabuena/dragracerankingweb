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
    },

    async getSeasonWinner(season, pointTypes) {
        const ranking = await this.getRanking(season, pointTypes)

        const queenScores = new Map()
        let winner = null

        for (const [key, pointType] of ranking) {
            const [queenId, episodeId] = key.split('|')

            // Si tiene WINNER
            if (pointType.id === 'point9') {
                winner = queenId
                break
            }

            // Sumar puntuación
            const currentScore = queenScores.get(queenId) || 0
            queenScores.set(queenId, currentScore + pointType.value)
        }

        // Si hay WINNER explícito
        if (winner) {
            return winner
        }

        // Si no hay WINNER, buscar la que más puntos tenga
        let highestScore = -Infinity
        let highestQueen = null

        for (const [queenId, score] of queenScores) {
            if (score > highestScore) {
                highestScore = score
                highestQueen = queenId
            }
        }

        return highestQueen
    },

    getHallOfFame: async (user) => {
        const userId = user ? user.id: null
        return await ppeApiClient.getHallOfFame(userId)
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