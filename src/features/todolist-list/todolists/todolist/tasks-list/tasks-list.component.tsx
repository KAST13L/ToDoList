import React, {FC} from 'react';
import {Task} from "@app/features/todolist-list/todolists/todolist/task/task.component";
import {TaskType} from "@app/features/todolist-list/tasks/task.api";
import {TaskStatuses} from "@app/common/enum/common.enums";
import {
    TodolistDomainType
} from "@app/features/todolist-list/todolists/todolists.reducer";

type PropsType = {
    tasks: TaskType[],
    todolist: TodolistDomainType
}

export const TasksList: FC<PropsType> = ({tasks,todolist}) => {

    let tasksForTodolist = tasks

    if (todolist.filter === 'active') {
        tasksForTodolist = tasks.filter(t => t.status === TaskStatuses.New)
    }
    if (todolist.filter === 'completed') {
        tasksForTodolist = tasks.filter(t => t.status === TaskStatuses.Completed)
    }

    return (
        <span>
            <div className='my-3 text-center font-thin text-zinc-500'>
                {!tasks.length
                    ? 'TodolistList is empty. Create your first tasks!'
                    : !tasksForTodolist.length && 'The list of tasks of the selected type is empty!'
                }
            </div>
            {
                tasksForTodolist.map(t => <Task key={t.id} task={t}
                                                todolistId={todolist.id}/>)
            }
        </span>
    );
};

