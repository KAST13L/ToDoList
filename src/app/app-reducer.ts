import {authAPI} from "../api/auth-api";
import {setIsLoggedInAC} from "../features/Auth/auth-reducer";
import {createAsyncThunk, createSlice, PayloadAction} from "@reduxjs/toolkit";
import {handleServerNetworkError} from "@app/utils/error-utils";

// types
export type RequestStatusType = 'idle' | 'loading' | 'succeeded' | 'failed'
export type InitialStateType = {
    status: RequestStatusType
    error: string | null
    success: string | null
    isInitialized: boolean
}

// asyncThunk
export const initializeAppT = createAsyncThunk('app/initializeApp', async (arg, {dispatch})=>{
    const data = await authAPI.me()
    try {
        if (data.resultCode === 0) {
            dispatch(setIsLoggedInAC({isLoggedIn: true}))
        }
    } catch (e: any) {
        handleServerNetworkError(e, dispatch)
    } finally {
        dispatch(setAppStatusAC({status: "idle"}))
        dispatch(setIsInitialized({isInitialized: true}))
    }
})

const initialState: InitialStateType = {
    status: 'idle',
    error: null,
    success: null,
    isInitialized: false
}

export const slice = createSlice({
    name: 'app',
    initialState: initialState,
    reducers: {
        setAppErrorAC(state, action: PayloadAction<{ error: string | null }>) {
            state.error = action.payload.error
        },
        setAppSuccessAC(state, action: PayloadAction<{ success: string | null }>) {
            state.success = action.payload.success
        },
        setAppStatusAC(state, action: PayloadAction<{ status: RequestStatusType }>) {
            state.status = action.payload.status
        },
        setIsInitialized(state, action: PayloadAction<{ isInitialized: boolean }>) {
            state.isInitialized = action.payload.isInitialized
        },

    }
})

export const {setAppErrorAC,setAppStatusAC,setAppSuccessAC,setIsInitialized} = slice.actions
export const appReducer = slice.reducer

/*
// sagas
export function* initializeAppWS() {
    // @ts-ignore
    const data: ResponseMeType = yield call(authAPI.me)
    try {
        if (data.resultCode === 0) {
            yield put(setIsLoggedInAC({isLoggedIn: true}))
        } else {
            /!*yield handleServerAppError(data)*!/
        }
    } catch (e) {
        if (axios.isAxiosError(e)) {
            yield handleServerNetworkError(e)
        }
    } finally {
        yield put(setAppStatusAC({status: "idle"}))
        yield put(setIsInitialized({isInitialized: true}))
    }
}
// worker saga AC's
export const initializeAppWSAC = () => ({type: 'APP/INITIALIZE'})
// appWatcher
export function* appWatcher() {
    yield takeEvery('APP/INITIALIZE', initializeAppWS)
}*/
