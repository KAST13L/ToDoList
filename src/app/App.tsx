import React, {FC, useEffect} from 'react'
import {useDispatch, useSelector} from 'react-redux'
import LinearProgress from '@mui/material/LinearProgress';
import {ErrorSnackbar} from '../components/ErrorSnackbar/ErrorSnackbar'
import {Navigate, Route, Routes} from "react-router-dom";
import {CircularProgress} from "@mui/material";
import {logoutWorkerSagaAC} from "../features/Auth/auth-reducer";
import {initializeAppWSAC, RequestStatusType} from "./app-reducer";
import {AppRootStateType} from "./store";
import {Login} from "@app/features/Auth/login.component";
import {TodolistsList} from "@app/features/TodolistsList/todolistsList.component";

const selectStatus = (state: AppRootStateType): RequestStatusType => state.app.status
const selectIsInitialized = (state: AppRootStateType): boolean => state.app.isInitialized
const selectIsLoggedIn = (state: AppRootStateType): boolean => state.auth.isLoggedIn

type AppPropsType = {
    demo: boolean
}

export const App: FC<AppPropsType> = ({demo}) => {
    const status = useSelector(selectStatus)
    const isInitialized = useSelector(selectIsInitialized)
    const isLoggedIn = useSelector(selectIsLoggedIn)
    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(initializeAppWSAC())
    }, [])

    if (!isInitialized) {
        return <CircularProgress
            style={{position: 'fixed', top: '30%', textAlign: 'center', width: '100%'}}/>
    }

    return (
        <div>
            <ErrorSnackbar/>
            <div>
                {isLoggedIn && <button onClick={() => {
                    dispatch(logoutWorkerSagaAC())
                }}>Log out </button>}
                {status === 'loading' && <LinearProgress/>}
            </div>
            <Routes>
                <Route path='/' element={<TodolistsList/>}/>
                <Route path='/login' element={<Login/>}/>
                <Route path='/404' element={<h1>404: PAGE NOT FOUND</h1>}/>
                <Route path='*' element={<Navigate to={'/404'}/>}/>
            </Routes>
        </div>
    )
}