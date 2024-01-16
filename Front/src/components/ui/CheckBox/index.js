import styles from './styles.module.css'

export function CheckBox({ options }) {
    return (
        <div className={styles.container}>
            {options.map(option => {
                return <label className={styles.checkbox}>{option.title}
                    <input type="checkbox" id={option.id} />
                </label>
            })}
        </div>
    )
}