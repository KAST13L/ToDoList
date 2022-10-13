import React, {useEffect} from 'react'
import './App.css'
import {TodolistsList} from '../features/TodolistsList/TodolistsList'
import {useDispatch, useSelector} from 'react-redux'
import {AppRootStateType, useAppSelector} from './store'
import {initializeAppTC, RequestStatusType} from './app-reducer'
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import LinearProgress from '@mui/material/LinearProgress';
import {Menu} from '@mui/icons-material';
import {ErrorSnackbar} from '../components/ErrorSnackbar/ErrorSnackbar'
import {Navigate, Route, Routes} from "react-router-dom";
import {Login} from "../features/TodolistsList/Login/Login";
import {CircularProgress} from "@mui/material";
import {logoutTC} from "../features/TodolistsList/Login/auth-reducer";

type PropsType = {
    demo?: boolean
}

function App({demo = false}: PropsType) {
    const status = useAppSelector((state) => state.app.status)
    const isInitialized = useAppSelector( state => state.app.isInitialized)
    const isLoggedIn = useAppSelector( state => state.auth.isLoggedIn)
    const dispatch = useDispatch()

    useEffect(()=>{

        dispatch(initializeAppTC())
    },[])

    if (!isInitialized) {
        return <div
            style={{position: 'fixed', top: '30%', textAlign: 'center', width: '100%'}}>
            <CircularProgress/>
        </div>
    }

    return (
        <div className="App">
            <ErrorSnackbar/>
            <AppBar position="static">
                <Toolbar>
                    <IconButton edge="start" color="inherit" aria-label="menu">
                        <Menu/>
                    </IconButton>
                    <Typography variant="h6">
                        News
                    </Typography>
                    {isLoggedIn && <Button onClick={()=>{dispatch(logoutTC())}} color="inherit">Log out </Button> }
                </Toolbar>
                <div style={{height:'5px'}}>
                    {status === 'loading' && <LinearProgress/>}
                </div>
            </AppBar>
            <Container fixed>
                <Routes>
                    <Route path='/' element={<TodolistsList/>}/>
                    <Route path='/login' element={<Login/>}/>
                    <Route path='/404' element={<h1>404: PAGE NOT FOUND</h1>}/>
                    <Route path='*' element={<Navigate to={'/404'}/>} />
                </Routes>
            </Container>

        </div>
    )
}

export default App
