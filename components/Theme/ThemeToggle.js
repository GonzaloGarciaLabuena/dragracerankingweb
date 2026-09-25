'use client'

import { useEffect, useState } from 'react'
import styles from './ThemeToggle.module.css'

export default function ThemeToggle() {
    const [theme, setTheme] = useState('light')

    useEffect(() => {
        const savedTheme = localStorage.getItem('theme') || 'light'

        document.documentElement.setAttribute('data-theme', savedTheme)
        setTheme(savedTheme)
    }, [])

    const toggleTheme = () => {
        const newTheme = theme === 'light' ? 'dark' : 'light'

        document.documentElement.setAttribute('data-theme', newTheme)
        localStorage.setItem('theme', newTheme)
        setTheme(newTheme)
    }

    return (
        <button
            onClick={toggleTheme}
            className={styles.button}
        >
            {theme !== 'light' ? '🌙' : '☀️'}
        </button>
    )
}