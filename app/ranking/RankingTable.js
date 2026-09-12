import styles from './page.module.css'
import RankingRow from './RankingRow'

export default function RankingTable({
    queens,
    episodes,
    pointTypes,
    pointsMap,
    setPointsMap,
    activeCell,
    setActiveCell,
    saveRanking
}) {

    const calculateScore = (queenId) => {
    
        let totalScore = 0
        let totalEpisodes = 0
        for (const [currentKey, point] of pointsMap) {
            
            const currentQueenId = currentKey.split('|')[0]

            if (currentQueenId === queenId) {
                totalScore += point.value 
                totalEpisodes++
            }
        }

        return totalEpisodes > 0 ? (totalScore / totalEpisodes).toFixed(3) : 0.000
    }

    const rankedQueens = [...queens]
        .map(queen => ({
            ...queen,
            score: calculateScore(queen.id)
        }))
        .sort((a, b) => b.score - a.score)

    const getPosition = (index) => {
        if (index === 0) return 1

        const currentScore = rankedQueens[index].score
        const previousScore = rankedQueens[index - 1].score

        if (currentScore === previousScore) {
            return getPosition(index - 1)
        }

        return index + 1
    }

    return (
        <div className={styles.tableContainer}>

            {saveRanking && (
                <button
                    type="button"
                    className={styles.save}
                    onClick={async () => await saveRanking()}
                >
                    Guardar ranking
                </button>
            )}

            <table className={styles.rankingTable}>

                <thead>
                    <tr>
                        <th className={styles.queenHeader}></th>

                        {episodes.map(episode => (
                            <th
                                key={episode.id}
                                className={styles.episodeHeader}
                            >
                                {episode.title}
                            </th>
                        ))}
                    </tr>
                </thead>

                <tbody>
                    {rankedQueens.map((queen, index) => (
                        <RankingRow
                            key={queen.id}
                            queen={queen}
                            episodes={episodes}
                            pointTypes={pointTypes}
                            pointsMap={pointsMap}
                            setPointsMap={setPointsMap}
                            activeCell={activeCell}
                            setActiveCell={setActiveCell}
                            position={getPosition(index)}
                        />
                    ))}
                </tbody>

            </table>

        </div>
    )
}