import {combineReducers} from 'redux'
import thunkMiddleware from 'redux-thunk'
import {appReducer} from '../features/Application'
import {authReducer} from '../features/Auth'
import {tasksReducer, todolistsReducer} from '../features/TodolistsList'
import {configureStore} from '@reduxjs/toolkit'
import {TypedUseSelectorHook, useSelector} from "react-redux";

// обєднуємо редюсери за допомогою combineReducers,
export const rootReducer = combineReducers({
    app: appReducer,
    auth: authReducer,
    todolists: todolistsReducer,
    tasks: tasksReducer
})
// створюємо store
//export const store = createStore(rootReducer, applyMiddleware(thunkMiddleware));

export const store = configureStore({
    reducer: rootReducer,
    middleware: getDefaultMiddleware => getDefaultMiddleware().prepend(thunkMiddleware)
})

export type RootStateType = ReturnType<typeof store.getState>
export const useAppSelector: TypedUseSelectorHook<RootStateType> = useSelector

// а это, чтобы можно было в консоли браузера обращаться к store в любой момент
// @ts-ignore
window.store = store

