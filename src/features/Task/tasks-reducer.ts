import {
    TaskPriorities,
    TaskStatuses,
    TaskType,
    todolistsAPI,
    UpdateTaskModelType
} from '@app/api/todolists-api'
import {setAppStatusAC, setAppSuccessAC} from '@app/app/app-reducer'
import {createAsyncThunk, createSlice, PayloadAction} from "@reduxjs/toolkit";
import {
    addTodolistAC,
    removeTodolistAC,
    setTodolistsAC
} from "@app/features/Todolist/todolists-reducer";
import {handleServerAppError, handleServerNetworkError} from "@app/utils/error-utils";
import {AppRootStateType} from "@app/app/store";

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

const initialState: TasksStateType = {}

// asyncThunk
export const fetchTasksT = createAsyncThunk('tasks/fetchTasks', async (todolistId: string, {dispatch}) => {
    dispatch(setAppStatusAC({status:'loading'}))
    const data = await todolistsAPI.getTasks(todolistId)
    try {
        dispatch(setTasksAC({tasks: data.items, todolistId: todolistId}))
        dispatch(setAppStatusAC({status: 'succeeded'}))
    } catch (e: any) {
        handleServerNetworkError(e, dispatch)
    } finally {
        dispatch(setAppStatusAC({status: 'idle'}))
    }
})
export const removeTaskT = createAsyncThunk('tasks/removeTask', async ({taskId, todolistId}: {taskId: string, todolistId: string}, {dispatch,rejectWithValue}) => {
    dispatch(setAppStatusAC({status: 'loading'}))
    try {
        const res = await todolistsAPI.deleteTask(todolistId, taskId)
        dispatch(setAppStatusAC({status: 'succeeded'}))
        dispatch(setAppSuccessAC({success: 'Task deleted'}))
        return {taskId: taskId, todolistId: todolistId}
    } catch (e: any) {
        handleServerNetworkError(e, dispatch)
        return rejectWithValue({})
    } finally {
        dispatch(setAppStatusAC({status: 'idle'}))
    }
} )
export const addTaskT = createAsyncThunk('tasks/addTask', async ({title, todolistId}: {title: string, todolistId: string}, {dispatch,rejectWithValue}) => {
    dispatch(setAppStatusAC({status: 'loading'}))
    try {
        const res = await todolistsAPI.createTask(todolistId,title)
        if (res.data.resultCode === 0) {
            dispatch(setAppStatusAC({status: 'succeeded'}))
            dispatch(setAppSuccessAC({success: 'Task added'}))
            return {task: res.data.data.item}
        } else {
            handleServerAppError(res.data, dispatch)
            return rejectWithValue({})
        }
    } catch (e: any) {
        handleServerNetworkError(e, dispatch)
        return rejectWithValue({})
    } finally {
        dispatch(setAppStatusAC({status: 'idle'}))
    }
})
export const updateTaskT= createAsyncThunk('tasks/updateTask', async ({taskId,domainModel,todolistId}: {taskId: string, domainModel: UpdateDomainTaskModelType, todolistId: string}, {dispatch, getState} ) => {
    const state = getState() as AppRootStateType
    const task = state.tasks[todolistId].find(t => t.id === taskId)
    if (!task) {
        console.warn('task not found in the state')
        return
    } else {

    }
    const apiModel: UpdateTaskModelType = {
        deadline: task.deadline,
        description: task.description,
        priority: task.priority,
        startDate: task.startDate,
        title: task.title,
        status: task.status,
        ...domainModel
    }

    dispatch(setAppStatusAC({status: 'loading'}))
    const res = await todolistsAPI.updateTask(todolistId,taskId, apiModel)
    try {
        if (res.data.resultCode === 0) {
            dispatch(updateTaskAC({
                taskId: taskId,
                model: domainModel,
                todolistId: todolistId
            }))
            dispatch(setAppStatusAC({status: 'succeeded'}))
            dispatch(setAppSuccessAC({success: 'Task changed'}))
        } else {
            handleServerAppError(res.data, dispatch);
        }
    } catch (e: any) {
       handleServerNetworkError(e, dispatch);
    } finally {
        dispatch(setAppStatusAC({status: 'idle'}))
    }
})

// slice
export const slice = createSlice({
    name: 'tasks',
    initialState: initialState,
    reducers: {
        updateTaskAC(state, action: PayloadAction<{ taskId: string, model: UpdateDomainTaskModelType, todolistId: string }>) {
            const tasks = state[action.payload.todolistId]
            const index = tasks.findIndex(t => t.id === action.payload.taskId)
            tasks[index] = {...tasks[index], ...action.payload.model}
        },
        setTasksAC(state, action: PayloadAction<{ tasks: Array<TaskType>, todolistId: string }>) {
            state[action.payload.todolistId] = action.payload.tasks
        },
    },
    extraReducers: (builder) => {
        builder.addCase(addTodolistAC, (state, action) => {
            state[action.payload.todolist.id] = []
        })
        builder.addCase(removeTodolistAC, (state, action) => {
            delete state[action.payload.id]
        })
        builder.addCase(setTodolistsAC, (state, action) => {
            action.payload.todolists.forEach(tl => {
                state[tl.id] = []
            })
        })
        builder.addCase(addTaskT.fulfilled, (state, action) => {
            state[action.payload.task.todoListId].unshift(action.payload.task)
        });
        builder.addCase(removeTaskT.fulfilled, (state, action) => {
            const tasks = state[action.payload.todolistId]
            const index = tasks.findIndex(t => t.id === action.payload.taskId)
            tasks.splice(index, 1)
        })
    }
})

export const {setTasksAC, updateTaskAC} = slice.actions
export const tasksReducer = slice.reducer

/*// sagas
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
            yield put(addTaskAC({task: res.data.data.item}))
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
}*/


