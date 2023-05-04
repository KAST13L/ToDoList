import {authApi, LoginParamsType} from "@app/features/auth/auth.api";
import {createSlice} from "@reduxjs/toolkit";
import {
    handleServerAppError,
    handleServerNetworkError
} from "@app/common/utils/error-utils";
import {appActions} from "@app/app/app.reducer";
import {ResultCode} from "@app/common/enum/common.enums";
import {createAppAsyncThunk} from "@app/common/utils/create-app-async-thunk";

export const login = createAppAsyncThunk<null, LoginParamsType>(
    'auth/login', async (data, thunkAPI) => {
        const {dispatch} = thunkAPI
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

export const logout = createAppAsyncThunk<null, undefined>(
    'auth/logout', async (arg, thunkAPI) => {
        const {dispatch} = thunkAPI

        try {
            const res = await authApi.logout()
            if (res.data.resultCode === ResultCode.Success) {
                dispatch(appActions.setAppSuccess({success: 'You are signed out!'}))
            } else {
                return handleServerAppError(res.data, thunkAPI)
            }
        } catch (e: any) {
            return handleServerNetworkError(e, thunkAPI)
        }
    })

const initializeApp = createAppAsyncThunk<{ isLoggedIn: boolean }, void>(
    'app/initializeApp', async (arg, thunkAPI) => {
        const {dispatch} = thunkAPI
        try {
            const res = await authApi.me()
            if (res.data.resultCode === ResultCode.Success) {
                return {isLoggedIn: true}
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
            .addCase(initializeApp.fulfilled, (state, action) => {
                state.isLoggedIn = action.payload.isLoggedIn
            })
    }
})

export const authReducer = slice.reducer
export const authThunks = {logout, login, initializeApp}