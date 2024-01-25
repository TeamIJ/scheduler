import styles from './styles.module.css'

export function CheckBox({ options, ...rest }) {
    return (
        <div className={styles.container}>
            {options.map(option => {
                return <label key={`checkbox-opt-${option.id}`} className={styles.checkbox}>
                    <input type="checkbox" id={option.id} { ...rest } />
                    {option.title}
                </label>
            })}
        </div>
    )
}