import {
    TaskPriorities,
    TaskStatuses,
    TaskType,
    todolistsAPI,
    UpdateTaskModelType
} from '@app/api/todolists-api'
import {setAppStatusAC, setAppSuccessAC} from '@app/app/app-reducer'
import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import {handleServerAppError, handleServerNetworkError} from "@app/utils/error-utils";
import {AppRootStateType} from "@app/app/store";
import {
    addTodolistT,
    fetchTodolistsT,
    removeTodolistT
} from "@app/features/Todolist/todolists-reducer";

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
const fetchTasksT = createAsyncThunk('tasks/fetchTasks', async (todolistId: string, {dispatch, rejectWithValue}) => {
    dispatch(setAppStatusAC({status:'loading'}))
    try {
        const data = await todolistsAPI.getTasks(todolistId)
        dispatch(setAppStatusAC({status: 'succeeded'}))
        return {tasks: data.items, todolistId: todolistId}
    } catch (e: any) {
        handleServerNetworkError(e, dispatch)
        return rejectWithValue({})
    } finally {
        dispatch(setAppStatusAC({status: 'idle'}))
    }
})
const removeTaskT = createAsyncThunk('tasks/removeTask', async ({taskId, todolistId}: {taskId: string, todolistId: string}, {dispatch,rejectWithValue}) => {
    dispatch(setAppStatusAC({status: 'loading'}))
    try {
        await todolistsAPI.deleteTask(todolistId, taskId);
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
const addTaskT = createAsyncThunk('tasks/addTask', async ({title, todolistId}: {title: string, todolistId: string}, {dispatch,rejectWithValue}) => {
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
const updateTaskT= createAsyncThunk('tasks/updateTask', async ({taskId,domainModel,todolistId}: {taskId: string, domainModel: UpdateDomainTaskModelType, todolistId: string}, {dispatch, getState, rejectWithValue} ) => {
    const state = getState() as AppRootStateType
    const task = state.tasks[todolistId].find(t => t.id === taskId)
    if (!task) {
        return rejectWithValue('task not found in the state')
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
    try {
        const res = await todolistsAPI.updateTask(todolistId,taskId, apiModel)
        if (res.data.resultCode === 0) {
            dispatch(setAppStatusAC({status: 'succeeded'}))
            dispatch(setAppSuccessAC({success: 'Task changed'}))
            return {
                taskId: taskId,
                model: domainModel,
                todolistId: todolistId
            }
        } else {
            handleServerAppError(res.data, dispatch);
            return rejectWithValue({})
        }
    } catch (e: any) {
       handleServerNetworkError(e, dispatch);
        return rejectWithValue({})
    } finally {
        dispatch(setAppStatusAC({status: 'idle'}))
    }
})

// slice
export const slice = createSlice({
    name: 'tasks',
    initialState: {} as TasksStateType,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(addTodolistT.fulfilled, (state, action) => {
            state[action.payload.todolist.id] = []
        })
        builder.addCase(removeTodolistT.fulfilled, (state, action) => {
            delete state[action.payload.id]
        })
        builder.addCase(fetchTodolistsT.fulfilled, (state, action) => {
            action.payload.todolists.forEach(tl => {
                state[tl.id] = []
            })
        })
        builder.addCase(addTaskT.fulfilled, (state, action) => {
            state[action.payload.task.todoListId].unshift(action.payload.task)
        })
        builder.addCase(removeTaskT.fulfilled, (state, action) => {
            const tasks = state[action.payload.todolistId]
            const index = tasks.findIndex(t => t.id === action.payload.taskId)
            tasks.splice(index, 1)
        })
        builder.addCase(fetchTasksT.fulfilled, (state, action) => {
            state[action.payload.todolistId] = action.payload.tasks
        })
        builder.addCase(updateTaskT.fulfilled, (state, action) => {
            const tasks = state[action.payload.todolistId]
            const index = tasks.findIndex(t => t.id === action.payload.taskId)
            tasks[index] = {...tasks[index], ...action.payload.model}
        })
    }
})

export const tasksReducer = slice.reducer

export const tasksActions = {fetchTasksT, removeTaskT, addTaskT, updateTaskT, ...slice.actions }
