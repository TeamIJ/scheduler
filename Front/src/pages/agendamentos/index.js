import Head from "next/head"
import Router from 'next/router'
import React from "react"
import { useState, useContext, useEffect } from "react"
import { validateSession } from '@/contexts/AuthContext'
import { Navbar } from '@/components/ui/Navbar'
import styles from './styles.module.css'
import { Button, ButtonGrid } from "@/components/ui/Button"
import { api } from "@/services/apiClient"
import ModalAgendamento from "./modal"
import {
    Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow,
    FormControl, InputLabel, MenuItem, Select,
    TextField
} from '@mui/material'
import EditIcon from '@mui/icons-material/Edit'
import SearchIcon from '@mui/icons-material/Search'
import AddIcon from '@mui/icons-material/Add'
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import { replicateZeros } from "@/services/utils"

import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'

const letrasDiasSemana = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S']

function formataData(dataAtinga) {
    let data = new Date(dataAtinga)
    let dia = data.getDate()
    let mes = data.getMonth() + 1
    let ano = data.getFullYear()
    return replicateZeros(dia, 2) + '/' + replicateZeros(mes, 2) + '/' + ano
}

function formataDataSQL(dia, mes, ano) {
    return ano + '-' + replicateZeros(mes + 1, 2) + '-' + replicateZeros(dia, 2)
}

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

let matricula
let nomeAluno
let profSelected
let data

export default function Home({ agendamentos }) {

    const [domLoaded, setDomLoaded] = useState(false)
    const [user, setUser] = useState('')
    const [showModal, setShowModal] = useState(false)
    const [modoModal, setModoModal] = useState('I')
    const [listaAgendamentos, setListaAgendamentos] = useState([])
    const [profOptions, setProfOptions] = useState([])
    const [page, setPage] = useState(0)
    const [rowsPerPage, setRowsPerPage] = useState(8)

    const handleChangePage = (event, newPage) => {
        setPage(newPage)
    }

    const columns = [
        { id: 'professor', label: 'Professor', minWidth: 170 },
        { id: 'aluno', label: 'Aluno', minWidth: 100 },
        { id: 'curso', label: 'Curso', minWidth: 100 },
        { id: 'modulo', label: 'Módulo', minWidth: 100 },
        { id: 'aula', label: 'Aula', minWidth: 50 },
        { id: 'data', label: 'Data', minWidth: 100 },
        { id: 'horario', label: 'Horário', minWidth: 100 },
        { id: 'tipo', label: 'Tipo', minWidth: 100 },
        { id: 'alterar', width: 20 }
    ]

    function formataListaAgendamentos(agendamentos) {
        agendamentos.forEach(agendamento => {
            let data = agendamento.data
            let horario = agendamento.horario
            let tipo = agendamento.tipo
            agendamento.data = formataData(data)
            agendamento.horario = horario.substring(0, 5)
            agendamento.tipo = tipo === 'R' ? 'Reposição' : "Treinamento"
            agendamento.alterar = <ButtonGrid onClick={() => {
                setShowModal(true)
                setModoModal('A')
            }} content={<EditIcon sx={{ width: '20px', height: '20px' }}></EditIcon>} />
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

    function handleMatriculaChange(e) {
        matricula = e.target.value
    }

    function handleNomeAlunoChange(e) {
        nomeAluno = e.target.value
    }

    function handleProfChange(e) {
        profSelected = e.target.value
    }

    function handleDataChange(e) {
        if (e) {
            data = formataDataSQL(e.$D, e.$M, e.$y)
        } else {
            data = ''
        }
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
        if (data) {
            if (temFiltro) {
                filtro += '&'
            }
            filtro += `data=${data}`
            temFiltro = true
        }
        let requestURL = `/api/scheduler/schedules/search${temFiltro ? '?' + filtro : ''}`
        const resAgendamento = await api.get(requestURL)
        setListaAgendamentos(formataListaAgendamentos(resAgendamento.data))
    }

    return (
        <>
            <Navbar user={user.name} />

            <div className={styles.container}>
                <div className={styles.pesquisaContainer}>
                    <form className={styles.filtrosContainer} onSubmit={(e) => pesquisaAgendamentos(e)} >
                        <div className={styles.voltar}>
                            <ButtonGrid onClick={() => Router.back()} content={<ArrowBackIosIcon />} />
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
                            <Select placeholder='Selecione um professor' displayEmpty sx={{ width: '100%' }} label="Professore(a)" id="profOptionsSelect"
                                value={profSelected} onChange={handleProfChange}>
                                <MenuItem value="">
                                    <em>Selecione um professor</em>
                                </MenuItem>
                                {profOptions.map((prof) => {
                                    return (
                                        <MenuItem key={prof.id} disabled={!prof.disponivel} value={prof.id}>{prof.nome}</MenuItem>
                                    )
                                })}
                            </Select>
                        </FormControl>

                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DatePicker format="DD/MM/YYYY" label="Data" InputLabelProps={{
                                shrink: true,
                            }} onChange={(e) => handleDataChange(e)}
                                dayOfWeekFormatter={(weekday) => `${letrasDiasSemana[weekday.$W]}`}
                            />
                        </LocalizationProvider>

                        <div className={styles.botoes}>
                            <ButtonGrid content={<SearchIcon></SearchIcon>} />
                            <ButtonGrid type='button' onClick={() => {
                                setShowModal(true)
                                setModoModal('I')
                            }} content={<AddIcon></AddIcon>} />
                        </div>
                    </form>
                    <TableContainer sx={{
                        height: '100%', maxHeight: '100%', width: '95%', backgroundColor: 'white',
                        boxShadow: '4px 2px 23px -18px rgba(0,0,0,0.75)', borderRadius: '5px'
                    }}>
                        <Table>
                            <TableHead sx={{ '& .MuiTableRow-head': { backgroundColor: '#ebebeb' } }}>
                                <TableRow>
                                    {columns.map((column) => (
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
                                {domLoaded &&
                                    listaAgendamentos.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
                                        return (
                                            <TableRow hover tabIndex={-1} key={row.idAgenda}>
                                                {
                                                    columns.map((column) => {
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
                    {domLoaded &&
                        <TablePagination
                            count={agendamentos.length}
                            rowsPerPage={rowsPerPage}
                            page={page}
                            onPageChange={handleChangePage}
                        />
                    }
                </div>
            </div>

            {showModal &&
                <ModalAgendamento modoModal={modoModal} pesquisaAgendamentos={pesquisaAgendamentos} setShowModal={setShowModal} />
            }
        </>
    )
}

export const getListaAgendamentos = async () => {
    const resAgendamento = await api.get('/api/scheduler/schedules/search')

    return resAgendamento.data
}

export const getServerSideProps = async () => {

    const listaAgendamentos = await getListaAgendamentos()

    return {
        props: {
            agendamentos: listaAgendamentos
        }
    }
}