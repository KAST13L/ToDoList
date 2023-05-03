import React, {FC} from 'react';
import {authThunks} from "@app/features/authh/auth.reducer";
import LinearProgress from "@mui/material/LinearProgress";
import {useSelector} from "react-redux";
import Button from "@mui/material/Button";
import {AddItemForm} from "@app/common/components/AddItemForm/AddItemForm";
import {todolistsThunks} from "@app/features/todolist-list/todolist/todolists.reducer";
import {AppBar} from "@mui/material";
import {selectIsLoggedIn, selectStatus} from "@app/app/selectors";
import {useActions} from "@app/common/hooks/useActions";


export const Header: FC = () => {

    const status = useSelector(selectStatus)
    const isLoggedIn = useSelector(selectIsLoggedIn)

    const {logout,addTodolist} = useActions({...authThunks, ...todolistsThunks})

    return (
        <AppBar position={'static'} color='default'>
            <div
                className='flex justify-between items-center p-3 text-center smw:flex-col'>
                <span className='flex justify-between smd:flex-col smw:mb-2'>
                    <span className='text-5xl smd:mb-3'>TODOLIST</span>
                    <span className='px-3'>{isLoggedIn &&
                        <AddItemForm
                            addItem={addTodolist}/>}</span>
                </span>
                <span>
                    {isLoggedIn &&
                        <Button onClick={logout}
                                color={'error'}
                                variant={'contained'}>Log out</Button>}
                </span>
            </div>
            <span className='h-[3px]'>{status === 'loading' && <LinearProgress/>}</span>
        </AppBar>
    );
};

