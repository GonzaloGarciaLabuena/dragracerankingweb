import styles from './CButton.module.css'

export default function CButton({
    children,
    onClick,
    type = 'button',
    disabled = false,
    className = ''
}) {
    return (
        <button
            type={type}
            className={`${styles.CButton} ${className}`}
            onClick={onClick}
            disabled={disabled}
        >
            {children}
        </button>
    )
}