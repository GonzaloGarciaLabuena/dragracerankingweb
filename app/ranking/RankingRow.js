import styles from './page.module.css'
import RankingCell from './RankingCell'

export default function RankingRow({
    queen,
    episodes,
    pointTypes,
    pointsMap,
    setPointsMap,
    activeCell,
    setActiveCell,
    position
}) {

    return (
        <tr>

            <td className={styles.queenCell}>

                <div className={styles.queenContent}>

                    <span className={styles.queenPosition}>
                        {position}º
                    </span>

                    <img
                        src={queen.image_url}
                        alt={queen.name}
                        className={styles.queenImage}
                        draggable={false}
                    />

                    <div className={styles.queenInfo}>

                        <span className={styles.queenName}>
                            {queen.name}
                        </span>

                        <span className={styles.queenScore}>
                            {queen.score}
                        </span>

                    </div>

                </div>

            </td>

            {episodes.map(episode => {

                const key = `${queen.id}|${episode.id}`

                return (
                    <td
                        key={episode.id}
                        className={styles.scoreCell}
                    >
                        <RankingCell
                            cellId={key}
                            activeCell={activeCell}
                            setActiveCell={setActiveCell}
                            point={pointsMap.get(key)}
                            pointTypes={pointTypes}
                            setPoint={(point) => {

                                setPointsMap(prev => {

                                    const copy = new Map(prev)

                                    if (point) {
                                        copy.set(key, point)
                                    } else {
                                        copy.delete(key)
                                    }

                                    return copy
                                })

                            }}
                        />
                    </td>
                )
            })}

        </tr>
    )
}