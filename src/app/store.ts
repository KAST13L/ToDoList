import {tasksReducer} from '../features/Task/tasks-reducer';
import {todolistsReducer} from '../features/Todolist/todolists-reducer';
import {combineReducers} from 'redux'
import thunkMiddleware from 'redux-thunk'
import {authReducer} from "../features/Auth/auth-reducer";
import {appReducer} from './app-reducer'
import {configureStore} from "@reduxjs/toolkit";
import {useDispatch} from "react-redux";

const rootReducer = combineReducers({
    app: appReducer,
    auth: authReducer,
    tasks: tasksReducer,
    todolists: todolistsReducer
})

export const store = configureStore({
    reducer: rootReducer,
    middleware: getDefaultMiddleware => getDefaultMiddleware().prepend(thunkMiddleware)
})

export type AppRootStateType = ReturnType<typeof rootReducer>

export type AppDispatch = typeof store.dispatch;
export const useAppDispatch = () => useDispatch<AppDispatch>();


// @ts-ignore
window.store = store;

