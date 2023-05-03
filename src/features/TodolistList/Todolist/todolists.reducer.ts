import {appActions, RequestStatusType} from "@app/app/app.reducer";
import {todolistsAPI, TodolistType} from "@app/features/TodolistList/todolists-api";
import {createAsyncThunk, createSlice, PayloadAction} from "@reduxjs/toolkit";
import {handleServerAppError, handleServerNetworkError} from "@app/common/utils/error-utils";
import {ThunkError} from "@app/common/hooks/useActions";

// types
export type FilterValuesType = 'all' | 'active' | 'completed';
export type TodolistDomainType = TodolistType & {
    filter: FilterValuesType
    entityStatus: RequestStatusType
}

// asyncThunk
export const fetchTodolists = createAsyncThunk<{ todolists: TodolistType[] }, undefined, ThunkError>(
    'todolist/fetchTodolists', async (arg, thunkAPI) => {
        const {dispatch} = thunkAPI
        dispatch(appActions.setAppStatus({status: 'loading'}))
        try {
            const res = await todolistsAPI.getTodolists()
            dispatch(appActions.setAppStatus({status: 'succeeded'}))
            return {todolists: res.data}
        } catch (e: any) {
            return handleServerNetworkError(e, thunkAPI)
        }
    })
export const removeTodolist = createAsyncThunk<{ id: string }, string, ThunkError>(
    'todolist/removeTodolist', async (todolistId, thunkAPI) => {
        const {dispatch} = thunkAPI
        dispatch(appActions.setAppStatus({status: 'loading'}))
        dispatch(todolistsActions.changeTodolistEntityStatus({id: todolistId, status: 'loading'}))
        try {
            await todolistsAPI.deleteTodolist(todolistId)
            dispatch(appActions.setAppSuccess({success: 'TodolistList removed'}))
            return {id: todolistId}
        } catch (e: any) {
            return handleServerNetworkError(e, thunkAPI)
        }
    })
export const addTodolist = createAsyncThunk<{ todolist: TodolistType }, string, ThunkError>(
    'todolist/addTodolist', async (title, thunkAPI) => {
        const {dispatch} = thunkAPI
        dispatch(appActions.setAppStatus({status: 'loading'}))
        try {
            const res = await todolistsAPI.createTodolist(title)
            if (res.data.resultCode === 0) {
                dispatch(appActions.setAppSuccess({success: 'TodolistList added'}))
                return {todolist: res.data.data.item}
            } else {
                return handleServerAppError(res.data, thunkAPI)
            }
        } catch (e: any) {
            return handleServerNetworkError(e, thunkAPI)
        }
    })
export const changeTodolistTitle = createAsyncThunk<{ id: string, title: string }, { id: string, title: string }, ThunkError>(
    'todolist/changeTodolistTitle', async ({id, title}, thunkAPI) => {
        const {dispatch} = thunkAPI
        dispatch(appActions.setAppStatus({status: 'loading'}))
        try {
            const res = await todolistsAPI.updateTodolist(id, title)
            if (res.data.resultCode === 0) {
                dispatch(appActions.setAppSuccess({success: 'TodolistList title changed'}))
                return {id, title}
            } else {
                return handleServerAppError(res.data, thunkAPI)
            }
        } catch (e: any) {
            return handleServerNetworkError(e, thunkAPI)
        }
    })

export const slice = createSlice({
    name: 'todolist',
    initialState: [] as TodolistDomainType[],
    reducers: {
        changeTodolistFilter(state, action: PayloadAction<{ id: string, filter: FilterValuesType }>) {
            const index = state.findIndex(tl => tl.id === action.payload.id)
            state[index].filter = action.payload.filter
        },
        changeTodolistEntityStatus(state, action: PayloadAction<{ id: string, status: RequestStatusType }>) {
            const index = state.findIndex(tl => tl.id === action.payload.id)
            state[index].entityStatus = action.payload.status
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchTodolists.fulfilled, (state, action) => {
                return action.payload.todolists.map(tl => ({
                    ...tl,
                    filter: 'all',
                    entityStatus: 'idle'
                }))
            })
            .addCase(removeTodolist.fulfilled, (state, action) => {
                state.filter(tl => tl.id !== action.payload.id)
                const index = state.findIndex(tl => tl.id === action.payload.id)
                state.splice(index, 1)
            })
            .addCase(addTodolist.fulfilled, (state, action) => {
                state.unshift({
                    ...action.payload.todolist,
                    entityStatus: 'idle',
                    filter: 'all'
                })
            })
            .addCase(changeTodolistTitle.fulfilled, (state, action) => {
                const index = state.findIndex(tl => tl.id === action.payload.id)
                state[index].title = action.payload.title
            })
    }
})

export const todolistsReducer = slice.reducer
export const todolistsActions = slice.actions
export const todolistsThunks = {fetchTodolists,removeTodolist,addTodolist,changeTodolistTitle}
