import { createContext, ReactNode, useState } from "react";
import { destroyCookie } from 'nookies'
import { Router } from 'next/router'
import { api } from '../services/apiClient'

export const AuthContext = createContext({})

export function signOut(){
    try{
        destroyCookie(undefined, '@nextauth.token')
        Router.push('/')
    }catch{
        console.log('falou!')
    }
}

export function AuthProvider ( { children } ) {
    const [user, setUser] = useState()
    const [password, setPassword] = useState()
    const  isAuthenticated = !!user;

    async function signIn(user, password) {
       try {
            const response = await api.post('/users/auth', {
                nome:user, senha:password
            })

            console.log(response.data)
       } catch (err) {
            console.log("Erro ao acessar ", err)
       }
    }

    return (
        <AuthContext.Provider value={{ user, isAuthenticated, signIn, signOut }}>
            {children}
        </AuthContext.Provider>

    )
}