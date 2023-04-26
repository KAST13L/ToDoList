import {
	appReducer,
	InitialAppStateType,
	setAppError,
	setAppStatus
} from "@app/app/app.reducer";

let startState: InitialAppStateType

beforeEach(() => {
	startState = {
		error: null,
		status: 'idle',
		isInitialized: false,
		success: null
	}
})

test('correct error message should be set', () => {
	const endState = appReducer(startState, setAppError({error: 'some error'}))
	expect(endState.error).toBe('some error');
})

test('correct status should be set', () => {
	const endState = appReducer(startState, setAppStatus({status: 'loading'}))
	expect(endState.status).toBe('loading');
})

