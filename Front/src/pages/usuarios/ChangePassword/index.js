import { useEffect, useState } from "react"
import { api } from '@/services/apiClient'
import { validateSession } from '@/contexts/AuthContext'
import styles from './styles.module.css'
import {
    FormControl, TextField, FormControlLabel, FormLabel, Radio, RadioGroup
} from '@mui/material'
import { Button, ButtonGrid } from '@/components/ui/Button'
import { toast } from 'react-toastify'
import { CheckBox } from "@/components/ui/CheckBox"
import CloseIcon from '@mui/icons-material/Close'

export default function ModalPassword({ user, setSenha, setShowModalPassword }) {

    const [showPassword, setShowPassword] = useState(false)
    const [senhaAtual, setSenhaAtual] = useState('')
    const [senhaNova, setSenhaNova] = useState('')

    function handleSenhaAtualChange(e) {
        setSenhaAtual(e.target.value)
    }

    function handleNovaSenhaChange(e){
        setSenhaNova(e.target.value)
    }

    async function submitChangePassword(e){
        e.preventDefault()

        let updateUser = {
            "nome": user,
            "senha": senhaAtual,
            "novaSenha": senhaNova,
            "reset": false
        }

        try{
            const response = await api.post(`/api/scheduler/users/changepassword/`, updateUser)
            setSenha(response.data.newPassword)
            setShowModalPassword(false)
            toast.success(response.data.message)
        }catch (err){
            toast.error(err.response.data.message)
        }
    }

    return (
        <>
            <div className={styles.container}>
                <form className={styles.main} onSubmit={(e) => submitChangePassword(e)} >
                    <div className={styles.header}>
                        <ButtonGrid content={
                            <CloseIcon />
                        } onClick={() => {
                            setShowModalPassword(false)
                        }
                        }>
                        </ButtonGrid>
                    </div>

                    <TextField className={styles.senhaAtual} sx={{ width: '100%' }}
                        id="senhaAtual"
                        onChange={handleSenhaAtualChange}
                        label="Senha atual"
                        value={senhaAtual}
                        type={showPassword ? 'text' : 'password'}
                        required
                        inputProps={{
                            maxLength: 80
                        }}
                        InputLabelProps={{
                            shrink: true,
                        }}
                    />

                    <TextField className={styles.novaSenha} sx={{ width: '100%' }}
                        id="novaSenha"
                        onChange={handleNovaSenhaChange}
                        label="Nova senha"
                        value={senhaNova}
                        type={showPassword ? 'text' : 'password'}
                        required
                        inputProps={{
                            maxLength: 80
                        }}
                        InputLabelProps={{
                            shrink: true,
                        }}
                    />

                    <CheckBox className={styles.mostraSenha} isLoginPage={false} onChange={() => {
                        setShowPassword(!showPassword)
                    }} options={[
                        {
                            id: "S",
                            title: "Mostrar Senha",
                        },
                    ]} />

                    <div className={styles.botoes}>
                        <Button type='submit' color='light-blue' content={
                            <span>Redefinir</span>
                        } />
                    </div>
                </form>
            </div >
        </>
    )
}