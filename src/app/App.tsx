import React, {useEffect} from 'react'
import {useSelector} from 'react-redux'
import {ErrorSnackbar} from '../components/ErrorSnackbar/ErrorSnackbar'
import {Route, Routes} from "react-router-dom";
import {Login} from "@app/features/Auth/login.component";
import {TodolistsList} from "@app/features/TodolistsList/todolistsList.component";
import {Header} from "@app/features/Header/header.component";
import {selectIsInitialized} from "@app/app/selectors";
import {useActions} from "@app/app/store";
import {Loader} from "@app/components/Loader/Loader";
import {authThunks} from "@app/features/Auth/auth.reducer";

export const App: React.FC = () => {

    const isInitialized = useSelector(selectIsInitialized)
    const {initializeApp} = useActions(authThunks)

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