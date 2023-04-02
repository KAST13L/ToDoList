import {call, put, takeEvery} from 'redux-saga/effects'
import {handleServerAppError, handleServerNetworkError} from "@app/utils/error-utils";
import {RequestStatusType, setAppStatusAC, setAppSuccessAC} from "@app/app/app-reducer";
import {todolistsAPI, TodolistType} from "@app/api/todolists-api";
import {createSlice, PayloadAction} from "@reduxjs/toolkit";

const initialState: Array<TodolistDomainType> = []

export const slice = createSlice({
    name: 'todolist',
    initialState: initialState,
    reducers: {
        removeTodolistAC(state, action: PayloadAction<{ id: string }>) {
            state.filter(tl => tl.id !== action.payload.id)
            const index = state.findIndex( tl => tl.id === action.payload.id)
            state.splice(index,1)
        },
        addTodolistAC(state, action: PayloadAction<{ todolist: TodolistType }>) {
            state.unshift({...action.payload.todolist, entityStatus: 'idle', filter:'all'})
        },
        changeTodolistTitleAC(state, action: PayloadAction<{ id: string, title: string }>) {
            const index = state.findIndex( tl => tl.id === action.payload.id)
            state[index].title = action.payload.title
        },
        changeTodolistFilterAC(state, action: PayloadAction<{ id: string, filter: FilterValuesType }>) {
            const index = state.findIndex( tl => tl.id === action.payload.id)
            state[index].filter = action.payload.filter
        },
        changeTodolistEntityStatusAC(state, action: PayloadAction<{ id: string, status: RequestStatusType }>) {
            const index = state.findIndex( tl => tl.id === action.payload.id)
            state[index].entityStatus = action.payload.status
        },
        setTodolistsAC(state, action: PayloadAction<{ todolists: Array<TodolistType> }>) {
            return action.payload.todolists.map(tl => ({...tl, filter: 'all', entityStatus: 'idle'}))
        }
    }
})

export const {
    changeTodolistEntityStatusAC,
    changeTodolistFilterAC,
    changeTodolistTitleAC,
    removeTodolistAC,
    addTodolistAC,
    setTodolistsAC
} = slice.actions
export const todolistsReducer = slice.reducer

// sagas
export function* fetchTodolistsWorkerSaga() {
    yield put(setAppStatusAC({status: 'loading'}))
    // @ts-ignore
    const res = yield call(todolistsAPI.getTodolists)
    try {
        if (res) {
        }
        yield put(setTodolistsAC({todolists: res.data}))
        yield put(setAppStatusAC({status: 'succeeded'}))
    } catch (e: any) {
        handleServerNetworkError(e)
    } finally {
        yield put(setAppStatusAC({status: 'idle'}))
    }
}

export function* removeTodolistWorkerSaga(action: ReturnType<typeof removeTodolistWorkerSagaAC>) {
    yield put(setAppStatusAC({status: 'loading'}))
    yield put(changeTodolistEntityStatusAC({id: action.todolistId, status: 'loading'}))
    // @ts-ignore
    const res = yield call(todolistsAPI.deleteTodolist, action.todolistId)
    try {
        if (res) {
        }
        yield put(removeTodolistAC({id: action.todolistId}))
        yield put(setAppStatusAC({status: 'succeeded'}))
        yield put(setAppSuccessAC({success: 'Todolist removed'}))
    } catch (e: any) {
        handleServerNetworkError(e)
    } finally {
        yield put(setAppStatusAC({status: 'idle'}))
    }
}

export function* addTodolistWorkerSaga(action: ReturnType<typeof addTodolistWorkerSagaAC>) {
    yield put(setAppStatusAC({status: 'loading'}))
    // @ts-ignore
    const res = yield call(todolistsAPI.createTodolist, action.title)
    try {
        if (res.data.resultCode === 0) {
            yield put(addTodolistAC({todolist: res.data.data.item}))
            yield put(setAppStatusAC({status: 'succeeded'}))
            yield put(setAppSuccessAC({success: 'Todolist added'}))
        } else {
            yield handleServerAppError(res.data)
        }
    } catch (e: any) {
        handleServerNetworkError(e)
    } finally {
        yield put(setAppStatusAC({status: 'idle'}))
    }
}

export function* changeTodolistTitleWorkerSaga(action: ReturnType<typeof changeTodolistTitleWorkerSagaAC>) {
    yield put(setAppStatusAC({status: 'loading'}))
    // @ts-ignore
    const res = yield call(todolistsAPI.updateTodolist, action.id, action.title)
    try {
        if (res.data.resultCode === 0) {
            yield put(changeTodolistTitleAC({id: action.id, title: action.title}))
            yield put(setAppStatusAC({status: 'succeeded'}))
            yield put(setAppSuccessAC({success: 'Todolist title changed'}))
        } else {
            yield handleServerAppError(res.data)
        }
    } catch (e: any) {
        handleServerNetworkError(e)
    } finally {
        yield put(setAppStatusAC({status: 'idle'}))
    }
}

// sagas ACs
export const fetchTodolistsWorkerSagaAC = () => ({type: 'TODO/FETCH-TODOLISTS'})
export const removeTodolistWorkerSagaAC = (todolistId: string) => ({
    type: 'TODO/REMOVE-TODOLIST',
    todolistId
})
export const addTodolistWorkerSagaAC = (title: string) => ({
    type: 'TODO/ADD-TODOLIST',
    title
})
export const changeTodolistTitleWorkerSagaAC = (id: string, title: string) => ({
    type: 'TODO/CHANGE-TODOLIST-TITLE',
    id,
    title
})

// types
export type FilterValuesType = 'all' | 'active' | 'completed';
export type TodolistDomainType = TodolistType & {
    filter: FilterValuesType
    entityStatus: RequestStatusType
}

// todolistsWatcher
export function* todolistsWatcher() {
    yield takeEvery('TODO/FETCH-TODOLISTS', fetchTodolistsWorkerSaga)
    yield takeEvery('TODO/REMOVE-TODOLIST', removeTodolistWorkerSaga)
    yield takeEvery('TODO/ADD-TODOLIST', addTodolistWorkerSaga)
    yield takeEvery('TODO/CHANGE-TODOLIST-TITLE', changeTodolistTitleWorkerSaga)
}