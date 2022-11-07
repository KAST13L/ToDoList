import React, {useEffect} from 'react'
import {useSelector} from 'react-redux'
import {Grid, Paper} from '@material-ui/core'
import {Todolist} from './Todolist/Todolist'
import {Redirect} from 'react-router-dom'
import {selectIsLoggedIn} from '../Auth/selectors'
import {todolistsActions} from './index'
import {useActions} from '../../utils/redux-utils'
import {useAppSelector} from "../../app/store";

type PropsType = {
    demo?: boolean
}

export const TodolistsList: React.FC<PropsType> = ({demo = false}) => {

    const todolists = useAppSelector(state => state.todolists)
    const tasks = useAppSelector(state => state.tasks)
    const isLoggedIn = useSelector(selectIsLoggedIn)

    const {fetchTodolistsTC} = useActions(todolistsActions)

    useEffect(() => {
        if (demo || !isLoggedIn) {
            return
        }
        fetchTodolistsTC()
    }, [])

    if (!isLoggedIn) {
        return <Redirect to={'/login'}/>
    }

    return <>
        <Grid container spacing={7} style={{margin:'auto'}}>
            {
                todolists.map(tl => {
                    let allTodolistTasks = tasks[tl.id]

                    return <Grid item key={tl.id}>
                        <div style={{width: '350px'}}>
                            <Paper elevation={9}>
                                <Todolist
                                    todolist={tl}
                                    tasks={allTodolistTasks}
                                    demo={demo}
                                />
                            </Paper>
                        </div>
                    </Grid>
                })
            }
        </Grid>
    </>
}
