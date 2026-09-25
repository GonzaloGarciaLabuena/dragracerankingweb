'use client'

import { useEffect, useState } from 'react'
import styles from './modal.module.css'
import CButton from '@/components/CButton/CButton'

export default function EpisodeModal({
    episode = {},
    onClose,
    onSave
}) {
    const [title, setTitle] = useState(episode.title || '')
    const [final, setFinal] = useState(episode.esFinal || false)

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
                        <div className={styles.formInputContainer}>   
                            <label className={styles.formLabel}>
                                Nombre
                            </label>

                            <input
                                id="episodeTitle"
                                type="text"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                className={styles.formInput}
                                autoFocus
                            />
                        </div>
                        <div className={styles.formInputContainer}>   
                            <label className={styles.formLabel}>
                                ¿Episodio final?
                            </label>

                            <input
                                id="checkboxFinal"
                                type="checkbox"
                                checked={final}
                                onChange={(e) => setFinal(e.target.checked)}
                                className={styles.checkbox}
                            />
                        </div>
                    </div>

                    <div className={styles.modalActions}>
                        <CButton 
                            onClick={onClose}
                        >
                            Cancelar
                        </CButton>
                        <CButton 
                            type="submit"
                            disabled={!title}
                        >
                            Guardar
                        </CButton>
                    </div>

                </form>
            </div>
        </div>
    )
}