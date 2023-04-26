import React, {ChangeEvent} from 'react'
import {EditableSpan} from '@app/components/EditableSpan/EditableSpan'
import {Delete} from '@mui/icons-material';
import IconButton from '@mui/material/IconButton';
import Checkbox from '@mui/material/Checkbox';
import {TaskStatuses, TaskType} from '@app/api/todolists-api'
import {useActions} from "@app/app/store";
import {tasksThunks} from "@app/features/Task/tasks.reducer";

type TaskPropsType = {
    task: TaskType
    todolistId: string
}
export const Task = React.memo(({todolistId, task}: TaskPropsType) => {

    const {updateTask, removeTask} = useActions(tasksThunks)

    const onStatusChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
        let currentStatus = e.currentTarget.checked ? TaskStatuses.Completed : TaskStatuses.New
        updateTask({
            taskId: task.id,
            model: {status: currentStatus},
            todolistId
        })
    }
    const onTitleChangeHandler = (title: string) => {
        updateTask({
            taskId: task.id,
            model: {title},
            todolistId
        })
    }
    const isDisabledTask = task.status === TaskStatuses.Completed ? 'line-through text-zinc-600' : ''

    return <div key={task.id} className='flex items-start'>
        <Checkbox
            checked={task.status === TaskStatuses.Completed}
            color="primary"
            onChange={onStatusChangeHandler}
        />
        <span className='relative mt-[9px]'>
            <span className={isDisabledTask}>
                <EditableSpan value={task.title} onChange={onTitleChangeHandler}/>
            </span>
            <span className='absolute left-[240px] top-[-6px]'>
                <IconButton onClick={() => removeTask({taskId: task.id, todolistId})}>
                    <Delete/>
                </IconButton>
            </span>
        </span>
    </div>
})
