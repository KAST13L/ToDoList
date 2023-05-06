import {createSlice} from "@reduxjs/toolkit";
import {AppRootStateType} from "@app/app/store";
import {
    addTodolist,
    fetchTodolists,
    removeTodolist
} from "@app/features/todolist-list/todolists/todolists.reducer";
import {appActions} from "@app/app/app.reducer";
import {createAppAsyncThunk} from '@app/common/utils/create-app-async-thunk';
import {ResultCode, TaskPriorities, TaskStatuses} from "@app/common/enum/common.enums";
import {
    tasksAPI,
    TaskType,
    UpdateTaskModelType
} from "@app/features/todolist-list/tasks/task.api";
import {TodolistType} from "@app/features/todolist-list/todolists/todolists.api";

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
export const fetchTasks = createAppAsyncThunk<{ tasks: TaskType[], todolistId: string }, string>(
    'tasks/fetchTasks', async (todolistId) => {
        const data = await tasksAPI.getTasks(todolistId)
        return {tasks: data.data.items, todolistId: todolistId}
    })
export const removeTask = createAppAsyncThunk<{ taskId: string, todolistId: string }, { taskId: string, todolistId: string }>(
    'tasks/removeTask', async ({taskId, todolistId}, {dispatch, rejectWithValue}) => {
        const res = await tasksAPI.deleteTask(todolistId, taskId);
        if (res.data.resultCode === ResultCode.Success) {
            dispatch(appActions.setAppSuccess({success: 'tasks deleted'}))
            return {taskId: taskId, todolistId: todolistId}
        } else {
            return rejectWithValue({data: res.data})
        }
    }
)

export const addTask = createAppAsyncThunk<{ task: TaskType }, { title: string, todolistId: string }>(
    'tasks/addTask', async ({title, todolistId}, {dispatch, rejectWithValue}) => {
        const res = await tasksAPI.createTask(todolistId, title)
        if (res.data.resultCode === ResultCode.Success) {
            dispatch(appActions.setAppSuccess({success: 'tasks added'}))
            return {task: res.data.data.item}
        } else {
            return rejectWithValue({data: res.data})
        }
    })
export const updateTask = createAppAsyncThunk<{
    taskId: string,
    model: UpdateDomainTaskModelType,
    todolistId: string
}, { taskId: string, model: UpdateDomainTaskModelType, todolistId: string }>(
    'tasks/updateTask', async ({taskId, model, todolistId}, thunkAPI) => {
        const {dispatch, getState, rejectWithValue} = thunkAPI

        const state = getState() as AppRootStateType
        const task = state.tasks[todolistId].find(t => t.id === taskId)
        if (!task) {
            return rejectWithValue(null)
        }
        const apiModel: UpdateTaskModelType = {
            deadline: task.deadline,
            description: task.description,
            priority: task.priority,
            startDate: task.startDate,
            title: task.title,
            status: task.status,
            ...model
        }

        const res = await tasksAPI.updateTask(todolistId, taskId, apiModel)
        if (res.data.resultCode === 0) {
            dispatch(appActions.setAppSuccess({success: 'tasks changed'}))
            return {taskId, model, todolistId}
        } else {
            return rejectWithValue({data: res.data})
        }
    })

// slice
export const slice = createSlice({
    name: 'tasks',
    initialState: {} as TasksStateType,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(addTodolist.fulfilled, (state, action) => {
                state[action.payload.todolist.id] = []
            })
            .addCase(removeTodolist.fulfilled, (state, action) => {
                delete state[action.payload.id]
            })
            .addCase(fetchTodolists.fulfilled, (state, action) => {
                action.payload.todolists.forEach((tl: TodolistType) => {
                    state[tl.id] = []
                })
            })
            .addCase(addTask.fulfilled, (state, action) => {
                state[action.payload.task.todoListId].unshift(action.payload.task)
            })
            .addCase(removeTask.fulfilled, (state, action) => {
                const tasks = state[action.payload.todolistId]
                const index = tasks.findIndex(t => t.id === action.payload.taskId)
                tasks.splice(index, 1)
            })
            .addCase(fetchTasks.fulfilled, (state, action) => {
                state[action.payload.todolistId] = action.payload.tasks
            })
            .addCase(updateTask.fulfilled, (state, action) => {
                const tasks = state[action.payload.todolistId]
                const index = tasks.findIndex(t => t.id === action.payload.taskId)
                tasks[index] = {...tasks[index], ...action.payload.model}
            })
    }
})

export const tasksReducer = slice.reducer
export const tasksThunks = {fetchTasks, removeTask, addTask, updateTask}
