'use client'

import styles from './page.module.css'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { ppeService } from '@/lib/services/ppeService'
import UserSelector from '../search/UserSelector'
import { profileService } from '@/lib/services/profileService'

export default function HallofFame() {
    const [hallOfFame, setHallOfFame] = useState([])
    const [loading, setLoading] = useState(true)
    const [users, setUsers] = useState([])
    const [selectedUser, setSelectedUser] = useState(null)
    const [dropdownOpenUser, setDropdownOpenUser] = useState(false)

    const fetchHallofFame = async (user = null) => {
        const hallOfFame = await ppeService.getHallOfFame(user)
        console.log(hallOfFame)
        setHallOfFame(hallOfFame)
    }

    const fetchUsers = async () => {
        const users = await profileService.getAllOtherProfiles()
        setUsers(users)
    }

    const handleUserChange = async (user) => {
        setLoading(true)
        setSelectedUser(user)
        setDropdownOpenUser(false)

        try {
            await Promise.all([
                fetchHallofFame(user)
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
                    fetchHallofFame(),
                    fetchUsers()
                ])
            } catch (error) {
                console.error('Error loading hall of fame:', error)
            } finally {
                setLoading(false)
            }
        }

        loadData()
    }, [])

    return (
        <div className={styles.pageContent}>

            <h1>Hall of Fame</h1>

            <UserSelector
                users={users}
                selectedUser={selectedUser}
                dropdownOpen={dropdownOpenUser}
                setDropdownOpen={setDropdownOpenUser}
                handleUserChange={handleUserChange}
            />

            <button
                type="button"
                className={styles.buttonCustom}
                onClick={() => {
                    handleUserChange(null)
                }}
            >
                Tu Hall of Fame
            </button>

            {!loading && hallOfFame.length === 0 && (
                <p>No hay datos para mostrar.</p>
            )}

            <div className={styles.hallOfFame}>
                {hallOfFame.map((item) => (
                    <Link href={
                            selectedUser
                                ? `/search?seasonId=${item.seasonId}&userId=${selectedUser.id}`
                                : `/ranking?seasonId=${item.seasonId}`
                        }
                        key={item.seasonId}
                    >
                        <div
                            key={item.seasonId}
                            className={styles.seasonCard}
                        >
                            <div className={styles.seasonName}>
                                {item.winner.season}
                            </div>

                            <div className={styles.winnerImage}>
                                <img
                                    src={item.winner.image_url}
                                    alt={item.winner.name}
                                />
                            </div>

                            <div className={styles.winnerInfo}>
                                <h2>{item.winner.name}</h2>
                                <span>{item.winner.score}</span>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>

            {loading && (
                <div className={styles.loadingOverlay}>
                    <div className={styles.loadingSpinner}></div>
                    <span>Cargando...</span>
                </div>
            )}

        </div>
    )
}