import {createSlice, PayloadAction} from "@reduxjs/toolkit";

// types
export type RequestStatusType = 'idle' | 'loading' | 'succeeded' | 'failed'
export type InitialAppStateType = {
    status: RequestStatusType
    error: string | null
    success: string | null
    isInitialized: boolean
}

export const slice = createSlice({
    name: 'app',
    initialState: {
        status: 'idle',
        error: null,
        success: null,
        isInitialized: false
    } as InitialAppStateType,
    reducers: {
        setAppError(state, action: PayloadAction<{ error: string | null }>) {
            state.error = action.payload.error
            state.status = 'failed'
        },
        setAppSuccess(state, action: PayloadAction<{ success: string | null }>) {
            state.success = action.payload.success
            state.status = 'succeeded'
        },
        setAppStatus(state, action: PayloadAction<{ status: RequestStatusType }>) {
            state.status = action.payload.status
        },
        setAppInitialized(state, action: PayloadAction<{ isInitialized: boolean }>) {
            state.isInitialized = action.payload.isInitialized
        },
    }
})

export const appReducer = slice.reducer
export const appActions = slice.actions
