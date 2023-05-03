import {ResponseType} from '../features/TodolistList/todolists-api'
import {Dispatch} from "redux";
import {appActions} from "@app/app/app.reducer";

export function handleServerAppError<D>(data: ResponseType<D>, thunkAPI: { dispatch: Dispatch, rejectWithValue: any }) {
    const {dispatch, rejectWithValue} = thunkAPI
    dispatch(appActions.setAppError({error: data.messages.length ? data.messages[0] : 'Some error occurred'}))
    dispatch(appActions.setAppStatus({status: 'failed'}))
    return rejectWithValue({})
}

export function handleServerNetworkError(error: { message: string }, thunkAPI: { dispatch: Dispatch, rejectWithValue: any }) {
    const {dispatch, rejectWithValue} = thunkAPI
    dispatch(appActions.setAppError({error: error.message ? error.message : 'Some error occurred'}))
    dispatch(appActions.setAppStatus({status: 'failed'}))
    return rejectWithValue({})
}
