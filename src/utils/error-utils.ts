import {setAppErrorAC, setAppStatusAC} from '../app/app-reducer'
import {ResponseType} from '../api/todolists-api'
import {put} from "redux-saga/effects";

export function* handleServerAppError<D>(data: ResponseType<D>) {
    if (data.messages.length) {
        yield put(setAppErrorAC({error: data.messages[0]}))
    } else {
        yield put(setAppErrorAC({error: 'Some error occurred'}))
    }
    yield put(setAppStatusAC({status: 'failed'}))
}

export function* handleServerNetworkError(error: { message: string }) {
    yield put(setAppErrorAC({error: error.message ? error.message : 'Some error occurred'}))
    yield put(setAppStatusAC({status: 'failed'}))
}
