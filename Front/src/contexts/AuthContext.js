import { createContext, ReactNode, useState } from "react";
import { destroyCookie } from 'nookies'
import { Router } from 'next/router'

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

    async function signIn(email, password) {
        alert("teste")
        console.log(email)
        console.log(password)
    }

    return (
        <AuthContext.Provider value={{ user, isAuthenticated, signIn, signOut }}>
            {children}
        </AuthContext.Provider>

    )
}