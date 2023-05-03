import React, {FC} from 'react';
import {EditableSpan} from "@app/common/components/EditableSpan/EditableSpan";
import IconButton from "@mui/material/IconButton";
import {Delete} from "@mui/icons-material";
import {useActions} from "@app/common/hooks/useActions";
import {
    TodolistDomainType,
    todolistsThunks
} from "@app/features/todolist-list/todolists/todolists.reducer";

type PropsType = {
    todolist: TodolistDomainType
}

export const TodolistHeader: FC<PropsType> = ({todolist}) => {

    const {changeTodolistTitle, removeTodolist} = useActions(todolistsThunks)

    return (
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

    );
};

