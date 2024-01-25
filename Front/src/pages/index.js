import Head from "next/head";
import { useState } from "react";
import { useRouter } from "next/router";
import styles from "../styles/home.module.css";

import { Input } from "../components/ui/Input";
import { Button } from "../components/ui/Button";
import { RadioButton } from "../components/ui/RadioButton";
import { CheckBox } from "../components/ui/CheckBox";

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
            <form className={styles.formProfessor}>
              <Input placeholder="Nome de Usuário" type="text" />
              <Input placeholder="Senha" type={showPassword? 'text' : 'password'} />
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
              <Input placeholder="Matrícula" type="text" />
              <Button color="light-blue" content={<span>Acessar</span>} />
            </form>
          }
        </div>
        <div className={styles.background}></div>
      </div>
    </>
  );
}