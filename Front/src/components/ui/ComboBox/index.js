import styles from './styles.module.css'

export function ComboBox({options, ...rest}){
    return (
        <select required={true} className={styles.select} {...rest} >
            <option value="" className={styles.placeholder} disabled selected>Selecione...</option>
            {options.map(option => {
                return <option key={`combo-opt-${option.id}`} disabled={option.disabled} id={option.id}>{option.title}</option>
            })}
        </select>
    )
}