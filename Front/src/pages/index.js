import Head from "next/head";
import { useState, useContext } from "react";
import { useRouter } from "next/router";
import styles from "../styles/home.module.css";

import { Input } from "../components/ui/Input";
import { Button } from "../components/ui/Button";
import { RadioButton } from "../components/ui/RadioButton";
import { CheckBox } from "../components/ui/CheckBox";

import { AuthContext } from "../contexts/AuthContext";

const loginOptions = [
  {
    id: "P",
    title: "Professor",
    checked: true,
  },
  {
    id: "A",
    title: "Aluno",
    checked: false
  },
]

export default function Home() {
  const { signIn } = useContext(AuthContext)

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)


  async function hadleLogin ( event ){
    event.preventDefault()
    await signIn( email, password )
  }

  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [optionLoginChecked, setOptionLoginChecked] = useState('P')

  return (
    <>
      <Head>
        <title>Scheduler - Login</title>
      </Head>
      <div className={styles.container}>
        <div className={styles.login}>
          <RadioButton className={styles.radioLogin} options={loginOptions} func={setOptionLoginChecked}/>
          { 
            optionLoginChecked !== 'A' ? 
            <form className={styles.formProfessor} onSubmit={ (e) => hadleLogin(e)}>
              <Input required placeholder="Nome de Usuário" type="text" value={email} onChange={(e) => setEmail(e.target.value)}/>
              <Input required placeholder="Senha" type={showPassword? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)}/>
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
                <a href="/reset_password" className={[styles.passwordReset]}>
                  Esqueci minha senha
                </a>
              </div>
                <Button color="light-blue" content={<span>Acessar</span>} />
            </form>
            :
            <form className={styles.formStudent}>
              <Input required placeholder="Matrícula" type="text" />
              <Button color="light-blue" content={<span>Acessar</span>} />
            </form>
          }
        </div>
        <div className={styles.background}></div>
      </div>
    </>
  );
}