import styles from './page.module.css'
import { FaCaretDown } from 'react-icons/fa'
import { useEffect, useState } from 'react'

export default function SeasonSelector({
    users,
    selectedUser,
    dropdownOpen,
    setDropdownOpen,
    handleUserChange
}) {
    const [userSearch, setUserSearch] = useState('')

    const filteredUsers = users.filter(user =>
        user.username.toLowerCase().includes(userSearch.toLowerCase())
    )

    return (
        <div className={styles.selector}>

            <button
                type="button"
                className={styles.selectorButton}
                onClick={() => setDropdownOpen(prev => !prev)}
            >
                <span>
                    {selectedUser
                        ? selectedUser.username
                        : 'Selecciona un usuario'}
                </span>

                <FaCaretDown
                    className={`${styles.caret} ${
                        dropdownOpen ? styles.caretOpen : ''
                    }`}
                />
            </button>

            {dropdownOpen && (
                <div className={styles.dropdown}>

                    <div className={styles.searchContainer}>
                        <input
                            type="text"
                            placeholder="Buscar usuario..."
                            value={userSearch}
                            onChange={(e) => setUserSearch(e.target.value)}
                            className={styles.searchInput}
                        />
                    </div>

                    {filteredUsers.map(user => (
                        <button
                            key={user.id}
                            type="button"
                            className={`${styles.dropdownItem} ${
                                selectedUser?.id === user.id
                                    ? styles.selected
                                    : ''
                            }`}
                            onClick={() => {
                                handleUserChange(user)
                                setUserSearch('')
                            }}
                        >
                            <span>{user.username}</span>
                        </button>
                    ))}

                    {filteredUsers.length === 0 && (
                        <div className={styles.noResults}>
                            No se encontraron usuarios
                        </div>
                    )}

                </div>
            )}

        </div>
    )
}