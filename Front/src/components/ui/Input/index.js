import styles from './styles.module.css'

export function Input({ ...rest }) {
    return (
        <input className={styles.input} {...rest} />
    )
}

export function InputLabel({ id, label, ...rest }) {
    return (
        <>
            <label for={id} className={styles.label}>{label}</label>
            <input id={id} className={styles.input} {...rest} />
        </>
    )
}

export function TextArea({ ...rest }) {
    return (
        <textarea className={styles.textarea} {...rest}></textarea>
    )
}