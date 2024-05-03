import Head from 'next/head'
import { useState } from "react";
import { useRouter } from "next/router";
import styles from './styles.module.css'
import { Input } from '../../components/ui/Input'
import { CheckBox } from "../../components/ui/CheckBox";
import { Button } from '../../components/ui/Button';
import { PopOver } from '../../components/ui/PopOver';
import { mask, removeCaracteres } from '@/services/utils';
import { api } from "@/services/apiClient"


export default function ResetPassword(){
    
    const router = useRouter()

    const [showPassword, setShowPassword] = useState(false)
    const [isHovering, setIsHovering] = useState(false)
    const [cpf, setCpf] = useState('')
    const [usuario, setUsuario] = useState('')
    const [senha, setSenha] = useState('')

    function handleCpfChange(e){
        setCpf(e.target.value)
    }

    function handleUsuarioChange(e){
        setUsuario(e.target.value)
    }

    function handleSenhaChange(e){
        setSenha(e.target.value)
    }

    async function updatePassword(e){
        e.preventDefault()

        let user = {
            "nome": usuario,
            "cpf": removeCaracteres(cpf),
            "novaSenha": senha,
            "reset": false
        }

        try {

            const response = await api.post('/api/scheduler/users/changepassword/', user)
            toast.success(response.data.message)
        } catch (err) {
            toast.error(err.response.data.message)
        }
    }

    return (
        <>
            <Head>
                <title>Scheduler - Mudar senha</title>
            </Head>
            <div className={styles.container}>
                <div className={styles.reset}>
                    <h1 className={styles.font}>Mudar Senha</h1>
                    <form onSubmit={(e) => updatePassword(e)}>
                        <Input required placeholder="Nome de Usuário" value={usuario} type="text" onChange={(e) => handleUsuarioChange(e)} />
                        <Input required placeholder="CPF"  type="text" value={cpf} onChange={(e) => handleCpfChange(e)} onBlur={() => mask(cpf, setCpf)} />
                        <Input required placeholder="Nova Senha" value={senha} onChange={(e) => handleSenhaChange(e)} type={showPassword? 'text' : 'password'} />
                        <div className={[styles.passwordContainer]}>
                        <CheckBox onChange={() => {
                            setShowPassword(!showPassword)
                            }} options={[
                                {
                                id: "S",
                                title: "Mostrar Senha",
                                },
                            ]}
                        ></CheckBox>
                        <a className={styles.info} onMouseEnter={() => setIsHovering(true)} onMouseLeave={() => setIsHovering(false)}><ion-icon name="information-circle-outline"></ion-icon>
                            <PopOver isHovering={isHovering} type='error' message="Caso não lembre suas credêciais contate o administrador do sistema."/>
                        </a>
                        </div>
                        <div className={styles.buttonContainer}>
                            <Button  color="light-blue" content={<span>Confirmar</span>} />
                            <Button color="light-blue" type='button' onClick={()=> router.push('/')}
                            content={
                                'Voltar'
                            } 
                            />
                        </div>
                    </form>
                </div>
                <div className={styles.background}></div>
            </div>
        </>
    )
}