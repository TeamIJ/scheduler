import styles from './styles.module.css'

export function PopOver({ message, type, ...rest }) {
    return (
        <div class="popover__wrapper" >
            <ion-icon name={type}></ion-icon>
            <div class="popover__content">
                <p class="popover__message">{message}</p>
            </div>
        </div>
    )
}