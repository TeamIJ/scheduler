import Head from "next/head";
import Image from "next/image";
import styles from "../styles/home.module.css";

import { Input, TextArea } from "../components/ui/Input";
import { Button, ButtonGrid, ButtonMenu } from "../components/ui/Button";
import { RadioButton } from "../components/ui/RadioButton";
import { CheckBox } from "../components/ui/CheckBox";
import { ComboBox } from "../components/ui/ComboBox";
import { useState } from "react";

const loginOptions = [
  {
    id: "P",
    title: "Professor",
  },
  {
    id: "A",
    title: "Aluno",
  },
];

export default function Home() {

  const [showPassword, setShowPassword] = useState(false)

  return (
    <>
      <Head>
        <title>Login</title>
      </Head>
      <div className={styles.container}>
        <RadioButton className={styles.radio} options={loginOptions} />
        <div className={styles.login}>
          { 
            true ? 
            <form>
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
            <form>
              <Input placeholder="Nome de Usuário" type="text" />
              <Button color="light-blue" content={<span>Acessar</span>} />
            </form>
          }
        </div>
        <div className={styles.background}></div>
      </div>
    </>
  );
}