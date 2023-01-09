import React, {useCallback, useEffect} from 'react'
import {useDispatch, useSelector} from 'react-redux'
import {
    changeTodolistFilterAC,
    changeTodolistTitleWorkerSagaAC,
    fetchTodolistsWorkerSagaAC,
    FilterValuesType,
    removeTodolistWorkerSagaAC,
    TodolistDomainType
} from '../Todolist/todolists-reducer'
import {
    addTaskWorkerSagaAC,
    removeTaskWorkerSagaAC,
    TasksStateType,
    updateTaskWorkerSagaAC
} from '../Task/tasks-reducer'
import {Navigate} from "react-router-dom";
import {TaskStatuses} from "@app/api/todolists-api";
import {AppRootStateType, store} from "@app/app/store";
import {Todolist} from "@app/features/Todolist/todolist.component";
import Grid from "@mui/material/Grid";

type PropsType = {
    demo?: boolean
}

export const TodolistsList: React.FC<PropsType> = ({demo = false}) => {
    const todolists = useSelector<AppRootStateType, Array<TodolistDomainType>>(state => state.todolists)
    const tasks = useSelector<AppRootStateType, TasksStateType>(state => state.tasks)
    const isLoggedIn = useSelector<AppRootStateType, boolean>(state => state.auth.isLoggedIn)
    const dispatch = useDispatch()

    useEffect(() => {
        if (demo || !isLoggedIn) {
            return;
        }
        dispatch(fetchTodolistsWorkerSagaAC())
    }, [])

    const removeTask = useCallback(function (id: string, todolistId: string) {
        dispatch(removeTaskWorkerSagaAC(id, todolistId))
    }, [])

    const addTask = useCallback(function (title: string, todolistId: string) {
        dispatch(addTaskWorkerSagaAC(title, todolistId))
    }, [])

    const changeStatus = useCallback(function (id: string, status: TaskStatuses, todolistId: string) {
        dispatch(updateTaskWorkerSagaAC(id, {status}, todolistId, store.getState))
    }, [])

    const changeTaskTitle = useCallback(function (id: string, newTitle: string, todolistId: string) {
        dispatch(updateTaskWorkerSagaAC(id, {title: newTitle}, todolistId, store.getState))
    }, [])

    const changeFilter = useCallback(function (value: FilterValuesType, todolistId: string) {
        dispatch(changeTodolistFilterAC(todolistId, value))
    }, [])

    const removeTodolist = useCallback(function (id: string) {
        dispatch(removeTodolistWorkerSagaAC(id))
    }, [])

    const changeTodolistTitle = useCallback(function (id: string, title: string) {
        dispatch(changeTodolistTitleWorkerSagaAC(id, title))
    }, [])

    if (!isLoggedIn) {
        return <Navigate to={'/login'}/>
    }

    return <Grid container className='flex justify-evenly items-start' >
        {
            !todolists.length && <div>
                <div className='my-5 text-3xl text-center font-thin text-zinc-500' >
                    Your list of todolists are empty. Just add them. And feel like a king over your tasks.
                </div>
                <div className='max-w-[1100px]'>
                    <img src="https://n1s2.hsmedia.ru/38/13/b4/3813b44d1eb77ade0112f3b528729aa1/1920x1080_0xac120003_11848801501662642079.jpeg"
                         alt="king"/>
                </div>
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
}
