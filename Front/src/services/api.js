import axios, { AxiosError } from 'axios'
import { parseCookies } from 'nookies'
import { AuthTokenErro } from './errors/AuthTokenErro'
import { signOut } from '../contexts/AuthContext'

export function setupAPIClient (context) {
    let cookies = parseCookies(context)

    const api = axios.create({
        baseURL: 'http://localhost:8080/',
        headers: {
            Authorization: `Bearer ${cookies['@nextauth.token']}`
        }
    })

    api.interceptors.response.use(response => {
        return response
    }, (error) => {
        if(error.response.status === 401){
            //qualquer erro não autorizado
            if(typeof window !== undefined){
                signOut()
            }else{
                return Promise.reject(new AuthTokenErro())
            }
        }

        return Promise.reject(error)
    })

    return api;
}