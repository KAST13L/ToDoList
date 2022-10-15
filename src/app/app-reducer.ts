import {authAPI} from "../api/auth-api";
import {setIsLoggedInAC} from "../features/TodolistsList/Login/auth-reducer";
import {handleServerAppError, handleServerNetworkError} from "../utils/error-utils";
import axios from "axios";
import {createAsyncThunk, createSlice, PayloadAction} from "@reduxjs/toolkit";

// types
export type RequestStatusType = 'idle' | 'loading' | 'succeeded' | 'failed'
export type InitialStateType = {
    status: RequestStatusType
    error: string | null
    isInitialized: boolean
}

//thunk
export const initializeAppTC = createAsyncThunk('app/initializeApp', async (arg, {dispatch}) => {
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
    }
    return;

})

// slice
const slice = createSlice({
    name: 'app',
    initialState: {
        status: 'idle',
        error: null,
        isInitialized: false
    } as InitialStateType,
    reducers: {
        setAppErrorAC(state, action: PayloadAction<{ error: string | null}>) {
            state.error = action.payload.error
        },
        setAppStatusAC(state, action: PayloadAction<{status: RequestStatusType}>){
            state.status = action.payload.status
        }
    },
    extraReducers: builder => {
        builder.addCase(initializeAppTC.fulfilled, (state) => {
            state.isInitialized = true
        })
    }
})
export const appReducer = slice.reducer

// actions
export const {setAppErrorAC, setAppStatusAC} = slice.actions

