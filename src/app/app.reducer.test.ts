import {
	appActions,
	appReducer,
	InitialAppStateType
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
	const endState = appReducer(startState, appActions.setAppError({error: 'some error'}))
	expect(endState.error).toBe('some error');
})

test('correct success message should be set', () => {
	const endState = appReducer(startState, appActions.setAppSuccess({success: 'some success'}))
	expect(endState.success).toBe('some success');
})

test('correct status should be set', () => {
	const endState = appReducer(startState, appActions.setAppStatus({status: 'loading'}))
	expect(endState.status).toBe('loading');
})

