import styles from './styles.module.css'
import {useState} from 'react'
import { Popover, Typography } from '@mui/material'

export function Button({ color, content, ...rest }) {
    let btnColor = color.includes("#") ? color : `var(--${color})`
    return (
        <button style={{ backgroundColor: btnColor }} className={styles.button} {...rest}>
            {content}
        </button>
    )
}

export function ButtonGrid({ mensagemHover, content, ...rest }) {

    const [anchorEl, setAnchorEl] = useState(null)

    const handlePopoverOpen = (event) => {
        setAnchorEl(event.currentTarget)
    };

    const handlePopoverClose = () => {
        setAnchorEl(null)
    }

    const open = Boolean(anchorEl)

    return (
        <>
            <button onMouseEnter={handlePopoverOpen} onMouseLeave={handlePopoverClose} className={styles.buttonGrid} {...rest}>
                {content}
            </button>
            <Popover id="mouse-over-popover"
                sx={{
                    pointerEvents: 'none',
                }}
                open={open}
                anchorEl={anchorEl}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left',
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'left',
                }}
                onClose={handlePopoverClose}
                disableRestoreFocus
            >
                <Typography sx={{ p: 1 }}>{mensagemHover}</Typography>
            </Popover>
        </>
    )
}

export function ButtonMenu({ color, content, ...rest }) {
    return (
        <button style={{ backgroundColor: `var(--${color})` }} className={styles.buttonMenu} {...rest}>
            {content}
        </button>
    )
}