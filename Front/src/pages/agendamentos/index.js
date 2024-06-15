import Head from 'next/head'
import Router from 'next/router'
import React from "react"
import styles from './styles.module.css'
import { useState, useEffect, useRef } from "react"
import { validateSession } from '@/contexts/AuthContext'
import { Navbar } from '@/components/ui/Navbar'
import { ButtonGrid } from "@/components/ui/Button"
import { api } from "@/services/apiClient"
import { CheckBox } from "@/components/ui/CheckBox"
import { replicateZeros } from "@/services/utils"
import ModalAgendamento from "./modal"
import {
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
    FormControl, InputLabel, MenuItem, Select,
    TextField
} from '@mui/material'
import EditIcon from '@mui/icons-material/Edit'
import SearchIcon from '@mui/icons-material/Search'
import AddIcon from '@mui/icons-material/Add'
import PrintIcon from '@mui/icons-material/Print';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import { useReactToPrint } from 'react-to-print'
import { Pagination } from 'antd'

function formataData(dataAtinga) {
    let data = new Date(dataAtinga)
    let dia = data.getDate()
    let mes = data.getMonth() + 1
    let ano = data.getFullYear()
    return replicateZeros(dia, 2) + '/' + replicateZeros(mes, 2) + '/' + ano
}

let statusOptions = [
    {
        "char": "T",
        "label": "Todos"
    },
    {
        "char": "A",
        "label": "Agendado(s)"
    },
    {
        "char": "F",
        "label": "Finalizado(s)"
    },
    {
        "char": "C",
        "label": "Cancelado(s)"
    },
]

