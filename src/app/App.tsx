import React, {useCallback, useEffect} from 'react'
import './App.css'
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

type PropsType = {
    demo?: boolean
}

function App({demo = false}: PropsType) {
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
        <div className="App">
            <ErrorSnackbar/>
            <AppBar position="static" color='transparent'>
                <Toolbar style={{display: 'flex', justifyContent: 'space-between', }}>
                    <div style={{display:'flex', flexDirection:'row', width: '750px', justifyContent:'space-between', padding: '10px'}}>
                        <Typography variant="h3">
                            TODO LIST
                        </Typography>
                        {isLoggedIn && <AddItemForm addItem={addTodolistCallback}/>}
                    </div>
                    {isLoggedIn && <Button variant={'contained'} color={'secondary'} onClick={logoutHandler}>Log out</Button>}
                </Toolbar>
                <div style={{height: '1px'}}>{status === 'loading' && <LinearProgress/>}</div>
            </AppBar>
            <Container fixed style={{paddingTop: '25px'}}>
                <Route exact path={'/'} render={() => <TodolistsList demo={demo}/>}/>
                <Route path={'/login'} render={() => <Login/>}/>
            </Container>
        </div>
    )
}

export default App
