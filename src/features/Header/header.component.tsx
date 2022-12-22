import React, {useCallback} from 'react';
import {logoutWorkerSagaAC} from "@app/features/Auth/auth-reducer";
import LinearProgress from "@mui/material/LinearProgress";
import {useDispatch, useSelector} from "react-redux";
import {AppRootStateType} from "@app/app/store";
import {RequestStatusType} from "@app/app/app-reducer";
import Button from "@mui/material/Button";
import {AddItemForm} from "@app/components/AddItemForm/AddItemForm";
import {addTodolistWorkerSagaAC} from "@app/features/Todolist/todolists-reducer";
import {AppBar} from "@mui/material";

const selectIsLoggedIn = (state: AppRootStateType): boolean => state.auth.isLoggedIn
const selectStatus = (state: AppRootStateType): RequestStatusType => state.app.status

export const Header = () => {
    const dispatch = useDispatch()

    const status = useSelector(selectStatus)
    const isLoggedIn = useSelector(selectIsLoggedIn)

    const logoutClick = () => {
        dispatch(logoutWorkerSagaAC())
    }

    const addTodolist = useCallback((title: string) => {
        dispatch(addTodolistWorkerSagaAC(title))
    }, [dispatch])

    return (
        <AppBar position='fixed' color='default'>
            <div className='flex relative items-center justify-between h-[77px] p-6 sm:h-[190px] sm:flex-col'>
                <div className='flex justify-between items-center w-[500px] md:flex-col' >
                <span className='text-5xl'>
                    TODOLIST
                </span>
                    <span className='py-[7px]'>
                    <AddItemForm addItem={addTodolist}/>
                </span>
                </div>
                <div>
                    {isLoggedIn && <Button onClick={logoutClick} variant={'contained'}>Log out</Button>}
                    {status === 'loading' && <LinearProgress/>}
                </div>
            </div>
        </AppBar>

    );
};

