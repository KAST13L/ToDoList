import {setAppStatusAC} from "../../../app/app-reducer";
import {authAPI, LoginParamsType} from "../../../api/auth-api";
import {handleServerAppError, handleServerNetworkError} from "../../../utils/error-utils";
import axios, {AxiosError} from "axios";
import {createAsyncThunk, createSlice, PayloadAction} from "@reduxjs/toolkit";
import {Dispatch} from "redux";


export const loginTC = createAsyncThunk('auth/loginTC', async (data: LoginParamsType, thunkAPI) => {
    thunkAPI.dispatch(setAppStatusAC({status:'loading'}))
    const res = await authAPI.login(data)
    try {
        if (res.data.resultCode === 0) {
            thunkAPI.dispatch(setAppStatusAC({status: 'succeeded'}))
            return {isLoggedIn: true}
        } else {
            handleServerAppError(res.data, thunkAPI.dispatch)
            return thunkAPI.rejectWithValue({errors: res.data.messages, fieldsErrors: res.data.fieldsErrors})
        }
    } catch (err) {
        const error: AxiosError | any = err;

        handleServerNetworkError(error, thunkAPI.dispatch)
        return thunkAPI.rejectWithValue({errors: [error.message], fieldsErrors: undefined})

    } finally {
        thunkAPI.dispatch(setAppStatusAC({status: "idle"}))
    }
})

export const logoutTC = () => async (dispatch: Dispatch) => {
    dispatch(setAppStatusAC({status: 'loading'}))
    const res = await authAPI.logout()
    try {
        if (res.data.resultCode === 0) {
            dispatch(setAppStatusAC({status: 'succeeded'}))
            dispatch(setIsLoggedInAC({isLoggedIn: false}))
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

/*export const logoutTC = createAsyncThunk('auth/logoutTC', async (data: string,thunkAPI) => {
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
})*/


const slice = createSlice({
    name: 'auth',
    initialState: {
        isLoggedIn: false
    },
    reducers: {
        setIsLoggedInAC(state, action: PayloadAction<{ isLoggedIn: boolean }>) {
            state.isLoggedIn = action.payload.isLoggedIn
        }
    },
    extraReducers: builder => {
        builder.addCase(loginTC.fulfilled, (state, action) => {
            return {...state, isLoggedIn: action.payload.isLoggedIn}
        });
        /*builder.addCase(logoutTC.fulfilled, (state, action) => {
            return {...state, isLoggedIn: action.payload.isLoggedIn}
        });*/
    }
})

export const authReducer = slice.reducer
export const {setIsLoggedInAC} = slice.actions
