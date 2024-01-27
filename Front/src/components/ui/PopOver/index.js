import styles from './styles.module.css'

const types = {
    alert: {
        icon: <ion-icon name="alert-circle"></ion-icon>
    },
    info: {
        icon: <ion-icon name="information-circle"></ion-icon>
    },
    sucess: {
        icon: <ion-icon name="checkmark-circle"></ion-icon>
    },
    warning: {
        icon: <ion-icon name="alert-circle"></ion-icon>
    },
    error: {
        icon: <ion-icon name="close-circle"></ion-icon>
    }
}


export function PopOver({ isHovering, message, type, ...rest }) {

    return (
        <div value={isHovering} className={styles.popoverWrapper} >
            {type ? 
                <span value={type} className={styles.icon}>{types[type].icon}</span> : <></>}
            <div className={styles.popoverContent}>
                <p className={styles.popoverMessage}>{message}</p>
            </div>
        </div>
    )
}