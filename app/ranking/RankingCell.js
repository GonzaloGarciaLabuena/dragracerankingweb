'use client'

import { useState, useRef } from 'react'
import styles from './RankingCell.module.css'

export default function RankingCell({ 
    esFinal,
    cellId, 
    activeCell, 
    setActiveCell, 
    pointTypes, 
    point, 
    setPoint 
}) {
    const [openUp, setOpenUp] = useState(false)
    const cellRef = useRef(null)
    const [finalPointTypes, setFinalPointTypes] = useState(pointTypes)
    const open = activeCell === cellId 
    const [openLeft, setOpenLeft] = useState(false)

    const handleOpen = () => {
        if (activeCell !== null) {
            if (open) {
                setActiveCell(false)
                return
            }

            if (cellRef.current) {
                const rect = cellRef.current.getBoundingClientRect()

                const dropdownHeight = 250
                const dropdownWidth = 150

                const spaceBelow = window.innerHeight - rect.bottom
                const spaceAbove = rect.top
                const spaceRight = window.innerWidth - rect.left

                setOpenUp(
                    spaceBelow < dropdownHeight &&
                    spaceAbove > spaceBelow
                )

                setOpenLeft(spaceRight < dropdownWidth)
            }

            if (!esFinal) {
                setFinalPointTypes(
                    pointTypes.filter(pointType => pointType.id !== 'point9')
                )
            } else {
                setFinalPointTypes(pointTypes)
            }

            setActiveCell(cellId)
        }
    }

    const handleSelect = (selectedPoint) => {
        setPoint(selectedPoint)
        setActiveCell(false)
    }

    const rect = cellRef.current?.getBoundingClientRect()

    return (
        <div ref={cellRef} className={styles.cell}>
            <button
                className={styles.scoreButton}
                style={{
                    backgroundColor: point
                        ? `#${point.hexaColor}`
                        : 'white'
                }}
                onClick={handleOpen}
            >
                {point ? point.label : '—'}
            </button>

            {open && rect && (
                <div
                    className={`${styles.dropdown} ${openUp ? styles.dropdownUp : ''}`}
                    style={{
                        top: openUp ? rect.top : rect.bottom,
                        left: openLeft ? undefined : rect.left,
                        right: openLeft ? window.innerWidth - rect.right : undefined
                    }}
                >
                    <button
                        className={`${styles.option} ${styles.emptyOption}`}
                        onClick={() => handleSelect(null)}
                    >
                        EMPTY
                    </button>

                    {finalPointTypes.map(pointType => (
                        <button
                            key={pointType.id}
                            className={styles.option}
                            style={{
                                backgroundColor: `#${pointType.hexaColor}`
                            }}
                            onClick={() => handleSelect(pointType)}
                        >
                            {pointType.label}
                        </button>
                    ))}
                </div>
            )}
        </div>
    )
}