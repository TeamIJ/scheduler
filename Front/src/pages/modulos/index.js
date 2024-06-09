import Head from 'next/head'
import Router from 'next/router'
import React from "react"
import { useState, useEffect } from "react"
import { validateSession } from '@/contexts/AuthContext'
import { Navbar } from '@/components/ui/Navbar'
import styles from './styles.module.css'
import { ButtonGrid } from "@/components/ui/Button"
import { api } from "@/services/apiClient"
import ModalModulo from "./modal"
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

const cursosOptions = []

async function getCursos() {
    const response = await api.get('/api/scheduler/courses')

    let courses = response.data
    if(courses.length > 0){
        courses.forEach(course => {
            cursosOptions.push({
                id: course.id,
                nome: course.curso
            })
        })
    }
}

getCursos()

export default function Home({ modulos }) {

    const [domLoaded, setDomLoaded] = useState(false)
    const [user, setUser] = useState('')
    const [showModal, setShowModal] = useState(false)
    const [modoModal, setModoModal] = useState('I')
    const [listaModulos, setListaModulos] = useState([])
    const [page, setPage] = useState(0)
    const [rowsPerPage, setRowsPerPage] = useState(11)
    const [cursoSelected, setCursoSelected] = useState('')
    const [nomeModulo, setNomeModulo] = useState('')
    const [preencheModulo, setPreencheModulo] = useState({})

    const columns = [
        { id: 'curso', label: 'Curso', minWidth: '100%' },
        { id: 'modulo', label: 'Módulo', minWidth: '100%' },
        { id: 'qtdAulas', label: 'Nro. Aulas', minWidth: '100%' },
        { id: 'botoes', maxWidth: '40px' },
    ]


    useEffect(() => {
        if (validateSession()) {
            let auth = localStorage.getItem('auth')
            let authBuffer = Buffer.from(auth, 'base64').toString('ascii')
            setUser(JSON.parse(authBuffer))
        }
    }, [])

    function formataListaModulos(modulos) {
        modulos.forEach(modulo => {
            modulo.botoes = <div className={styles.botoesGrid}>
                <ButtonGrid mensagemHover={"Alterar"} key={'alterar'} content={<EditIcon />} onClick={() => {
                    setModoModal("A")
                    setShowModal(true)
                    setPreencheModulo(modulo)
                }}/>
                <ButtonGrid mensagemHover={"Excluir"} key={'excluir'} content={<DeleteIcon />} onClick={() => {
                    setModoModal("E")
                    setShowModal(true)
                    setPreencheModulo(modulo)
                }}/>
            </div>
        })
        return modulos
    }

    useEffect(() => {
        setListaModulos(formataListaModulos(modulos))
    }, [])


    setTimeout(() => {
        setDomLoaded(true)
    }, 150)


    function handleNomeModuloChange(e) {
        setNomeModulo(e.target.value)
    }

    function handleCursoChange(e){
        setCursoSelected(e.target.value)
    }

    async function pesquisarModulos(e) {
        e.preventDefault()

        let temFiltro = false
        let filtro = ''
        if (nomeModulo) {
            filtro += `modulo=${nomeModulo}`
            temFiltro = true
        }
        if (cursoSelected !== '') {
            if (temFiltro) {
                filtro += '&'
            }
            filtro += `curso=${cursoSelected}`
            temFiltro = true
        }

        let requestURL = `/api/scheduler/modules/search${temFiltro ? '?' + filtro : ''}`
        const resModulo = await api.get(requestURL)
        setListaModulos(formataListaModulos(resModulo.data))
        setPage(0)
    }

    return (
        <>
            <Head>
                <title>Scheduler - Módulos</title>
            </Head>
            <Navbar user={user.name} />
            <div className={styles.container}>
                <div className={styles.pesquisaContainer}>
                    <form className={styles.filtrosContainer} onSubmit={(e) => pesquisarModulos(e)} onKeyDown={(e) => {
                        if (e.key === "Enter") {
                            pesquisarModulos(e)
                        }
                    }}>
                        <div className={styles.voltar}>
                            <ButtonGrid mensagemHover={"Voltar"} onClick={() => Router.back()} content={<ArrowBackIosIcon />} />
                        </div>

                        <FormControl className={styles.curso} sx={{ width: '100%' }}>
                            <InputLabel shrink htmlFor="cursosOptionsSelect">
                                Curso
                            </InputLabel>
                            <Select placeholder='Selecione um Curso' displayEmpty sx={{ width: '100%' }} label="Curso" id="cursosOptionsSelect"
                                value={cursoSelected} onChange={handleCursoChange}>
                                <MenuItem value="">
                                    <em>Selecione um Curso</em>
                                </MenuItem>
                                {cursosOptions.map((curso) => {
                                    return (
                                        <MenuItem key={curso.id} value={curso.id}>{curso.nome}</MenuItem>
                                    )
                                })}
                            </Select>
                        </FormControl>

                        <TextField className={styles.modulo} sx={{ width: '100%' }}
                            id="nomeModuloInput"
                            onChange={handleNomeModuloChange}
                            label="Módulo"
                            value={nomeModulo}
                            inputProps={{
                                maxLength: 80
                            }}
                            InputLabelProps={{
                                shrink: true,
                            }}
                        />

                        <div className={styles.botoes}>
                            <ButtonGrid mensagemHover={"Pesquisar"} content={<SearchIcon></SearchIcon>} />
                            <ButtonGrid mensagemHover={"Incluir"} type='button' onClick={() => {
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
                                {(domLoaded && listaModulos.length > 0) &&
                                    listaModulos.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
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
                            total={listaModulos.length}
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
                <ModalModulo modoModal={modoModal} preencheModulo={preencheModulo} pesquisarModulos={pesquisarModulos} setShowModal={setShowModal} />
            }
        </>
    )
}

export const getListaModulos = async () => {
    const resModulo = await api.get('/api/scheduler/modules/search')

    return resModulo.data
}

export const getServerSideProps = async () => {

    const listaModulos = await getListaModulos()

    return {
        props: {
            modulos: listaModulos
        }
    }
}