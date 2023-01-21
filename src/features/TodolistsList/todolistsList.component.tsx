import React, {useCallback, useEffect, useState} from 'react'
import {useDispatch, useSelector} from 'react-redux'
import {
    changeTodolistFilterAC,
    changeTodolistTitleWorkerSagaAC,
    fetchTodolistsWorkerSagaAC,
    FilterValuesType,
    removeTodolistWorkerSagaAC
} from '../Todolist/todolists-reducer'
import {
    addTaskWorkerSagaAC,
    removeTaskWorkerSagaAC,
    updateTaskWorkerSagaAC
} from '../Task/tasks-reducer'
import {Navigate} from "react-router-dom";
import {TaskStatuses} from "@app/api/todolists-api";
import {store} from "@app/app/store";
import {Todolist} from "@app/features/Todolist/todolist.component";
import Grid from "@mui/material/Grid";
import {JackInTheBox} from "react-awesome-reveal";
import {selectIsLoggedIn, selectTasks, selectTodolists} from "@app/app/selectors";

type PropsType = {
    demo?: boolean
}

export const TodolistsList: React.FC<PropsType> = ({demo = false}) => {
    const dispatch = useDispatch()

    const todolists = useSelector(selectTodolists)
    const tasks = useSelector(selectTasks)
    const isLoggedIn = useSelector(selectIsLoggedIn)

    const [isShow, setIsShow] = useState<boolean>(false)

    const removeTask = useCallback(function (id: string, todolistId: string) {
        dispatch(removeTaskWorkerSagaAC(id, todolistId))
    }, [dispatch])

    const addTask = useCallback(function (title: string, todolistId: string) {
        dispatch(addTaskWorkerSagaAC(title, todolistId))
    }, [dispatch])

    const changeStatus = useCallback(function (id: string, status: TaskStatuses, todolistId: string) {
        dispatch(updateTaskWorkerSagaAC(id, {status}, todolistId, store.getState))
    }, [dispatch])

    const changeTaskTitle = useCallback(function (id: string, newTitle: string, todolistId: string) {
        dispatch(updateTaskWorkerSagaAC(id, {title: newTitle}, todolistId, store.getState))
    }, [dispatch])

    const changeFilter = useCallback(function (value: FilterValuesType, todolistId: string) {
        dispatch(changeTodolistFilterAC(todolistId, value))
    }, [dispatch])

    const removeTodolist = useCallback(function (id: string) {
        dispatch(removeTodolistWorkerSagaAC(id))
    }, [dispatch])

    const changeTodolistTitle = useCallback(function (id: string, title: string) {
        dispatch(changeTodolistTitleWorkerSagaAC(id, title))
    }, [dispatch])

    const onClickLinkHandler = (e: any) => {
        e.preventDefault()
        setIsShow(() => !isShow)
    }

    useEffect(() => {
        if (demo || !isLoggedIn) {
            return;
        }
        dispatch(fetchTodolistsWorkerSagaAC())
    }, [dispatch])


    if (!isLoggedIn) {
        return <Navigate to={'/login'}/>
    }

    return (
        <Grid container className='flex justify-evenly items-start'>
            {
                !todolists.length && <div>
                    <div className='my-5 text-3xl text-center font-thin text-zinc-500'>
                        Your todo list is empty. Just add them. And feel like a
                        <a href=''
                           className='underline'
                           onClick={onClickLinkHandler}>queen</a>
                        over your tasks.
                    </div>
                    {isShow && <JackInTheBox>
                        <div className='max-w-[1000px]'>
                            <img
                                src="https://n1s2.hsmedia.ru/38/13/b4/3813b44d1eb77ade0112f3b528729aa1/1920x1080_0xac120003_11848801501662642079.jpeg"
                                alt="king"/>
                        </div>
                    </JackInTheBox>}
                </div>
            }
            {
                todolists.map(tl => {
                    let allTodolistTasks = tasks[tl.id]
                    return <Todolist
                        key={tl.id}
                        todolist={tl}
                        tasks={allTodolistTasks}
                        removeTask={removeTask}
                        changeFilter={changeFilter}
                        addTask={addTask}
                        changeTaskStatus={changeStatus}
                        removeTodolist={removeTodolist}
                        changeTaskTitle={changeTaskTitle}
                        changeTodolistTitle={changeTodolistTitle}
                        demo={demo}
                    />
                })
            }
        </Grid>
    )
}
