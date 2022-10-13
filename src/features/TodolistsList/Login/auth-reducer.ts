import {Dispatch} from 'redux'
import {setAppStatusAC} from "../../../app/app-reducer";
import {authAPI, LoginParamsType} from "../../../api/auth-api";
import {handleServerAppError, handleServerNetworkError} from "../../../utils/error-utils";
import axios from "axios";
import {createSlice, PayloadAction} from "@reduxjs/toolkit";

const initialState = {
    isLoggedIn: false
}

const slice = createSlice({
    name: 'auth',
    initialState: initialState,
    reducers: {
        setIsLoggedInAC(state, action: PayloadAction<{ value: boolean }>) {
            state.isLoggedIn = action.payload.value
        }
    }
})

export const authReducer = slice.reducer
export const {setIsLoggedInAC} = slice.actions

export const loginTC = (data: LoginParamsType) => async (dispatch: Dispatch) => {
    const res = await authAPI.login(data)
    try {
        dispatch(setAppStatusAC({status: 'loading'}))
        if (res.data.resultCode === 0) {
            dispatch(setIsLoggedInAC({value: true}))
            dispatch(setAppStatusAC({status: 'succeeded'}))

        } else {
            handleServerAppError(res.data, dispatch)
        }
    } catch (e) {
        if (axios.isAxiosError(e)) {
            handleServerNetworkError(e, dispatch)
        }
    } finally {
        dispatch(setAppStatusAC({status: "idle"}))
    }
}

export const logoutTC = () => async (dispatch: Dispatch) => {
    dispatch(setAppStatusAC({status: 'loading'}))
    const res = await authAPI.logout()
    try {
        if (res.data.resultCode === 0) {
            dispatch(setIsLoggedInAC({value: false}))
            dispatch(setAppStatusAC({status: 'succeeded'}))
        } else {
            handleServerAppError(res.data, dispatch)
        }
    } catch (e) {
        if (axios.isAxiosError(e)) {
            handleServerNetworkError(e, dispatch)
        }
    } finally {
        dispatch(setAppStatusAC({status: "idle"}))
    }
}