import React, {useEffect} from 'react'
import {useSelector} from 'react-redux'
import {ErrorSnackbar} from '../common/components/ErrorSnackbar/ErrorSnackbar'
import {Route, Routes} from "react-router-dom";
import {Login} from "@app/features/Auth/Login/login.component";
import {TodolistsList} from "@app/features/TodolistList/todolistsList.component";
import {Header} from "@app/features/Header/header.component";
import {selectIsInitialized} from "@app/app/selectors";
import {Loader} from "@app/common/components/Loader/Loader";
import {authThunks} from "@app/features/Auth/auth.reducer";
import {useActions} from "@app/common/hooks/useActions";

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