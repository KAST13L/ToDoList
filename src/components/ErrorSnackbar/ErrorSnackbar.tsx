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

    const severity: AlertColor = error ? 'error' : 'success'
    const message = error ? error : success
    const visualTime = error ? 6000 : 2000

    const handleClose = async () => {
        success && dispatch(setAppSuccessAC({success: null}))
        error && dispatch(setAppErrorAC({error: null}))
    }

    const isOpen: boolean = !!error || !!success

    return (<Snackbar open={isOpen} autoHideDuration={visualTime} onClose={handleClose}>
            <Alert variant='filled' severity={severity} sx={{width: '600px'}}>
                {message}
            </Alert>
        </Snackbar>
    );
}
