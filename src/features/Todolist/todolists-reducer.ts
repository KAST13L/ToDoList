import {call, put, takeEvery} from 'redux-saga/effects'
import {handleServerAppError, handleServerNetworkError} from "@app/utils/error-utils";
import {RequestStatusType, setAppStatusAC, setAppSuccessAC} from "@app/app/app-reducer";
import {todolistsAPI, TodolistType} from "@app/api/todolists-api";

const initialState: Array<TodolistDomainType> = []

export const todolistsReducer = (state: Array<TodolistDomainType> = initialState, action: ActionsType): Array<TodolistDomainType> => {
    switch (action.type) {
        case 'REMOVE-TODOLIST':
            return state.filter(tl => tl.id !== action.id)
        case 'ADD-TODOLIST':
            return [{...action.todolist, filter: 'all', entityStatus: 'idle'}, ...state]
        case 'CHANGE-TODOLIST-TITLE':
            return state.map(tl => tl.id === action.id ? {
                ...tl,
                title: action.title
            } : tl)
        case 'CHANGE-TODOLIST-FILTER':
            return state.map(tl => tl.id === action.id ? {
                ...tl,
                filter: action.filter
            } : tl)
        case 'CHANGE-TODOLIST-ENTITY-STATUS':
            return state.map(tl => tl.id === action.id ? {
                ...tl,
                entityStatus: action.status
            } : tl)
        case 'SET-TODOLISTS':
            return action.todolists.map(tl => ({
                ...tl,
                filter: 'all',
                entityStatus: 'idle'
            }))
        default:
            return state
    }
}

// actions
export const removeTodolistAC = (id: string) => ({type: 'REMOVE-TODOLIST', id} as const)
export const addTodolistAC = (todolist: TodolistType) => ({
    type: 'ADD-TODOLIST',
    todolist
} as const)
export const changeTodolistTitleAC = (id: string, title: string) => ({
    type: 'CHANGE-TODOLIST-TITLE',
    id,
    title
} as const)
export const changeTodolistFilterAC = (id: string, filter: FilterValuesType) => ({
    type: 'CHANGE-TODOLIST-FILTER',
    id,
    filter
} as const)
export const changeTodolistEntityStatusAC = (id: string, status: RequestStatusType) => ({
    type: 'CHANGE-TODOLIST-ENTITY-STATUS', id, status
} as const)
export const setTodolistsAC = (todolists: Array<TodolistType>) => ({
    type: 'SET-TODOLISTS',
    todolists
} as const)

// sagas
export function* fetchTodolistsWorkerSaga() {
    yield put(setAppStatusAC('loading'))
    // @ts-ignore
    const res = yield call(todolistsAPI.getTodolists)
    try {
        if (res) {}
        yield put(setTodolistsAC(res.data))
        yield put(setAppStatusAC('succeeded'))
    } catch (e: any) {
        handleServerNetworkError(e)
    } finally {
        yield put(setAppStatusAC('idle'))
    }
}

export function* removeTodolistWorkerSaga(action: ReturnType<typeof removeTodolistWorkerSagaAC>) {
    yield put(setAppStatusAC('loading'))
    yield put(changeTodolistEntityStatusAC(action.todolistId, 'loading'))
    // @ts-ignore
    const res = yield call(todolistsAPI.deleteTodolist, action.todolistId)
    try {
        if (res) {}
        yield put(removeTodolistAC(action.todolistId))
        yield put(setAppStatusAC('succeeded'))
        yield put(setAppSuccessAC('Todolist removed'))
    } catch (e: any) {
        handleServerNetworkError(e)
    } finally {
        yield put(setAppStatusAC('idle'))
    }
}

export function* addTodolistWorkerSaga(action: ReturnType<typeof addTodolistWorkerSagaAC>) {
    yield put(setAppStatusAC('loading'))
    // @ts-ignore
    const res = yield call(todolistsAPI.createTodolist, action.title)
    try {
        if (res.data.resultCode === 0) {
            yield put(addTodolistAC(res.data.data.item))
            yield put(setAppStatusAC('succeeded'))
            yield put(setAppSuccessAC('Todolist added'))
        } else {
            yield handleServerAppError(res.data)
        }
    } catch (e: any) {
        handleServerNetworkError(e)
    } finally {
        yield put(setAppStatusAC('idle'))
    }
}

export function* changeTodolistTitleWorkerSaga(action: ReturnType<typeof changeTodolistTitleWorkerSagaAC>) {
    yield put(setAppStatusAC('loading'))
    // @ts-ignore
    const res = yield call(todolistsAPI.updateTodolist, action.id, action.title)
    try {
        if (res.data.resultCode === 0) {
            yield put(changeTodolistTitleAC(action.id, action.title))
            yield put(setAppStatusAC('succeeded'))
            yield put(setAppSuccessAC('Todolist title changed'))
        } else {
            yield handleServerAppError(res.data)
        }
    } catch (e: any) {
        handleServerNetworkError(e)
    } finally {
        yield put(setAppStatusAC('idle'))
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
export type AddTodolistActionType = ReturnType<typeof addTodolistAC>;
export type RemoveTodolistActionType = ReturnType<typeof removeTodolistAC>;
export type SetTodolistsActionType = ReturnType<typeof setTodolistsAC>;
type ActionsType =
    | RemoveTodolistActionType
    | AddTodolistActionType
    | ReturnType<typeof changeTodolistTitleAC>
    | ReturnType<typeof changeTodolistFilterAC>
    | SetTodolistsActionType
    | ReturnType<typeof changeTodolistEntityStatusAC>
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