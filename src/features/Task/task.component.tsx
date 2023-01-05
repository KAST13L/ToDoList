import React, {ChangeEvent, useCallback} from 'react'
import {EditableSpan} from '@app/components/EditableSpan/EditableSpan'
import {Delete} from '@mui/icons-material';
import IconButton from '@mui/material/IconButton';
import Checkbox from '@mui/material/Checkbox';
import {TaskStatuses, TaskType} from '@app/api/todolists-api'

type TaskPropsType = {
    task: TaskType
    todolistId: string
    changeTaskStatus: (id: string, status: TaskStatuses, todolistId: string) => void
    changeTaskTitle: (taskId: string, newTitle: string, todolistId: string) => void
    removeTask: (taskId: string, todolistId: string) => void
}
export const Task = React.memo((props: TaskPropsType) => {
    const onClickHandler = useCallback(() => props.removeTask(props.task.id, props.todolistId), [props.task.id, props.todolistId]);

    const onChangeHandler = useCallback((e: ChangeEvent<HTMLInputElement>) => {
        let newIsDoneValue = e.currentTarget.checked
        props.changeTaskStatus(props.task.id, newIsDoneValue ? TaskStatuses.Completed : TaskStatuses.New, props.todolistId)
    }, [props.task.id, props.todolistId]);

    const onTitleChangeHandler = useCallback((newValue: string) => {
        props.changeTaskTitle(props.task.id, newValue, props.todolistId)
    }, [props.task.id, props.todolistId]);

    const disabledTask = props.task.status === TaskStatuses.Completed ? 'line-through text-zinc-600' : ''

    return <div key={props.task.id}
                className='flex items-start'>
        <Checkbox
            checked={props.task.status === TaskStatuses.Completed}
            color="primary"
            onChange={onChangeHandler}
        />
        <span className='relative mt-[9px]'>
            <span className={disabledTask}>
                <EditableSpan value={props.task.title} onChange={onTitleChangeHandler}/>
            </span>
            <span className='absolute left-[240px] top-[-6px]'>
                <IconButton onClick={onClickHandler}>
                    <Delete/>
                </IconButton>
            </span>
        </span>
    </div>
})
