import Head from 'next/head'
import { useContext, useEffect } from "react";
import Router from 'next/router'
import styles from './styles.module.css'
import { Navbar } from '../../components/ui/Navbar';
import { ButtonMenu } from '@/components/ui/Button';
import { CalendarMonth, Person, SchoolOutlined, AutoStoriesOutlined, WatchLaterOutlined, GroupOutlined, AccountCircle, Schema } from '@mui/icons-material';

import { AuthContext } from "../../contexts/AuthContext";

const buttons = [
  {
    title: 'Agendamentos',
    id: 'agendamentos',
    icon: <CalendarMonth fontSize='large' />,
    roles: ['A', 'P', 'S']
  },
  {
    title: 'Horários',
    id: 'horarios',
    icon: <WatchLaterOutlined fontSize='large' />,
    roles: ['A', 'P']
  },
  {
    title: 'Matrículas',
    id: 'matriculas',
    icon: <SchoolOutlined fontSize='large' />,
    roles: ['A', 'P']
  },
  {
    title: 'Professores',
    id: 'professores',
    icon: <GroupOutlined fontSize='large' />,
    roles: ['A', 'P']
  },
  {
    title: 'Cursos',
    id: 'cursos',
    icon: <AutoStoriesOutlined fontSize='large' />,
    roles: ['A', 'P']
  },
  {
    title: 'Módulos',
    id: 'modulos',
    icon: <Schema fontSize='large' />,
    roles: ['A', 'P']
  },
  {
    title: 'Usuários',
    id: 'usuarios',
    icon: <AccountCircle fontSize='large' />,
    roles: ['A']
  },
]

export default function Home() {

  const authContext = useContext(AuthContext)
  let user = authContext.user
  useEffect(() => {
    console.log(authContext)
  }, [])
  return (
    <>
      <Head>
        <title>Scheduler - Home</title>
      </Head>
      <Navbar user={user ? user.name : ''} />

      <div className={styles.containter}>
        <div className={styles.menu}>
          <div className={styles.history}>
            <h2>Histórico de Agendamentos</h2>
          </div>
          <div className={styles.buttonsContainer}>
            {buttons.map((button) => {
              if(button.roles.includes(user.role)){
                return <ButtonMenu color={'blue-main'} content={
                  <>
                    {button.icon}
                    <span key={button.id}>{button.title}</span>
                  </>
                } />
              }
            })}
          </div>
        </div>
      </div>
    </>
  )
}
