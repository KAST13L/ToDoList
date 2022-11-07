import React, {useCallback, useEffect} from 'react'
import './App.module.scss'
import {AppBar, Button, CircularProgress, Container, LinearProgress, Toolbar, Typography} from '@material-ui/core'
import {todolistsActions, TodolistsList} from '../features/TodolistsList'
import {ErrorSnackbar} from '../components/ErrorSnackbar/ErrorSnackbar'
import {useSelector} from 'react-redux'
import {appActions} from '../features/Application'
import {Route} from 'react-router-dom'
import {authActions, authSelectors, Login} from '../features/Auth'
import {selectIsInitialized, selectStatus} from '../features/Application/selectors'
import {useActions, useAppDispatch} from '../utils/redux-utils'
import {AddItemForm, AddItemFormSubmitHelperType} from "../components/AddItemForm/AddItemForm";
import s from './App.module.scss'

type PropsType = {
    demo?: boolean
}

export const App = ({demo = false}: PropsType) => {
    const status = useSelector(selectStatus)
    const isInitialized = useSelector(selectIsInitialized)
    const isLoggedIn = useSelector(authSelectors.selectIsLoggedIn)

    const dispatch = useAppDispatch()
    const {logout} = useActions(authActions)
    const {initializeApp} = useActions(appActions)

    useEffect(() => {
        if (!demo) {
            initializeApp()
        }
    }, [])

    const logoutHandler = useCallback(() => {
        logout()
    }, [])


    const addTodolistCallback = useCallback(async (title: string, helper: AddItemFormSubmitHelperType) => {
        let thunk = todolistsActions.addTodolistTC(title)
        const resultAction = await dispatch(thunk)

        if (todolistsActions.addTodolistTC.rejected.match(resultAction)) {
            if (resultAction.payload?.errors?.length) {
                const errorMessage = resultAction.payload?.errors[0]
                helper.setError(errorMessage)
            } else {
                helper.setError('Some error occurred')
            }
        } else {
            helper.setTitle('')
        }
    }, [])


    if (!isInitialized) {
        return <div
            style={{position: 'fixed', top: '30%', textAlign: 'center', width: '100%'}}>
            <CircularProgress/>
        </div>
    }

    return (
        <div className={s.App}>
            <ErrorSnackbar/>
            <AppBar position="fixed" color='transparent'>
                <Toolbar className={s.toolbar}>
                    <div className={s.containerAppBar}>
                        <Typography variant="h3" style={{padding:'0 20px'}}>
                            TODO LIST
                        </Typography>
                        {isLoggedIn && <AddItemForm addItem={addTodolistCallback}/>}
                    </div>
                    {isLoggedIn && <div style={{textAlign:'center', padding:'10px'}}>
                        <Button variant={'contained'} color={'secondary'} onClick={logoutHandler}>Log out</Button>
                    </div>}
                </Toolbar>
                <div style={{height: '1px'}}>{status === 'loading' && <LinearProgress/>}</div>
            </AppBar>
            <Container className={s.content}>
                <Route exact path={'/'} render={() => <TodolistsList demo={demo}/>}/>
                <Route path={'/login'} render={() => <Login/>}/>
            </Container>
        </div>
    )
}

