import {authAPI, ResponseMeType} from "../api/auth-api";
import {setIsLoggedInAC} from "../features/Auth/auth-reducer";
import {handleServerAppError, handleServerNetworkError} from "../utils/error-utils";
import axios from "axios";
import {call, put, takeEvery} from 'redux-saga/effects';

const initialState: InitialStateType = {
    status: 'idle',
    error: null,
    success: null,
    isInitialized: false
}

export const appReducer = (state: InitialStateType = initialState, action: ActionsType): InitialStateType => {
    switch (action.type) {
        case 'APP/SET-STATUS':
            return {...state, status: action.status}
        case 'APP/SET-ERROR':
            return {...state, error: action.error}
        case 'APP/SET-SUCCESS':
            return {...state, success: action.success}
        case 'APP/SET-IS-INITIALIZED':
            return {...state, isInitialized: action.isInitialized}
        default:
            return {...state}
    }
}
// AC's
export const setAppErrorAC = (error: string | null) => ({type: 'APP/SET-ERROR', error} as const)
export const setAppSuccessAC = (success: string | null) => ({type: 'APP/SET-SUCCESS', success} as const)
export const setAppStatusAC = (status: RequestStatusType) => ({type: 'APP/SET-STATUS', status} as const)
export const setIsInitialized = (isInitialized: boolean) => ({type: 'APP/SET-IS-INITIALIZED', isInitialized} as const)

// AC's types
export type SetAppErrorACType = ReturnType<typeof setAppErrorAC>
export type SetAppStatusACType = ReturnType<typeof setAppStatusAC>
export type SetIsInitializedACType = ReturnType<typeof setIsInitialized>
export type SetAppSuccessACType = ReturnType<typeof setAppSuccessAC>

// sagas
export function* initializeAppWS() {
    // @ts-ignore
    const data: ResponseMeType = yield call(authAPI.me)
    try {
        if (data.resultCode === 0) {
            yield put(setIsLoggedInAC(true))
        } else {
            yield handleServerAppError(data)
        }
    } catch (e) {
        if (axios.isAxiosError(e)) {
            yield handleServerNetworkError(e)
        }
    } finally {
        yield put(setAppStatusAC("idle"))
        yield put(setIsInitialized(true))
    }
}

// worker saga AC's
export const initializeAppWSAC = () => ({type: 'APP/INITIALIZE'})

// common types
export type RequestStatusType = 'idle' | 'loading' | 'succeeded' | 'failed'
export type InitialStateType = {
    status: RequestStatusType
    error: string | null
    success: string | null
    isInitialized: boolean
}
type ActionsType = SetAppErrorACType | SetAppStatusACType | SetIsInitializedACType | SetAppSuccessACType

// appWatcher

export function* appWatcher(){
    yield takeEvery('APP/INITIALIZE', initializeAppWS)
}