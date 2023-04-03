import {tasksReducer} from '../features/Task/tasks-reducer';
import {todolistsReducer, todolistsWatcher} from '../features/Todolist/todolists-reducer';
import {combineReducers} from 'redux'
import thunkMiddleware from 'redux-thunk'
import {authReducer} from "../features/Auth/auth-reducer";
import createSagaMiddleware from 'redux-saga';
import {all} from 'redux-saga/effects';
import {appReducer, appWatcher} from './app-reducer'
import {configureStore} from "@reduxjs/toolkit";

const sagaMiddleware = createSagaMiddleware()

const rootReducer = combineReducers({
    app: appReducer,
    auth: authReducer,
    tasks: tasksReducer,
    todolists: todolistsReducer
})

export const store = configureStore({
    reducer: rootReducer,
    middleware: getDefaultMiddleware => getDefaultMiddleware().prepend(thunkMiddleware, sagaMiddleware)
})

export type AppRootStateType = ReturnType<typeof rootReducer>

sagaMiddleware.run(rootWatcher)

function* rootWatcher() {
    yield all([
        appWatcher(),
        // tasksWatcher(),
        // authWatcher(),
        todolistsWatcher()
    ])
}

// @ts-ignore
window.store = store;
