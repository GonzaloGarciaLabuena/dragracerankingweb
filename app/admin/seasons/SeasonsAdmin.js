'use client'

import { seasonService } from '@/lib/services/seasonService'
import { episodeService } from '@/lib/services/episodeService'
import { ppeService } from '@/lib/services/ppeService'
import { useEffect, useState } from 'react'
import styles from './seasons.module.css'
import EpisodeEditModal from './EpisodeEditModal'
import EpisodeModal from './EpisodeModal' 
import SeasonMondal from './SeasonModal'
import SeasonSelector from '@/components/SeasonSelector/SeasonSelector'
import CButton from '@/components/CButton/CButton'

export default function SeasonsAdmin() {

    const [seasons, setSeasons] = useState([])
    const [episodes, setEpisodes] = useState([])
    const [selectedSeason, setSelectedSeason] = useState(null)
    const [dropdownOpen, setDropdownOpen] = useState(false)
    const [editingEpisode, setEditingEpisode] = useState(null)
    const [newEpisode, setNewEpisode] = useState(null)
    const [newSeason, setNewSeason] = useState(null)
    const [editSeason, setEditSeason] = useState(null)
    const [seasonSearch, setSeasonSearch] = useState('')

    const fetchSeasons = async () => {
        const seasonsList = await seasonService.getAllSeasons()
        setSeasons(seasonsList)
    }

    const fetchEpisodes = async (season) => {
        const episodesList = await episodeService.getEpisodesAdmin(season.id)
        setEpisodes(episodesList)
    }

    useEffect(() => {
        fetchSeasons()
    }, [])

    const updateEpisodes = async () => {
        fetchEpisodes(selectedSeason)
    }

    const handleSeasonChange = (season) => {
        setSelectedSeason(season)
        fetchEpisodes(season)
        setDropdownOpen(false)
    }

    const filteredSeasons = seasons.filter(season =>
        season.name.toLowerCase().includes(seasonSearch.toLowerCase())
    )

    return (
        <div className={styles.container}>

            <h2>Administrar temporadas</h2>

            <div className={styles.options}>
                <div className={styles.left}>
                    <SeasonSelector
                        seasons={seasons}
                        selectedSeason={selectedSeason}
                        dropdownOpen={dropdownOpen}
                        setDropdownOpen={setDropdownOpen}
                        handleSeasonChange={handleSeasonChange}
                    >
                        Seleccionar
                    </SeasonSelector>
                </div>
                <div className={styles.right}>
                    <CButton 
                        onClick={() => {
                            setNewSeason(true)
                        }}
                    >
                        Añadir
                    </CButton>

                    <CButton 
                        disabled={!selectedSeason}
                        onClick={() => {
                            setEditSeason(true)
                        }}
                    >
                        Editar
                    </CButton>

                    <CButton 
                        disabled={!selectedSeason}
                        onClick={ async () => {
                            await ppeService.publishRanking(selectedSeason)
                            alert("Temporada " + selectedSeason.name + " publicada correctamente")
                        }}
                    >
                        Publicar
                    </CButton>
                </div>
            </div>

            {selectedSeason && (
                <div className={styles.seasonContent}>

                    <div className={styles.seasonHeader}>
                        <h3>{selectedSeason.name}</h3>

                        <p>
                            {selectedSeason.franchise} ·{' '}
                            {selectedSeason.year}
                        </p>
                    </div>

                    <div className={styles.options}>
                        <div className={styles.left}>
                            <h4>Episodios</h4>
                            <CButton 
                                onClick={() => {
                                    setNewEpisode(true)
                                }}
                            >
                                Añadir
                            </CButton>
                            <CButton 
                                onClick={ async () => {
                                    await episodeService.deleteLastEpisode(selectedSeason.id);
                                    updateEpisodes();
                                }}
                            >
                                Eliminar
                            </CButton>
                        </div>
                    </div>

                    <div className={styles.episodes}>

                        {episodes.map(episode => (
                            <button
                                key={episode.id}
                                type="button"
                                className={styles.episode}
                                onClick={() => setEditingEpisode(episode)}
                            >
                                <span className={styles.episodeNumber}>
                                    {episode.number}
                                </span>

                                <span>
                                    {episode.title}
                                </span>
                            </button>
                        ))}

                    </div>

                </div>
            )}

            {newEpisode && (
                <EpisodeModal
                    onClose={() => setNewEpisode(null)}

                    onSave={ async (newEpisode) => {
                        await episodeService.createEpisode(selectedSeason.id, newEpisode);
                        updateEpisodes();
                        setNewEpisode(null)
                    }}
                />
            )}

            {editingEpisode && (
                <EpisodeModal
                    episode={editingEpisode}
                    onClose={() => setEditingEpisode(null)}

                    onSave={ async (updatedEpisode) => {
                        await episodeService.updateEpisode(updatedEpisode);
                        updateEpisodes();
                        setEditingEpisode(null)
                    }}
                />
            )}

            {newSeason && (
                <SeasonMondal
                    onClose={() => setNewSeason(null)}

                    onSave={ async ({ name, franchise, year }) => {
                        const newSeason = await seasonService.createSeason(name, franchise, year)
                        setNewSeason(null)
                        fetchSeasons(newSeason)
                    }}
                />
            )}

            {editSeason && (
                <SeasonMondal
                    season = {selectedSeason}
                    onClose={() => setEditSeason(null)}
                    onSave={ async ({ name, franchise, year }) => {
                        const response = await seasonService.updateSeason(selectedSeason.id, name, franchise, year)
                        if(response.success){
                            setEditSeason(null)
                            fetchSeasons(response.data)
                        }
                    }}
                />
            )}
        </div>
    )
}