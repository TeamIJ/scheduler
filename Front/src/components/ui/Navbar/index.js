import styles from './styles.module.css'
import { ButtonGrid  } from '../Button'
import LogoutIcon from '@mui/icons-material/Logout';
import Image from 'next/image';
import LogoImg from '../../../../public/logo_scheduler.png'
import { signOut } from "../../../contexts/AuthContext";
import { useContext } from "react";

export function Navbar({ user, logo, ...rest }){
    return (
        <div className={styles.navbar}>
            <h1>{user}</h1>
            <Image className={styles.img} src={LogoImg}/>
            <div className={styles.button}>
                <ButtonGrid type='button' onClick={() => {signOut()}} content={<LogoutIcon htmlColor='white' fontSize='small' />}/>
            </div>
        </div>
    )
}

