import styles from './styles.module.css'

export function CheckBox({ options }) {
    return (
        <div className={styles.container}>
            {options.map(option => {
                return <label className={styles.checkbox}>
                    <input type="checkbox" id={option.id} />
                    {option.title}
                </label>
            })}
        </div>
    )
}