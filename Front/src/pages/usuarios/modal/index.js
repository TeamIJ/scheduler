import { useEffect, useState } from "react"
import { api } from '@/services/apiClient'
import { validateSession } from '@/contexts/AuthContext'
import styles from './styles.module.css'
import ModalPassword from "../ChangePassword"
import {
    FormControl, TextField, FormControlLabel, FormLabel, Radio, RadioGroup
} from '@mui/material'
import { Button, ButtonGrid } from '@/components/ui/Button'
import { toast } from 'react-toastify'
import { CheckBox } from "@/components/ui/CheckBox"
import CloseIcon from '@mui/icons-material/Close'

export default function ModalUsuario({ modoModal, pesquisarUsuarios, setShowModalUser, preencheUsuario }) {

    const [user, setUser] = useState('')
    const [usuario, setUsuario] = useState('')
    const [nome, setNome] = useState('')
    const [senha, setSenha] = useState('')
    const [tipo, setTipo] = useState('P')
    const [showPassword, setShowPassword] = useState(false)
    const [showModalPassword, setShowModalPassword] = useState(false)

    useEffect(() => {
        if (validateSession()) {
            let auth = localStorage.getItem('auth')
            let authBuffer = Buffer.from(auth, 'base64').toString('ascii')
            setUser(JSON.parse(authBuffer))
        }
    }, [])

    async function retriveUserInfo(user, setSenha){
        const response = await api.get(`/api/scheduler/users/info/${user}`)
        let i = Buffer.from(response.data.i, 'base64').toString('ascii')
        setSenha(i)
    }

    useEffect(() => {
        if (modoModal !== 'I') {
            setUsuario(preencheUsuario.usuario)
            setNome(preencheUsuario.nome)
            if(user.user === preencheUsuario.usuario){
                retriveUserInfo(preencheUsuario.usuario, setSenha)
            }else{
                setSenha('*********')
            }
        }
    }, [user])

    function handleUsuarioChange(e) {
        setUsuario(e.target.value)
    }

    function handleNomeChange(e) {
        setNome(e.target.value)
    }

    function handleSenhaChange(e) {
        setSenha(e.target.value)
    }

    function handleTipoChange(e) {
        setTipo(e.target.value)
    }

    async function submitUsuario(e) {
        e.preventDefault()

        let user = {
            "usuario": usuario,
            "nome": nome,
            "senha": senha,
            "tipo": tipo
        }
        try {

            let response
            if (modoModal === 'I') {
                response = await api.post('/api/scheduler/users', user)
            } else if (modoModal === 'A') {
                response = await api.put(`/api/scheduler/users/${preencheUsuario.usuario}`, user)
            } else {
                response = await api.delete(`/api/scheduler/users/${preencheUsuario.usuario}`)
            }
            setShowModalUser(false)
            toast.success(response.data.message)
        } catch (err) {
            toast.error(err.response.data.message)
        }
        pesquisarUsuarios(e)
    }

    async function resetPassword(){
        let userReset = {
            "nome": usuario,
            "novaSenha": "",
            "reset": true
        }

        try{
            const response = await api.post(`/api/scheduler/users/changepassword/`, userReset)
            retriveUserInfo(usuario, setSenha)
            setShowPassword(true)
            toast.success(response.data.message)
        }catch (err){
            toast.error(err.response.data.message)
        }
    }

    return (
        <>
            <div className={styles.container}>
                <form className={styles.main} onSubmit={(e) => submitUsuario(e)} >
                    <div className={styles.header}>
                        <ButtonGrid mensagemHover={"Fechar"} content={
                            <CloseIcon />
                        } onClick={(e) => {
                            setShowModalUser(false)
                        }
                        }>
                        </ButtonGrid>
                    </div>

                    <TextField className={styles.usuario} sx={{ width: '100%' }}
                        id="usuario"
                        onChange={handleUsuarioChange}
                        label="Usuário"
                        value={usuario}
                        required={modoModal === 'I'}
                        inputProps={{
                            maxLength: 80
                        }}
                        InputLabelProps={{
                            shrink: true,
                        }}
                        disabled={modoModal !== 'I'}
                    />

                    <TextField className={styles.nome} sx={{ width: '100%' }}
                        id="nome"
                        onChange={handleNomeChange}
                        label="Nome Completo"
                        value={nome}
                        required={modoModal !== 'E'}
                        inputProps={{
                            maxLength: 80
                        }}
                        InputLabelProps={{
                            shrink: true,
                        }}
                        disabled={modoModal === 'E'}
                    />

                    <div className={styles.senha}>
                        <TextField sx={{ width: '50%' }}
                            id="senha"
                            onChange={handleSenhaChange}
                            label="Senha"
                            value={senha}
                            type={showPassword ? "text" : "password"}
                            required={modoModal === 'I'}
                            inputProps={{
                                maxLength: 20
                            }}
                            InputLabelProps={{
                                shrink: true,
                            }}
                            disabled={modoModal !== 'I'}
                        />
                        {modoModal === "A" &&
                            <>
                                <Button type="button" color={'light-blue'} content={"Redefinir"} onClick={() => {
                                    setShowModalPassword(true)
                                }} />
                                {user.role === "A" &&
                                    <Button type="button" color={'light-blue'} content={"Resetar"} onClick={() => resetPassword()}/>
                                }
                            </>
                        }
                    </div>

                    <FormControl className={styles.tipo}>
                        <FormLabel required={modoModal !== 'E'} id="tipo" sx={{ fontSize: '75%' }}>Tipo Usuário</FormLabel>
                        <RadioGroup
                            row
                            aria-labelledby="tipo"
                            name="row-radio-buttons-group"
                            onChange={handleTipoChange}
                            
                        >
                            <FormControlLabel checked={tipo === 'A'} disabled={user.role !== "A" || modoModal === 'E'} value="A" control={<Radio size="small" />} label="Admin" sx={{
                                '& .MuiFormControlLabel-label': {
                                    fontSize: '90%'
                                }
                            }} />
                            <FormControlLabel checked={tipo === 'P'} disabled={user.role !== "A" || modoModal === 'E'}  value="P" control={<Radio size="small" />} label="Professor" sx={{
                                '& .MuiFormControlLabel-label': {
                                    fontSize: '90%'
                                }
                            }} />
                            <FormControlLabel checked={tipo === 'U'} disabled={user.role !== "A" || modoModal === 'E'}  value="U" control={<Radio size="small" />} label="Usuário" sx={{
                                '& .MuiFormControlLabel-label': {
                                    fontSize: '90%'
                                }
                            }} />
                        </RadioGroup>
                    </FormControl>

                    {user.user === preencheUsuario.usuario &&
                        <CheckBox checked={showPassword} isLoginPage={false} onChange={() => {
                            setShowPassword(!showPassword)
                        }} options={[
                            {
                                id: "S",
                                title: "Mostrar Senha",
                            },
                        ]} />
                    }
                    

                    <div className={styles.botoes}>
                        <Button type='submit' color='light-blue' content={
                            <span>{modoModal === 'I' ? 'Cadastrar' : modoModal === 'A' ? 'Alterar' : 'Excluir'}</span>
                        } />
                    </div>
                </form>
            </div >
            
            {showModalPassword &&
                <ModalPassword user={preencheUsuario.usuario} setSenha={setSenha} setShowModalPassword={setShowModalPassword} />
            }
        </>
    )
}