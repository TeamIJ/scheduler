import Head from 'next/head'
import Router from 'next/router'
import React from "react"
import { useState, useEffect } from "react"
import { validateSession } from '@/contexts/AuthContext'
import { Navbar } from '@/components/ui/Navbar'
import styles from './styles.module.css'
import { ButtonGrid } from "@/components/ui/Button"
import { api } from "@/services/apiClient"
import ModalUsuario from "./modal"
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

let tipoOptions = [
    {
        "char": "T",
        "label": "Todos"
    },
    {
        "char": "A",
        "label": "Administrador"
    },
    {
        "char": "P",
        "label": "Professor"
    },
    {
        "char": "U",
        "label": "Usuário"
    },
]

export default function Home({ usuarios }) {

    const [domLoaded, setDomLoaded] = useState(false)
    const [user, setUser] = useState('')
    const [showModalUser, setShowModalUser] = useState(false)
    const [modoModal, setModoModal] = useState('I')
    const [page, setPage] = useState(0)
    const [rowsPerPage, setRowsPerPage] = useState(11)
    const [nomeUsuario, setNomeUsuario] = useState('')
    const [tipoSelected, setTipoSelected] = useState('T')
    const [listaUsuarios, setListaUsuarios] = useState([])
    const [preencheUsuario, setPreencheUsuario] = useState({})

    const columns = [
        { id: 'nome', label: 'Nome', minWidth: '100%' },
        { id: 'descricaoTipo', label: 'Tipo', minWidth: '100%' },
        { id: 'botoes', maxWidth: '40px' },
    ]


    useEffect(() => {
        if (validateSession()) {
            let auth = localStorage.getItem('auth')
            let authBuffer = Buffer.from(auth, 'base64').toString('ascii')
            setUser(JSON.parse(authBuffer))
        }
    }, [])

    function formataListaUsuarios(usuarios) {
        usuarios.forEach(usuario => {
            let descricaoTipo = usuario.tipo === 'A' ? "Administrador" : usuario.tipo === 'P' ? "Professor" : "Usuário"
            usuario.descricaoTipo = descricaoTipo
            usuario.botoes = <div className={styles.botoesGrid}>
                {(user.role === "A" || (user.role === "P" && user.user === usuario.usuario)) &&
                    <ButtonGrid mensagemHover={"Alterar"} key={'alterar'} content={<EditIcon />} onClick={() => {
                        setModoModal("A")
                        setShowModalUser(true)
                        setPreencheUsuario(usuario)
                    }} />
                }
                {(user.role === "A" && user.user !== usuario.usuario) &&
                    <ButtonGrid mensagemHover={"Excluir"} key={'excluir'} content={<DeleteIcon />} onClick={() => {
                        setModoModal("E")
                        setShowModalUser(true)
                        setPreencheUsuario(usuario)
                    }} />
                }

            </div>
        })
        return usuarios
    }

    useEffect(() => {
        setListaUsuarios(formataListaUsuarios(usuarios))
    }, [user])


    setTimeout(() => {
        setDomLoaded(true)
    }, 150)


    function handleNomeUsuarioChange(e) {
        setNomeUsuario(e.target.value)
    }

    function handleTipoChange(e) {
        setTipoSelected(e.target.value)
    }

    async function pesquisarUsuarios(e) {
        e.preventDefault()

        let temFiltro = false
        let filtro = ''
        if (nomeUsuario) {
            filtro += `nome=${nomeUsuario}`
            temFiltro = true
        }

        if (temFiltro) {
            filtro += '&'
        }
        filtro += `tipo=${tipoSelected}`
        temFiltro = true

        let requestURL = `/api/scheduler/users/search${temFiltro ? '?' + filtro : ''}`
        const resUsuarios = await api.get(requestURL)
        setListaUsuarios(formataListaUsuarios(resUsuarios.data))
        setPage(0)
    }

    return (
        <>
            <Head>
                <title>Scheduler - Usuários</title>
            </Head>
            <Navbar user={user.name} />
            <div className={styles.container}>
                <div className={styles.pesquisaContainer}>
                    <form className={styles.filtrosContainer} onSubmit={(e) => pesquisarUsuarios(e)} onKeyDown={(e) => {
                        if (e.key === "Enter") {
                            pesquisarUsuarios(e)
                        }
                    }}>
                        <div className={styles.voltar}>
                            <ButtonGrid mensagemHover={"Voltar"} onClick={() => Router.back()} content={<ArrowBackIosIcon />} />
                        </div>

                        <TextField className={styles.nomeUsuario} sx={{ width: '100%' }}
                            id="nomeUsuario"
                            onChange={handleNomeUsuarioChange}
                            label="Nome"
                            value={nomeUsuario}
                            inputProps={{
                                maxLength: 80
                            }}
                            InputLabelProps={{
                                shrink: true,
                            }}
                        />
                        
                        <FormControl className={styles.tipo} sx={{ width: '50%' }}>
                            <InputLabel shrink htmlFor="typeOptionsSelect">
                                Tipo
                            </InputLabel>
                            <Select displayEmpty sx={{ width: '100%' }} label="Status" id="typeOptionsSelect"
                                value={tipoSelected} onChange={handleTipoChange}>
                                {tipoOptions.map((tipo) => {
                                    return (
                                        <MenuItem key={tipo.char} value={tipo.char}>{tipo.label}</MenuItem>
                                    )
                                })}
                            </Select>
                        </FormControl>

                        <div className={styles.botoes}>
                            <ButtonGrid mensagemHover={"Pesquisar"} content={<SearchIcon></SearchIcon>} />
                            <ButtonGrid mensagemHover={"Incluir"} type='button' onClick={() => {
                                setShowModalUser(true)
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
                                {(domLoaded && listaUsuarios.length > 0) &&
                                    listaUsuarios.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
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
                            total={listaUsuarios.length}
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

            {showModalUser &&
                <ModalUsuario modoModal={modoModal} preencheUsuario={preencheUsuario} pesquisarUsuarios={pesquisarUsuarios} setShowModalUser={setShowModalUser} />
            }
        </>
    )
}

export const getListaUsuarios = async () => {
    const resUsuarios = await api.get('/api/scheduler/users/search')
    return resUsuarios.data
}

export const getServerSideProps = async () => {

    const listaUsuarios = await getListaUsuarios()

    return {
        props: {
            usuarios: listaUsuarios
        }
    }
}