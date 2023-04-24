import {tasksReducer} from '../features/Task/tasks-reducer';
import {todolistsReducer} from '../features/Todolist/todolists-reducer';
import {ActionCreatorsMapObject, bindActionCreators, combineReducers} from 'redux'
import thunkMiddleware from 'redux-thunk'
import {authReducer} from "../features/Auth/auth-reducer";
import {appReducer} from './app-reducer'
import {configureStore} from "@reduxjs/toolkit";
import {useDispatch} from "react-redux";
import {useMemo} from "react";
import {FieldErrorType} from "@app/api/types";

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

export function useActions<T extends ActionCreatorsMapObject>(actions: T) {
    const dispatch = useAppDispatch()
    return useMemo(() => {
        return bindActionCreators(actions, dispatch)
    }, [])
}

export type ThunkError = { rejectValue: { errors: string[], fieldsErrors?: FieldErrorType[]} }

// @ts-ignore
window.store = store;

