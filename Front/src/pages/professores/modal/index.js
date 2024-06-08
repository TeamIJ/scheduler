import { useEffect, useState } from "react";
import { api } from '@/services/apiClient';
import { validateSession } from '@/contexts/AuthContext';
import styles from './styles.module.css'
import {
    FormControl, FormControlLabel, FormLabel, Radio, RadioGroup, TextField
} from '@mui/material';
import { Button, ButtonGrid } from '@/components/ui/Button';
import { toast } from 'react-toastify'
import CloseIcon from '@mui/icons-material/Close';
import Transfer from "../../../components/ui/Transfer";
import { mask } from "../../../services/utils";

export default function ModalProfessor({ cursos, modoModal, pesquisarProfessor, setShowModal, preencheProfessor }) {

    const [user, setUser] = useState('')
    const [nomeProfessor, setNomeProfessor] = useState('')
    const [cpf, setCpf] = useState('')
    const [status, setStatus] = useState('D')
    const [left, setLeft] = useState([])
    const [right, setRight] = useState([])
    const [checked, setChecked] = useState([])
    const [cursosFiltrados, setCursosFiltrados] = useState([])

    useEffect(() => {
        if (validateSession()) {
            let auth = localStorage.getItem('auth')
            let authBuffer = Buffer.from(auth, 'base64').toString('ascii')
            setUser(JSON.parse(authBuffer))
        }
    }, [])

    async function getListaCursosPorProfessor(id) {
        const response = await api.get(`/api/scheduler/professor/courses/${id}`)
        let cursosResponse = response.data

        let rightAux = []
        cursosResponse.forEach(curso => {
            rightAux.push(curso.ID_CURSO)
        })
        setRight(prevRight => rightAux)
        setChecked(prevChecked => rightAux)
        
        let leftAux = []
        cursos.forEach(curso => {
            if(!rightAux.includes(curso.id)){
                leftAux.push(curso.id)
            }
        })
        setLeft(prevLeft => leftAux)
    }

    useEffect(() => {
        if (modoModal !== 'I') {
            getListaCursosPorProfessor(preencheProfessor.ID_PROF)
            mask(preencheProfessor.cpf, setCpf)
            setNomeProfessor(preencheProfessor.nome)
            setStatus(preencheProfessor.status)
        }
    }, [])

    function handleNomeProfessorChange(e) {
        setNomeProfessor(e.target.value)
    }

    function handleStatusChange(e) {
        setStatus(e.target.value)
    }

    function handleCpfProfessor(e) {
        setCpf(e.target.value)
    }

    async function submitProfessor(e) {
        e.preventDefault()

        let professor = {
            "cpf": cpf.replace(/[^0-9]/g, ''),
            "nome": nomeProfessor,
            "status": status,
            "courses": right
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
        pesquisarProfessor(e)
    }

    return (
        <>
            <div className={styles.container}>
                <form className={styles.main} onSubmit={(e) => submitProfessor(e)} >
                    <div className={styles.header}>
                        <ButtonGrid mensagemHover={"Fechar"} content={
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

                    <TextField className={styles.cpf} sx={{ width: '100%' }}
                        id="cpf"
                        onChange={handleCpfProfessor}
                        onBlur={() => mask(cpf.replace(/[^0-9]/g, ''), setCpf)}
                        label="CPF"
                        value={cpf}
                        required={modoModal !== 'E'}
                        inputProps={{
                            maxLength: 14
                        }}
                        InputLabelProps={{
                            shrink: true,
                        }}
                        disabled={modoModal !== 'I'}
                    />

                    <FormControl className={styles.curso} sx={{ width: '100%' }}>
                        <Transfer cursos={cursos} cursosFiltrados={cursosFiltrados} checked={checked} left={left} right={right} setChecked={setChecked} setRight={setRight} setLeft={setLeft} modoModal={modoModal} />
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
                            <FormControlLabel checked={status === 'A'} disabled={user.role !== "A" || modoModal === 'E'} value="A" control={<Radio size="small" />} label="Ausente" sx={{
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