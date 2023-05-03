import {authApi, LoginParamsType} from "@app/features/Auth/auth.api";
import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import {handleServerAppError, handleServerNetworkError} from "@app/utils/error-utils";
import {appActions} from "@app/app/app.reducer";
import {ThunkError} from "@app/common/hooks/useActions";
import {ResultCode} from "@app/common/enum/common.enums";

export const login = createAsyncThunk<null, LoginParamsType, ThunkError>(
    'auth/login', async (data, thunkAPI) => {
        const {dispatch} = thunkAPI

        dispatch(appActions.setAppStatus({status: "loading"}))
        try {
            const res = await authApi.login(data)
            if (res.data.resultCode === ResultCode.Success) {
                dispatch(appActions.setAppSuccess({success: 'You are authorized!'}))
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

        dispatch(appActions.setAppStatus({status: 'loading'}))
        try {
            const res = await authApi.logout()
            if (res.data.resultCode === 0) {
                dispatch(appActions.setAppSuccess({success: 'You are signed out!'}))
            } else {
                return handleServerAppError(res.data, thunkAPI)
            }
        } catch (e: any) {
            return handleServerNetworkError(e, thunkAPI)
        }
    })

const initializeApp = createAsyncThunk<null, undefined, ThunkError>(
    'app/initializeApp', async (arg, thunkAPI) => {
        const {dispatch} = thunkAPI
        try {
            const res = await authApi.me()
            if (res.data.resultCode === 0) {
                return;
            }
        } catch (e: any) {
            return handleServerNetworkError(e, thunkAPI)
        } finally {
            dispatch(appActions.setAppInitialized({isInitialized: true}));
        }
    })

export const slice = createSlice({
    name: 'auth',
    initialState: {
        isLoggedIn: false
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(login.fulfilled, (state) => {
                state.isLoggedIn = true
            })
            .addCase(logout.fulfilled, (state) => {
                state.isLoggedIn = false
            })
            .addCase(initializeApp.fulfilled, (state) => {
                state.isLoggedIn = true
            })
    }
})

export const authReducer = slice.reducer
export const authThunks = {logout, login, initializeApp}