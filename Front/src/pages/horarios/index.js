import Head from 'next/head'
import Router from 'next/router'
import React from "react"
import { useState, useEffect } from "react"
import { validateSession } from '@/contexts/AuthContext'
import { Navbar } from '@/components/ui/Navbar'
import styles from './styles.module.css'
import { api } from "@/services/apiClient"
import { Button, ButtonGrid } from "@/components/ui/Button"
import { CalendarWeek } from '@/components/ui/CalendarWeek';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import { toast } from 'react-toastify'

const days = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb']

export default function Horarios({ calendar }) {

    const [user, setUser] = useState('')
    const [dateHourSelected, setDateHourSelected] = useState('')
    const [diaSemanaSelecionado, setDiaSemanaSelecionado] = useState('')
    const [horariosHabilitados, setHorariosHabilitados] = useState([])
    const [diasHabilitados, setDiasHabilitados] = useState([])

    useEffect(() => {
        if (validateSession()) {
            let auth = localStorage.getItem('auth')
            let authBuffer = Buffer.from(auth, 'base64').toString('ascii')
            setUser(JSON.parse(authBuffer))
        }
    }, [])

    const buttonStyle = {
        width: 150,
        backgroundColor: 'var(--light-blue)',
        fontSize: '100%',
    }

    function handleSalvarAction(e) {
        e.preventDefault()
        try {
            let timetable = []
            diasHabilitados.forEach(async dia => {

                let horarios = horariosHabilitados.filter((h) => {
                    return parseInt(h.split('-')[0]) === dia
                })

                let horariosFormatados = []

                horarios.forEach(horario => {
                    horariosFormatados.push(`${horario.split('-')[4].slice(1)}:00:00`)
                })

                timetable.push({
                    dayWeek: days[dia],
                    hours: horariosFormatados
                })

            })
            api.put('/api/scheduler/timetables/days', timetable)
            api.put('/api/scheduler/timetables/hours', timetable)
            toast.success('Horários atualizados com sucesso!')
        } catch (err) {
            toast.error('Erro ao atualizar os horários!')
        }


    }

    return (
        <>
            <Head>
                <title>Scheduler - Horários</title>
            </Head>
            <Navbar user={user.name} />
            <div className={styles.container}>
                <form className={styles.pesquisaContainer} onSubmit={(e) => handleSalvarAction(e)}>
                    <div className={styles.filtrosContainer}>
                        <div className={styles.voltar}>
                            <ButtonGrid type='button' onClick={() => Router.back()} content={<ArrowBackIosIcon />} />
                        </div>
                    </div>

                    <div className={styles.calendario}>
                        <CalendarWeek tela={'HORARIOS'} calendar={calendar} setDateHourSelected={setDateHourSelected} setDiaSemanaSelecionado={setDiaSemanaSelecionado}
                            setHorariosHabilitados={setHorariosHabilitados}
                            setDiasHabilitados={setDiasHabilitados} />
                    </div>

                    <div className={styles.botoes}>
                        <Button type='submit' color='light-blue' style={buttonStyle} content={
                            <span>Salvar</span>
                        } />
                    </div>
                </form>
            </div>

        </>
    )
}

export const getCalendar = async () => {
    const resCalendar = await api.get('/api/scheduler/timetables/calendar/info')
    return resCalendar.data
}


export const getServerSideProps = async () => {

    const calendar = await getCalendar()
    return {
        props: {
            calendar: calendar
        }
    }
}