import {authAPI, LoginParamsType} from "@app/api/auth-api";
import {setAppStatusAC, setAppSuccessAC} from "@app/app/app-reducer";
import {createAsyncThunk, createSlice, PayloadAction} from "@reduxjs/toolkit";
import {handleServerAppError, handleServerNetworkError} from "@app/utils/error-utils";

export const loginT = createAsyncThunk<undefined, LoginParamsType, any>('auth/login', async (data, {
    dispatch,
    rejectWithValue
}) => {
    dispatch(setAppStatusAC({status: "loading"}))
    try {
        const res = await authAPI.login(data)
        if (res.data.resultCode === 0) {
            dispatch(setAppStatusAC({status: 'succeeded'}))
            dispatch(setAppSuccessAC({success: 'You are authorized!'}))
        } else {
            handleServerAppError(res.data, dispatch)
            return rejectWithValue({})
        }
    } catch (e: any) {
        handleServerNetworkError(e, dispatch)
        return rejectWithValue({})
    } finally {
        dispatch(setAppStatusAC({status: "idle"}))
    }
})

export const logoutT = createAsyncThunk('auth/logout', async (arg, {
    dispatch,
    rejectWithValue
}) => {
    dispatch(setAppStatusAC({status: 'loading'}))
    try {
        const res = await authAPI.logout()
        if (res.data.resultCode === 0) {
            dispatch(setAppStatusAC({status: 'succeeded'}))
            dispatch(setAppSuccessAC({success: 'You are signed out!'}))
        } else {
            handleServerAppError(res.data, dispatch)
            return rejectWithValue({})
        }
    } catch (e: any) {
        handleServerNetworkError(e, dispatch)
        return rejectWithValue({})
    } finally {
        dispatch(setAppStatusAC({status: 'idle'}))
    }
})

export const slice = createSlice({
    name: 'auth',
    initialState: {
        isLoggedIn: false
    },
    reducers: {
        setIsLoggedInAC(state, action: PayloadAction<{ isLoggedIn: boolean }>) {
            state.isLoggedIn = action.payload.isLoggedIn
        }
    },
    extraReducers: (builder) => {
        builder.addCase(loginT.fulfilled, (state) => {
            state.isLoggedIn = true
        });
        builder.addCase(logoutT.fulfilled, (state) => {
            state.isLoggedIn = false
        });
    }
})

export const authReducer = slice.reducer
export const {setIsLoggedInAC} = slice.actions

/*
// sagas
export function* loginWorkerSaga(action: ReturnType<typeof loginWorkerSagaAC>) {
    yield put(setAppStatusAC({status: "loading"}))
    // @ts-ignore
    const res = yield call(authAPI.login, action.data)
    try {
        if (res.data.resultCode === 0) {
            yield put(setIsLoggedInAC({isLoggedIn: true}))
            yield put(setAppStatusAC({status: 'succeeded'}))
            yield put(setAppSuccessAC({success: 'You are authorized!'}))
        } else {
            yield handleServerAppError(res.data)
        }
    } catch (e: any) {
        yield handleServerNetworkError(e)
    } finally {
        yield put(setAppStatusAC({status: "idle"}))
    }
}
export function* logoutWorkerSaga() {
    yield put(setAppStatusAC({status: 'loading'}))
    // @ts-ignore
    const res = yield call(authAPI.logout)
    try {
        if (res.data.resultCode === 0) {
            yield put(setIsLoggedInAC({isLoggedIn: false}))
            yield put(setAppStatusAC({status: 'succeeded'}))
            yield put(setAppSuccessAC({success: 'You are signed out!'}))
        } else {
            yield handleServerAppError(res.data)
        }
    } catch (e: any) {
        yield handleServerNetworkError(e)
    } finally {
        yield put(setAppStatusAC({status: 'idle'}))
    }
}

// saga ACs
export const loginWorkerSagaAC = (data: LoginParamsType) => ({type: 'AUTH/LOGIN', data})
export const logoutWorkerSagaAC = () => ({type: 'AUTH/LOGOUT'})

// authWatcher
export function* authWatcher() {
    yield takeEvery('AUTH/LOGIN', loginWorkerSaga)
    yield takeEvery('AUTH/LOGOUT', logoutWorkerSaga)
}*/
