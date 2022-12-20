import React, {useCallback, useEffect} from 'react'
import {useDispatch, useSelector} from 'react-redux'
import {AppRootStateType, store} from '../../app/store'
import {
    addTodolistWorkerSagaAC,
    changeTodolistFilterAC,
    changeTodolistTitleWorkerSagaAC,
    fetchTodolistsWorkerSagaAC,
    FilterValuesType,
    removeTodolistWorkerSagaAC,
    TodolistDomainType
} from './todolists-reducer'
import {
    addTaskWorkerSagaAC,
    removeTaskWorkerSagaAC,
    TasksStateType,
    updateTaskWorkerSagaAC
} from './tasks-reducer'
import {TaskStatuses} from '../../api/todolists-api'
import {AddItemForm} from '../../components/AddItemForm/AddItemForm'
import {Todolist} from './Todolist/Todolist'
import {Navigate} from "react-router-dom";

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

    const addTodolist = useCallback((title: string) => {
        dispatch(addTodolistWorkerSagaAC(title))
    }, [dispatch])


    if (!isLoggedIn) {
        return <Navigate to={'/login'}/>
    }

    return <>
        <AddItemForm addItem={addTodolist}/>
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
    </>
}
