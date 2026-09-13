'use client'

import styles from './page.module.css'
import { useEffect, useState } from 'react'
import { seasonService } from '@/lib/services/seasonService'
import { pointTypeService } from '@/lib/services/pointTypeService'
import { queenService } from '@/lib/services/queenService'
import { ppeService } from '@/lib/services/ppeService'
import { episodeService } from '@/lib/services/episodeService'
import { profileService } from '@/lib/services/profileService'
import UserSelector from './UserSelector'
import SeasonSelector from '../ranking/SeasonSelector'
import RankingTable from '../ranking/RankingTable'

export default function Search() {
    const [users, setUsers] = useState([])
    const [seasons, setSeasons] = useState([])
    const [selectedUser, setSelectedUser] = useState(null)
    const [selectedSeason, setSelectedSeason] = useState(null)
    const [dropdownOpenUser, setDropdownOpenUser] = useState(false)
    const [dropdownOpenSeason, setDropdownOpenSeason] = useState(false)
    const [episodes, setEpisodes] = useState([])
    const [pointTypes, setPointTypes] = useState([])
    const [pointsMap, setPointsMap] = useState(new Map())
    const [queens, setQueens] = useState([])
    const [loading, setLoading] = useState(true)

    const fetchUsers = async () => {
        const users = await profileService.getAllOtherProfiles()
        setUsers(users)
    }

    const fetchSeasons = async (user) => {
        const seasonList = await seasonService.getUserRankedSeasons(user)
        setSeasons(seasonList)
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

    const fetchPPE = async (user, season) => {
        const map = await ppeService.getRankingOfUser(user, season, pointTypes)
        setPointsMap(map)
    }

    const handleUserChange = async (user) => {
        setLoading(true)
        setSelectedUser(user)
        setDropdownOpenUser(false)

        setSelectedSeason(null)
        setSeasons([])
        setEpisodes([])
        setQueens([])
        setPointsMap(new Map())
        
        try {
            await Promise.all([
                fetchSeasons(user)
            ])
        } catch (error) {
            console.error('Error loading queens:', error)
        } finally {
            setLoading(false)
        }
    }

    const handleSeasonChange = async (season) => {
        setLoading(true)

        setSelectedSeason(season)
        setDropdownOpenSeason(false)

        try {
            await Promise.all([
                fetchEpisodes(season),
                fetchQueens(season),
                fetchPPE(selectedUser, season)
            ])
        } catch (error) {
            console.error('Error loading queens:', error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        const loadData = async () => {
            setLoading(true)

            try {
                await Promise.all([
                    fetchUsers(),
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


    return(
        
        <div className={styles.pageContent}>

            {loading && (
                <div className={styles.loadingOverlay}>
                    <div className={styles.loadingSpinner}></div>
                    <span>Cargando...</span>
                </div>
            )}  

            <UserSelector
                users={users}
                selectedUser={selectedUser}
                dropdownOpen={dropdownOpenUser}
                setDropdownOpen={setDropdownOpenUser}
                handleUserChange={handleUserChange}
            />

             {selectedUser && ( 
                <SeasonSelector
                    seasons={seasons}
                    selectedSeason={selectedSeason}
                    dropdownOpen={dropdownOpenSeason}
                    setDropdownOpen={setDropdownOpenSeason}
                    handleSeasonChange={handleSeasonChange}
                />
            )}

            {selectedSeason && (
                <RankingTable
                    user={selectedUser}
                    season={selectedSeason}
                    queens={queens}
                    episodes={episodes}
                    pointTypes={pointTypes}
                    pointsMap={pointsMap}
                    setPointsMap={setPointsMap}
                    activeCell={null}
                    setActiveCell={null}
                    saveRanking={null}
                />
            )}
        </div>
    )
}