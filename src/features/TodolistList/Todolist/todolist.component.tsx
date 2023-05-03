import React, {useEffect} from 'react'
import IconButton from '@mui/material/IconButton';
import Button from '@mui/material/Button';
import {Delete} from '@mui/icons-material';
import {Task} from './Task/task.component'
import {
    FilterValuesType,
    TodolistDomainType,
    todolistsActions,
    todolistsThunks
} from './todolists.reducer'
import {tasksThunks} from './Task/tasks.reducer'
import {TaskStatuses, TaskType} from "@app/api/todolists-api";
import {EditableSpan} from "@app/components/EditableSpan/EditableSpan";
import {AddItemForm} from "@app/components/AddItemForm/AddItemForm";
import Paper from '@mui/material/Paper';
import {useActions} from "@app/common/hooks/useActions";

type PropsType = {
    todolist: TodolistDomainType
    tasks: Array<TaskType>
}

export const Todolist: React.FC<PropsType> = React.memo(function ({todolist, tasks}) {

    const thunkAndActionsList = {...tasksThunks, ...todolistsThunks, ...todolistsActions}

    const {
        addTask,
        fetchTasks,
        removeTodolist,
        changeTodolistTitle,
        changeTodolistFilter
    } = useActions({...thunkAndActionsList})

    useEffect(() => {
        fetchTasks(todolist.id)
    }, [])

    let tasksForTodolist = tasks

    if (todolist.filter === 'active') {
        tasksForTodolist = tasks.filter(t => t.status === TaskStatuses.New)
    }
    if (todolist.filter === 'completed') {
        tasksForTodolist = tasks.filter(t => t.status === TaskStatuses.Completed)
    }

    const renderFilterButton = (filter: FilterValuesType, color: any) => {
        return <Button
            variant={todolist.filter === filter ? 'outlined' : 'text'}
            onClick={() => changeTodolistFilter({id: todolist.id, filter})}
            color={color}>
            {filter}
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
                    ? 'TodolistList is empty. Create your first task!'
                    : !tasksForTodolist.length && 'The list of tasks of the selected type is empty!'
                }
            </div>
            {
                tasksForTodolist.map(t => <Task key={t.id} task={t}
                                                todolistId={todolist.id}/>)
            }
        </span>
        <div className='mt-2 flex justify-evenly'>
            {renderFilterButton('all', 'inherit')}
            {renderFilterButton('active', 'primary')}
            {renderFilterButton('completed', 'secondary')}
        </div>
    </Paper>
})


