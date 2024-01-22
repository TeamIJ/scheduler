import styles from './styles.module.css'

export function RadioButton({ options }) {
    return (
        <div className={styles.container}>
            {options.map(option => {
                return <label key={`radio-opt-${option.id}`} className={styles.radio}>{option.title}
                    <input type="radio" id={option.id} />
                    <span className={styles.checkmark}></span>
                </label>
            })}
        </div>
    )
}