import {setAppError, setAppStatus} from '../app/app-reducer'
import {ResponseType} from '../api/todolists-api'
import {Dispatch} from "redux";

export function handleServerAppError<D>(data: ResponseType<D>, dispatch: Dispatch) {
    if (data.messages.length) {
        dispatch(setAppError({error: data.messages[0]}))
    } else {
        dispatch(setAppError({error: 'Some error occurred'}))
    }
    dispatch(setAppStatus({status: 'failed'}))
}

export function handleServerNetworkError(error: { message: string }, dispatch: Dispatch) {
    dispatch(setAppError({error: error.message ? error.message : 'Some error occurred'}))
    dispatch(setAppStatus({status: 'failed'}))
}

/*
export function* handleServerNetworkError(error: { message: string }) {
    yield put(setAppErrorAC({error: error.message ? error.message : 'Some error occurred'}))
    yield put(setAppStatusAC({status: 'failed'}))
}
export function* handleServerAppError<D>(data: ResponseType<D>) {
    if (data.messages.length) {
        yield put(setAppErrorAC({error: data.messages[0]}))
    } else {
        yield put(setAppErrorAC({error: 'Some error occurred'}))
    }
    yield put(setAppStatusAC({status: 'failed'}))
}*/
