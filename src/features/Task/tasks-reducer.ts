import {
    AddTodolistActionType,
    RemoveTodolistActionType,
    SetTodolistsActionType
} from '../Todolist/todolists-reducer'
import {
    TaskPriorities,
    TaskStatuses,
    TaskType,
    todolistsAPI,
    UpdateTaskModelType
} from '@app/api/todolists-api'
import {AppRootStateType} from '@app/app/store'
import {setAppStatusAC, setAppSuccessAC} from '@app/app/app-reducer'
import {handleServerAppError, handleServerNetworkError} from '@app/utils/error-utils'
import {call, put, takeEvery} from 'redux-saga/effects';

const initialState: TasksStateType = {}

export const tasksReducer = (state: TasksStateType = initialState, action: ActionsType): TasksStateType => {
    switch (action.type) {
        case 'REMOVE-TASK':
            return {
                ...state,
                [action.todolistId]: state[action.todolistId].filter(t => t.id !== action.taskId)
            }
        case 'ADD-TASK':
            return {
                ...state,
                [action.task.todoListId]: [action.task, ...state[action.task.todoListId]]
            }
        case 'UPDATE-TASK':
            return {
                ...state,
                [action.todolistId]: state[action.todolistId]
                    .map(t => t.id === action.taskId ? {...t, ...action.model} : t)
            }
        case 'ADD-TODOLIST':
            return {...state, [action.todolist.id]: []}
        case 'REMOVE-TODOLIST':
            const copyState = {...state}
            delete copyState[action.id]
            return copyState
        case 'SET-TODOLISTS': {
            const copyState = {...state}
            action.todolists.forEach(tl => {
                copyState[tl.id] = []
            })
            return copyState
        }
        case 'SET-TASKS':
            return {...state, [action.todolistId]: action.tasks}
        default:
            return state
    }
}

// actions
export const removeTaskAC = (taskId: string, todolistId: string) => ({
    type: 'REMOVE-TASK',
    taskId,
    todolistId
} as const)
export const addTaskAC = (task: TaskType) => ({type: 'ADD-TASK', task} as const)
export const updateTaskAC = (taskId: string, model: UpdateDomainTaskModelType, todolistId: string) => ({
    type: 'UPDATE-TASK',
    model,
    todolistId,
    taskId
} as const)
export const setTasksAC = (tasks: Array<TaskType>, todolistId: string) => ({
    type: 'SET-TASKS',
    tasks,
    todolistId
} as const)

// sagas
export function* fetchTasksWorkerSaga(action: ReturnType<typeof fetchTasksWorkerSagaAC>) {
    yield put(setAppStatusAC('loading'))
    // @ts-ignore
    const data = yield call(todolistsAPI.getTasks, action.todolistId)
    try {
        yield put(setTasksAC(data.items, action.todolistId))
        yield put(setAppStatusAC('succeeded'))
    } catch (e: any) {
        handleServerNetworkError(e)
    } finally {
        yield put(setAppStatusAC('idle'))
    }
}

export function* removeTaskWorkerSaga(action: ReturnType<typeof removeTaskWorkerSagaAC>) {
    yield put(setAppStatusAC('loading'))
    // @ts-ignore
    const res = yield call(todolistsAPI.deleteTask, action.todolistId, action.taskId)
    try {
        if (res) {
        }
        yield put(removeTaskAC(action.taskId, action.todolistId))
        yield put(setAppStatusAC('succeeded'))
        yield put(setAppSuccessAC('Task deleted'))
    } catch (e: any) {
        handleServerNetworkError(e)
    } finally {
        yield put(setAppStatusAC('idle'))
    }
}

export function* addTaskWorkerSaga(action: ReturnType<typeof addTaskWorkerSagaAC>) {
    yield put(setAppStatusAC('loading'))
    // @ts-ignore
    const res = yield call(todolistsAPI.createTask, action.todolistId, action.title)
    try {
        if (res.data.resultCode === 0) {
            yield put(addTaskAC(res.data.data.item))
            yield put(setAppStatusAC('succeeded'))
            yield put(setAppSuccessAC('Task added'))
        } else {
            yield handleServerAppError(res.data);
        }
    } catch (e: any) {
        handleServerNetworkError(e)
    } finally {
        yield put(setAppStatusAC('idle'))
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

    yield put(setAppStatusAC('loading'))
    // @ts-ignore
    const res = yield call(todolistsAPI.updateTask, action.todolistId, action.taskId, apiModel)
    try {
        if (res.data.resultCode === 0) {
            yield put(updateTaskAC(action.taskId, action.domainModel, action.todolistId))
            yield put(setAppStatusAC('succeeded'))
            yield put(setAppSuccessAC('Task changed'))
        } else {
            yield handleServerAppError(res.data);
        }
    } catch (error: any) {
        handleServerNetworkError(error);
    } finally {
        yield put(setAppStatusAC('idle'))
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
type ActionsType =
    | ReturnType<typeof removeTaskAC>
    | ReturnType<typeof addTaskAC>
    | ReturnType<typeof updateTaskAC>
    | AddTodolistActionType
    | RemoveTodolistActionType
    | SetTodolistsActionType
    | ReturnType<typeof setTasksAC>


