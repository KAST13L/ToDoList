import React, {useEffect} from 'react'
import './App.css'
import {TodolistsList} from '../features/TodolistsList/TodolistsList'
import {useDispatch, useSelector} from 'react-redux'
import {AppRootStateType} from './store'
import {initializeAppWSAC, RequestStatusType} from './app-reducer'
import AppBar from '@mui/material/AppBar';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import LinearProgress from '@mui/material/LinearProgress';
import {ErrorSnackbar} from '../components/ErrorSnackbar/ErrorSnackbar'
import {Navigate, Route, Routes} from "react-router-dom";
import {Login} from "../features/TodolistsList/Login/Login";
import {CircularProgress} from "@mui/material";
import {logoutWorkerSagaAC} from "../features/TodolistsList/Login/auth-reducer";


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
        <div className="App">
            <ErrorSnackbar/>
            <div>
                {isLoggedIn && <Button onClick={() => {
                    dispatch(logoutWorkerSagaAC())
                }} color="inherit">Log out </Button>}
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