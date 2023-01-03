import {authAPI, LoginParamsType} from "@app/api/auth-api";
import {handleServerAppError, handleServerNetworkError} from "@app/utils/error-utils";
import {call, put, takeEvery} from 'redux-saga/effects';
import {
    SetAppErrorACType,
    setAppStatusAC,
    SetAppStatusACType, setAppSuccessAC
} from "@app/app/app-reducer";

const initialState = {
    isLoggedIn: false
}
type InitialStateType = typeof initialState

export const authReducer = (state: InitialStateType = initialState, action: ActionsType): InitialStateType => {
    switch (action.type) {
        case 'login/SET-IS-LOGGED-IN':
            return {...state, isLoggedIn: action.value}
        default:
            return state
    }
}

// actions
export const setIsLoggedInAC = (value: boolean) =>
    ({type: 'login/SET-IS-LOGGED-IN', value} as const)

// sagas
export function* loginWorkerSaga(action: ReturnType<typeof loginWorkerSagaAC>){
    yield put(setAppStatusAC("loading"))
    // @ts-ignore
    const res = yield call(authAPI.login, action.data)
    try {
        if (res.data.resultCode === 0){
            yield put(setIsLoggedInAC(true))
            yield put(setAppStatusAC('succeeded'))
            yield put(setAppSuccessAC('You are authorized!'))
        } else {
            yield handleServerAppError(res.data)
        }
    } catch (e: any) {
        yield handleServerNetworkError(e)
    } finally {
        yield put(setAppStatusAC("idle"))
    }
}
export function* logoutWorkerSaga(){
    yield put(setAppStatusAC('loading'))
    // @ts-ignore
    const res = yield call(authAPI.logout)
    try {
        if (res.data.resultCode === 0) {
            yield put(setIsLoggedInAC(false))
            yield put(setAppStatusAC('succeeded'))
            yield put(setAppSuccessAC('You are signed out!'))
        } else {
            yield handleServerAppError(res.data)
        }
    } catch (e: any){
        yield handleServerNetworkError(e)
    } finally {
        yield put(setAppStatusAC('idle'))
    }
}

// saga ACs
export const loginWorkerSagaAC = (data: LoginParamsType) => ({type:'AUTH/LOGIN', data})
export const logoutWorkerSagaAC = () => ({type:'AUTH/LOGOUT'})

// types
type ActionsType = ReturnType<typeof setIsLoggedInAC> | SetAppStatusACType | SetAppErrorACType

// authWatcher
export function* authWatcher(){
    yield takeEvery('AUTH/LOGIN', loginWorkerSaga)
    yield takeEvery('AUTH/LOGOUT', logoutWorkerSaga)
}