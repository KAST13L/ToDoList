import {tasksReducer} from '../features/TodolistList/Todolist/Task/tasks.reducer';
import {todolistsReducer} from '../features/TodolistList/Todolist/todolists.reducer';
import {AnyAction, combineReducers} from 'redux'
import thunkMiddleware, {ThunkDispatch} from 'redux-thunk'
import {authReducer} from "../features/Auth/auth.reducer";
import {appReducer} from './app.reducer'
import {configureStore} from "@reduxjs/toolkit";

const rootReducer = combineReducers({
    app: appReducer,
    auth: authReducer,
    tasks: tasksReducer,
    todolists: todolistsReducer
})

export const store = configureStore({
    reducer: rootReducer,
})

export type AppRootStateType = ReturnType<typeof rootReducer>
export type AppDispatch = ThunkDispatch<AppRootStateType, unknown, AnyAction>

// @ts-ignore
window.store = store;
