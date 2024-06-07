import Head from 'next/head'
import Router from 'next/router'
import React from "react"
import { useState, useEffect } from "react"
import { validateSession } from '@/contexts/AuthContext'
import { Navbar } from '@/components/ui/Navbar'
import styles from './styles.module.css'
import { ButtonGrid } from "@/components/ui/Button"
import { api } from "@/services/apiClient"
import ModalCurso from "./modal"
import {
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField
} from '@mui/material'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete';
import SearchIcon from '@mui/icons-material/Search'
import AddIcon from '@mui/icons-material/Add'
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';

import { Pagination } from 'antd'

export default function Cursos({ cursos }) {

    const [domLoaded, setDomLoaded] = useState(false)
    const [user, setUser] = useState('')
    const [showModal, setShowModal] = useState(false)
    const [modoModal, setModoModal] = useState('I')
    const [listaCursos, setListaCursos] = useState([])
    const [page, setPage] = useState(0)
    const [rowsPerPage, setRowsPerPage] = useState(11)
    const [nomeCurso, setNomeCurso] = useState('')
    const [preencheCurso, setPreencheCurso] = useState({})

    const columns = [
        { id: 'curso', label: 'Curso', minWidth: '100%' },
        { id: 'botoes', maxWidth: '40px' }
    ]

    function formataListaCursos(cursos) {
        cursos.forEach(curso => {
            curso.botoes = <div className={styles.botoesGrid}>
                <ButtonGrid key={'alterar'} content={<EditIcon />} onClick={() => {
                    setModoModal("A")
                    setShowModal(true)
                    setPreencheCurso(curso)
                }}/>
                <ButtonGrid key={'excluir'} content={<DeleteIcon />} onClick={() => {
                    setModoModal("E")
                    setShowModal(true)
                    setPreencheCurso(curso)
                }}/>
            </div>
        })
        return cursos
    }

    useEffect(() => {
        if (validateSession()) {
            let auth = localStorage.getItem('auth')
            let authBuffer = Buffer.from(auth, 'base64').toString('ascii')
            setUser(JSON.parse(authBuffer))
        }
    }, [])

    useEffect(() => {
        setListaCursos(formataListaCursos(cursos))
    }, [])

    setTimeout(() => {
        setDomLoaded(true)
    }, 150)


    function handleNomeCursoChange(e) {
        setNomeCurso(e.target.value)
    }

    async function pesquisarCursos(e) {
        e.preventDefault()
        let requestURL = `/api/scheduler/courses/${nomeCurso}`
        const resCurso = await api.get(requestURL)
        setListaCursos(formataListaCursos(resCurso.data))
        setPage(0)
    }

    return (
        <>
            <Head>
                <title>Scheduler - Cursos</title>
            </Head>
            <Navbar user={user.name} />
            <div className={styles.container}>
                <div className={styles.pesquisaContainer}>
                    <form className={styles.filtrosContainer} onSubmit={(e) => pesquisarCursos(e)} onKeyDown={(e) => {
                        if (e.key === "Enter") {
                            pesquisarCursos(e)
                        }
                    }}>
                        <div className={styles.voltar}>
                            <ButtonGrid onClick={() => Router.back()} content={<ArrowBackIosIcon />} />
                        </div>

                        <TextField className={styles.curso} sx={{ width: '100%' }}
                            id="nomeCursoInput"
                            onChange={handleNomeCursoChange}
                            label="Curso"
                            value={nomeCurso}
                            inputProps={{
                                maxLength: 80
                            }}
                            InputLabelProps={{
                                shrink: true,
                            }}
                        />

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
                                    listaCursos.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
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
                            total={listaCursos.length}
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
                <ModalCurso modoModal={modoModal} preencheCurso={preencheCurso} pesquisarCursos={pesquisarCursos} setShowModal={setShowModal} />
            }
        </>
    )
}

export const getListaCursos = async () => {
    const resCurso = await api.get('/api/scheduler/courses')
    return resCurso.data
}

export const getServerSideProps = async () => {
    const listaCursos = await getListaCursos()
    return {
        props: {
            cursos: listaCursos
        }
    }
}