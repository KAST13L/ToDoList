import {authAPI, LoginParamsType} from "@app/api/auth-api";
import {handleServerAppError, handleServerNetworkError} from "@app/utils/error-utils";
import {call, put, takeEvery} from 'redux-saga/effects';
import {setAppStatusAC, setAppSuccessAC} from "@app/app/app-reducer";
import {createSlice, PayloadAction} from "@reduxjs/toolkit";

const initialState = {
    isLoggedIn: false
}

export const slice = createSlice({
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

// sagas
export function* loginWorkerSaga(action: ReturnType<typeof loginWorkerSagaAC>) {
    yield put(setAppStatusAC({status: "loading"}))
    // @ts-ignore
    const res = yield call(authAPI.login, action.data)
    try {
        if (res.data.resultCode === 0) {
            yield put(setIsLoggedInAC({value: true}))
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
            yield put(setIsLoggedInAC({value: false}))
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
}