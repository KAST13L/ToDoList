import {authAPI} from "../api/auth-api";
import {setIsLoggedInAC} from "../features/Auth/auth-reducer";
import {createAsyncThunk, createSlice, PayloadAction} from "@reduxjs/toolkit";
import {handleServerNetworkError} from "@app/utils/error-utils";

// types
export type RequestStatusType = 'idle' | 'loading' | 'succeeded' | 'failed'
export type InitialStateType = {
    status: RequestStatusType
    error: string | null
    success: string | null
    isInitialized: boolean
}

// asyncThunk
export const initializeAppT = createAsyncThunk('app/initializeApp', async (arg, {dispatch})=>{
    const data = await authAPI.me()
    try {
        if (data.resultCode === 0) {
            dispatch(setIsLoggedInAC({isLoggedIn: true}))
        }
    } catch (e: any) {
        handleServerNetworkError(e, dispatch)
    } finally {
        dispatch(setAppStatusAC({status: "idle"}))
    }
})


export const slice = createSlice({
    name: 'app',
    initialState: {
        status: 'idle',
        error: null,
        success: null,
        isInitialized: false
    } as InitialStateType,
    reducers: {
        setAppErrorAC(state, action: PayloadAction<{ error: string | null }>) {
            state.error = action.payload.error
        },
        setAppSuccessAC(state, action: PayloadAction<{ success: string | null }>) {
            state.success = action.payload.success
        },
        setAppStatusAC(state, action: PayloadAction<{ status: RequestStatusType }>) {
            state.status = action.payload.status
        }
    },
    extraReducers: (builder) => {
        builder.addCase(initializeAppT.fulfilled, (state) => {
            state.isInitialized = true
        })
    }
})

export const {setAppErrorAC,setAppStatusAC,setAppSuccessAC} = slice.actions
export const appReducer = slice.reducer

export const appActions = {initializeAppT}