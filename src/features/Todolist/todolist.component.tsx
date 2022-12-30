import React, {FC, useCallback, useEffect} from 'react'
import IconButton from '@mui/material/IconButton';
import Button from '@mui/material/Button';
import {Delete} from '@mui/icons-material';
import {Task} from '../Task/task.component'
import {FilterValuesType, TodolistDomainType} from './todolists-reducer'
import {useDispatch} from 'react-redux'
import {fetchTasksWorkerSagaAC} from '../Task/tasks-reducer'
import {TaskStatuses, TaskType} from "@app/api/todolists-api";
import {EditableSpan} from "@app/components/EditableSpan/EditableSpan";
import {AddItemForm} from "@app/components/AddItemForm/AddItemForm";
import Paper from '@mui/material/Paper';

type PropsType = {
    todolist: TodolistDomainType
    tasks: Array<TaskType>
    changeFilter: (value: FilterValuesType, todolistId: string) => void
    addTask: (title: string, todolistId: string) => void
    changeTaskStatus: (id: string, status: TaskStatuses, todolistId: string) => void
    changeTaskTitle: (taskId: string, newTitle: string, todolistId: string) => void
    removeTask: (taskId: string, todolistId: string) => void
    removeTodolist: (id: string) => void
    changeTodolistTitle: (id: string, newTitle: string) => void
    demo?: boolean
}

export const Todolist: FC<PropsType> = React.memo(function ({demo = false, ...props}) {

    const dispatch = useDispatch()

    useEffect(() => {
        if (demo) {
            return
        }
        const saga = fetchTasksWorkerSagaAC(props.todolist.id)
        dispatch(saga)
    }, [])

    const addTask = useCallback((title: string) => {
        props.addTask(title, props.todolist.id)
    }, [props.addTask, props.todolist.id])

    const removeTodolist = () => {
        props.removeTodolist(props.todolist.id)
    }
    const changeTodolistTitle = useCallback((title: string) => {
        props.changeTodolistTitle(props.todolist.id, title)
    }, [props.todolist.id, props.changeTodolistTitle])

    const onAllClickHandler = useCallback(() => props.changeFilter('all', props.todolist.id), [props.todolist.id, props.changeFilter])
    const onActiveClickHandler = useCallback(() => props.changeFilter('active', props.todolist.id), [props.todolist.id, props.changeFilter])
    const onCompletedClickHandler = useCallback(() => props.changeFilter('completed', props.todolist.id), [props.todolist.id, props.changeFilter])


    let tasksForTodolist = props.tasks

    if (props.todolist.filter === 'active') {
        tasksForTodolist = props.tasks.filter(t => t.status === TaskStatuses.New)
    }
    if (props.todolist.filter === 'completed') {
        tasksForTodolist = props.tasks.filter(t => t.status === TaskStatuses.Completed)
    }

    return <Paper elevation={8} className='flex-row w-[290px] m-4 p-4'>
        <div className='min-h-[30px] h-auto'>
            <div className='relative h-[30px] text-2xl font-extrabold'>
                <EditableSpan value={props.todolist.title}
                              onChange={changeTodolistTitle}/>
                <span className='absolute left-[235px] bottom-[6px]'>
                <IconButton onClick={removeTodolist}
                            disabled={props.todolist.entityStatus === 'loading'}>
                    <Delete/>
                </IconButton>
            </span>
            </div>
        </div>
        <div className='ml-[5px] my-2'>
            <AddItemForm addItem={addTask}
                         disabled={props.todolist.entityStatus === 'loading'}/>
            {
                tasksForTodolist.map(t => <Task key={t.id} task={t}
                                                todolistId={props.todolist.id}
                                                removeTask={props.removeTask}
                                                changeTaskTitle={props.changeTaskTitle}
                                                changeTaskStatus={props.changeTaskStatus}
                />)
            }
        </div>

        <span>
            <Button variant={props.todolist.filter === 'all' ? 'outlined' : 'text'}
                    onClick={onAllClickHandler}
                    color={'inherit'}>All
            </Button>
            <Button variant={props.todolist.filter === 'active' ? 'outlined' : 'text'}
                    onClick={onActiveClickHandler}
                    color={'primary'}>Active
            </Button>
            <Button variant={props.todolist.filter === 'completed' ? 'outlined' : 'text'}
                    onClick={onCompletedClickHandler}
                    color={'secondary'}>Completed
            </Button>
        </span>
    </Paper>
})


