import {setAppStatusAC} from "../../../app/app-reducer";
import {authAPI, LoginParamsType} from "../../../api/auth-api";
import {handleServerAppError, handleServerNetworkError} from "../../../utils/error-utils";
import axios from "axios";
import {createAsyncThunk, createSlice, PayloadAction} from "@reduxjs/toolkit";


export const loginTC = createAsyncThunk('auth/loginTC', async (data: LoginParamsType, thunkAPI) => {
    const res = await authAPI.login(data)
    try {
        thunkAPI.dispatch(setAppStatusAC({status: 'loading'}))
        if (res.data.resultCode === 0) {
            thunkAPI.dispatch(setAppStatusAC({status: 'succeeded'}))
            return {isLoggedIn: true}
        } else {
            handleServerAppError(res.data, thunkAPI.dispatch)
            return {isLoggedIn: false}
        }
    } catch (e) {
        if (axios.isAxiosError(e)) {
            handleServerNetworkError(e, thunkAPI.dispatch)
            return {isLoggedIn: false}
        }
        return {isLoggedIn: false}
    } finally {
        thunkAPI.dispatch(setAppStatusAC({status: "idle"}))
    }
})

export const logoutTC = createAsyncThunk('auth/logoutTC', async ({},thunkAPI) => {
    thunkAPI.dispatch(setAppStatusAC({status: 'loading'}))
    const res = await authAPI.logout()
    try {
        if (res.data.resultCode === 0) {
            thunkAPI.dispatch(setAppStatusAC({status: 'succeeded'}))
            return {isLoggedIn: false}
        } else {
            handleServerAppError(res.data, thunkAPI.dispatch)
            return {isLoggedIn: true}
        }
    } catch (e) {
        if (axios.isAxiosError(e)) {
            handleServerNetworkError(e, thunkAPI.dispatch)
            return {isLoggedIn: true}
        }
        return {isLoggedIn: true}
    } finally {
        thunkAPI.dispatch(setAppStatusAC({status: "idle"}))
    }
})


const slice = createSlice({
    name: 'auth',
    initialState: {
        isLoggedIn: false
    },
    reducers: {
        setIsLoggedInAC(state, action: PayloadAction<{ value: boolean }>) {
            state.isLoggedIn = action.payload.value
        }
    },
    extraReducers: builder => {
        builder.addCase(loginTC.fulfilled, (state, action) => {
            return {...state, isLoggedIn: action.payload.isLoggedIn}
        });
        builder.addCase(logoutTC.fulfilled, (state, action) => {
            return {...state, isLoggedIn: action.payload.isLoggedIn}
        })
    }
})

export const authReducer = slice.reducer
export const {setIsLoggedInAC} = slice.actions
