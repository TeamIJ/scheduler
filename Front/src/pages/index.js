import Head from 'next/head'
import Image from 'next/image'

import { Input, TextArea } from '../components/ui/Input'
import { Button, ButtonGrid, ButtonMenu } from '../components/ui/Button'
import { RadioButton } from '../components/ui/RadioButton'

export default function Home() {
  return (
    <div>
      <form>
        <Input placeHolder='E-mail' type='text'/>
        <Input placeHolder='Senha' type='password'/>
        <Button color='light-blue' content={<ion-icon name="chevron-forward-outline"></ion-icon>} />
        <ButtonGrid content={<ion-icon name="pencil-outline"></ion-icon>}/>
        <ButtonMenu color='light-blue' content={
          <>
            <span><ion-icon name="person-outline"></ion-icon></span>
            <a>Usuários</a>
          </>
        }/>
        <RadioButton options={[
          {
            id: 'prof',
            title: 'Professor'
          },
          {
            id: 'student',
            title: 'Aluno'
          }
          ]} />
      </form>
    </div>
  )
}
