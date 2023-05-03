import React, {FC, memo, useEffect} from 'react'
import {TodolistDomainType} from '../todolists.reducer'
import {tasksThunks} from '../../tasks/tasks.reducer'
import {TaskType} from "@app/features/todolist-list/tasks/task.api";
import {AddItemForm} from "@app/common/components/AddItemForm/AddItemForm";
import Paper from '@mui/material/Paper';
import {useActions} from "@app/common/hooks/useActions";
import {FilterTasksButtons} from "@app/features/todolist-list/todolists/todolist/filter-tasks-buttons/filter-tasks-buttons.component";
import {TodolistHeader} from "@app/features/todolist-list/todolists/todolist/todolist-header/todolist-header.component";
import {TasksList} from "@app/features/todolist-list/todolists/todolist/tasks-list/tasks-list.component";

type PropsType = {
    todolist: TodolistDomainType
    tasks: Array<TaskType>
}

export const Todolist: FC<PropsType> = memo(function ({todolist, tasks}) {

    const {fetchTasks} = useActions(tasksThunks)

    useEffect(() => {
        fetchTasks(todolist.id)
    }, [])

    return <Paper elevation={8} className='flex-row w-[350px] mx-4 my-8 p-4'>

        <TodolistHeader todolist={todolist}/>

        <TasksList tasks={tasks} todolist={todolist}/>

        <FilterTasksButtons todolist={todolist}/>

    </Paper>
})


