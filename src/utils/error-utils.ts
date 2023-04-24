import {setAppError, setAppStatus} from '../app/app.reducer'
import {ResponseType} from '../api/todolists-api'
import {Dispatch} from "redux";

export function handleServerAppError<D>(data: ResponseType<D>, thunkAPI: { dispatch: Dispatch, rejectWithValue: any }) {
    const {dispatch,rejectWithValue } = thunkAPI
    dispatch(setAppError({error: data.messages.length ? data.messages[0] : 'Some error occurred'}))
    dispatch(setAppStatus({status: 'failed'}))
    return rejectWithValue({})
}

export function handleServerNetworkError(error: { message: string }, thunkAPI: { dispatch: Dispatch, rejectWithValue: any }) {
    const {dispatch,rejectWithValue} = thunkAPI
    dispatch(setAppError({error: error.message ? error.message : 'Some error occurred'}))
    dispatch(setAppStatus({status: 'failed'}))
    return rejectWithValue({})
}
