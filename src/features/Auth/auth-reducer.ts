import {authAPI, LoginParamsType} from "@app/api/auth-api";
import {setAppStatus, setAppSuccess} from "@app/app/app-reducer";
import {createAsyncThunk, createSlice, PayloadAction} from "@reduxjs/toolkit";
import {handleServerAppError, handleServerNetworkError} from "@app/utils/error-utils";

export const login = createAsyncThunk<undefined, LoginParamsType, any>('auth/login', async (data, {
    dispatch,
    rejectWithValue
}) => {
    dispatch(setAppStatus({status: "loading"}))
    try {
        const res = await authAPI.login(data)
        if (res.data.resultCode === 0) {
            dispatch(setAppStatus({status: 'succeeded'}))
            dispatch(setAppSuccess({success: 'You are authorized!'}))
        } else {
            handleServerAppError(res.data, dispatch)
            return rejectWithValue({})
        }
    } catch (e: any) {
        handleServerNetworkError(e, dispatch)
        return rejectWithValue({})
    } finally {
        dispatch(setAppStatus({status: "idle"}))
    }
})

export const logout = createAsyncThunk('auth/logout', async (arg, {
    dispatch,
    rejectWithValue
}) => {
    dispatch(setAppStatus({status: 'loading'}))
    try {
        const res = await authAPI.logout()
        if (res.data.resultCode === 0) {
            dispatch(setAppStatus({status: 'succeeded'}))
            dispatch(setAppSuccess({success: 'You are signed out!'}))
        } else {
            handleServerAppError(res.data, dispatch)
            return rejectWithValue({})
        }
    } catch (e: any) {
        handleServerNetworkError(e, dispatch)
        return rejectWithValue({})
    } finally {
        dispatch(setAppStatus({status: 'idle'}))
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

export const authActions = {logout,login}