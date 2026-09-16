'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase/client'
import styles from './Header.module.css'
import { profileService } from '@/lib/services/profileService'

export default function Header() {
    const [profile, setProfile] = useState(null)
    const [menuOpen, setMenuOpen] = useState(false)

    useEffect(() => {
        getProfile()

        const handleProfileUpdated = () => {
            getProfile()
        }
        window.addEventListener('profileUpdated', handleProfileUpdated)

        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange(async (_event, session) => {
            if (session?.user) {
                getProfile()
            } else {
                setProfile(null)
            }
        })

        return () => {
            subscription.unsubscribe()
        }
    }, [])

    const handleLogin = async () => {
        window.location.href = '/login'
    }

    const handleRegister = async () => {
        window.location.href = '/register'
    }

    const getProfile = async () => {
        const profileData = await profileService.getProfileData()
        setProfile(profileData)
    }

    return (
        <header className={styles.header}>
            {/* HEADER ESCRITORIO */}
            <div className={`${styles.container} ${styles.desktopHeader}`}>

                <Link href="/ranking" className={styles.logo}>
                    DragRaceRanking
                </Link>

                <nav className={styles.nav}>
                    <Link href="/ranking" className={styles.buttonHeader}>
                        Ranking
                    </Link>

                    <Link href="/halloffame" className={styles.buttonHeader}>
                        Hall of Fame
                    </Link>

                    <Link href="/search" className={styles.buttonHeader}>
                        Other Rankings
                    </Link>

                    {profile?.role === 'admin' && (
                        <Link href="/admin" className={styles.buttonHeader}>
                            Administrador
                        </Link>
                    )}
                </nav>

                <div className={styles.auth}>
                    {profile ? (
                        <Link href="/profile" className={styles.profile}>
                            {profile.username}

                            <img
                                src={profile.avatar_url || '/default_avatar.svg'}
                                alt={profile.username}
                                className={styles.queenImage}
                                draggable={false}
                            />
                        </Link>
                    ) : (
                        <>
                            <button onClick={handleLogin} className={styles.login}>
                                Login
                            </button>

                            <button onClick={handleRegister} className={styles.register}>
                                Register
                            </button>
                        </>
                    )}
                </div>

            </div>


            {/* HEADER MÓVIL */}
            <div className={styles.mobileHeader}>

                <Link href="/ranking" className={styles.mobileLogo}>
                    DragRaceRanking
                </Link>
                <div className={styles.navContainer}>
                    {profile && ( 
                        <img
                            src={profile.avatar_url || '/default_avatar.svg'}
                            alt={profile.username}
                            className={styles.avatarHeader}
                            draggable={false}
                        />
                    )}
                    <button
                        className={styles.menuButton}
                        onClick={() => setMenuOpen(!menuOpen)}
                        aria-label="Abrir menú"
                    >
                        <img
                            src={menuOpen ? '/cross-icon.svg' : '/burger-icon.svg'}
                            alt=""
                            className={styles.menuIcon}
                        />
                    </button>
                </div>
            </div>


            {/* MENÚ MÓVIL */}
            {menuOpen && (
                <nav className={styles.mobileNav}>
                    <Link href="/ranking" onClick={() => setMenuOpen(false)}>
                        Ranking
                    </Link>

                    <Link href="/halloffame" onClick={() => setMenuOpen(false)}>
                        Hall of Fame
                    </Link>

                    <Link href="/search" onClick={() => setMenuOpen(false)}>
                        Other Rankings
                    </Link>

                    {profile?.role === 'admin' && (
                        <Link href="/admin" onClick={() => setMenuOpen(false)}>
                            Administrador
                        </Link>
                    )}

                    <div className={styles.mobileAuth}>

                        {profile ? (
                            <Link href="/profile" onClick={() => setMenuOpen(false)}>
                                <span>{profile.username}</span>
                            </Link>
                        ) : (
                            <>
                                <button
                                    onClick={() => {
                                        setMenuOpen(false)
                                        handleLogin()
                                    }}
                                    className={styles.login}
                                >
                                    Login
                                </button>

                                <button
                                    onClick={() => {
                                        setMenuOpen(false)
                                        handleRegister()
                                    }}
                                    className={styles.register}
                                >
                                    Register
                                </button>
                            </>
                        )}

                    </div>

                </nav>
            )}

        </header>
    )
}