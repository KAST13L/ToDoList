import React, {FC, useEffect} from 'react'
import {useSelector} from 'react-redux'
import {ErrorSnackbar} from '../components/ErrorSnackbar/ErrorSnackbar'
import {Route, Routes} from "react-router-dom";
import {appActions} from "./app.reducer";
import {Login} from "@app/features/Auth/login.component";
import {TodolistsList} from "@app/features/TodolistsList/todolistsList.component";
import {Header} from "@app/features/Header/header.component";
import {selectIsInitialized} from "@app/app/selectors";
import {useActions} from "@app/app/store";
import {Loader} from "@app/components/Loader/Loader";

export const App: FC = () => {

    const isInitialized = useSelector(selectIsInitialized)
    const {initializeApp} = useActions(appActions)

    useEffect(() => {
        initializeApp()
    }, [])

    if (!isInitialized) return <Loader/>

    return (
        <span>
            <ErrorSnackbar/>
            <Header/>
            <div className='mx-8'>
                <Routes>
                    <Route path='/' element={<TodolistsList/>}/>
                    <Route path='/login' element={<Login/>}/>
                </Routes>
            </div>
        </span>
    )
}