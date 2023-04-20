import {RequestStatusType, setAppStatusAC, setAppSuccessAC} from "@app/app/app-reducer";
import {todolistsAPI, TodolistType} from "@app/api/todolists-api";
import {createAsyncThunk, createSlice, PayloadAction} from "@reduxjs/toolkit";
import {handleServerAppError, handleServerNetworkError} from "@app/utils/error-utils";

// types
export type FilterValuesType = 'all' | 'active' | 'completed';
export type TodolistDomainType = TodolistType & {
    filter: FilterValuesType
    entityStatus: RequestStatusType
}

// asyncThunk
export const fetchTodolistsT = createAsyncThunk('todolist/fetchTodolists', async (arg, {dispatch,rejectWithValue}) => {
    dispatch(setAppStatusAC({status: 'loading'}))
    try {
        const res = await todolistsAPI.getTodolists()
        dispatch(setAppStatusAC({status: 'succeeded'}))
        return {todolists: res.data}
    } catch (e: any) {
        handleServerNetworkError(e, dispatch)
        return rejectWithValue({})
    } finally {
        dispatch(setAppStatusAC({status: 'idle'}))
    }
})
export const removeTodolistT = createAsyncThunk('todolist/removeTodolist', async (todolistId: string, {dispatch, rejectWithValue}) => {
    dispatch(setAppStatusAC({status: 'loading'}))
    dispatch(changeTodolistEntityStatusAC({id: todolistId, status: 'loading'}))
    try {
        await todolistsAPI.deleteTodolist(todolistId)
        dispatch(setAppStatusAC({status: 'succeeded'}))
        dispatch(setAppSuccessAC({success: 'Todolist removed'}))
        return {id: todolistId}
    } catch (e: any) {
        handleServerNetworkError(e, dispatch)
        return rejectWithValue({})
    } finally {
        dispatch(setAppStatusAC({status: 'idle'}))
    }
})
export const addTodolistT = createAsyncThunk('todolist/addTodolist', async (title: string, {dispatch, rejectWithValue}) => {
    dispatch(setAppStatusAC({status: 'loading'}))
    try {
        const res = await todolistsAPI.createTodolist(title)
        if (res.data.resultCode === 0) {
            dispatch(setAppStatusAC({status: 'succeeded'}))
            dispatch(setAppSuccessAC({success: 'Todolist added'}))
            return {todolist: res.data.data.item}
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
export const changeTodolistTitleT = createAsyncThunk('todolist/changeTodolistTitle', async ({id,title}: {id: string, title: string}, {dispatch, rejectWithValue}) => {
    dispatch(setAppStatusAC({status: 'loading'}))
    try {
        const res = await todolistsAPI.updateTodolist(id, title)
        if (res.data.resultCode === 0) {
            dispatch(setAppStatusAC({status: 'succeeded'}))
            dispatch(setAppSuccessAC({success: 'Todolist title changed'}))
            return {id, title}
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


export const slice = createSlice({
    name: 'todolist',
    initialState: [] as TodolistDomainType[],
    reducers: {
        changeTodolistFilterAC(state, action: PayloadAction<{ id: string, filter: FilterValuesType }>) {
            const index = state.findIndex( tl => tl.id === action.payload.id)
            state[index].filter = action.payload.filter
        },
        changeTodolistEntityStatusAC(state, action: PayloadAction<{ id: string, status: RequestStatusType }>) {
            const index = state.findIndex( tl => tl.id === action.payload.id)
            state[index].entityStatus = action.payload.status
        }
    },
    extraReducers: (builder) => {
        builder.addCase(fetchTodolistsT.fulfilled, (state, action) => {
            return action.payload.todolists.map(tl => ({...tl, filter: 'all', entityStatus: 'idle'}))
        })
        builder.addCase(removeTodolistT.fulfilled, (state, action) => {
            state.filter(tl => tl.id !== action.payload.id)
            const index = state.findIndex( tl => tl.id === action.payload.id)
            state.splice(index,1)
        })
        builder.addCase(addTodolistT.fulfilled, (state, action) => {
            state.unshift({...action.payload.todolist, entityStatus: 'idle', filter:'all'})
        })
        builder.addCase(changeTodolistTitleT.fulfilled, (state, action) => {
            const index = state.findIndex( tl => tl.id === action.payload.id)
            state[index].title = action.payload.title
        })
    }
})

export const {
    changeTodolistEntityStatusAC,
    changeTodolistFilterAC
} = slice.actions
export const todolistsReducer = slice.reducer

export const todolistActions = {fetchTodolistsT, removeTodolistT, addTodolistT, changeTodolistTitleT, ...slice.actions}