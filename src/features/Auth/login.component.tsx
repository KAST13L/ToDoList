import {useDispatch, useSelector} from "react-redux";
import {AppRootStateType} from "@app/app/store";
import Paper from "@mui/material/Paper";
import {FormControl, FormControlLabel, FormGroup, FormLabel} from "@mui/material";
import TextField from "@mui/material/TextField";
import Checkbox from "@mui/material/Checkbox";
import Button from "@mui/material/Button";
import {Navigate} from "react-router-dom";
import {loginWorkerSagaAC} from "@app/features/Auth/auth-reducer";
import {useFormik} from "formik";
import React from "react";


type FormValuesType = {
    email: string
    password: string
    rememberMe: boolean
}

export const Login = () => {

    const isLoggedIn = useSelector<AppRootStateType, boolean>(state => state.auth.isLoggedIn)
    const dispatch = useDispatch()

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
            email: 'smykdav@gmail.com',
            password: 'asdasdasd',
            rememberMe: false
        },
        onSubmit: (values: FormValuesType) => {
            dispatch(loginWorkerSagaAC(values));
        },
    })

    if (isLoggedIn) {
        return <Navigate to={'/todolist'}/>
    }

    return (
        <span className='flex justify-center my-8'>
            <Paper elevation={6}
                   className=' flex justify-center items-center w-[400px] h-[500px]'>
                <form onSubmit={formik.handleSubmit}>
                    <FormControl>
                        <span className='flex justify-center '>
                            <h2 className='font-serif text-4xl mb-4'>Login</h2>
                        </span>
                    <FormGroup>
                            <TextField
                                label="Email"
                                margin="normal"
                                {...formik.getFieldProps("email")}/>
                            <TextField
                                type="password"
                                label="Password"
                                margin="normal"
                                {...formik.getFieldProps("password")}
                            />
                            <FormControlLabel
                                label={'Remember me'}
                                control={<Checkbox
                                    {...formik.getFieldProps("rememberMe")}
                                    checked={formik.values.rememberMe}
                                />}
                            />
                            <Button type={'submit'} variant={'contained'}
                                    color={'primary'}
                                    style={{marginBottom: '10px'}}>Login</Button>
                    </FormGroup>
                    <FormLabel>
                        <span className='text-center m-2 '>
                        <p>To log in get registered <a
                            href={'https://social-network.samuraijs.com/'}
                            target={'_blank'}>here</a></p>
                            <p>or use common test account credentials:</p><hr
                            className='m-2'/>
                            <p>Email: smykdav@gmail.com</p>
                            <p>Password: asdasdasd</p>
                        </span>
                    </FormLabel>
                </FormControl>
            </form>
        </Paper>
    </span>)
}