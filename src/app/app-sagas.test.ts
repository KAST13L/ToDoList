// @ts-ignore
import {initializeAppWS, setAppStatusAC, setIsInitialized} from "./app-reducer";
import {call, put} from "redux-saga/effects";
import {authAPI, ResponseMeType} from "../api/auth-api";
import {setIsLoggedInAC} from "../features/Auth/auth-reducer";

let meResponse: ResponseMeType

beforeEach(() => {
    meResponse = {
        resultCode: 0,
        data: {
            id: 33,
            login: '',
            email: ''
        },
        fieldsErrors: [],
        messages: []
    }
})

test('correct using initialWorkerSaga when login success', () => {
    const generator = initializeAppWS();

    expect(generator.next().value).toEqual(call(authAPI.me))

    expect(generator.next(meResponse).value).toEqual(put(setIsLoggedInAC(true)))

    expect(generator.next().value).toEqual(put(setAppStatusAC("idle")))

    expect(generator.next().value).toEqual(put(setIsInitialized(true)))
})

test('correct using initialWorkerSaga when login unsuccess', () => {
    const generator = initializeAppWS();

    expect(generator.next().value).toEqual(call(authAPI.me))

    meResponse.resultCode = 1;
    expect(generator.next(meResponse).value).toEqual(put(setAppStatusAC("idle")))

    expect(generator.next().value).toEqual(put(setIsInitialized(true)))
})