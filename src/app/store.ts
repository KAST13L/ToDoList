import {tasksReducer} from '../features/Task/tasks-reducer';
import {todolistsReducer} from '../features/Todolist/todolists-reducer';
import {combineReducers} from 'redux'
import thunkMiddleware from 'redux-thunk'
import {authReducer} from "../features/Auth/auth-reducer";
import {appReducer} from './app-reducer'
import {configureStore} from "@reduxjs/toolkit";

// const sagaMiddleware = createSagaMiddleware()

const rootReducer = combineReducers({
    app: appReducer,
    auth: authReducer,
    tasks: tasksReducer,
    todolists: todolistsReducer
})

export const store = configureStore({
    reducer: rootReducer,
    middleware: getDefaultMiddleware => getDefaultMiddleware().prepend(thunkMiddleware) // +sagaMiddleware
})

export type AppRootStateType = ReturnType<typeof rootReducer>

// @ts-ignore
window.store = store;

/*sagaMiddleware.run(rootWatcher)

function* rootWatcher() {
    yield all([
        // appWatcher(),
        // tasksWatcher(),
        // authWatcher(),
        // todolistsWatcher()
    ])
}*/
