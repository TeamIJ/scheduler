import { useEffect, useState } from "react";
import { api } from '@/services/apiClient';
import { validateSession } from '@/contexts/AuthContext';
import styles from './styles.module.css'
import {
    FormControl, InputLabel, MenuItem, Select, FormControlLabel, FormLabel, Radio, RadioGroup, TextField
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

export default function ModalProfessor({ modoModal, pesquisarProfessores, setShowModal, preencheProfessor }) {

    const [user, setUser] = useState('')
    const [cursosOptions, setCursosOptions] = useState([])
    const [cursoSelected, setCursoSelected] = useState('')
    const [nomeProfessor, setNomeProfessor] = useState('')
    const [status, setStatus] = useState('D')

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
            setCursoSelected(preencheProfessor.ID_CURSO)
        }
    }, [])

    function handleCursoChange(e) {
        setCursoSelected(e.target.value)
    }

    function handleNomeProfessorChange(e) {
        setNomeProfessor(e.target.value)
    }

    function handleStatusChange(e) {
        setStatus(e.target.value)
    }

    async function submitProfessor(e) {
        e.preventDefault()

        let professor = {
            "id_curso": cursoSelected,
            "nome_prof": nomeProfessor,
            "status_prof": status
        }
        try {

            let response
            if (modoModal === 'I') {
                response = await api.post('/api/scheduler/professor', professor)
            } else if (modoModal === 'A') {
                response = await api.put(`/api/scheduler/professor/${preencheProfessor.id}`, professor)
            } else {
                response = await api.delete(`/api/scheduler/professor/${preencheProfessor.id}`)
            }
            setShowModal(false)
            toast.success(response.data.message)
        } catch (err) {
            toast.error(err.response.data.message)
        }
        pesquisarProfessores(e)
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

                    <TextField className={styles.nome} sx={{ width: '100%' }}
                        id="nome"
                        onChange={handleNomeProfessorChange}
                        label="Nome"
                        value={nomeProfessor}
                        required={modoModal !== 'E'}
                        inputProps={{
                            maxLength: 80
                        }}
                        InputLabelProps={{
                            shrink: true,
                        }}
                        disabled={modoModal === 'E'}
                    />


                    <FormControl className={styles.curso} sx={{ width: '40%' }}>
                        <InputLabel required={modoModal !== 'E'} shrink htmlFor="cursosOptionsSelect">
                            Curso
                        </InputLabel>
                        <Select required={modoModal !== 'E'} placeholder='Selecione um Curso' disabled={modoModal === 'E'} displayEmpty sx={{ width: '100%' }} label="Curso" id="cursosOptionsSelect"
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

                    <FormControl className={styles.status}>
                        <FormLabel required={modoModal !== 'E'} id="status" sx={{ fontSize: '75%' }}>Status</FormLabel>
                        <RadioGroup
                            row
                            aria-labelledby="status"
                            name="row-radio-buttons-group"
                            onChange={handleStatusChange}
                            
                        >
                            <FormControlLabel checked={status === 'D'} disabled={user.role !== "A" || modoModal === 'E'} value="D" control={<Radio size="small" />} label="Dísponivel" sx={{
                                '& .MuiFormControlLabel-label': {
                                    fontSize: '90%'
                                }
                            }} />
                            <FormControlLabel checked={status === 'A'} disabled={user.role !== "A" || modoModal === 'E'}  value="A" control={<Radio size="small" />} label="Ausente" sx={{
                                '& .MuiFormControlLabel-label': {
                                    fontSize: '90%'
                                }
                            }} />
                        </RadioGroup>
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