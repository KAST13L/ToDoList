import {
    TaskPriorities,
    TaskStatuses,
    TaskType,
    todolistsAPI,
    UpdateTaskModelType
} from '../../api/todolists-api'
import {Dispatch} from 'redux'
import {AppRootStateType} from '../../app/store'
import {setAppStatusAC} from '../../app/app-reducer'
import {handleServerAppError, handleServerNetworkError} from '../../utils/error-utils'
import {createAsyncThunk, createSlice, PayloadAction} from "@reduxjs/toolkit";
import {addTodolistAC, removeTodolistAC, setTodolistsAC} from "./todolists-reducer";

const initialState: TasksStateType = {}

export const fetchTasksTC = createAsyncThunk('tasks/fetchTusks', (todolistId: string,thunkAPI) => {
    thunkAPI.dispatch(setAppStatusAC({status: 'loading'}))
    return todolistsAPI.getTasks(todolistId)
        .then((res) => {
            const tasks = res.data.items
            /*thunkAPI.dispatch(setTasksAC({tasks, todolistId}))*/
            thunkAPI.dispatch(setAppStatusAC({status: 'succeeded'}))
            return {tasks, todolistId}
        })
} )


const slice = createSlice({
    name: 'task',
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
        }
    },
    extraReducers: (builder) => {
        builder.addCase(addTodolistAC, (state, action) => {
            return {...state, [action.payload.todolist.id]: []}
        });
        builder.addCase(removeTodolistAC, (state, action) => {
            const copyState = {...state}
            delete copyState[action.payload.id]
            return copyState
        });
        builder.addCase(setTodolistsAC, (state, action) => {
            const copyState = {...state}
            action.payload.todolists.forEach((tl: any) => {
                copyState[tl.id] = []
            })
            return copyState
        });
        builder.addCase(fetchTasksTC.fulfilled, (state, action) => {
            return {...state, [action.payload.todolistId]: action.payload.tasks}
        });
    }
})

export const tasksReducer = slice.reducer
export const {removeTaskAC, updateTaskAC, addTaskAC} = slice.actions

// thunks

export const removeTaskTC = (taskId: string, todolistId: string) => (dispatch: Dispatch) => {
    todolistsAPI.deleteTask(todolistId, taskId)
        .then(() => {
            const action = removeTaskAC({taskId, todolistId})
            dispatch(action)
        })
}
export const addTaskTC = (title: string, todolistId: string) => (dispatch: Dispatch) => {
    dispatch(setAppStatusAC({status: 'loading'}))
    todolistsAPI.createTask(todolistId, title)
        .then(res => {
            if (res.data.resultCode === 0) {
                const task = res.data.data.item
                const action = addTaskAC({task})
                dispatch(action)
                dispatch(setAppStatusAC({status: 'succeeded'}))
            } else {
                handleServerAppError(res.data, dispatch);
            }
        })
        .catch((error) => {
            handleServerNetworkError(error, dispatch)
        })
}
export const updateTaskTC = (taskId: string, domainModel: UpdateDomainTaskModelType, todolistId: string) =>
    (dispatch: Dispatch, getState: () => AppRootStateType) => {
        const state = getState()
        const task = state.tasks[todolistId].find(t => t.id === taskId)
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
            ...domainModel
        }

        todolistsAPI.updateTask(todolistId, taskId, apiModel)
            .then(res => {
                if (res.data.resultCode === 0) {
                    const action = updateTaskAC({taskId, model: domainModel, todolistId})
                    dispatch(action)
                } else {
                    handleServerAppError(res.data, dispatch);
                }
            })
            .catch((error) => {
                handleServerNetworkError(error, dispatch);
            })
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
