import Head from 'next/head'
import { useEffect, useState } from "react";
import { api } from '@/services/apiClient';
import { validateSession } from '@/contexts/AuthContext';
import styles from './styles.module.css'
import {
    FormControl, InputLabel, MenuItem, Select,
    TextField, Paper, RadioGroup, FormControlLabel, FormLabel, Radio
} from '@mui/material';
import { CalendarWeek } from '@/components/ui/CalendarWeek';
import { Button } from '@/components/ui/Button';
import { toast } from 'react-toastify'

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
        let day = data.split('-')[1]
        let month = data.split('-')[2]
        let year = data.split('-')[3]

        return day + '/' + month + '/' + year
    }
    return ''
}

function formataDataSql(data) {
    if (data) {
        let day = data.split('-')[1]
        let month = data.split('-')[2]
        let year = data.split('-')[3]

        return year + '-' + month + '-' + day
    }
    return ''
}

function formataHora(data) {
    if (data) {
        let hour = data.split('-')[4].replace('H', '')
        return hour + ":00"
    }
    return ''
}

export default function ModalAgendamento({ modoModal, pesquisaAgendamentos, setShowModal }) {

    const [user, setUser] = useState('')
    const [profSelected, setProfSelected] = useState('')
    const [cursoSelected, setCursoSelected] = useState('')
    const [moduloSelected, setModuloSelected] = useState('')
    const [modulosOptions, setModulosOptions] = useState([])
    const [profOptions, setProfOptions] = useState([])
    const [matricula, setMatricula] = useState('')
    const [nomeAluno, setNomeAluno] = useState('')
    const [tipoAgendamento, setTipoAgendamento] = useState('R')
    const [aula, setAula] = useState(0)
    const [dateHourSelected, setDateHourSelected] = useState('')
    const [diaSemanaSelecionado, setDiaSemanaSelecionado] = useState('')

    useEffect(() => {
        if (validateSession()) {
            let auth = localStorage.getItem('auth')
            let authBuffer = Buffer.from(auth, 'base64').toString('ascii')
            setUser(JSON.parse(authBuffer))
        }
    }, [])

    function handleMatriculaChange(e) {
        setMatricula(e.target.value)
    }

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

    async function handleMatriculaBlur(e) {
        let matricula = e.target.value
        if (matricula === '') {
            setNomeAluno('')
        } else {
            setNomeAluno(await getNomeAluno(matricula))
        }
    }

    function handleAulaChange(e) {
        setAula(e.target.value)
    }

    function handleTipoAgendamentoChange(e) {
        setTipoAgendamento(e.target.value)
    }

    async function gravaAgendamento(e){
        e.preventDefault()
        if(!dateHourSelected) {
            toast.error('Nenhum horário selecionado!')
        }else{
            let agendamento = {
                "idCurso": cursoSelected,
                "idProf": profSelected,
                "matricula": matricula,
                "idModulo": moduloSelected,
                "horario": formataHora(dateHourSelected),
                "aula": aula,
                "dataAula": formataDataSql(dateHourSelected),
                "diaSemana": diaSemanaSelecionado,
                "login": user.user,
                "statusAgenda": "A",
                "tipoAgendamento": tipoAgendamento
            }

            try{
                const response = await api.post('/api/scheduler/schedules', agendamento)

                setShowModal(false)
                toast.success(response.data.message)
            }catch(err){
                toast.error(err.response.data.message)
            }
        }
        pesquisaAgendamentos(e)
    }

    return (
        <>
            <Head>
                <title>Scheduler - Agendamentos</title>
            </Head>
            <div className={styles.container}>
                <form className={styles.main} onSubmit={(e) => gravaAgendamento(e)} >
                    <TextField className={styles.matriculaAluno} sx={{ width: '100%' }}
                        id="matriculaInput"
                        onChange={handleMatriculaChange}
                        onBlur={handleMatriculaBlur}
                        label="Matrícula"
                        required
                        inputProps={{
                            maxLength: 11
                        }}
                        InputLabelProps={{
                            shrink: true,
                        }}
                    />

                    <TextField className={styles.nomeAluno} sx={{ width: '100%' }}
                        id="nomeAlunoInput"
                        label="Nome do aluno"
                        value={nomeAluno}
                        disabled
                        InputLabelProps={{
                            shrink: true,
                        }}
                    />

                    <FormControl className={styles.curso} sx={{ width: '100%' }}>
                        <InputLabel required shrink htmlFor="cursosOptionsSelect">
                            Curso
                        </InputLabel>
                        <Select required placeholder='Selecione um Curso' displayEmpty sx={{ width: '100%' }} label="Curso" id="cursosOptionsSelect"
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
                        <InputLabel required shrink htmlFor="modulosOptionsSelect">
                            Módulo
                        </InputLabel>
                        <Select required placeholder='Selecione um Módulo' displayEmpty sx={{ width: '100%' }} label="Módulo" id="modulosOptionsSelect"
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
                        onChange={handleAulaChange}
                        label="Aula"
                        required
                        inputProps={{
                            maxLength: 2
                        }}
                        InputLabelProps={{
                            shrink: true,
                        }}
                    />

                    <FormControl className={styles.professor} sx={{ width: '100%' }}>
                        <InputLabel required shrink htmlFor="profOptionsSelect">
                            Professor(a)
                        </InputLabel>
                        <Select required placeholder='Selecione um professor' displayEmpty sx={{ width: '100%' }} label="Professore(a)" id="profOptionsSelect"
                            value={profSelected} onChange={handleProfChange}>
                            <MenuItem disabled value="">
                                <em>Selecione um professor</em>
                            </MenuItem>
                            {profOptions.map((prof) => {
                                return (
                                    <MenuItem key={prof.id} disabled={!prof.disponivel} value={prof.id}>{prof.nome}</MenuItem>
                                )
                            })}
                        </Select>
                    </FormControl>

                    <div className={styles.tipoAgendamento}>
                        <FormControl >
                            <FormLabel required id="tipoAgendamento" sx={{ fontSize: '75%' }}>Tipo Agendamento</FormLabel>
                            <RadioGroup
                                row
                                aria-labelledby="tipoAgendamento"
                                name="row-radio-buttons-group"
                                onChange={handleTipoAgendamentoChange}

                            >
                                <FormControlLabel checked={tipoAgendamento === 'R'} value="R" control={<Radio size="small" />} label="Reposição" sx={{ '& .MuiFormControlLabel-label': {
                                    fontSize: '90%'
                                }}} />
                                <FormControlLabel checked={tipoAgendamento === 'T'} value="T" control={<Radio size="small" />} label="Treinamento" sx={{ '& .MuiFormControlLabel-label': {
                                    fontSize: '90%'
                                }}} />
                            </RadioGroup>
                        </FormControl>
                    </div>

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
                        <CalendarWeek setDateHourSelected={setDateHourSelected} setDiaSemanaSelecionado={setDiaSemanaSelecionado} />
                    </div>

                    <div className={styles.botoes}>
                        <Button type='submit' color='green' content={
                            <span>{modoModal === 'I' ? 'Agendar' : 'Alterar'}</span>
                        } />
                        <Button color='red' content={
                            <span>Cancelar</span>
                        } onClick={() => setShowModal(false)} />
                    </div>

                </form>
            </div >
        </>
    )
}