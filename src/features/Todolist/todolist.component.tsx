import React, {FC, useCallback, useEffect} from 'react'
import IconButton from '@mui/material/IconButton';
import Button from '@mui/material/Button';
import {Delete} from '@mui/icons-material';
import {Task} from '../Task/task.component'
import {
    changeTodolistFilterAC,
    changeTodolistTitleT,
    removeTodolistT,
    TodolistDomainType
} from './todolists-reducer'
import {addTaskT, fetchTasksT} from '../Task/tasks-reducer'
import {TaskStatuses, TaskType} from "@app/api/todolists-api";
import {EditableSpan} from "@app/components/EditableSpan/EditableSpan";
import {AddItemForm} from "@app/components/AddItemForm/AddItemForm";
import Paper from '@mui/material/Paper';
import {useAppDispatch} from "@app/app/store";

type PropsType = {
    todolist: TodolistDomainType
    tasks: Array<TaskType>
}

export const Todolist: FC<PropsType> = React.memo(function ( {todolist, tasks} ) {

    const dispatch = useAppDispatch()

    useEffect(() => {
        dispatch(fetchTasksT(todolist.id))
    }, [])

    const addTask = useCallback((title: string) => {
        dispatch(addTaskT({title, todolistId: todolist.id}))
    }, [todolist.id])

    const removeTodolist = () => {
        dispatch(removeTodolistT(todolist.id))
    }
    const changeTodolistTitle = useCallback((title: string) => {
        dispatch(changeTodolistTitleT({title, id: todolist.id}))
    }, [todolist.id])

    const onAllClickHandler = useCallback(() => {
        dispatch(changeTodolistFilterAC({id: todolist.id, filter: 'all'}))
    }, [todolist.id])

    const onActiveClickHandler = useCallback(() => {
        dispatch(changeTodolistFilterAC({id: todolist.id, filter: 'active'}))
    }, [todolist.id])

    const onCompletedClickHandler = useCallback(() => {
        dispatch(changeTodolistFilterAC({id: todolist.id, filter: 'completed'}))
    }, [todolist.id])


    let tasksForTodolist = tasks

    if (todolist.filter === 'active') {
        tasksForTodolist = tasks.filter(t => t.status === TaskStatuses.New)
    }
    if (todolist.filter === 'completed') {
        tasksForTodolist = tasks.filter(t => t.status === TaskStatuses.Completed)
    }

    return <Paper elevation={8} className='flex-row w-[350px] mx-4 my-8 p-4'>
        <div className='relative w-[310px] text-2xl font-extrabold'>
            <EditableSpan value={todolist.title}
                          onChange={changeTodolistTitle}/>
            <span className='absolute left-[295px] top-[-17px]'>
                    <IconButton onClick={removeTodolist}
                                disabled={todolist.entityStatus === 'loading'}>
                        <Delete/>
                    </IconButton>
                </span>
        </div>
        <div className='my-2'>
            <AddItemForm addItem={addTask}
                         disabled={todolist.entityStatus === 'loading'}/>
        </div>
        <span>
            <div className='my-3 text-center font-thin text-zinc-500'>
                {!tasks.length
                    ? 'Todolist is empty. Create your first task!'
                    : !tasksForTodolist.length && 'The list of tasks of the selected type is empty!'
                }
            </div>
            {
                tasksForTodolist.map(t => <Task key={t.id} task={t}
                                                todolistId={todolist.id}
                />)
            }
        </span>
        <div className='mt-2 flex justify-evenly'>
            <Button variant={todolist.filter === 'all' ? 'outlined' : 'text'}
                    onClick={onAllClickHandler}
                    color={'inherit'}>All
            </Button>
            <Button variant={todolist.filter === 'active' ? 'outlined' : 'text'}
                    onClick={onActiveClickHandler}
                    color={'primary'}>Active
            </Button>
            <Button variant={todolist.filter === 'completed' ? 'outlined' : 'text'}
                    onClick={onCompletedClickHandler}
                    color={'secondary'}>Completed
            </Button>
        </div>
    </Paper>
})


