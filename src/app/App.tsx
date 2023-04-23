import React, {FC, useEffect} from 'react'
import {useSelector} from 'react-redux'
import {ErrorSnackbar} from '../components/ErrorSnackbar/ErrorSnackbar'
import {Navigate, Route, Routes} from "react-router-dom";
import {CircularProgress} from "@mui/material";
import {appActions} from "./app-reducer";
import {Login} from "@app/features/Auth/login.component";
import {TodolistsList} from "@app/features/TodolistsList/todolistsList.component";
import {Header} from "@app/features/Header/header.component";
import {selectIsInitialized} from "@app/app/selectors";
import {useActions} from "@app/app/store";

type AppPropsType = {
    demo?: boolean
}

export const App: FC<AppPropsType> = ({demo = false}) => {

    const isInitialized = useSelector(selectIsInitialized)
    const {initializeApp} = useActions(appActions)

    useEffect(() => {
        initializeApp()
    }, [])

    if (!demo && !isInitialized) {
        return <div className="fixed w-[100%] text-center top-[30%]"><CircularProgress/>
        </div>
    }
    return (
        <span>
            <ErrorSnackbar/>
            <Header demo={demo}/>
            <div className='mx-8'>
                <Routes>
                    <Route path='/todolist' element={<TodolistsList/>}/>
                    <Route path='/' element={<TodolistsList/>}/>
                    <Route path='/login' element={<Login/>}/>
                    <Route path='/404' element={<h1>404: PAGE NOT FOUND</h1>}/>
                    <Route path='*' element={<Navigate to={'/404'}/>}/>
                </Routes>
            </div>
        </span>
    )
}