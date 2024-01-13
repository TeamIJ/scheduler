import styles from './styles.module.css'

export function Button({ color, content, ...rest }) {
    return (
        <button style={{ backgroundColor: `var(--${color})` }} className={styles.button} {...rest}>
            {content}
        </button>
    )
}

export function ButtonGrid({ content, ...rest }) {
    return (
        <button className={styles.buttonGrid} {...rest}>
            {content}
        </button>
    )
}

export function ButtonMenu({ color, content, ...rest }) {
    return (
        <button style={{ backgroundColor: `var(--${color})` }} className={styles.buttonMenu} {...rest}>
            {content}
        </button>
    )
}