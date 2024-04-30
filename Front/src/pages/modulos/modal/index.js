import { useEffect, useState } from "react";
import { api } from '@/services/apiClient';
import { validateSession } from '@/contexts/AuthContext';
import styles from './styles.module.css'
import {
    FormControl, InputLabel, MenuItem, Select,
    TextField
} from '@mui/material';
import { Button, ButtonGrid } from '@/components/ui/Button';
import { toast } from 'react-toastify'
import CloseIcon from '@mui/icons-material/Close';

async function getCursos() {
    const response = await api.get('/api/scheduler/courses')

    let courses = response.data
    let coursesAux = []
    courses.forEach(course => {
        coursesAux.push({
            id: course.id,
            nome: course.curso
        })
    })
    return coursesAux
}

export default function ModalModulo({ modoModal, pesquiasrModulos, setShowModal, preencheModulo }) {

    const [user, setUser] = useState('')
    const [cursosOptions, setCursosOptions] = useState([])
    const [cursoSelected, setCursoSelected] = useState('')
    const [nomeModulo, setNomeModulo] = useState('')
    const [qtdAula, setQtdAula] = useState('')

    async function preencheListaCursos(){
        let cursos = await getCursos()
        setCursosOptions(cursos)
    }

    useEffect(() => {
        if (validateSession()) {
            let auth = localStorage.getItem('auth')
            let authBuffer = Buffer.from(auth, 'base64').toString('ascii')
            setUser(JSON.parse(authBuffer))
        }
        preencheListaCursos()
    }, [])

    useEffect(() => {
        if (modoModal !== 'I') {
            preencheListaCursos()
            setNomeModulo(preencheModulo.modulo)
            setCursoSelected(preencheModulo.id)
            setQtdAula(preencheModulo.qtdAulas)
        }
    }, [])

    function handleNomeModuloChange(e) {
        setNomeModulo(e.target.value)
    }

    function handleCursoChange(e) {
        setCursoSelected(e.target.value)
    }

    function handleQtdAulaChange(e) {
        setQtdAula(e.target.value)
    }

    async function submitModulo(e) {
        e.preventDefault()

        let modulo = {
            "id_curso": cursoSelected,
            "nome_modulo": nomeModulo,
            "qtd_aulas": qtdAula
        }
        try {

            let response
            if (modoModal === 'I') {
                response = await api.post('/api/scheduler/modules', modulo)
            } else if (modoModal === 'A') {
                response = await api.put(`/api/scheduler/modules/${preencheModulo.id}`, modulo)
            } else {
                response = await api.delete(`/api/scheduler/modules/${preencheModulo.id}`)
            }
            setShowModal(false)
            toast.success(response.data.message)
        } catch (err) {
            toast.error(err.response.data.message)
        }
        pesquiasrModulos(e)
    }

    return (
        <>
            <div className={styles.container}>
                <form className={styles.main} onSubmit={(e) => submitModulo(e)} >
                    <div className={styles.header}>
                        <ButtonGrid content={
                            <CloseIcon />
                        } onClick={(e) => {
                            setShowModal(false)
                        }
                        }>
                        </ButtonGrid>
                    </div>


                    <TextField className={styles.modulo} sx={{ width: '100%' }}
                        id="nomeModuloInput"
                        onChange={handleNomeModuloChange}
                        label="Módulo"
                        value={nomeModulo}
                        required
                        inputProps={{
                            maxLength: 80
                        }}
                        InputLabelProps={{
                            shrink: true,
                        }}
                        disabled={modoModal === 'E'}
                    />

                    <TextField className={styles.aula} sx={{ width: '100%' }}
                        id="qtdAulaInput"
                        onChange={handleQtdAulaChange}
                        label="Nro. Aulas"
                        value={qtdAula}
                        required
                        InputLabelProps={{
                            shrink: true,
                        }}
                        disabled={modoModal === 'E'}
                    />

                    <FormControl className={styles.curso} sx={{ width: '40%' }}>
                        <InputLabel required shrink htmlFor="cursosOptionsSelect">
                            Curso
                        </InputLabel>
                        <Select required placeholder='Selecione um Curso' disabled={modoModal === 'E'} displayEmpty sx={{ width: '100%' }} label="Curso" id="cursosOptionsSelect"
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

                    <div className={styles.botoes}>
                        <Button type='submit' color='light-blue' content={
                            <span>{modoModal === 'I' ? 'Cadastrar' : modoModal === 'A' ? 'Alterar' : 'Excluir'}</span>
                        } />
                    </div>
                </form>
            </div >
        </>
    )
}