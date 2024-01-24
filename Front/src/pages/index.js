import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/home.module.css'

import { Input, TextArea } from '../components/ui/Input'
import { Button, ButtonGrid, ButtonMenu } from '../components/ui/Button'
import { RadioButton } from '../components/ui/RadioButton'
import { CheckBox } from '../components/ui/CheckBox'
import { ComboBox } from '../components/ui/ComboBox'

const loginOptions = [
  {
    id: 'P',
    title: "Professor"
  },
  {
    id: 'A',
    title: "Aluno"
  },

]

export default function Home() {
  return (
    <>
      <Head>
        <title>Login</title>
      </Head>
      <div className={styles.container}>
        <div className={styles.login}>
          <RadioButton options={loginOptions} />
          <form>
            <Input placeholder="Nome de Usuário" />
            <Input placeholder="Senha" />
            <div className={[styles.textLeft, styles.linkPassword]}>
              <a href='/reset_password'>Esqueci minha senha!</a>
              <Button color="light-blue" content={
                <a>Acessar</a>
              } />
            </div>
          </form>
        </div>
        <div className={styles.background}></div>
      </div>
    </>
  )
}
