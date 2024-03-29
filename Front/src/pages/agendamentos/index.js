import Head from 'next/head'
import { Navbar } from '../../components/ui/Navbar';
import { useEffect, useState } from "react";
import Router from 'next/router'
import { api } from '@/services/apiClient';
import { validateSession } from '@/contexts/AuthContext';
import styles from './styles.module.css'
import { FormControl, InputLabel, MenuItem, Select, TextField, Paper } from '@mui/material';
import { CalendarWeek } from '@/components/ui/CalendarWeek';
import { Button } from '@/components/ui/Button';

const cursosOptions = []

async function getCursos() {
    const response = await api.get('/api/scheduler/courses')

    let courses = response.data

    courses.forEach(course => {
        cursosOptions.push({
            id: course.ID_CURSO,
            nome: course.NOME_CURSO
        })
    })
}

getCursos()

async function getModulos(curso) {
    const response = await api.get(`/api/scheduler/modules/course/${curso}`)

    let modules = []

    if (response.data.length > 0) {
        response.data.forEach(module => {
            modules.push({
                id: module.ID_MODULO,
                nome: module.NOME_MODULO,
                qtdAulas: module.QTD_AULAS
            })
        })
    } else {
        modules = []
    }

    return modules
}

async function getProfessores(curso) {
    const response = await api.get(`/api/scheduler/professor/course/${curso}`)

    let professors = []

    if (response.data.length > 0) {
        response.data.forEach(prof => {
            professors.push({
                id: prof.ID_PROF,
                cpf: prof.CPF_PROF,
                nome: prof.NOME,
                disponivel: prof.STATUS_PROF === "D"
            })
        })
    } else {
        professors = []
    }

    return professors
}

async function getNomeAluno(matricula) {
    const response = await api.get(`/api/scheduler/students?registry=${matricula}`)

    if (response.data.length !== 0) {
        return response.data[0].NOME
    } else {
        return ''
    }
}

function formataData(data) {
    if (data) {
        let day = data.split('-')[0]
        let month = data.split('-')[1]
        let year = data.split('-')[2]

        return day + '/' + month + '/' + year
    }
    return ''
}

function formataHora(data) {
    if (data) {
        let hour = data.split('-')[3].replace('H', '')
        return hour + ":00"
    }
    return ''
}

