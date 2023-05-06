import {
  appActions,
  appReducer,
  InitialAppStateType,
} from "@app/app/app.reducer";
import { useActions } from "@app/common/hooks/useActions";

let startState: InitialAppStateType;

const { setAppError, setAppStatus, setAppSuccess, setAppInitialized } =
  useActions(appActions);

beforeEach(() => {
  startState = {
    error: null,
    status: "idle",
    isInitialized: false,
    success: null,
  };
});

test("correct error message should be set", () => {
  const endState = appReducer(startState, setAppError({ error: "some error" }));
  expect(endState.error).toBe("some error");
});

test("correct success message should be set", () => {
  const endState = appReducer(
    startState,
    setAppSuccess({ success: "some success" })
  );
  expect(endState.success).toBe("some success");
});

test("correct status should be set", () => {
  const endState = appReducer(startState, setAppStatus({ status: "loading" }));
  expect(endState.status).toBe("loading");
});
test("correct isInitialized should be set", () => {
  const endState = appReducer(
    startState,
    setAppInitialized({ isInitialized: true })
  );
  expect(endState.isInitialized).toBeTruthy();
});
