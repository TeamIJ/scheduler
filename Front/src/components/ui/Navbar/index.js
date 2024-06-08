import styles from './styles.module.css'
import Router from 'next/router'
import { ButtonGrid  } from '../Button'
import LogoutIcon from '@mui/icons-material/Logout';
import Image from 'next/image';
import LogoImg from '../../../../public/logo_scheduler.png'
import { signOut } from "../../../contexts/AuthContext";
import {useState} from 'react'
import { Popover, Typography } from '@mui/material'

export function Navbar({ user, logo, ...rest }){

    const [anchorEl, setAnchorEl] = useState(null)

    const handlePopoverOpen = (event) => {
        setAnchorEl(event.currentTarget)
    };

    const handlePopoverClose = () => {
        setAnchorEl(null)
    }

    const open = Boolean(anchorEl)
    return (
        <div className={styles.navbar}>
            <h1>{user}</h1>
            <Image onMouseEnter={handlePopoverOpen} onMouseLeave={handlePopoverClose} alt='scheduler' onClick={() => Router.push('/home')} className={styles.img} src={LogoImg}/>
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
                <Typography sx={{ p: 1 }}>Página inicial</Typography>
            </Popover>
            <div className={styles.button}>
                <ButtonGrid mensagemHover={"Sair"}  type='button' onClick={() => {signOut()}} content={<LogoutIcon htmlColor='white' />}/>
            </div>
        </div>
    )
}

