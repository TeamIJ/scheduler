import styles from './styles.module.css'
import { useState, useEffect } from "react";

export function RadioButton({ options, func, ...rest }) {

    const [optionsRadio, setOptionsRadio] = useState(options)
    const [optionChecked, setOptionChecked] = useState('')

    let optionsRadioAux = optionsRadio

    function handleRadioChange(e) {
        optionsRadioAux.forEach(option => {
            option.checked = false
        })
        optionsRadioAux.filter(option => {
            return option.id === e.target.id
        })[0].checked = true
        setOptionChecked(e.target.id)
    }
    
    useEffect(() => {
        setOptionsRadio(optionsRadioAux)
        func(optionChecked)
    }, [optionChecked])

    return (
        <div className={styles.container}>
            {optionsRadio.map(option => {
                return <label key={`radio-opt-${option.id}`} className={styles.radio}>{option.title}
                    <input type="radio" id={option.id} {...rest} checked={option.checked} onChange={(e) => {
                        handleRadioChange(e)
                    }} />
                    <span className={styles.checkmark}></span>
                </label>
            })}
        </div>
    )
}