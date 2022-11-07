import {combineReducers} from 'redux'
import thunkMiddleware from 'redux-thunk'
import {appReducer} from '../features/Application'
import {authReducer} from '../features/Auth'
import {tasksReducer, todolistsReducer} from '../features/TodolistsList'
import {configureStore} from '@reduxjs/toolkit'

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


// а це для того щоб можна було в консолі звернутися до store
// @ts-ignore
window.store = store

