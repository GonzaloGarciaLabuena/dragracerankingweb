'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase/client'
import styles from './page.module.css'
import { profileService } from '@/lib/services/profileService'
import AvatarChangeModal from './AvatarChangeModal'

export default function ProfilePage() {

    const router = useRouter()

    const [user, setUser] = useState(null)
    const [editingUsername, setEditingUsername] = useState(false)
    const [username, setUsername] = useState()
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')

    const [avatarModalOpen, setAvatarModalOpen] = useState(false)

    useEffect(() => {
        const getUser = async () => {
            const { data, error } = await supabase.auth.getUser()

            if (error) {
                setError(error.message)
                setLoading(false)
                return
            }

            if (!data.user) {
                router.push('/login')
                return
            } 
            getProfileData();
        }

        getUser()
    }, [router])

    const getProfileData = async () => {
        const profileData = await profileService.getProfileData()
        setUser(profileData)
        setLoading(false)
    }

    const handleLogout = async () => {
        const { error } = await supabase.auth.signOut()

        if (error) {
            setError(error.message)
            return
        }

        router.push('/login')
    }

    const handleSaveUsername = async () => {
        await profileService.updateYourProfile({username: username})
        user.username = username
        setEditingUsername(false)
        window.dispatchEvent(new Event('profileUpdated'))
    }

    const handleSaveAvatarImage = async (avatar) => {
        await profileService.updateYourProfile({avatar_url: avatar})
        user.avatar_url = avatar
        setAvatarModalOpen(false)
        window.dispatchEvent(new Event('profileUpdated'))
    }

    if (loading) {
        return (
            <main className={styles.container}>
                <p>Cargando perfil...</p>
            </main>
        )
    }

    if (!user) {
        return null
    }

    return (
        <main className={styles.container}>

            <div className={styles.profile}>

                <header className={styles.header}>
                    <h1>Mi perfil</h1>
                </header>

                {error && (
                    <p className={styles.error}>
                        {error}
                    </p>
                )}

                <section className={styles.section}>
                    <h2>Datos personales</h2>

                    <div className={styles.info}>
                        <span className={styles.label}>
                            Usuario
                        </span>

                        <span>
                            {user.full_name}
                        </span>
                    </div>
                    <div className={styles.info}>
                        <span className={styles.label}>
                            Nombre Drag
                        </span>

                        {editingUsername ? (
                            <input
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                            />
                        ) : (
                            <span>
                                {user.username}
                            </span>
                        )}

                        <button
                            type="button"
                            onClick={() => {
                                if (editingUsername) {
                                    handleSaveUsername()
                                }else{
                                    setUsername(user.username)
                                    setEditingUsername(!editingUsername)
                                }
                            }}
                        >
                            {editingUsername ? 'Guardar' : 'Editar'}
                        </button>
                    </div>
                    <div className={styles.info}>
                        <span className={styles.label}>
                            Avatar
                        </span>
                        <img
                            src={user.avatar_url || '/default_avatar.svg'}
                            alt={user.username}
                            className={styles.queenImage}
                            draggable={false}
                        />
                        <button
                            type="button"
                            onClick={() => setAvatarModalOpen(true)}
                        >
                            Editar
                        </button>
                    </div>
                </section>

                <section className={styles.section}>
                    <h2>Estadísticas</h2>

                    <div className={styles.comingSoon}>
                        <p>
                            Podrás consultar tus estadísticas.
                        </p>
                    </div>
                </section>

                <section className={styles.section}>
                    <h2>Cuenta</h2>

                    <button
                        className={styles.logout}
                        onClick={handleLogout}
                    >
                        Cerrar sesión
                    </button>
                </section>

                {avatarModalOpen && (
                    <AvatarChangeModal
                        currentAvatar={user.avatar_url}
                        onClose={() => setAvatarModalOpen(false)}
                        onSave={ (url_image) => {
                            handleSaveAvatarImage(url_image)
                        }}
                    />
                )}
            </div>

        </main>
    )
}