import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { authThunks } from "@app/features/auth/auth.reducer";
import { tasksThunks } from "@app/features/todolist-list/tasks/tasks.reducer";
import { todolistsThunks } from "@app/features/todolist-list/todolists/todolists.reducer";

// types
export type RequestStatusType = "idle" | "loading" | "succeeded" | "failed";
export type InitialAppStateType = {
  status: RequestStatusType;
  error: string | null;
  success: string | null;
  isInitialized: boolean;
};

export const slice = createSlice({
  name: "app",
  initialState: {
    status: "idle",
    error: null,
    success: null,
    isInitialized: false,
  } as InitialAppStateType,
  reducers: {
    setAppError(state, action: PayloadAction<{ error: string | null }>) {
      state.error = action.payload.error;
      state.status = "failed";
    },
    setAppSuccess(state, action: PayloadAction<{ success: string | null }>) {
      state.success = action.payload.success;
      state.status = "succeeded";
    },
    setAppStatus(state, action: PayloadAction<{ status: RequestStatusType }>) {
      state.status = action.payload.status;
    },
    setAppInitialized(
      state,
      action: PayloadAction<{ isInitialized: boolean }>
    ) {
      state.isInitialized = action.payload.isInitialized;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(authThunks.login.fulfilled, (state) => {
        state.success = "You are authorized!";
      })
      .addCase(authThunks.logout.fulfilled, (state) => {
        state.success = "You are signed out!";
      })
      .addCase(tasksThunks.removeTask.fulfilled, (state) => {
        state.success = "Tasks deleted!";
      })
      .addCase(tasksThunks.addTask.fulfilled, (state) => {
        state.success = "Task added!";
      })
      .addCase(tasksThunks.updateTask.fulfilled, (state) => {
        state.success = "Task changed!";
      })
      .addCase(todolistsThunks.removeTodolist.fulfilled, (state) => {
        state.success = "TodolistList removed!";
      })
      .addCase(todolistsThunks.addTodolist.fulfilled, (state) => {
        state.success = "TodolistList added!";
      })
      .addCase(todolistsThunks.changeTodolistTitle.fulfilled, (state) => {
        state.success = "TodolistList title changed!";
      })
      .addMatcher(
        (action) => action.type.endsWith("/pending"),
        (state) => {
          state.status = "loading";
        }
      )
      .addMatcher(
        (action) => action.type.endsWith("/rejected"),
        (state, action) => {
          const { payload, error } = action;
          if (payload) {
            state.error = payload.data.messages.length
              ? payload.data.messages[0]
              : "some error occurred";
          } else {
            state.error = error.message ? error.message : "some error occurred";
          }
          state.status = "failed";
        }
      )
      .addMatcher(
        (action) => action.type.endsWith("/fulfilled"),
        (state) => {
          state.status = "succeeded";
        }
      );
  },
});

export const appReducer = slice.reducer;
export const appActions = slice.actions;
