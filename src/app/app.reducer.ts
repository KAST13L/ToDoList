import {authAPI} from "../api/auth-api";
import {setIsLoggedIn} from "../features/Auth/auth.reducer";
import {createAsyncThunk, createSlice, PayloadAction} from "@reduxjs/toolkit";
import {handleServerAppError, handleServerNetworkError} from "@app/utils/error-utils";
import {ThunkError} from "@app/app/store";

// types
export type RequestStatusType = 'idle' | 'loading' | 'succeeded' | 'failed'
export type InitialStateType = {
    status: RequestStatusType
    error: string | null
    success: string | null
    isInitialized: boolean
}

// asyncThunk
const initializeApp = createAsyncThunk<null, undefined, ThunkError>(
    'app/initializeApp', async (arg, thunkAPI) => {
        const {dispatch} = thunkAPI
        try {
            const res = await authAPI.me()
            if (res.resultCode === 0) {
                dispatch(setIsLoggedIn({isLoggedIn: true}))
            } else {
                return handleServerAppError(res, thunkAPI)
            }
        } catch (e: any) {
            return handleServerNetworkError(e, thunkAPI)
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
        setAppError(state, action: PayloadAction<{ error: string | null }>) {
            state.error = action.payload.error
        },
        setAppSuccess(state, action: PayloadAction<{ success: string | null }>) {
            state.success = action.payload.success
        },
        setAppStatus(state, action: PayloadAction<{ status: RequestStatusType }>) {
            state.status = action.payload.status
        }
    },
    extraReducers: (builder) => {
        builder.addCase(initializeApp.fulfilled, (state) => {
            state.isInitialized = true
        })
    }
})

export const {setAppError, setAppStatus, setAppSuccess} = slice.actions
export const appReducer = slice.reducer

export const appActions = {initializeApp}