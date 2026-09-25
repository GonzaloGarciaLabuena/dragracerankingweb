'use client'

import { useEffect, useState } from 'react'
import styles from './modal.module.css'
import { FaCaretDown } from 'react-icons/fa'
import { seasonService } from '@/lib/services/seasonService'
import { wikiImgService } from "@/lib/services/wikiImgService";
import SeasonSelector from '@/components/SeasonSelector/SeasonSelector'
import CButton from '@/components/CButton/CButton'

export default function QueenNewModal({
    season,
    onClose,
    onSave
}) {
    const [name, setName] = useState('')
    const [url, setUrl] = useState('')
    const [selectedSeason, setSelectedSeason] = useState(season)
    const [dropdownOpen, setDropdownOpen] = useState(false)
    const [seasons, setSeasons] = useState([])
    const [imagePreview, setImagePreview] = useState(null)

    const handleSubmit = (e) => {
        e.preventDefault()

        onSave({name: name, url: url, season: selectedSeason})
    }

    const handleSeasonChange = (seasonChange) => {
        setSelectedSeason(seasonChange)
        setDropdownOpen(false)
    }

    const fetchSeasons = async () => {
        try {
            const seasonList = await seasonService.getAllSeasons()
            setSeasons(seasonList)
        } catch (error) {
            console.error('Error fetching queens list:', error)
        } 
    }

    useEffect(() => {
        fetchSeasons()
    }, [])

    return (
        <div
            className={styles.modalOverlay}
            onClick={onClose}
        >
            <div
                className={styles.modal}
                onClick={(e) => e.stopPropagation()}
            >
                <h3>Añadir nueva reina</h3>

                <form onSubmit={handleSubmit}>

                    <div className={styles.formGroup}>
                        <div className={styles.formInputContainer}>   
                            <label className={styles.formLabel}>
                                Nombre
                            </label>

                            <input
                                id="queenName"
                                type="text"
                                onChange={(e) => setName(e.target.value)}
                                className={styles.formInput}
                                autoFocus
                            />
                        </div> 

                        <div className={styles.formInputContainer}>
                            <label className={styles.formLabel}>
                                Temporada
                            </label>

                            <div className={styles.seasonContainer}>
                                <span className={styles.seasonName}>
                                    {selectedSeason?.name}
                                </span>

                                <SeasonSelector
                                    seasons={seasons}
                                    selectedSeason={selectedSeason}
                                    dropdownOpen={dropdownOpen}
                                    setDropdownOpen={setDropdownOpen}
                                    handleSeasonChange={handleSeasonChange}
                                    dropLeft
                                />
                            </div>
                        </div>

                        <div className={styles.formInputContainer}>
                            <label className={styles.formLabel}>
                                Url
                            </label>

                            <input
                                id="urlImg"
                                type="text"
                                onChange={(e) => setUrl(e.target.value)}
                                className={styles.formInput}
                            />
                        </div>
                        <div className={styles.ImgContainer}>
                            {imagePreview ? (
                                <img
                                    className={styles.queenimg}
                                    src={imagePreview}
                                    alt="Imagen de la reina"
                                />
                            ) : (
                                <>
                                    <img
                                        className={`${styles.queenimg} ${styles.defaultAvatarBlack}`}
                                        src="/default-avatar-black.svg"
                                        alt="Imagen por defecto"
                                    />

                                    <img
                                        className={`${styles.queenimg} ${styles.defaultAvatarWhite}`}
                                        src="/default-avatar-white.svg"
                                        alt="Imagen por defecto"
                                    />
                                </>
                            )}
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
                            disabled={!name.trim() || !selectedSeason}
                        >
                            Guardar
                        </CButton>
                    </div>

                </form>
            </div>
        </div>
    )
}