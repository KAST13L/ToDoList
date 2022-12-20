import React, {useEffect} from 'react'
import {useDispatch, useSelector} from 'react-redux'
import LinearProgress from '@mui/material/LinearProgress';
import {ErrorSnackbar} from '../components/ErrorSnackbar/ErrorSnackbar'
import {Navigate, Route, Routes} from "react-router-dom";
import {Login} from "../features/TodolistsList/Login/Login";
import {CircularProgress} from "@mui/material";
import {logoutWorkerSagaAC} from "../features/TodolistsList/Login/auth-reducer";
import {TodolistsList} from "../features/TodolistsList/TodolistsList";
import {initializeAppWSAC, RequestStatusType} from "./app-reducer";
import {AppRootStateType} from "./store";


const selectStatus = (state: AppRootStateType): RequestStatusType => state.app.status
const selectIsInitialized = (state: AppRootStateType): boolean => state.app.isInitialized
const selectIsLoggedIn = (state: AppRootStateType): boolean => state.auth.isLoggedIn

export const App = () => {
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
                }} >Log out </button>}
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