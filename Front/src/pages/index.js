import Head from "next/head";
import styles from "../styles/home.module.css";

import { Input } from "../components/ui/Input";
import { Button } from "../components/ui/Button";
import { RadioButton } from "../components/ui/RadioButton";
import { CheckBox } from "../components/ui/CheckBox";
import { useState } from "react";

const loginOptions = [
  {
    id: "P",
    title: "Professor",
    checked: false,
  },
  {
    id: "A",
    title: "Aluno",
    checked: true
  },
]

export default function Home() {

  const [showPassword, setShowPassword] = useState(false)
  const [optionLoginChecked, setOptionLoginChecked] = useState('A')

  return (
    <>
      <Head>
        <title>Login</title>
      </Head>
      <div className={styles.container}>
        <div className={styles.login}>
          <RadioButton className={styles.radioLogin} options={loginOptions} func={setOptionLoginChecked}/>
          { 
            optionLoginChecked === 'P' ? 
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
                <a href="/reset_password" target="_blank" className={[styles.passwordReset]}>
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