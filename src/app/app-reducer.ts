import {Dispatch} from "redux";
import {authAPI} from "../api/auth-api";
import {setIsLoggedInAC} from "../features/TodolistsList/Login/auth-reducer";
import {handleServerAppError, handleServerNetworkError} from "../utils/error-utils";
import axios from "axios";
import {createSlice, PayloadAction} from "@reduxjs/toolkit";

// types
export type RequestStatusType = 'idle' | 'loading' | 'succeeded' | 'failed'
export type InitialStateType = {
    status: RequestStatusType
    error: string | null
    isInitialized: boolean
}

// initState
const initialState: InitialStateType = {
    status: 'idle',
    error: null,
    isInitialized: false
}

// slice
const slice = createSlice({
    name: 'app',
    initialState,
    reducers: {
        setAppErrorAC(state, action: PayloadAction<{ error: string | null}>) {
            state.error = action.payload.error
        },
        setAppStatusAC(state, action: PayloadAction<{status: RequestStatusType}>){
            state.status = action.payload.status
        },
        setIsInitialized(state, action: PayloadAction<{isInitialized:boolean}>){
            state.isInitialized = action.payload.isInitialized
        }
    }
})
export const appReducer = slice.reducer

// actions
export const {setAppErrorAC, setAppStatusAC, setIsInitialized} = slice.actions

//thunk
export const initializeAppTC = () => async (dispatch: Dispatch) => {
    const response = await authAPI.me()
    try {
        if (response.data.resultCode === 0) {
            dispatch(setIsLoggedInAC({isLoggedIn: true}))
        } else {
            handleServerAppError(response.data, dispatch)
        }
    } catch (e) {
        if (axios.isAxiosError(e)) {
            handleServerNetworkError(e, dispatch)
        }
    } finally {
        dispatch(setAppStatusAC({status:"idle"}))
        dispatch(setIsInitialized({isInitialized:true}))
    }
}
