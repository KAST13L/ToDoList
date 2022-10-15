import {TaskPriorities, TaskStatuses, TaskType, todolistsAPI, UpdateTaskModelType} from '../../api/todolists-api'
import {AppRootStateType} from '../../app/store'
import {setAppStatusAC} from '../../app/app-reducer'
import {handleServerAppError, handleServerNetworkError} from '../../utils/error-utils'
import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import {addTodolistTC, fetchTodolistsTC, removeTodolistTC} from "./todolists-reducer";

// async thunks
export const fetchTasksTC = createAsyncThunk('tasks/fetchTasks', async (todolistId: string, thunkAPI) => {
    thunkAPI.dispatch(setAppStatusAC({status: 'loading'}))
    const res = await todolistsAPI.getTasks(todolistId)
    const tasks = res.data.items
    thunkAPI.dispatch(setAppStatusAC({status: 'succeeded'}))
    return {tasks, todolistId}

})
export const removeTaskTC = createAsyncThunk('tasks/removeTask', async ({taskId, todolistId}: {taskId: string, todolistId: string}, thunkAPI) => {
    const res = await todolistsAPI.deleteTask(todolistId, taskId)
    return {taskId, todolistId}
})
export const addTaskTC = createAsyncThunk('tasks/addTask',async ({title, todolistId}: {title: string, todolistId: string}, {dispatch,rejectWithValue}) => {
    dispatch(setAppStatusAC({status: 'loading'}))
    const res = await todolistsAPI.createTask(todolistId, title)
    try {
        if (res.data.resultCode === 0) {
            const task = res.data.data.item
            dispatch(setAppStatusAC({status: 'succeeded'}))
            return {task}
        } else {
            handleServerAppError(res.data, dispatch);
            return rejectWithValue(null)
        }
    } catch (error: any) {
        handleServerNetworkError(error, dispatch)
        return rejectWithValue(null)
    }
})
export const updateTaskTC = createAsyncThunk('tasks/updateTask', async ({taskId, domainModel, todolistId}:{taskId: string, domainModel: UpdateDomainTaskModelType, todolistId: string}, {dispatch, getState, rejectWithValue}) => {
    const state = getState() as AppRootStateType;
    const task = state.tasks[todolistId].find(t => t.id === taskId)
    if (!task) {
        console.warn('task not found in the state')
        return rejectWithValue(null)
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

    const res = await todolistsAPI.updateTask(todolistId, taskId, apiModel)
    if (res.data.resultCode === 0) {
        return {taskId, model: domainModel, todolistId}
    } else {
        handleServerAppError(res.data, dispatch);
        rejectWithValue(null)
    }
    return rejectWithValue(null)
})

const slice = createSlice({
    name: 'task',
    initialState: {} as TasksStateType,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(addTodolistTC.fulfilled, (state, action) => {
            return {...state, [action.payload.todolist.id]: []}
        });
        builder.addCase(removeTodolistTC.fulfilled, (state, action) => {
            const copyState = {...state}
            delete copyState[action.payload.id]
            return copyState
        });
        builder.addCase(fetchTodolistsTC.fulfilled, (state, action) => {
            const copyState = {...state}
            action.payload.todolists.forEach((tl: any) => {
                copyState[tl.id] = []
            })
            return copyState
        });
        builder.addCase(fetchTasksTC.fulfilled, (state, action) => {
            return {...state, [action.payload.todolistId]: action.payload.tasks}
        });
        builder.addCase(removeTaskTC.fulfilled, (state, action) => {
            return {
                ...state, [action.payload.todolistId]: state[action.payload.todolistId].filter(t => t.id !== action.payload.taskId)
            }
        });
        builder.addCase(addTaskTC.fulfilled, (state, action) => {
            return {
                ...state,
                [action.payload.task.todoListId]: [action.payload.task, ...state[action.payload.task.todoListId]]
            }
        });
        builder.addCase(updateTaskTC.fulfilled, (state, action) => {
            return {
                ...state,
                [action.payload.todolistId]: state[action.payload.todolistId]
                    .map(t => t.id === action.payload.taskId ? {...t, ...action.payload.model} : t)
            }
        })
    }
})

export const tasksReducer = slice.reducer
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
