import Head from 'next/head'
import { useEffect, useState } from "react";
import styles from './styles.module.css'
import { Navbar } from '../../components/ui/Navbar';
import { ButtonMenu } from '@/components/ui/Button';
import { CalendarMonth, SchoolOutlined, AutoStoriesOutlined, WatchLaterOutlined, GroupOutlined, AccountCircle, Schema } from '@mui/icons-material';
import { validateSession } from '@/contexts/AuthContext';
import { CalendarWeek } from "@/components/ui/CalendarWeek";

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

  const [user, setUser] = useState('')

  useEffect(() => {
    if(validateSession()){
      let auth = localStorage.getItem('auth')
      let authBuffer = Buffer.from(auth, 'base64').toString('ascii')
      setUser(JSON.parse(authBuffer))
    }
  }, [])

  return (
    <>
      {user ?
        <>
          <Head>
            <title>Scheduler - Home</title>
          </Head>
          <Navbar user={user.name} />

          <div className={styles.containter}>
            <div className={styles.menu}>
              <div className={styles.history}>
                <h2>Histórico de Agendamentos</h2>
              </div>
              { user.role !== 'S' ?
                <div className={styles.buttonsContainer}>
                  {buttons.map((button) => {
                    if (button.roles.includes(user.role)) {
                      return <ButtonMenu key={button.id} color={'blue-main'} content={
                        <>
                          {button.icon}
                          <span key={button.id}>{button.title}</span>
                        </>
                      } />
                    }
                  })}
                </div>
                : 
                <>
                  <CalendarWeek/>
                </>
              }
            </div>
          </div>
        </>
        : 
        <></>
      }
    </>
  )
}
