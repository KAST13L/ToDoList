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

// особливості створення стору з використанням redux-toolkit
export const store = configureStore({
    reducer: rootReducer,
    middleware: getDefaultMiddleware => getDefaultMiddleware().prepend(thunkMiddleware)
})

// створення хуку який дозволяє при виклику його в компонетні не уточнювати типуванням
export type RootStateType = ReturnType<typeof store.getState>
export const useAppSelector: TypedUseSelectorHook<RootStateType> = useSelector

// а це для того щоб можна було в консолі звернутися до store
// @ts-ignore
window.store = store

