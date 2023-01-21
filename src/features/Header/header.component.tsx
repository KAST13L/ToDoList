import React, {FC, useCallback} from 'react';
import {logoutWorkerSagaAC} from "@app/features/Auth/auth-reducer";
import LinearProgress from "@mui/material/LinearProgress";
import {useDispatch, useSelector} from "react-redux";
import Button from "@mui/material/Button";
import {AddItemForm} from "@app/components/AddItemForm/AddItemForm";
import {addTodolistWorkerSagaAC} from "@app/features/Todolist/todolists-reducer";
import {AppBar} from "@mui/material";
import {action} from "@storybook/addon-actions";
import {selectIsLoggedIn, selectStatus} from "@app/app/selectors";

interface HeaderPropsType {
    demo?: boolean
}

export const Header: FC<HeaderPropsType> = ({demo = false}) => {
    const dispatch = useDispatch()

    const status = useSelector(selectStatus)
    const isLoggedIn = useSelector(selectIsLoggedIn)

    const logoutClick = () => {
        dispatch(logoutWorkerSagaAC())
    }

    const addTodolist = useCallback((title: string) => {
        dispatch(addTodolistWorkerSagaAC(title))
    }, [dispatch])

    const isAuthorizedAndIsDemo = demo || isLoggedIn

    return (
        <AppBar position={'static'} color='default'>
            <div
                className='flex justify-between items-center p-3 text-center smw:flex-col'>
                {!isAuthorizedAndIsDemo && <div></div>}
                <span className='flex justify-between smd:flex-col smw:mb-2'>
                    <span className='text-5xl smd:mb-3'>TODOLIST</span>
                    <span className='px-3'>{isAuthorizedAndIsDemo &&
                        <AddItemForm addItem={demo ? action('add todolist') : addTodolist}/>}</span>
                </span>
                <span>
                    {isAuthorizedAndIsDemo &&
                        <Button onClick={demo ? action('logout') : logoutClick} color={'error'}
                                variant={'contained'}>Log out</Button>}
                </span>
            </div>
            <span className='h-[3px]'>{status === 'loading' && <LinearProgress/>}</span>
        </AppBar>
    );
};

