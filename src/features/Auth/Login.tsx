import React from 'react'
import {
    Button,
    Checkbox,
    FormControl,
    FormControlLabel,
    FormGroup,
    FormLabel,
    Paper,
    TextField
} from '@material-ui/core'
import {useFormik} from 'formik'
import {useSelector} from 'react-redux'
import {Redirect} from 'react-router-dom'
import {selectIsLoggedIn} from './selectors'
import {authActions} from './index'
import {useAppDispatch} from '../../utils/redux-utils'

type FormValuesType = {
    email: string
    password: string
    rememberMe: boolean
}

export const Login = () => {
    const dispatch = useAppDispatch()

    const isLoggedIn = useSelector(selectIsLoggedIn);

    const formik = useFormik({
        validate: (values) => {
            if (!values.email) {
                return {
                    email: 'Email is required'
                }
            }
            if (!values.password) {
                return {
                    password: 'Password is required'
                }
            }

        },
        initialValues: {
            email: 'free@samuraijs.com',
            password: 'free',
            rememberMe: false
        },
        onSubmit: async (values: FormValuesType) => {
            await dispatch(authActions.login(values));
        },
    })

    if (isLoggedIn) {
        return <Redirect to={"/"}/>
    }


    return <div style={{display: 'flex', justifyContent: 'center',padding: '40px'}}>
        <Paper elevation={6} style={{justifyContent:'center',padding: '20px'}}>
            <form onSubmit={formik.handleSubmit}>
                <FormControl style={{textAlign: 'center'}}>
                    <h2>Login</h2>
                    <FormGroup>
                        <TextField
                            label="Email"
                            margin="normal"
                            {...formik.getFieldProps("email")}
                        />
                        <div style={{height: '1px', color: 'red'}}>
                            {formik.errors.email ? <div>{formik.errors.email}</div> : null}
                        </div>
                        <TextField
                            type="password"
                            label="Password"
                            margin="normal"
                            {...formik.getFieldProps("password")}
                        />
                        <div style={{height: '10px', color: 'red'}}>
                            {formik.errors.password ? <div>{formik.errors.password}</div> : null}
                        </div>
                        <FormControlLabel
                            style={{paddingBottom:'9px'}}
                            label={'Remember me'}
                            control={<Checkbox
                                {...formik.getFieldProps("rememberMe")}
                                checked={formik.values.rememberMe}
                            />}
                        />
                        <Button type={'submit'} variant={'contained'} color={'primary'} style={{marginBottom:'10px'}}>Login</Button>
                    </FormGroup>
                    <FormLabel>
                        <p>To log in get registered <a href={'https://social-network.samuraijs.com/'}
                                                        target={'_blank'}>here</a></p>
                        <p>or use common test account credentials:</p>
                        <p> Email: free@samuraijs.com</p>
                        <p>Password: free</p>
                    </FormLabel>
                </FormControl>
            </form>
        </Paper>
    </div>
}

