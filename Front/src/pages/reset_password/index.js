import Head from 'next/head'
import { useState } from "react";
import { useRouter } from "next/router";
import styles from './styles.module.css'
import { Input } from '../../components/ui/Input'
import { CheckBox } from "../../components/ui/CheckBox";
import { Button } from '../../components/ui/Button';
import { PopOver } from '../../components/ui/PopOver';

export default function ResetPassword(){
    
    const router = useRouter()

    const [showPassword, setShowPassword] = useState(false)
    return (
        <>
            <Head>
                <title>Scheduler - Mudar senha</title>
            </Head>
            <div className={styles.container}>
                <div className={styles.reset}>
                    <h1 className={styles.font}>Mudar Senha</h1>
                    <form>
                        <Input placeholder="Nome de Usuário" type="text" />
                        <Input placeholder="Senha Anterior"  type={showPassword? 'text' : 'password'} />
                        <Input placeholder="Nova Senha" type={showPassword? 'text' : 'password'} />
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
                        <PopOver type='help-circle-outline'>
                        </PopOver>
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