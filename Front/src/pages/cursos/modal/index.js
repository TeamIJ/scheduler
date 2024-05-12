import { useEffect, useState } from "react";
import { api } from '@/services/apiClient';
import { validateSession } from '@/contexts/AuthContext';
import styles from './styles.module.css'
import { TextField } from '@mui/material';
import { Button, ButtonGrid } from '@/components/ui/Button';
import { toast } from 'react-toastify'
import CloseIcon from '@mui/icons-material/Close';

export default function ModalCurso({ modoModal, pesquisarCursos, setShowModal, preencheCurso }) {

    const [user, setUser] = useState('')
    const [idCurso, setIdCurso] = useState('')
    const [nomeCurso, setNomeCurso] = useState('')

    useEffect(() => {
        if (validateSession()) {
            let auth = localStorage.getItem('auth')
            let authBuffer = Buffer.from(auth, 'base64').toString('ascii')
            setUser(JSON.parse(authBuffer))
        }
    }, [])

    useEffect(() => {
        if (modoModal !== 'I') {
            setIdCurso(preencheCurso.id)
            setNomeCurso(preencheCurso.curso)
        }
    }, [])

    function handleNomeCursoChange(e) {
        setNomeCurso(e.target.value)
    }

    async function submitModulo(e) {
        e.preventDefault()

        let curso = {
            "id_curso" : idCurso,
            "nome_curso": nomeCurso
        }
        try {
            let response
            if (modoModal === 'I') {
                response = await api.post('/api/scheduler/courses', curso)
            } else if (modoModal === 'A') {
                response = await api.put(`/api/scheduler/courses/${idCurso}`, curso)
            } else {
                response = await api.delete(`/api/scheduler/courses/${idCurso}`)
            }
            setShowModal(false)
            toast.success(response.data.message)
        } catch (err) {
            toast.error(err.response.data.message)
        }
        pesquisarCursos(e)
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


                    <TextField className={styles.curso} sx={{ width: '100%' }}
                        id="nomeCursoInput"
                        onChange={handleNomeCursoChange}
                        label="Curso"
                        value={nomeCurso}
                        required={modoModal !== 'E'}
                        inputProps={{
                            maxLength: 80
                        }}
                        InputLabelProps={{
                            shrink: true,
                        }}
                        disabled={modoModal === 'E'}
                    />

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