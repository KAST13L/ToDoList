import React from 'react';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert, {AlertColor, AlertProps} from '@mui/material/Alert';
import {useDispatch, useSelector} from 'react-redux';
import {setAppErrorAC, setAppSuccessAC} from "@app/app/app-reducer";
import {AppRootStateType} from "@app/app/store";

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(
    props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});


export function ErrorSnackbar() {
    const error = useSelector<AppRootStateType, string | null>(state => state.app.error)
    const success = useSelector<AppRootStateType, string | null>(state => state.app.success)

    const dispatch = useDispatch();

    const severity: AlertColor = success ? 'success' : 'error'
    const message = success ? success : error

    const handleClose = async () => {
        error && dispatch(setAppErrorAC(null))
        success && dispatch(setAppSuccessAC(null))
    }

    const isOpen: boolean = !!error || !!success

    return (<Snackbar open={isOpen} autoHideDuration={6000} onClose={handleClose}>
            <Alert variant='filled' severity={severity} sx={{width: '100%'}}>
                {message}
            </Alert>
        </Snackbar>
    );
}
