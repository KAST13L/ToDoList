import {setAppError, setAppStatus} from '../app/app-reducer'
import {ResponseType} from '../api/todolists-api'
import {Dispatch} from "redux";

export function handleServerAppError<D>(data: ResponseType<D>, dispatch: Dispatch, rejectWithValue: any) {
    dispatch(setAppError({error: data.messages.length ? data.messages[0] : 'Some error occurred'}))
    dispatch(setAppStatus({status: 'failed'}))
    return rejectWithValue({})
}

export function handleServerNetworkError(error: { message: string }, dispatch: Dispatch, rejectWithValue: any) {
    dispatch(setAppError({error: error.message ? error.message : 'Some error occurred'}))
    dispatch(setAppStatus({status: 'failed'}))
    return rejectWithValue({})
}
