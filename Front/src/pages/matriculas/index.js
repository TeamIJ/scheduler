import Head from 'next/head'
import Router from 'next/router'
import React from "react"
import { useState, useEffect } from "react"
import { validateSession } from '@/contexts/AuthContext'
import { Navbar } from '@/components/ui/Navbar'
import styles from './styles.module.css'
import { ButtonGrid } from "@/components/ui/Button"
import { api } from "@/services/apiClient"
import ModalStudents from "./modal"
import {
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
    FormControl, InputLabel, MenuItem, Select,
    TextField
} from '@mui/material'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete';
import SearchIcon from '@mui/icons-material/Search'
import AddIcon from '@mui/icons-material/Add'
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';

import { Pagination } from 'antd'

let statusOptions = [
    {
        "char": "T",
        "label": "Todos"
    },
    {
        "char": "A",
        "label": "Ativo"
    },
    {
        "char": "I",
        "label": "Inativo"
    },
]

export default function Home({ students }) {

    const [domLoaded, setDomLoaded] = useState(false)
    const [page, setPage] = useState(0)
    const [rowsPerPage, setRowsPerPage] = useState(11)
    const [user, setUser] = useState('')
    const [showModal, setShowModal] = useState(false)
    const [modoModal, setModoModal] = useState('I')
    const [nome, setNome] = useState('')
    const [status, setStatus] = useState('T')
    const [registry, setRegistry] = useState('')
    const [listaStudents, setListaStudents] = useState([])
    const [statusSelected, setStatusSelected] = useState('T')
    const [preencheStudent, setPreencheStudent] = useState([])

    const columns = [
        { id: 'matricula', label: 'Matrícula', maxWidth: '20px' },
        { id: 'nome', label: 'Nome', minWidth: '100%' },
        { id: 'statusDescricao', label: 'Status', minWidth: '100%' },
        { id: 'botoes', maxWidth: '40px' },
    ]

    useEffect(() => {
        if (validateSession()) {
            let auth = localStorage.getItem('auth')
            let authBuffer = Buffer.from(auth, 'base64').toString('ascii')
            setUser(JSON.parse(authBuffer))
        }
    }, [])

    function formataListaStudents(students) {
        students.forEach(student => {
            student.statusDescricao = student.status === 'A' ? 'Ativo' : 'Inativo'
            student.botoes = <div className={styles.botoesGrid}>
                <ButtonGrid key={'alterar'} content={<EditIcon />} onClick={() => {
                    setModoModal("A")
                    setShowModal(true)
                    setPreencheStudent(student)
                }}/>
                <ButtonGrid key={'excluir'} content={<DeleteIcon />} onClick={() => {
                    setModoModal("E")
                    setShowModal(true)
                    setPreencheStudent(student)
                }}/>
            </div>
        })
        return students
    }

    useEffect(() => {
        setListaStudents(formataListaStudents(students))
    }, [])


    setTimeout(() => {
        setDomLoaded(true)
    }, 150)

    function handleNomeChange(e) {
        setNome(e.target.value)
    }

    function handleStudentChange(e){
        setRegistry(e.target.value)
    }

    function handleStatusChange(e){
        setStatusSelected(e.target.value)
    }

    async function pesquisarStudents(e) {
        e.preventDefault()

        let temFiltro = false
        let filtro = ''
        if (registry) {
            filtro += `registry=${registry}`
            temFiltro = true
        }

        if (nome) {
            if (temFiltro) {
                filtro += '&'
            }
            filtro +=  `nome_aluno=${nome}`
            temFiltro = true
        }

        if (temFiltro) {
            filtro += '&'
        }
        filtro += `status=${statusSelected}`
        temFiltro = true

        let requestURL = `/api/scheduler/students/${temFiltro ? '?' + filtro : ''}`
        const resStudents = await api.get(requestURL)
        setListaStudents(formataListaStudents(resStudents.data))
        setPage(0)
    }

    return (
        <>
            <Head>
                <title>Scheduler - Alunos</title>
            </Head>
            <Navbar user={user.name} />
            <div className={styles.container}>
                <div className={styles.pesquisaContainer}>
                    <form className={styles.filtrosContainer} onSubmit={(e) => pesquisarStudents(e)} onKeyDown={(e) => {
                        if (e.key === "Enter") {
                            pesquisarStudents(e)
                        }
                    }}>
                        <div className={styles.voltar}>
                            <ButtonGrid onClick={() => Router.back()} content={<ArrowBackIosIcon />} />
                        </div>

                        <TextField className={styles.student} sx={{ width: '100%' }}
                            id="studentInput"
                            onChange={handleStudentChange}
                            label="Matrícula"
                            inputProps={{
                                maxLength: 11
                            }}
                            InputLabelProps={{
                                shrink: true,
                            }}
                        />
                        <TextField className={styles.nome} sx={{ width: '100%' }}
                            id="nomeInput"
                            onChange={handleNomeChange}
                            label="Nome"
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
                                    listaStudents.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
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
                            total={listaStudents.length}
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
                <ModalStudents modoModal={modoModal} preencheStudent={preencheStudent} pesquisarStudents={pesquisarStudents} setShowModal={setShowModal} />
            }
        </>
    )
}

export const getListaStudents = async () => {
    const resStudents = await api.get('/api/scheduler/students')

    return resStudents.data
}

export const getServerSideProps = async () => {

    const listaStudents = await getListaStudents()

    return {
        props: {
            students: listaStudents
        }
    }
}