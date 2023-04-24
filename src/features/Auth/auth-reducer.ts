import {authAPI, LoginParamsType} from "@app/api/auth-api";
import {setAppStatus, setAppSuccess} from "@app/app/app-reducer";
import {createAsyncThunk, createSlice, PayloadAction} from "@reduxjs/toolkit";
import {handleServerAppError, handleServerNetworkError} from "@app/utils/error-utils";
import {ThunkError} from "@app/app/store";

export const login = createAsyncThunk<null, LoginParamsType, ThunkError>(
    'auth/login', async (data, thunkAPI) => {
        const {dispatch} = thunkAPI

        dispatch(setAppStatus({status: "loading"}))
        try {
            const res = await authAPI.login(data)
            if (res.data.resultCode === 0) {
                dispatch(setAppStatus({status: 'succeeded'}))
                dispatch(setAppSuccess({success: 'You are authorized!'}))
            } else {
                return handleServerAppError(res.data, thunkAPI)
            }
        } catch (e: any) {
            return handleServerNetworkError(e, thunkAPI)
        }
    })

export const logout = createAsyncThunk<null, undefined, ThunkError>(
    'auth/logout', async (arg, thunkAPI) => {
        const {dispatch} = thunkAPI

        dispatch(setAppStatus({status: 'loading'}))
        try {
            const res = await authAPI.logout()
            if (res.data.resultCode === 0) {
                dispatch(setAppStatus({status: 'succeeded'}))
                dispatch(setAppSuccess({success: 'You are signed out!'}))
            } else {
                return handleServerAppError(res.data, thunkAPI)
            }
        } catch (e: any) {
            return handleServerNetworkError(e, thunkAPI)
        }
    })

export const slice = createSlice({
    name: 'auth',
    initialState: {
        isLoggedIn: false
    },
    reducers: {
        setIsLoggedIn(state, action: PayloadAction<{ isLoggedIn: boolean }>) {
            state.isLoggedIn = action.payload.isLoggedIn
        }
    },
    extraReducers: (builder) => {
        builder.addCase(login.fulfilled, (state) => {
            state.isLoggedIn = true
        });
        builder.addCase(logout.fulfilled, (state) => {
            state.isLoggedIn = false
        });
    }
})

export const authReducer = slice.reducer
export const {setIsLoggedIn} = slice.actions

export const authActions = {logout, login}