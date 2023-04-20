import React, {FC} from 'react';
import {authActions} from "@app/features/Auth/auth-reducer";
import LinearProgress from "@mui/material/LinearProgress";
import {useSelector} from "react-redux";
import Button from "@mui/material/Button";
import {AddItemForm} from "@app/components/AddItemForm/AddItemForm";
import {todolistActions} from "@app/features/Todolist/todolists-reducer";
import {AppBar} from "@mui/material";
import {action} from "@storybook/addon-actions";
import {selectIsLoggedIn, selectStatus} from "@app/app/selectors";
import {useActions} from "@app/app/store";

interface HeaderPropsType {
    demo?: boolean
}

export const Header: FC<HeaderPropsType> = ({demo = false}) => {

    const status = useSelector(selectStatus)
    const isLoggedIn = useSelector(selectIsLoggedIn)

    const {logout} = useActions(authActions)
    const {addTodolist} = useActions(todolistActions)

    const isAuthorizedAndIsDemo = demo || isLoggedIn

    return (
        <AppBar position={'static'} color='default'>
            <div
                className='flex justify-between items-center p-3 text-center smw:flex-col'>
                {!isAuthorizedAndIsDemo && <div></div>}
                <span className='flex justify-between smd:flex-col smw:mb-2'>
                    <span className='text-5xl smd:mb-3'>TODOLIST</span>
                    <span className='px-3'>{isAuthorizedAndIsDemo &&
                        <AddItemForm
                            addItem={demo ? action('add todolist') : addTodolist}/>}</span>
                </span>
                <span>
                    {isAuthorizedAndIsDemo &&
                        <Button onClick={demo ? action('logout') : logout}
                                color={'error'}
                                variant={'contained'}>Log out</Button>}
                </span>
            </div>
            <span className='h-[3px]'>{status === 'loading' && <LinearProgress/>}</span>
        </AppBar>
    );
};

