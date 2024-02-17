import { createContext, useState } from "react";
import Router from 'next/router'
import { api } from '../services/apiClient'
import { toast } from 'react-toastify'

export const AuthContext = createContext({})

export function signOut() {
    try {
        localStorage.removeItem('auth')
        Router.push('/')
    } catch {
        console.log('erro ao deslogar')
    }
}

export function validateSession(){
    let auth = localStorage.getItem('auth')
    console.log('teste')
    if (auth === null){
        Router.push('/')
        return false
    }
    return true
}

export function AuthProvider({ children }) {
    const [user, setUser] = useState()
    const isAuthenticated = !!user;

    async function signIn(user, password, role) {
        try {

            if (role === 'P') {
                const response = await api.post('/api/scheduler/users/auth', {
                    nome: user, senha: password
                })

                setUser(response.data.user)
                localStorage.setItem('auth', Buffer.from(JSON.stringify(response.data.user)).toString('base64'))
            } else {
                const response = await api.post(`/api/scheduler/students/auth/${user}`, {
                    nome: user, senha: password
                })

                setUser(response.data.user)
                localStorage.setItem('auth', Buffer.from(JSON.stringify(response.data.user)).toString('base64'))
            }


            toast.success('Logado com sucesso!')

            Router.push('/home')

        } catch (err) {
            if (role === 'P') {
                toast.error('Usuário ou senha inválido!')
            } else {
                toast.error('Matrícula inválida!')
            }
            console.log("Erro ao acessar ", err)
        }
    }

    return (
        <AuthContext.Provider value={{ user, isAuthenticated, signIn, signOut }}>
            {children}
        </AuthContext.Provider>

    )
}
