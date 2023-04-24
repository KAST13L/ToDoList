import {
    TaskPriorities,
    TaskStatuses,
    TaskType,
    todolistsAPI,
    UpdateTaskModelType
} from '@app/api/todolists-api'
import {setAppStatus, setAppSuccess} from '@app/app/app-reducer'
import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import {handleServerAppError, handleServerNetworkError} from "@app/utils/error-utils";
import {AppRootStateType, ThunkError} from "@app/app/store";
import {
    addTodolist,
    fetchTodolists,
    removeTodolist
} from "@app/features/Todolist/todolists-reducer";
import {TodolistType} from "@app/api/types";

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

// asyncThunk
export const fetchTasks = createAsyncThunk<{ tasks: TaskType[], todolistId: string }, string, ThunkError>(
    'tasks/fetchTasks', async (todolistId, thunkAPI) => {
        const {dispatch} = thunkAPI
        dispatch(setAppStatus({status: 'loading'}))
        try {
            const data = await todolistsAPI.getTasks(todolistId)
            dispatch(setAppStatus({status: 'succeeded'}))
            return {tasks: data.items, todolistId: todolistId}
        } catch (e: any) {
            return handleServerNetworkError(e, thunkAPI)
        } finally {
            dispatch(setAppStatus({status: 'idle'}))
        }
    })
export const removeTask = createAsyncThunk<{ taskId: string, todolistId: string }, { taskId: string, todolistId: string }, ThunkError>(
    'tasks/removeTask', async ({taskId, todolistId}, thunkAPI) => {
        const {dispatch} = thunkAPI
        dispatch(setAppStatus({status: 'loading'}))
        try {
            await todolistsAPI.deleteTask(todolistId, taskId);
            dispatch(setAppStatus({status: 'succeeded'}))
            dispatch(setAppSuccess({success: 'Task deleted'}))
            return {taskId: taskId, todolistId: todolistId}
        } catch (e: any) {
            return handleServerNetworkError(e, thunkAPI)
        } finally {
            dispatch(setAppStatus({status: 'idle'}))
        }
    })
export const addTask = createAsyncThunk<{ task: TaskType }, { title: string, todolistId: string }, ThunkError>(
    'tasks/addTask', async ({title, todolistId}, thunkAPI) => {
        const {dispatch} = thunkAPI
        dispatch(setAppStatus({status: 'loading'}))
        try {
            const res = await todolistsAPI.createTask(todolistId, title)
            if (res.data.resultCode === 0) {
                dispatch(setAppStatus({status: 'succeeded'}))
                dispatch(setAppSuccess({success: 'Task added'}))
                return {task: res.data.data.item}
            } else {
                return handleServerAppError(res.data, thunkAPI)
            }
        } catch (e: any) {
            return handleServerNetworkError(e, thunkAPI)
        } finally {
            dispatch(setAppStatus({status: 'idle'}))
        }
    })
export const updateTask = createAsyncThunk<{
    taskId: string,
    model: UpdateDomainTaskModelType,
    todolistId: string
}, { taskId: string, domainModel: UpdateDomainTaskModelType, todolistId: string }, ThunkError>(
    'tasks/updateTask', async ({taskId, domainModel, todolistId}, thunkAPI) => {
        const {dispatch, getState,rejectWithValue} = thunkAPI
        const state = getState() as AppRootStateType
        const task = state.tasks[todolistId].find(t => t.id === taskId)
        if (!task) {
            return rejectWithValue({errors: ['error']})
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

        dispatch(setAppStatus({status: 'loading'}))
        try {
            const res = await todolistsAPI.updateTask(todolistId, taskId, apiModel)
            if (res.data.resultCode === 0) {
                dispatch(setAppStatus({status: 'succeeded'}))
                dispatch(setAppSuccess({success: 'Task changed'}))
                return {
                    taskId: taskId,
                    model: domainModel,
                    todolistId: todolistId
                }
            } else {
                return handleServerAppError(res.data, thunkAPI);
            }
        } catch (e: any) {
            return handleServerNetworkError(e, thunkAPI);
        } finally {
            dispatch(setAppStatus({status: 'idle'}))
        }
    })

// slice
export const slice = createSlice({
    name: 'tasks',
    initialState: {} as TasksStateType,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(addTodolist.fulfilled, (state, action) => {
            state[action.payload.todolist.id] = []
        })
        builder.addCase(removeTodolist.fulfilled, (state, action) => {
            delete state[action.payload.id]
        })
        builder.addCase(fetchTodolists.fulfilled, (state, action) => {
            action.payload.todolists.forEach((tl: TodolistType) => {
                state[tl.id] = []
            })
        })
        builder.addCase(addTask.fulfilled, (state, action) => {
            state[action.payload.task.todoListId].unshift(action.payload.task)
        })
        builder.addCase(removeTask.fulfilled, (state, action) => {
            const tasks = state[action.payload.todolistId]
            const index = tasks.findIndex(t => t.id === action.payload.taskId)
            tasks.splice(index, 1)
        })
        builder.addCase(fetchTasks.fulfilled, (state, action) => {
            state[action.payload.todolistId] = action.payload.tasks
        })
        builder.addCase(updateTask.fulfilled, (state, action) => {
            const tasks = state[action.payload.todolistId]
            const index = tasks.findIndex(t => t.id === action.payload.taskId)
            tasks[index] = {...tasks[index], ...action.payload.model}
        })
    }
})

export const tasksReducer = slice.reducer

export const tasksActions = {
    fetchTasks,
    removeTask,
    addTask,
    updateTask, ...slice.actions
}
