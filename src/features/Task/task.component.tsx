import React, {ChangeEvent, useCallback} from 'react'
import {EditableSpan} from '@app/components/EditableSpan/EditableSpan'
import {Delete} from '@mui/icons-material';
import IconButton from '@mui/material/IconButton';
import Checkbox from '@mui/material/Checkbox';
import {TaskStatuses, TaskType} from '@app/api/todolists-api'
import {useAppDispatch} from "@app/app/store";
import {removeTaskT, updateTaskT} from "@app/features/Task/tasks-reducer";

type TaskPropsType = {
    task: TaskType
    todolistId: string
}
export const Task = React.memo(({todolistId,task}: TaskPropsType) => {

    const dispatch = useAppDispatch()

    const onClickHandler = useCallback(() => {
        dispatch(removeTaskT({taskId: task.id, todolistId}))
    }, [task.id, todolistId]);

    const onChangeHandler = useCallback((e: ChangeEvent<HTMLInputElement>) => {
        let newIsDoneValue = e.currentTarget.checked
        let currentStatus = newIsDoneValue ? TaskStatuses.Completed : TaskStatuses.New
        dispatch(updateTaskT({
            taskId: task.id,
            domainModel: {status: currentStatus},
            todolistId
        }))
    }, [task.id,todolistId]);

    const onTitleChangeHandler = useCallback((newValue: string) => {
        dispatch(updateTaskT({
            taskId: task.id,
            domainModel: {title: newValue},
            todolistId
        }))
    }, [task.id,todolistId]);

    const disabledTask = task.status === TaskStatuses.Completed ? 'line-through text-zinc-600' : ''

    return <div key={task.id}
                className='flex items-start'>
        <Checkbox
            checked={task.status === TaskStatuses.Completed}
            color="primary"
            onChange={onChangeHandler}
        />
        <span className='relative mt-[9px]'>
            <span className={disabledTask}>
                <EditableSpan value={task.title} onChange={onTitleChangeHandler}/>
            </span>
            <span className='absolute left-[240px] top-[-6px]'>
                <IconButton onClick={onClickHandler}>
                    <Delete/>
                </IconButton>
            </span>
        </span>
    </div>
})
