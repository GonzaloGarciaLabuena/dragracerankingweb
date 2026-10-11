"use client";

import { useCallback, useEffect, useState } from "react";
import styles from "./modal.module.css";
import { supabaseStorageService } from "@/lib/services/supabaseStorageService";
import useIsMobile from "@/hooks/useIsMobile";
import CButton from "@/components/CButton/CButton";

export default function AvatarChangeModal({ onClose, onSave, currentAvatar }) {
  const [avatarImages, setAvatarImages] = useState([]);
  const [selectedAvatar, setSelectedAvatar] = useState(currentAvatar);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const isMobile = useIsMobile();

  const avatarsPerPage = isMobile ? 12 : 20;

  const fetchAvatars = useCallback(async (pageNumber, pageSize) => {
    setLoading(true);

    try {
      const result = await supabaseStorageService.getAllImg(
        pageNumber,
        pageSize,
      );

      setAvatarImages(result.images);
      setPage(result.page);
      setTotalPages(result.totalPages);
    } catch (error) {
      console.error("Error fetching avatars:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // Esperar a que el hook determine si es móvil.
    if (isMobile === null) return;

    fetchAvatars(1, avatarsPerPage);
  }, [isMobile, avatarsPerPage, fetchAvatars]);

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <h2 className={styles.title} >Elegir avatar</h2>

          <button
            type="button"
            className={styles.closeButton}
            onClick={onClose}
          >
            ×
          </button>
        </div>

        <div className={styles.content}>
          {loading || isMobile === null ? (
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
                      selectedAvatar === avatar.image_url ? styles.selected : ""
                    }`}
                    onClick={() => setSelectedAvatar(avatar.image_url)}
                  >
                    <img
                      src={avatar.image_url}
                      alt="Avatar"
                      draggable={false}
                    />
                  </button>
                ))}
              </div>
            </>
          )}
        </div>

        <div className={styles.actions}>
          <div className={styles.actionsLeft}>
            {totalPages > 1 && (
              <div className={styles.pagination}>
                <CButton
                  type="button"
                  className={styles.saveButton}
                  disabled={page === 1}
                  onClick={() => fetchAvatars(page - 1, avatarsPerPage)}
                >
                  Anterior
                </CButton>

                <span className={styles.paginaText}>
                  Página {page} de {totalPages}
                </span>

                <CButton
                  type="button"
                  className={styles.saveButton}
                  disabled={page === totalPages}
                  onClick={() => fetchAvatars(page + 1, avatarsPerPage)}
                >
                  Siguiente
                </CButton>
              </div>
            )}
          </div>
          <div className={styles.actionsRight}>
            <CButton
              type="submit"
              className={styles.saveButton}
              disabled={!selectedAvatar}
              onClick={() => onSave(selectedAvatar)}
            >
              Guardar
            </CButton>
          </div>
        </div>
      </div>
    </div>
  );
}
