'use client'

import styles from './page.module.css'
import { useEffect, useState, useRef } from 'react'
import { toPng } from 'html-to-image'
import { seasonService } from '@/lib/services/seasonService'
import { episodeService } from '@/lib/services/episodeService'
import { pointTypeService } from '@/lib/services/pointTypeService'
import { queenService } from '@/lib/services/queenService'
import { ppeService } from '@/lib/services/ppeService'
import { profileService } from '@/lib/services/profileService'
import SeasonSelector from '@/components/SeasonSelector/SeasonSelector'
import RankingTable from './RankingTable'

export default function RankingPage() {

    const tableRef = useRef(null)
    const [seasons, setSeasons] = useState([])
    const [selectedSeason, setSelectedSeason] = useState(null)
    const [dropdownOpen, setDropdownOpen] = useState(false)
    const [episodes, setEpisodes] = useState([])
    const [pointTypes, setPointTypes] = useState([])
    const [activeCell, setActiveCell] = useState(false)
    const [pointsMap, setPointsMap] = useState(new Map())
    const [queens, setQueens] = useState([])
    const [loading, setLoading] = useState(true)
    const [profile, setProfile] = useState(null)
    const [initialDataLoaded, setInitialDataLoaded] = useState(false)

    const fetchSeasons = async () => {
        const map = await seasonService.getRankableSeasons()
        setSeasons(map)
    }

    const fetchEpisodes = async (season) => {
        const map = await episodeService.getEpisodes(season.id)
        setEpisodes(map)
    }

    const fetchPointTypes = async () => {
        const types = await pointTypeService.getPointTypes()
        setPointTypes(types)
    }

    const fetchQueens = async (season) => {
        const data = await queenService.listQueens(season, null)
        setQueens(data.data)
    }

    const fetchPPE = async (season) => {
        const map = await ppeService.getRanking(season, pointTypes)
        setPointsMap(map)
    }

    const getProfile = async () => {
        const profileData = await profileService.getProfileData()
        setProfile(profileData)
    }

    const handleSeasonChange = async (season) => {
        setLoading(true)

        setSelectedSeason(season)
        setDropdownOpen(false)

        try {
            await Promise.all([
                fetchEpisodes(season),
                fetchQueens(season),
                fetchPPE(season)
            ])
        } catch (error) {
            console.error('Error loading queens:', error)
        } finally {
            setLoading(false)
        }
    }

    const saveRanking = async () => {
        await ppeService.saveRanking(selectedSeason, queens, episodes, pointsMap)
        alert("Ranking guardado correctamente")
    }

    const downloadRanking = async () => {
        if (!tableRef.current) return
        const table = tableRef.current
        try {
            const backgroundColor = getComputedStyle(document.documentElement)
                .getPropertyValue('--color-table-background')
                .trim()

            const dataUrl = await toPng(table, {
                pixelRatio: 2,
                backgroundColor,
                cacheBust: true,

                style: {
                    boxShadow: 'none'
                }
            })


            const link = document.createElement('a')

            const seasonName = selectedSeason?.name
                ?.replace(/^rupaul's /i, '')
                ?.replace(/\s+/g, '-')

            link.download = `${profile?.username}-${seasonName}-ranking.png`
            link.href = dataUrl
            link.click()
        } catch (error) {
            console.error('Error al descargar el ranking:', error)
        }
    }

    useEffect(() => {
        const loadData = async () => {
            setLoading(true)

            try {
                await Promise.all([
                    getProfile(),
                    fetchSeasons(),
                    fetchPointTypes()
                ])
                setInitialDataLoaded(true)
            } catch (error) {
                console.error('Error loading ranking:', error)
            } finally {
                setLoading(false)
            }
        }

        loadData()
    }, [])

    useEffect(() => {
        const seasonId = new URLSearchParams(window.location.search).get('seasonId')

        if (!initialDataLoaded || !seasonId || seasons.length === 0) {
            return
        }

        const season = seasons.find(
            season => String(season.id) === String(seasonId)
        )

        if (season) {
            handleSeasonChange(season)
        }
    }, [initialDataLoaded])

    return (
        <div className={styles.pageContent}>

            {loading && (
                <div className={styles.loadingOverlay}>
                    <div className={styles.loadingSpinner}></div>
                    <span>Cargando...</span>
                </div>
            )}

            <div className={styles.options}>
                <SeasonSelector
                    seasons={seasons}
                    selectedSeason={selectedSeason}
                    dropdownOpen={dropdownOpen}
                    setDropdownOpen={setDropdownOpen}
                    handleSeasonChange={handleSeasonChange}
                >
                    Seleccionar temporada
                </SeasonSelector>
                
                <button
                    type="button"
                    className={styles.optionButton}
                    onClick={saveRanking}
                >
                    Guardar ranking
                </button>

                <button 
                    type="button"
                    className={styles.optionButton}
                    onClick={downloadRanking}
                >
                    Descargar ranking
                </button>
            </div>

            {selectedSeason && (
                <RankingTable
                    user={profile}
                    season={selectedSeason}
                    queens={queens}
                    episodes={episodes}
                    pointTypes={pointTypes}
                    pointsMap={pointsMap}
                    setPointsMap={setPointsMap}
                    activeCell={activeCell}
                    setActiveCell={setActiveCell}
                    tableRef={tableRef}
                />
            )}

        </div>
    )
}