import React, {FC} from 'react';
import {
    FilterValuesType,
    TodolistDomainType, todolistsActions
} from "@app/features/todolist-list/todolists/todolists.reducer";
import Button from "@mui/material/Button";
import {useActions} from "@app/common/hooks/useActions";

type PropsType = {
    todolist: TodolistDomainType
}

export const FilterTasksButtons: FC<PropsType> = ({todolist}) => {

    const {changeTodolistFilter} = useActions(todolistsActions)

    const renderFilterButton = (filter: FilterValuesType, color: any) => {
        return <Button
            variant={todolist.filter === filter ? 'outlined' : 'text'}
            onClick={() => changeTodolistFilter({id: todolist.id, filter})}
            color={color}>
            {filter}
        </Button>
    }

    return (
        <div className='mt-2 flex justify-evenly'>
            {renderFilterButton('all', 'inherit')}
            {renderFilterButton('active', 'primary')}
            {renderFilterButton('completed', 'secondary')}
        </div>
    );
};

