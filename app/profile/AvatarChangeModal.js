'use client'

import { useEffect, useState } from 'react'
import styles from './modal.module.css'
import { supabaseStorageService } from '@/lib/services/supabaseStorageService'

export default function AvatarChangeModal({
    onClose,
    onSave,
    currentAvatar
}) {
    const [avatarImages, setAvatarImages] = useState([])
    const [selectedAvatar, setSelectedAvatar] = useState(currentAvatar)
    const [loading, setLoading] = useState(true)
    const [page, setPage] = useState(1)
    const [totalPages, setTotalPages] = useState(1)

    useEffect(() => {
        fetchAvatars(1)
    }, [])

    const fetchAvatars = async (pageNumber) => {
        setLoading(true)

        try {
            const result = await supabaseStorageService.getAllImg(pageNumber, 20)

            setAvatarImages(result.images)
            setPage(result.page)
            setTotalPages(result.totalPages)
        } catch (error) {
            console.error('Error fetching avatars:', error)
        } finally {
            setLoading(false)
        }
    }
    
    return (
        <div className={styles.modalOverlay} onClick={onClose}>
            <div className={styles.modal} onClick={(e) => e.stopPropagation()}>

                <div className={styles.header}>
                    <h2>Elegir avatar</h2>

                    <button type="button" className={styles.closeButton} onClick={onClose}>
                        ×
                    </button>
                </div>

                <div className={styles.content}>
                    {loading ? (
                        <div className={styles.loading}>
                            <div className={styles.loadingSpinner}></div>
                            <span>Cargando...</span>
                        </div>
                    ) : (
                        <>
                            <div className={styles.avatarGrid}>
                                {avatarImages.map((avatar) => (
                                    <button
                                        key={avatar.image_url}
                                        type="button"
                                        className={`${styles.avatarOption} ${
                                            selectedAvatar === avatar.image_url
                                                ? styles.selected
                                                : ''
                                        }`}
                                        onClick={() =>
                                            setSelectedAvatar(avatar.image_url)
                                        }
                                    >
                                        <img src={avatar.image_url} alt="Avatar" draggable={false}/>
                                    </button>
                                ))}
                            </div>

                            {!loading && totalPages > 1 && (
                                <div className={styles.pagination}>
                                    <button type="button" disabled={page === 1} onClick={() => fetchAvatars(page - 1)}>
                                        Anterior
                                    </button>

                                    <span>Página {page} de {totalPages}</span>

                                    <button type="button" disabled={page === totalPages} onClick={() => fetchAvatars(page + 1)}>
                                        Siguiente
                                    </button>
                                </div>
                            )}
                        </>
                    )}

                </div>

                <div className={styles.actions}>
                    <button type="button" className={styles.saveButton} disabled={!selectedAvatar} 
                            onClick={() => onSave(selectedAvatar)}>
                        Guardar
                    </button>
                </div>

            </div>
        </div>
    )
}