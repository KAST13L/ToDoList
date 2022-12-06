import axios, {AxiosResponse} from 'axios'
import {ResponseType} from "./todolists-api";

const instance = axios.create({
    baseURL: 'https://social-network.samuraijs.com/api/1.1/',
    withCredentials: true,
    headers: {
        'API-KEY': 'bdde517a-46a7-467a-aaf3-bd81b358e84b'
    }
})

export type LoginParamsType = {
    email: string
    password: string
    rememberMe: boolean
    captcha?: string
}

export const authAPI = {
    login(data: LoginParamsType) {
        return instance.post<LoginParamsType, AxiosResponse<ResponseType<{userId?: string}>>>('auth/login', data)
    },
    me(){
        return instance.get<ResponseMeType>('auth/me')
            .then(response => response.data)
    },
    logout(){
        return instance.delete<ResponseType>('auth/login')
    }
}

export type ResponseMeType = ResponseType<{ id: number, email: string, login: string }>