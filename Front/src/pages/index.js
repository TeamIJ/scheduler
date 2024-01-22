import Head from 'next/head'
import Image from 'next/image'

import { Input, TextArea } from '../components/ui/Input'
import { Button, ButtonGrid, ButtonMenu } from '../components/ui/Button'
import { RadioButton } from '../components/ui/RadioButton'
import { CheckBox } from '../components/ui/CheckBox'
import { ComboBox } from '../components/ui/ComboBox'

export default function Home() {
  return (
    <div>
      <form>
        <Input placeholder='E-mail' type='text'/>
        <Input placeholder='Senha' type='password'/>
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

          <CheckBox  options={[
            {
              id: 'prof',
              title: 'Professor'
            },
            {
              id: 'student',
              title: 'Aluno'
            }
          ]}/>
          <ComboBox options={[
            {
              id: 1,
              title: 'Izzy'
            },
            {
              id: 2,
              title: 'Jack'
            },
            {
              id: 3,
              title: 'Will',
              disabled: true
            },
          ]}/>
      </form>
    </div>
  )
}
