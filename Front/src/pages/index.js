import Head from 'next/head'
import Image from 'next/image'

import { Input, TextArea } from '../components/ui/Input'

export default function Home() {
  return (
    <div>
      <form>
        <Input placeHolder='E-mail' type='text'/>
        <Input placeHolder='Senha' type='password'/>
      </form>
    </div>
  )
}
