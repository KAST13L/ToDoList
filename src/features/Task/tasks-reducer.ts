import {
    TaskPriorities,
    TaskStatuses,
    TaskType,
    todolistsAPI,
    TodolistType,
    UpdateTaskModelType
} from '@app/api/todolists-api'
import {AppRootStateType} from '@app/app/store'
import {setAppStatusAC, setAppSuccessAC} from '@app/app/app-reducer'
import {handleServerAppError, handleServerNetworkError} from '@app/utils/error-utils'
import {call, put, takeEvery} from 'redux-saga/effects';
import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {
    addTodolistAC,
    removeTodolistAC,
    setTodolistsAC
} from "@app/features/Todolist/todolists-reducer";

const initialState: TasksStateType = {}

export const slice = createSlice({
    name: 'tasks',
    initialState: initialState,
    reducers: {
        removeTaskAC(state, action: PayloadAction<{ taskId: string, todolistId: string }>) {
            return {
                ...state,
                [action.payload.todolistId]: state[action.payload.todolistId].filter(t => t.id !== action.payload.taskId)
            }
        },
        addTaskAC(state, action: PayloadAction<{ task: TaskType }>) {
            return {
                ...state,
                [action.payload.task.todoListId]: [action.payload.task, ...state[action.payload.task.todoListId]]
            }
        },
        updateTaskAC(state, action: PayloadAction<{ taskId: string, model: UpdateDomainTaskModelType, todolistId: string }>) {
            return {
                ...state,
                [action.payload.todolistId]: state[action.payload.todolistId]
                    .map(t => t.id === action.payload.taskId ? {...t, ...action.payload.model} : t)
            }
        },
        setTasksAC(state, action: PayloadAction<{ tasks: Array<TaskType>, todolistId: string }>) {
            return {...state, [action.payload.todolistId]: action.payload.tasks}
        },
    },
    extraReducers: (builder) => {
        builder.addCase(addTodolistAC, (state, action: PayloadAction<{ todolist: TodolistType }>) => {
                return {...state, [action.payload.todolist.id]: []}
            })
        builder.addCase(removeTodolistAC, (state, action: PayloadAction<{ id: string }>) => {
                const copyState = {...state}
                delete copyState[action.payload.id]
                return copyState
            })
        builder.addCase(setTodolistsAC, (state, action: PayloadAction<{ todolists: Array<TodolistType> }>) => {
                const copyState = {...state}
                action.payload.todolists.forEach(tl => {
                    copyState[tl.id] = []
                })
                return copyState
            })
    }
})

export const {addTaskAC, setTasksAC, updateTaskAC, removeTaskAC} = slice.actions
export const tasksReducer = slice.reducer

// sagas
export function* fetchTasksWorkerSaga(action: ReturnType<typeof fetchTasksWorkerSagaAC>) {
    yield put(setAppStatusAC({status: 'loading'}))
    // @ts-ignore
    const data = yield call(todolistsAPI.getTasks, action.todolistId)
    try {
        yield put(setTasksAC({tasks: data.items, todolistId: action.todolistId}))
        yield put(setAppStatusAC({status: 'succeeded'}))
    } catch (e: any) {
        handleServerNetworkError(e)
    } finally {
        yield put(setAppStatusAC({status: 'idle'}))
    }
}

export function* removeTaskWorkerSaga(action: ReturnType<typeof removeTaskWorkerSagaAC>) {
    yield put(setAppStatusAC({status: 'loading'}))
    // @ts-ignore
    const res = yield call(todolistsAPI.deleteTask, action.todolistId, action.taskId)
    try {
        if (res) {
        }
        yield put(removeTaskAC({taskId: action.taskId, todolistId: action.todolistId}))
        yield put(setAppStatusAC({status: 'succeeded'}))
        yield put(setAppSuccessAC({success: 'Task deleted'}))
    } catch (e: any) {
        handleServerNetworkError(e)
    } finally {
        yield put(setAppStatusAC({status: 'idle'}))
    }
}

export function* addTaskWorkerSaga(action: ReturnType<typeof addTaskWorkerSagaAC>) {
    yield put(setAppStatusAC({status: 'loading'}))
    // @ts-ignore
    const res = yield call(todolistsAPI.createTask, action.todolistId, action.title)
    try {
        if (res.data.resultCode === 0) {
            yield put(addTaskAC(res.data.data.item))
            yield put(setAppStatusAC({status: 'succeeded'}))
            yield put(setAppSuccessAC({success: 'Task added'}))
        } else {
            yield handleServerAppError(res.data);
        }
    } catch (e: any) {
        handleServerNetworkError(e)
    } finally {
        yield put(setAppStatusAC({status: 'idle'}))
    }
}

export function* updateTaskWorkerSaga(action: ReturnType<typeof updateTaskWorkerSagaAC>) {
    const state = action.getState()
    const task = state.tasks[action.todolistId].find(t => t.id === action.taskId)
    if (!task) {
        console.warn('task not found in the state')
        return
    }
    const apiModel: UpdateTaskModelType = {
        deadline: task.deadline,
        description: task.description,
        priority: task.priority,
        startDate: task.startDate,
        title: task.title,
        status: task.status,
        ...action.domainModel
    }

    yield put(setAppStatusAC({status: 'loading'}))
    // @ts-ignore
    const res = yield call(todolistsAPI.updateTask, action.todolistId, action.taskId, apiModel)
    try {
        if (res.data.resultCode === 0) {
            yield put(updateTaskAC({
                taskId: action.taskId,
                model: action.domainModel,
                todolistId: action.todolistId
            }))
            yield put(setAppStatusAC({status: 'succeeded'}))
            yield put(setAppSuccessAC({success: 'Task changed'}))
        } else {
            yield handleServerAppError(res.data);
        }
    } catch (error: any) {
        handleServerNetworkError(error);
    } finally {
        yield put(setAppStatusAC({status: 'idle'}))
    }
}

// sagas ACs
export const fetchTasksWorkerSagaAC = (todolistId: string) => ({
    type: 'TASKS/FETCH-TASKS',
    todolistId
})
export const removeTaskWorkerSagaAC = (taskId: string, todolistId: string) => ({
    type: 'TASKS/REMOVE-TASK',
    todolistId,
    taskId
})
export const addTaskWorkerSagaAC = (title: string, todolistId: string) => ({
    type: 'TASKS/ADD-TASK',
    todolistId,
    title
})
export const updateTaskWorkerSagaAC = (taskId: string, domainModel: UpdateDomainTaskModelType, todolistId: string, getState: () => AppRootStateType) => ({
    type: 'TASKS/UPDATE-TASK',
    taskId,
    domainModel,
    todolistId,
    getState
})

// tasksWatcher
export function* tasksWatcher() {
    yield takeEvery('TASKS/FETCH-TASKS', fetchTasksWorkerSaga)
    yield takeEvery('TASKS/REMOVE-TASK', removeTaskWorkerSaga)
    yield takeEvery('TASKS/ADD-TASK', addTaskWorkerSaga)
    yield takeEvery('TASKS/UPDATE-TASK', updateTaskWorkerSaga)
}

// types
export type UpdateDomainTaskModelType = {
    title?: string
    description?: string
    status?: TaskStatuses
    priority?: TaskPriorities
    startDate?: string
    deadline?: string
}
export type TasksStateType = {
    [key: string]: Array<TaskType>
}


