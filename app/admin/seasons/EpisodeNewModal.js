'use client'

import { useEffect, useState } from 'react'
import styles from './modal.module.css'

export default function EpisodeNewModal({
    onClose,
    onSave
}) {
    const [title, setTitle] = useState("")
    const [final, setFinal] = useState(false)

    const handleSubmit = (e) => {
        e.preventDefault()

        onSave({
            title: title.trim(),
            esFinal: final
        })
    }

    return (
        <div
            className={styles.modalOverlay}
            onClick={onClose}
        >
            <div
                className={styles.modal}
                onClick={(e) => e.stopPropagation()}
            >
                <h3>Añadir nuevo episodio</h3>

                <form onSubmit={handleSubmit}>

                    <div className={styles.formGroup}>
                        <label htmlFor="episodeTitle">
                            Nombre del episodio
                        </label>

                        <input
                            id="episodeTitle"
                            type="text"
                            onChange={(e) => setTitle(e.target.value)}
                            autoFocus
                        />

                        <label className={styles.checkboxLabel}>
                            <input
                                type="checkbox"
                                checked={final}
                                onChange={(e) => setFinal(e.target.checked)}
                            />
                            Episodio final
                        </label>
                    </div>

                    <div className={styles.modalActions}>

                        <button
                            type="button"
                            onClick={onClose}
                        >
                            Cancelar
                        </button>

                        <button
                            type="submit"
                            disabled={!title.trim()}
                        >
                            Guardar
                        </button>

                    </div>

                </form>
            </div>
        </div>
    )
}