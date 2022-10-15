import {setAppStatusAC} from "../../../app/app-reducer";
import {authAPI, LoginParamsType} from "../../../api/auth-api";
import {handleServerAppError, handleServerNetworkError} from "../../../utils/error-utils";
import axios, {AxiosError} from "axios";
import {createAsyncThunk, createSlice, PayloadAction} from "@reduxjs/toolkit";

export const loginTC = createAsyncThunk('auth/loginTC', async (data: LoginParamsType, thunkAPI) => {
    thunkAPI.dispatch(setAppStatusAC({status:'loading'}))
    const res = await authAPI.login(data)
    try {
        if (res.data.resultCode === 0) {
            thunkAPI.dispatch(setAppStatusAC({status: 'succeeded'}))
            return;
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
export const logoutTC = createAsyncThunk('auth/logoutTC', async (arg,thunkAPI) => {
    thunkAPI.dispatch(setAppStatusAC({status: 'loading'}))
    const res = await authAPI.logout()
    try {
        if (res.data.resultCode === 0) {
            thunkAPI.dispatch(setAppStatusAC({status: 'succeeded'}))
            return;
        } else {
            handleServerAppError(res.data, thunkAPI.dispatch)
            return thunkAPI.rejectWithValue({})
        }
    } catch (e) {
        if (axios.isAxiosError(e)) {
            handleServerNetworkError(e, thunkAPI.dispatch)
            return thunkAPI.rejectWithValue({})
        }
        return thunkAPI.rejectWithValue({})
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
        setIsLoggedInAC(state, action: PayloadAction<{ isLoggedIn: boolean }>) {
            state.isLoggedIn = action.payload.isLoggedIn
        }
    },
    extraReducers: builder => {
        builder.addCase(loginTC.fulfilled, (state) => {
            return {...state, isLoggedIn: true}
        });
        builder.addCase(logoutTC.fulfilled, (state) => {
            return {...state, isLoggedIn: false}
        });
    }
})

export const authReducer = slice.reducer
export const {setIsLoggedInAC} = slice.actions
