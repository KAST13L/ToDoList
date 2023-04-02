import {authAPI, ResponseMeType} from "../api/auth-api";
import {setIsLoggedInAC} from "../features/Auth/auth-reducer";
import {handleServerNetworkError} from "../utils/error-utils";
import axios from "axios";
import {call, put, takeEvery} from 'redux-saga/effects';
import {createSlice, PayloadAction} from "@reduxjs/toolkit";

const initialState: InitialStateType = {
    status: 'idle',
    error: null,
    success: null,
    isInitialized: false
}

export const slice = createSlice({
    name: 'app',
    initialState: initialState,
    reducers: {
        setAppErrorAC(state, action: PayloadAction<{ error: string | null }>) {
            state.error = action.payload.error
        },
        setAppSuccessAC(state, action: PayloadAction<{ success: string | null }>) {
            state.success = action.payload.success
        },
        setAppStatusAC(state, action: PayloadAction<{ status: RequestStatusType }>) {
            state.status = action.payload.status
        },
        setIsInitialized(state, action: PayloadAction<{ isInitialized: boolean }>) {
            state.isInitialized = action.payload.isInitialized
        },

    }
})

export const {setAppErrorAC,setAppStatusAC,setAppSuccessAC,setIsInitialized} = slice.actions
export const appReducer = slice.reducer

// sagas
export function* initializeAppWS() {
    // @ts-ignore
    const data: ResponseMeType = yield call(authAPI.me)
    try {
        if (data.resultCode === 0) {
            yield put(setIsLoggedInAC({value: true}))
        } else {
            /*yield handleServerAppError(data)*/
        }
    } catch (e) {
        if (axios.isAxiosError(e)) {
            yield handleServerNetworkError(e)
        }
    } finally {
        yield put(setAppStatusAC({status: "idle"}))
        yield put(setIsInitialized({isInitialized: true}))
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

// appWatcher
export function* appWatcher() {
    yield takeEvery('APP/INITIALIZE', initializeAppWS)
}