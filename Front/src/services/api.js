import axios, { AxiosError } from 'axios'
import { AuthTokenErro } from './errors/AuthTokenErro'
import { signOut } from '../contexts/AuthContext'
import config from 'C:\\temp\\config.json'


export function setupAPIClient(context) {
 
    const api = axios.create({
        baseURL: `http://${config.hostAddress}:8080/`,
    })

    api.interceptors.response.use(response => {
        return response
    }, (error) => {
        if (error.response.status === 401) {
            //qualquer erro não autorizado
            if (typeof window !== undefined) {
                signOut()
            } else {
                return Promise.reject(new AuthTokenErro())
            }
        }

        return Promise.reject(error)
    })

    return api;
}