async function getProfessores() {
    const response = await api.get(`/api/scheduler/professor/`)

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


export default function Agendamentos({ calendar, agendamentos, cursosOptions }) {

    const [domLoaded, setDomLoaded] = useState(false)
    const [user, setUser] = useState('')
    const [showModal, setShowModal] = useState(false)
    const [modoModal, setModoModal] = useState('I')
    const [listaAgendamentos, setListaAgendamentos] = useState([])
    const [profOptions, setProfOptions] = useState([])
    const [page, setPage] = useState(0)
    const [rowsPerPage, setRowsPerPage] = useState(11)
    const [preencheAgendamento, setPreencheAgendamento] = useState({})
    const [statusSelected, setStatusSelected] = useState("T")
    const [somenteDaSemana, setSomenteDaSemana] = useState(true)
    const [profSelected, setProfSelected] = useState('')
    const [nomeAluno, setNomeAluno] = useState('')
    const [matricula, setMatricula] = useState('')

    const componentRef = useRef();

    const TableAgendamentos = ({innerRef, imprimir}) => {

        let gridColuna = imprimir ? columnsPrint : columns
        return (
            <TableContainer ref={innerRef} sx={{
                height: '100%', maxHeight: '100%', width: '100%', backgroundColor: 'white',
                boxShadow: '4px 2px 23px -18px rgba(0,0,0,0.75)', borderRadius: '5px', marginBottom: '8px'
            }}>
                <Table>
                    <TableHead sx={{ '& .MuiTableRow-head': { backgroundColor: '#ebebeb' } }}>
                        <TableRow>
                            {gridColuna.map((column) => (
                                <TableCell
                                    key={column.id}
                                    style={{ top: 57, fontWeight: 'bold' }}
                                >
                                    {column.label}
                                </TableCell>
                            ))}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {(domLoaded && listaAgendamentos.length > 0) &&
                            listaAgendamentos.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
                                return (
                                    <TableRow hover tabIndex={-1} key={row.idAgenda}>
                                        {
                                            gridColuna.map((column) => {
                                                const value = row[column.id]
                                                return (
                                                    <TableCell key={column.id}>
                                                        {value}
                                                    </TableCell>
                                                )
                                            })
                                        }
                                    </TableRow>
                                )
                            })
                        }
                    </TableBody>
                </Table>
            </TableContainer>
        )
    }

    const columns = [
        { id: 'professor', label: 'Professor', minWidth: 170 },
        { id: 'aluno', label: 'Aluno', minWidth: 100 },
        { id: 'curso', label: 'Curso', minWidth: 100 },
        { id: 'modulo', label: 'Módulo', minWidth: 100 },
        { id: 'aula', label: 'Aula', minWidth: 50 },
        { id: 'data', label: 'Data', minWidth: 100 },
        { id: 'horario', label: 'Horário', minWidth: 100 },
        { id: 'descricaoTipo', label: 'Tipo', minWidth: 100 },
        { id: 'statusDescricao', label: 'Status', minWidth: 100 },
        { id: 'botoes', width: 20 },
    ]

    const columnsPrint = [
        { id: 'professor', label: 'Professor', minWidth: 170 },
        { id: 'aluno', label: 'Aluno', minWidth: 100 },
        { id: 'curso', label: 'Curso', minWidth: 100 },
        { id: 'modulo', label: 'Módulo', minWidth: 100 },
        { id: 'aula', label: 'Aula', minWidth: 50 },
        { id: 'data', label: 'Data', minWidth: 100 },
        { id: 'horario', label: 'Horário', minWidth: 100 },
        { id: 'descricaoTipo', label: 'Tipo', minWidth: 100 },
        { id: 'statusDescricao', label: 'Status', minWidth: 100 },
        { id: 'assinatura', label: 'Assinatura', width: 60}
    ]

    function formataListaAgendamentos(agendamentos) {
        agendamentos.forEach(formataAgendamento => {
            let data = formataAgendamento.data
            let horario = formataAgendamento.horario
            let descricaoTipo = formataAgendamento.tipo === 'R' ? 'Reposição' : "Treinamento"
            let descricaoStatus = formataAgendamento.status === 'A' ? 'Agendado' : formataAgendamento.status === 'C' ? 'Cancelado' : 'Finalizado'
            formataAgendamento.data = formataData(data)
            formataAgendamento.horario = horario.substring(0, 5)
            formataAgendamento.descricaoTipo = descricaoTipo
            formataAgendamento.statusDescricao = descricaoStatus
                formataAgendamento.botoes = formataAgendamento.status === 'A' ? <div className={styles.botoesGrid}>
                <ButtonGrid mensagemHover={"Alterar"}  onClick={() => {
                    setShowModal(true)
                    setModoModal('A')
                    setPreencheAgendamento(formataAgendamento)
                }} content={<EditIcon sx={{ width: '20px', height: '20px' }}></EditIcon>} />
                </div>
                : <></>
        })
        return agendamentos
    }

    useEffect(() => {
        if (validateSession()) {
            let auth = localStorage.getItem('auth')
            let authBuffer = Buffer.from(auth, 'base64').toString('ascii')
            setUser(JSON.parse(authBuffer))
        }
        preencheProfessores()
        setListaAgendamentos(formataListaAgendamentos(agendamentos))
    }, [])

    async function preencheProfessores() {
        let professores = await getProfessores()
        setProfOptions(professores)
    }

    setTimeout(() => {
        setDomLoaded(true)
    }, 150)

    const handlePrint = useReactToPrint({
        content: () => componentRef.current,
        pageStyle: "@page { size: landscape; }",
        documentTitle: 'Lista de Agendamentos',
    })

    function handleMatriculaChange(e) {
        setMatricula(e.target.value)
    }

    function handleNomeAlunoChange(e) {
        setNomeAluno(e.target.value)
    }

    function handleProfChange(e) {
        setProfSelected(e.target.value)
    }

    function handleStatusChange(e) {
        setStatusSelected(e.target.value)
    }

    async function pesquisaAgendamentos(e) {
        e.preventDefault()

        let temFiltro = false
        let filtro = ''
        if (matricula) {
            filtro += `matricula=${matricula}`
            temFiltro = true
        }
        if (nomeAluno) {
            if (temFiltro) {
                filtro += '&'
            }
            filtro += `aluno=${nomeAluno}`
            temFiltro = true
        }
        if (profSelected) {
            if (temFiltro) {
                filtro += '&'
            }
            filtro += `id_prof=${profSelected}`
            temFiltro = true
        }

        if (temFiltro) {
            filtro += '&'
        }
        filtro += `somenteDaSemana=${somenteDaSemana}`
        temFiltro = true

        if (temFiltro) {
            filtro += '&'
        }
        filtro += `status=${statusSelected}`
        temFiltro = true

        let requestURL = `/api/scheduler/schedules/search${temFiltro ? '?' + filtro : ''}`
        const resAgendamento = await api.get(requestURL)
        setListaAgendamentos(formataListaAgendamentos(resAgendamento.data))
        setPage(0)
    }

    return (
        <>
            <Head>
                <title>Scheduler - Agendamentos</title>
            </Head>
            <Navbar user={user.name} />

            <div className={styles.container}>
                <div className={styles.pesquisaContainer}>
                    <form className={styles.filtrosContainer} onSubmit={(e) => pesquisaAgendamentos(e)} onKeyDown={(e) => {
                        if (e.key === "Enter") {
                            pesquisaAgendamentos(e)
                        }
                    }}>
                        <div className={styles.voltar}>
                            <ButtonGrid mensagemHover={"Voltar"}  onClick={() => Router.back()} content={<ArrowBackIosIcon />} />
                        </div>
                        <TextField className={styles.matricula} sx={{ width: '100%' }}
                            id="matriculaInput"
                            onChange={handleMatriculaChange}
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
                            onChange={handleNomeAlunoChange}
                            label="Nome do aluno"
                            InputLabelProps={{
                                shrink: true,
                            }}
                        />
                        <FormControl className={styles.professor} sx={{ width: '100%' }}>
                            <InputLabel shrink htmlFor="profOptionsSelect">
                                Professor(a)
                            </InputLabel>
                            <Select placeholder='Selecione um(a) professor(a)' displayEmpty sx={{ width: '100%' }} label="Professor(a)" id="profOptionsSelect"
                                value={profSelected} onChange={handleProfChange}>
                                <MenuItem value="">
                                    <em>Selecione um(a) professor(a)</em>
                                </MenuItem>
                                {profOptions.map((prof) => {
                                    return (
                                        <MenuItem key={prof.id} disabled={!prof.disponivel} value={prof.id}>{prof.nome}</MenuItem>
                                    )
                                })}
                            </Select>
                        </FormControl>

                        <div className={styles.checkbox}>
                            <CheckBox checked={somenteDaSemana} isLoginPage={false} onChange={() => {
                                setSomenteDaSemana(!somenteDaSemana)
                            }} options={[
                                {
                                    id: "S",
                                    title: "Somente da semana",
                                },
                            ]} />
                        </div>

                        <FormControl className={styles.status} sx={{ width: '100%' }}>
                            <InputLabel shrink htmlFor="statusOptionsSelect">
                                Status
                            </InputLabel>
                            <Select displayEmpty sx={{ width: '100%' }} label="Status" id="statusOptionsSelect"
                                value={statusSelected} onChange={handleStatusChange}>
                                {statusOptions.map((status) => {
                                    return (
                                        <MenuItem key={status.char} value={status.char}>{status.label}</MenuItem>
                                    )
                                })}
                            </Select>
                        </FormControl>

                        <div className={styles.botoes}>
                            <ButtonGrid mensagemHover={"Imprimir"} onClick={handlePrint} content={<PrintIcon></PrintIcon>} />
                            <ButtonGrid mensagemHover={"Pesquisar"} content={<SearchIcon></SearchIcon>} />
                            <ButtonGrid mensagemHover={"Incluir"} type='button' onClick={() => {
                                    setShowModal(true)
                                    setModoModal('I')
                                }} content={<AddIcon></AddIcon>} />
                        </div>
                    </form>
                    <TableAgendamentos imprimir={false}/>
                    <div style={{ display: 'none' }}>
                        <TableAgendamentos innerRef={componentRef} imprimir={true}/>
                    </div>
                    {domLoaded &&
                        <Pagination
                            total={listaAgendamentos.length}
                            showSizeChanger={false}
                            current={page + 1}
                            pageSize={rowsPerPage}
                            onChange={(e) => {
                                setPage(e - 1)
                            }}
                        />
                    }
                </div>
            </div>

            {showModal &&
                <ModalAgendamento calendar={calendar} modoModal={modoModal} cursosOptions={cursosOptions} preencheAgendamento={preencheAgendamento} pesquisaAgendamentos={pesquisaAgendamentos} setShowModal={setShowModal} />
            }
        </>
    )
}

export const getListaAgendamentos = async () => {
    const resAgendamento = await api.get('/api/scheduler/schedules/search?somenteDaSemana=true')

    return resAgendamento.data
}

export const getCalendar = async () => {
    const resCalendar = await api.get('/api/scheduler/timetables/calendar/info')
    return resCalendar.data
}

export const getCursosOptions = async () => {
    const response = await api.get('/api/scheduler/courses')

    let courses = response.data

    let cursosOptions = []

    if(courses.length > 0){
        courses.forEach(course => {
        cursosOptions.push({
                id: course.id,
                nome: course.curso
            })
        })
    }
    
    return cursosOptions
}

export const getServerSideProps = async () => {

    const listaAgendamentos = await getListaAgendamentos()
    const listaCursos = await getCursosOptions()
    const calendar = await getCalendar()
    return {
        props: {
            agendamentos: listaAgendamentos,
            calendar: calendar,
            cursosOptions: listaCursos,
        }
    }
}
