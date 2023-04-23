import React, {FC, useEffect} from 'react'
import IconButton from '@mui/material/IconButton';
import Button from '@mui/material/Button';
import {Delete} from '@mui/icons-material';
import {Task} from '../Task/task.component'
import {FilterValuesType, todolistActions, TodolistDomainType} from './todolists-reducer'
import {tasksActions} from '../Task/tasks-reducer'
import {TaskStatuses, TaskType} from "@app/api/todolists-api";
import {EditableSpan} from "@app/components/EditableSpan/EditableSpan";
import {AddItemForm} from "@app/components/AddItemForm/AddItemForm";
import Paper from '@mui/material/Paper';
import {useActions} from "@app/app/store";

type PropsType = {
    todolist: TodolistDomainType
    tasks: Array<TaskType>
}

export const Todolist: FC<PropsType> = React.memo(function ({todolist, tasks}) {

    const {addTask, fetchTasks} = useActions(tasksActions)
    const {
        removeTodolist,
        changeTodolistTitle,
        changeTodolistFilter
    } = useActions(todolistActions)

    useEffect(() => {
        fetchTasks(todolist.id)
    }, [])

    const onAllClickHandler = () => {
        changeTodolistFilter({id: todolist.id, filter: 'all'})
    }

    const onActiveClickHandler = () => {
        changeTodolistFilter({id: todolist.id, filter: 'active'})
    }

    const onCompletedClickHandler = () => {
        changeTodolistFilter({id: todolist.id, filter: 'completed'})
    }


    let tasksForTodolist = tasks

    if (todolist.filter === 'active') {
        tasksForTodolist = tasks.filter(t => t.status === TaskStatuses.New)
    }
    if (todolist.filter === 'completed') {
        tasksForTodolist = tasks.filter(t => t.status === TaskStatuses.Completed)
    }

    const renderFilterButton = (text: FilterValuesType, onClick: () => void, color: any) => {
        return <Button
            variant={todolist.filter === text ? 'outlined' : 'text'}
            onClick={onClick}
            color={color}>
            {text}
        </Button>
    }

    return <Paper elevation={8} className='flex-row w-[350px] mx-4 my-8 p-4'>
        <div className='relative w-[310px] text-2xl font-extrabold'>
            <EditableSpan value={todolist.title}
                          onChange={(title) => changeTodolistTitle({
                              title,
                              id: todolist.id
                          })}/>
            <span className='absolute left-[295px] top-[-17px]'>
                    <IconButton onClick={() => removeTodolist(todolist.id)}
                                disabled={todolist.entityStatus === 'loading'}>
                        <Delete/>
                    </IconButton>
                </span>
        </div>
        <div className='my-2'>
            <AddItemForm addItem={(title) => addTask({title, todolistId: todolist.id})}
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
            {renderFilterButton('all',onAllClickHandler, 'inherit' )}
            {renderFilterButton('active',onActiveClickHandler, 'primary' )}
            {renderFilterButton('completed',onCompletedClickHandler, 'secondary' )}
        </div>
    </Paper>
})


