import Head from 'next/head'
import Router from 'next/router'
import React from "react"
import { useState, useEffect } from "react"
import { validateSession } from '@/contexts/AuthContext'
import { Navbar } from '@/components/ui/Navbar'
import styles from './styles.module.css'
import { ButtonGrid } from "@/components/ui/Button"
import { api } from "@/services/apiClient"
import ModalProfessor from "./modal"
import {
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
    FormControl, InputLabel, MenuItem, Select, TextField
} from '@mui/material'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete';
import SearchIcon from '@mui/icons-material/Search'
import AddIcon from '@mui/icons-material/Add'
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';

import { Pagination } from 'antd'

async function getProfessores() {
    const response = await api.get(`/api/scheduler/professor/`)

    let professors = []

    if (response.data.length > 0) {
        response.data.forEach(prof => {
            professors.push({
                id: prof.ID_PROF,
                nome: prof.NOME,
                disponivel: prof.STATUS_PROF === "D"
            })
        })
    } else {
        professors = []
    }
    return professors
}

getProfessores()

let statusOptions = [
    {
        "char": "T",
        "label": "Todos"
    },
    {
        "char": "D",
        "label": "Dísponivel"
    },
    {
        "char": "A",
        "label": "Ausente"
    },
]

export default function Home({ professores, cursos }) {

    const [domLoaded, setDomLoaded] = useState(false)
    const [user, setUser] = useState('')
    const [showModal, setShowModal] = useState(false)
    const [modoModal, setModoModal] = useState('I')
    const [listaProfessores, setListaProfessores] = useState([])
    const [page, setPage] = useState(0)
    const [rowsPerPage, setRowsPerPage] = useState(11)
    const [nomeProfessor, setNomeProfessor] = useState([])
    const [preencheProfessor, setPreencheProfessor] = useState({})
    const [statusSelected, setStatusSelected] = useState('T')

    const columns = [
        { id: 'nome', label: 'Nome', minWidth: '200%' },
        { id: 'statusDescricao', label: 'Status', minWidth: '50px' },
        { id: 'botoes', maxWidth: '40px' },
    ]

    useEffect(() => {
        if (validateSession()) {
            let auth = localStorage.getItem('auth')
            let authBuffer = Buffer.from(auth, 'base64').toString('ascii')
            setUser(JSON.parse(authBuffer))
        }
    }, [])


    
    function formataListaProfessores(professores) {
        professores.forEach(professor => {
            let descricaoStatus = professor.STATUS_PROF === 'D' ? 'Dísponivel' : 'Ausente'
            professor.statusDescricao = descricaoStatus
            professor.status = professor.STATUS_PROF
            professor.cpf = professor.CPF_PROF
            professor.nome = professor.NOME
            professor.id = professor.ID_PROF
            professor.botoes = <div className={styles.botoesGrid}>
                <ButtonGrid key={'alterar'} content={<EditIcon />} onClick={() => {
                    setModoModal("A")
                    setShowModal(true)
                    setPreencheProfessor(professor)
                }}/>
                <ButtonGrid key={'excluir'} content={<DeleteIcon />} onClick={() => {
                    setModoModal("E")
                    setShowModal(true)
                    setPreencheProfessor(professor)
                }}/>
            </div>
        })

        return professores
    }

    useEffect(() => {
        setListaProfessores(formataListaProfessores(professores))
    }, [])


    setTimeout(() => {
        setDomLoaded(true)
    }, 150)

    function handleNomeChange(e){
        setNomeProfessor(e.target.value)
    }

    function handleStatusChange(e){
        setStatusSelected(e.target.value)
    }

    async function pesquisarProfessor(e) {
        e.preventDefault()

        let temFiltro = false
        let filtro = ''
        if (nomeProfessor !== '') {
            if (temFiltro) {
                filtro += '&'
            }
            filtro += `nome=${nomeProfessor}`
            temFiltro = true
        }

        if (temFiltro) {
            filtro += '&'
        }
        filtro += `status_prof=${statusSelected}`
        temFiltro = true

        let requestURL = `/api/scheduler/professor/${temFiltro ? '?' + filtro : ''}`
        const resProf = await api.get(requestURL)
        setListaProfessores(formataListaProfessores(resProf.data))
        setPage(0)
    }

    return (
        <>
            <Head>
                <title>Scheduler - Professores</title>
            </Head>
            <Navbar user={user.name} />
            <div className={styles.container}>
                <div className={styles.pesquisaContainer}>
                    <form className={styles.filtrosContainer} onSubmit={(e) => pesquisarProfessor(e)} onKeyDown={(e) => {
                        if (e.key === "Enter") {
                            pesquisarProfessor(e)
                        }
                    }}>
                        <div className={styles.voltar}>
                            <ButtonGrid onClick={() => Router.back()} content={<ArrowBackIosIcon />} />
                        </div>

                        <TextField className={styles.professor} sx={{ width: '100%' }}
                            id="nomeInput"
                            onChange={handleNomeChange}
                            label="Nome"
                            value={nomeProfessor}
                            InputLabelProps={{
                                shrink: true,
                            }}
                        />

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
                            <ButtonGrid content={<SearchIcon></SearchIcon>} />
                            <ButtonGrid type='button' onClick={() => {
                                setShowModal(true)
                                setModoModal('I')
                            }} content={<AddIcon></AddIcon>} />
                        </div>
                    </form>
                    <TableContainer sx={{
                        height: '100%', maxHeight: '100%', width: '95%', backgroundColor: 'white',
                        boxShadow: '4px 2px 23px -18px rgba(0,0,0,0.75)', borderRadius: '5px', marginBottom: '8px'
                    }}>
                        <Table>
                            <TableHead sx={{ '& .MuiTableRow-head': { backgroundColor: '#ebebeb' } }}>
                                <TableRow>
                                    {columns.map((column) => (
                                        <TableCell
                                            key={column.id}
                                            style={{ top: 57, fontWeight: 'bold', minWidth: column.minWidth, maxWidth: column.maxWidth }}
                                        >
                                            {column.label}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {domLoaded &&
                                    listaProfessores.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
                                        return (
                                            <TableRow hover tabIndex={-1} key={row.idAgenda}>
                                                {
                                                    columns.map((column) => {
                                                        const value = row[column.id]
                                                        return (
                                                            <TableCell key={column.id}
                                                                style={{ minWidth: column.minWidth, maxWidth: column.maxWidth }}
                                                            >
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
                        <Pagination
                            total={listaProfessores.length}
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
                <ModalProfessor cursos={cursos} modoModal={modoModal} preencheProfessor={preencheProfessor} pesquisarProfessor={pesquisarProfessor} setShowModal={setShowModal} />
            }
        </>
    )
}

export const getListaProfessores = async () => {
    const resProf = await api.get('/api/scheduler/professor/')
    return resProf.data
}

export const getListaCursos = async () => {
    const resCursos = await api.get('/api/scheduler/courses')
    let courses = resCursos.data
    let coursesAux = []
    courses.forEach(course => {
        coursesAux.push({
            id: course.id,
            nome: course.curso
        })
    })
    return coursesAux
}

export const getServerSideProps = async () => {

    const listaProfessores = await getListaProfessores()
    const listaCursos = await getListaCursos()
    return {
        props: {
            professores: listaProfessores,
            cursos: listaCursos
        }
    }
}