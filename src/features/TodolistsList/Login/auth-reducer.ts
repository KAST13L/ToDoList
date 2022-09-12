import { Dispatch } from 'redux'
import {SetAppErrorActionType, setAppStatusAC, SetAppStatusActionType} from "../../../app/app-reducer";
import {authAPI, LoginParamsType} from "../../../api/auth-api";
import {handleServerAppError, handleServerNetworkError} from "../../../utils/error-utils";
import axios from "axios";

const initialState = {
    isLoggedIn: false
}
type InitialStateType = typeof initialState

export const authReducer = (state: InitialStateType = initialState, action: ActionsType): InitialStateType => {
    switch (action.type) {
        case 'login/SET-IS-LOGGED-IN':
            return {...state, isLoggedIn: action.value}
        default:
            return state
    }
}
// actions
export const setIsLoggedInAC = (value: boolean) =>
    ({type: 'login/SET-IS-LOGGED-IN', value} as const)

// thunks
export const loginTC = (data: LoginParamsType) => async (dispatch: Dispatch<ActionsType>) => {
    const res = await authAPI.login(data)
    try {
        dispatch(setAppStatusAC('loading'))
        if (res.data.resultCode === 0){
            dispatch(setIsLoggedInAC(true))
            dispatch(setAppStatusAC('succeeded'))

        } else {
            handleServerAppError(res.data, dispatch)
        }
    } catch (e) {
        if(axios.isAxiosError(e)){
            handleServerNetworkError(e, dispatch)
        }
    } finally {
        dispatch(setAppStatusAC("idle"))
    }
}

export const logoutTC = () => (dispatch: Dispatch<ActionsType>) => {
    dispatch(setAppStatusAC('loading'))
    authAPI.logout()
        .then(res => {
            if (res.data.resultCode === 0) {
                dispatch(setIsLoggedInAC(false))
                dispatch(setAppStatusAC('succeeded'))
            } else {
                handleServerAppError(res.data, dispatch)
            }
        })
        .catch((e) => {
            handleServerNetworkError(e, dispatch)
        })
}



// types
type ActionsType = ReturnType<typeof setIsLoggedInAC> | SetAppStatusActionType | SetAppErrorActionType
