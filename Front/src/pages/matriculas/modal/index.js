import { useEffect, useState } from "react";
import { api } from '@/services/apiClient';
import { validateSession } from '@/contexts/AuthContext';
import {
    FormControl, FormControlLabel, FormLabel, Radio, RadioGroup, TextField
} from '@mui/material';
import { Button, ButtonGrid } from '@/components/ui/Button';
import { toast } from 'react-toastify'
import CloseIcon from '@mui/icons-material/Close';
import styles from './styles.module.css'

export default function ModalStudents({ modoModal, pesquisarStudents, setShowModal, preencheStudent }) {

    const [user, setUser] = useState('')
    const [nomeStudent, setNomeStudent] = useState('')
    const [registry, setRegistry] = useState('')
    const [status, setStatus] = useState('A')

    useEffect(() => {
        if (validateSession()) {
            let auth = localStorage.getItem('auth')
            let authBuffer = Buffer.from(auth, 'base64').toString('ascii')
            setUser(JSON.parse(authBuffer))
        }
    }, [])

    useEffect(() => {
        if (modoModal !== 'I') {
            setRegistry(preencheStudent.matricula)
            setNomeStudent(preencheStudent.nome)
            setStatus(preencheStudent.status)
        }
    }, [])

    function handleNomeChange(e) {
        setNomeStudent(e.target.value)
    }

    function handleMatriculaChange(e) {
        setRegistry(e.target.value)
    }

    function handleStatusChange(e) {
        setStatus(e.target.value)
    }

    async function submitStudent(e) {
        e.preventDefault()

        let student = {
            "matricula": registry,
            "nome": nomeStudent,
            "statusAluno": status
        }
        
        try {

            let response
            if (modoModal === 'I') {
                response = await api.post('/api/scheduler/students', student)
            } else if (modoModal === 'A') {
                response = await api.put(`/api/scheduler/students/${preencheStudent.matricula}`, student)
            } else {
                response = await api.delete(`/api/scheduler/students/${preencheStudent.matricula}`)
            }
            setShowModal(false)
            toast.success(response.data.message)
        } catch (err) {
            toast.error(err.response.data.message)
        }
        pesquisarStudents(e)
    }

    return (
        <>
            <div className={styles.container}>
                <form className={styles.main} onSubmit={(e) => submitStudent(e)} >
                    <div className={styles.header}>
                        <ButtonGrid mensagemHover={"Fechar"} content={
                            <CloseIcon />
                        } onClick={(e) => {
                            setShowModal(false)
                        }
                        }>
                        </ButtonGrid>
                    </div>
                    
                    <TextField className={styles.registry} sx={{ width: '100%' }}
                        id="registry"
                        onChange={handleMatriculaChange}
                        label="Matrícula"
                        value={registry}
                        required={modoModal !== 'E'}
                        InputLabelProps={{
                            shrink: true,
                        }}
                        disabled={modoModal !== 'I'}
                    />

                    <TextField className={styles.nome} sx={{ width: '100%' }}
                        id="nomeStudentInput"
                        onChange={handleNomeChange}
                        label="Nome"
                        value={nomeStudent}
                        required={modoModal !== 'E'}
                        inputProps={{
                            maxLength: 80
                        }}
                        InputLabelProps={{
                            shrink: true,
                        }}
                        disabled={modoModal === 'E'}
                    />

                    <FormControl className={styles.status}>
                        <FormLabel required={modoModal !== 'E'} id="status" sx={{ fontSize: '75%' }}>Status</FormLabel>
                        <RadioGroup
                            row
                            aria-labelledby="status"
                            name="row-radio-buttons-group"
                            onChange={handleStatusChange}
                            
                        >
                            <FormControlLabel checked={status === 'A'} disabled={user.role !== "A" || modoModal === 'E'} value="A" control={<Radio size="small" />} label="Ativo" sx={{
                                '& .MuiFormControlLabel-label': {
                                    fontSize: '90%'
                                }
                            }} />
                            <FormControlLabel checked={status === 'I'} disabled={user.role !== "A" || modoModal === 'E'}  value="I" control={<Radio size="small" />} label="Inativo" sx={{
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