'use client'

import styles from './page.module.css'
import { useEffect, useState } from 'react'
import { seasonService } from '@/lib/services/seasonService'
import { episodeService } from '@/lib/services/episodeService'
import { pointTypeService } from '@/lib/services/pointTypeService'
import { queenService } from '@/lib/services/queenService'
import { ppeService } from '@/lib/services/ppeService'
import { profileService } from '@/lib/services/profileService'
import SeasonSelector from './SeasonSelector'
import RankingTable from './RankingTable'

export default function RankingPage() {
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

    useEffect(() => {
        const loadData = async () => {
            setLoading(true)

            try {
                await Promise.all([
                    getProfile(),
                    fetchSeasons(),
                    fetchPointTypes()
                ])
            } catch (error) {
                console.error('Error loading ranking:', error)
            } finally {
                setLoading(false)
            }
        }

        loadData()
    }, [])

    return (
        <div className={styles.pageContent}>

            {loading && (
                <div className={styles.loadingOverlay}>
                    <div className={styles.loadingSpinner}></div>
                    <span>Cargando...</span>
                </div>
            )}

            <SeasonSelector
                seasons={seasons}
                selectedSeason={selectedSeason}
                dropdownOpen={dropdownOpen}
                setDropdownOpen={setDropdownOpen}
                handleSeasonChange={handleSeasonChange}
            />

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
                    saveRanking={saveRanking}
                />
            )}

        </div>
    )
}