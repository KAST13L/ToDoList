import {todolistsAPI, TodolistType} from '../../api/todolists-api'
import {RequestStatusType, setAppStatusAC} from '../../app/app-reducer'
import {createAsyncThunk, createSlice, PayloadAction} from "@reduxjs/toolkit";
import {handleServerNetworkError} from "../../utils/error-utils";

// async thunks
export const fetchTodolistsTC = createAsyncThunk('todolist/fetchTodolists', async (arg, {dispatch, rejectWithValue}) => {
    dispatch(setAppStatusAC({status: 'loading'}))
    const res = await todolistsAPI.getTodolists()
    try {
        dispatch(setAppStatusAC({status: 'succeeded'}))
        return {todolists: res.data}
    } catch (e: any) {
        handleServerNetworkError(e, dispatch)
        return rejectWithValue(null)
    }

})
export const removeTodolistTC = createAsyncThunk('todolist/removeTodolist', async (todolistId: string, {dispatch, rejectWithValue}) => {
    dispatch(setAppStatusAC({status: 'loading'}))
    dispatch(changeTodolistEntityStatusAC({id: todolistId, status: 'loading'}))
    const res = await todolistsAPI.deleteTodolist(todolistId)
    try {
        dispatch(setAppStatusAC({status: 'succeeded'}))
        return {id: todolistId}
    } catch (e: any) {
        handleServerNetworkError(e, dispatch)
        return rejectWithValue(null)
    }
})
export const addTodolistTC = createAsyncThunk('todolist/addTodolist', async (title:string, {dispatch, rejectWithValue}) => {
    dispatch(setAppStatusAC({status: 'loading'}))
    const res = await todolistsAPI.createTodolist(title)
    try {
        dispatch(setAppStatusAC({status: 'succeeded'}))
        return {todolist: res.data.data.item}
    } catch (e: any) {
        handleServerNetworkError(e, dispatch)
        return rejectWithValue(null)
    }
})
export const changeTodolistTitleTC = createAsyncThunk('todolist/changeTodolist', async ({id, title}: {id: string, title: string}, {dispatch, rejectWithValue}) => {
    const res = await todolistsAPI.updateTodolist(id, title)
    try {
        return {id, title}
    } catch (e: any) {
        handleServerNetworkError(e, dispatch)
        return rejectWithValue(null)
    }
})


const slice = createSlice({
    name: 'todolist',
    initialState: [] as Array<TodolistDomainType>,
    reducers: {
        changeTodolistFilterAC(state, action: PayloadAction<{ id: string, filter: FilterValuesType }>) {
            return state.map(tl => tl.id === action.payload.id ? {...tl, filter: action.payload.filter} : tl)
        },
        changeTodolistEntityStatusAC(state, action: PayloadAction<{ id: string, status: RequestStatusType }>) {
            return state.map(tl => tl.id === action.payload.id ? {...tl, entityStatus: action.payload.status} : tl)
        },
    },
    extraReducers: builder => {
        builder.addCase(fetchTodolistsTC.fulfilled, (state, action) => {
            return action.payload.todolists.map(tl => ({...tl, filter: 'all', entityStatus: 'idle'}))
        });
        builder.addCase(removeTodolistTC.fulfilled, (state, action) => {
            return state.filter(tl => tl.id !== action.payload.id)
        });
        builder.addCase(addTodolistTC.fulfilled, (state, action) => {
            state.unshift({...action.payload.todolist, filter: 'all', entityStatus: 'idle'})
        });
        builder.addCase(changeTodolistTitleTC.fulfilled, (state, action) => {
            return state.map(tl => tl.id === action.payload.id ? {...tl, title: action.payload.title} : tl)
        });
    }
})

export const todolistReducer = slice.reducer
export const {
    changeTodolistFilterAC,
    changeTodolistEntityStatusAC
} = slice.actions


// types
export type FilterValuesType = 'all' | 'active' | 'completed';
export type TodolistDomainType = TodolistType & {
    filter: FilterValuesType
    entityStatus: RequestStatusType
}