export default function Agendamentos() {

    const [user, setUser] = useState('')
    const [profSelected, setProfSelected] = useState('')
    const [cursoSelected, setCursoSelected] = useState('')
    const [moduloSelected, setModuloSelected] = useState('')
    const [modulosOptions, setModulosOptions] = useState([])
    const [profOptions, setProfOptions] = useState([])
    const [matricula, setMatricula] = useState('')
    const [nomeAluno, setNomeAluno] = useState('')
    const [dateHourSelected, setDateHourSelected] = useState('')
    const [showPaper, setShowPaper] = useState(!dateHourSelected)

    useEffect(() => {
        if (validateSession()) {
            let auth = localStorage.getItem('auth')
            let authBuffer = Buffer.from(auth, 'base64').toString('ascii')
            setUser(JSON.parse(authBuffer))
        }
    }, [])

    async function handleCursoChange(e) {
        let course = e.target.value
        setCursoSelected(course)

        let modules = await getModulos(course)
        setModulosOptions(modules)

        let professors = await getProfessores(course)
        setProfOptions(professors)
    }

    function handleModuloChange(e) {
        setModuloSelected(e.target.value)
    }

    function handleProfChange(e) {
        setProfSelected(e.target.value)
    }

    function handleMatriculaChange(e) {
        console.log(e.target.value)
    }

    function handleVoltar() {
        Router.back()
    }

    async function handleMatriculaBlur(e) {
        let matricula = e.target.value
        if (matricula === '') {
            setNomeAluno('')
        } else {
            setNomeAluno(await getNomeAluno(matricula))
        }
    }

    return (
        <>
            <Head>
                <title>Scheduler - Agendamentos</title>
            </Head>
            <Navbar user={user.name} />
            <div className={styles.container}>
                <div className={styles.main}>
                    <TextField className={styles.matriculaAluno} sx={{ width: '100%' }}
                        id="matriculaInput"
                        onChange={handleMatriculaChange}
                        onBlur={handleMatriculaBlur}
                        label="Matrícula"
                        inputProps={{
                            maxLength: 11
                        }}
                        InputLabelProps={{
                            shrink: true,
                        }}
                    />

                    <TextField className={styles.nomeAluno} sx={{ width: '100%' }}
                        id="nomeAlunoInput"
                        onChange={handleMatriculaChange}
                        label="Nome do aluno"
                        value={nomeAluno}
                        disabled
                        InputLabelProps={{
                            shrink: true,
                        }}
                    />

                    <FormControl className={styles.curso} sx={{ width: '100%' }}>
                        <InputLabel shrink htmlFor="cursosOptionsSelect">
                            Curso
                        </InputLabel>
                        <Select placeholder='Selecione um Curso' displayEmpty sx={{ width: '100%' }} label="Curso" id="cursosOptionsSelect"
                            value={cursoSelected} onChange={handleCursoChange}>
                            <MenuItem disabled value="">
                                <em>Selecione um Curso</em>
                            </MenuItem>
                            {cursosOptions.map((curso) => {
                                return (
                                    <MenuItem key={curso.id} value={curso.id}>{curso.nome}</MenuItem>
                                )
                            })}
                        </Select>
                    </FormControl>

                    <FormControl className={styles.modulo} sx={{ width: '100%' }}>
                        <InputLabel shrink htmlFor="modulosOptionsSelect">
                            Módulo
                        </InputLabel>
                        <Select placeholder='Selecione um Módulo' displayEmpty sx={{ width: '100%' }} label="Módulo" id="modulosOptionsSelect"
                            value={moduloSelected} onChange={handleModuloChange}>
                            <MenuItem disabled value="">
                                <em>Selecione um Módulo</em>
                            </MenuItem>
                            {modulosOptions.map((modulo) => {
                                return (
                                    <MenuItem key={modulo.id} value={modulo.id}>{modulo.nome}</MenuItem>
                                )
                            })}
                        </Select>
                    </FormControl>

                    <TextField className={styles.aula} sx={{ width: '100%' }}
                        id="numeroAula"
                        onChange={handleMatriculaChange}
                        onBlur={handleMatriculaBlur}
                        label="Aula"
                        inputProps={{
                            maxLength: 2
                        }}
                        InputLabelProps={{
                            shrink: true,
                        }}
                    />

                    <FormControl className={styles.professor} sx={{ width: '100%' }}>
                        <InputLabel shrink htmlFor="profOptionsSelect">
                            Professor(a)
                        </InputLabel>
                        <Select placeholder='Selecione um professor' displayEmpty sx={{ width: '100%' }} label="Professore(a)" id="profOptionsSelect"
                            value={profSelected} onChange={handleProfChange}>
                            <MenuItem disabled value="">
                                <em>Selecione um professor</em>
                            </MenuItem>
                            {profOptions.map((prof) => {
                                return (
                                    <MenuItem key={prof.id} disabled={!prof.disponivel} value={prof.cpf}>{prof.nome}</MenuItem>
                                )
                            })}
                        </Select>
                    </FormControl>

                    {

                    }
                    <Paper className={styles.confirmacaoDiaHorario} elevation={0}
                        sx={{
                            display: 'flex', flexDirection: 'column', justifyContent: 'center',
                            alignItems: 'flex-start', height: '100%', width: '100%', padding: '5px', paddingLeft: '14px',
                            border: dateHourSelected ? '2px solid var(--light-blue)' : ''
                        }}>
                        {dateHourSelected &&
                            <>
                                <p>Data: {formataData(dateHourSelected)}</p>
                                <p>Horário: {formataHora(dateHourSelected)}</p>
                            </>
                        }
                    </Paper>

                    <div className={styles.calendario}>
                        <CalendarWeek setDateHourSelected={setDateHourSelected} />
                    </div>

                    <div className={styles.botoes}>
                        <Button color='green' content={
                            <span>Agendar</span>
                        } />
                        <Button color='red' content={
                            <span>Cancelar</span>
                        } onClick={handleVoltar} />
                    </div>

                </div>
            </div >
        </>
    )
}