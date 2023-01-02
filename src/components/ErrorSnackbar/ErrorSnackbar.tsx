import React from 'react';
import Snackbar from '@mui/material/Snackbar';
import Alert, {AlertColor} from '@mui/material/Alert';
import {useDispatch, useSelector} from 'react-redux';
import {setAppErrorAC, setAppSuccessAC} from "@app/app/app-reducer";
import {AppRootStateType} from "@app/app/store";

export function ErrorSnackbar() {
    const error = useSelector<AppRootStateType, string | null>(state => state.app.error)
    const success = useSelector<AppRootStateType, string | null>(state => state.app.success)

    const dispatch = useDispatch();

    const severity: AlertColor = success ? 'success' : 'error'
    const message = success ? success : error

    const handleClose = async () => {
        success && dispatch(setAppSuccessAC(null))
        error && dispatch(setAppErrorAC(null))
    }

    const isOpen: boolean = !!error || !!success

    return (<Snackbar open={isOpen} autoHideDuration={6000} onClose={handleClose}>
            <Alert variant='filled' severity={severity} sx={{width: '600px'}}>
                {message}
            </Alert>
        </Snackbar>
    );
}
