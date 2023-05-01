import React from 'react';
import Snackbar from '@mui/material/Snackbar';
import Alert, {AlertColor} from '@mui/material/Alert';
import {useSelector} from 'react-redux';
import {appActions} from "@app/app/app.reducer";
import {selectError, selectSuccess} from "@app/app/selectors";
import {useActions} from "@app/common/hooks/useActions";

export function ErrorSnackbar() {
    const error = useSelector(selectError)
    const success = useSelector(selectSuccess)

    const {setAppError, setAppSuccess} = useActions(appActions)

    const severity: AlertColor = error ? 'error' : 'success'
    const message = error ? error : success
    const visualTime = error ? 6000 : 2000

    const handleClose = async () => {
        success && setAppSuccess({success: null})
        error && setAppError({error: null})
    }

    const isOpen: boolean = !!error || !!success

    return (<Snackbar open={isOpen} autoHideDuration={visualTime} onClose={handleClose}>
            <Alert variant='filled' severity={severity} sx={{width: '600px'}}>
                {message}
            </Alert>
        </Snackbar>
    );
}
