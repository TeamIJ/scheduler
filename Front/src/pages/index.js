import Head from "next/head";
import { useState, useContext } from "react";
import styles from "../styles/home.module.css";
import { PopOver } from '@/components/ui/PopOver';

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

  const [user, setUser] = useState('')
  const [password, setPassword] = useState('')

  const [isHovering, setIsHovering] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [optionLoginChecked, setOptionLoginChecked] = useState('P')

  async function hadleLogin(event) {
    event.preventDefault()
    let option = loginOptions.filter(e => {
      return e.checked === true
    })[0].id
    await signIn(user, password, option)
  }

  return (
    <>
      <Head>
        <title>Scheduler - Login</title>
      </Head>
      <div className={styles.container}>
        <div className={styles.login}>
          <div className={styles.titulo}>
            <h1>Faça seu Login</h1>
          </div>

          <form className={styles.formProfessor} onSubmit={(e) => hadleLogin(e)}>
            <Input required placeholder="Nome de Usuário" type="text" value={user} onChange={(e) => setUser(e.target.value)} />
            <Input required placeholder="Senha" type={showPassword ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} />
            <div className={[styles.passwordContainer]}>
              <CheckBox isLoginPage={true} onChange={() => {
                setShowPassword(!showPassword)
              }} options={[
                {
                  id: "S",
                  title: "Mostrar Senha",
                },
              ]}
              ></CheckBox>
              <a className={styles.info} onMouseEnter={() => setIsHovering(true)} onMouseLeave={() => setIsHovering(false)}><ion-icon name="information-circle-outline"></ion-icon>
                <PopOver isHovering={isHovering} type='error' message="Caso não lembre suas credêciais contate o administrador do sistema." />
              </a>
            </div>
            <Button color="light-blue" content={<span>Acessar</span>} />
          </form>
        </div>
        <div className={styles.background}></div>
      </div>
    </>
  );
}