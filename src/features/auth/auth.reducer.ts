import { authApi, LoginParamsType } from "@app/features/auth/auth.api";
import { createSlice } from "@reduxjs/toolkit";
import { appActions } from "@app/app/app.reducer";
import { ResultCode } from "@app/common/enum/common.enums";
import { createAppAsyncThunk } from "@app/common/utils/create-app-async-thunk";

export const login = createAppAsyncThunk<any, LoginParamsType>(
  "auth/login",
  async (data, { rejectWithValue }) => {
    const res = await authApi.login(data);
    if (res.data.resultCode === ResultCode.Success) {
      return;
    } else {
      return rejectWithValue({ data: res.data });
    }
  }
);

export const logout = createAppAsyncThunk<any, void>(
  "auth/logout",
  async (arg, { rejectWithValue }) => {
    const res = await authApi.logout();
    if (res.data.resultCode === ResultCode.Success) {
      return;
    } else {
      return rejectWithValue({ data: res.data });
    }
  }
);

const initializeApp = createAppAsyncThunk<{ isLoggedIn: boolean }, void>(
  "app/initializeApp",
  async (arg, { rejectWithValue, dispatch }) => {
    try {
      const res = await authApi.me();
      if (res.data.resultCode === ResultCode.Success) {
        return { isLoggedIn: true };
      } else {
        return rejectWithValue({ data: res.data });
      }
    } finally {
      dispatch(appActions.setAppInitialized({ isInitialized: true }));
    }
  }
);

export const slice = createSlice({
  name: "auth",
  initialState: {
    isLoggedIn: false,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(login.fulfilled, (state) => {
        state.isLoggedIn = true;
      })
      .addCase(logout.fulfilled, (state) => {
        state.isLoggedIn = false;
      })
      .addCase(initializeApp.fulfilled, (state, action) => {
        state.isLoggedIn = action.payload.isLoggedIn;
      });
  },
});

export const authReducer = slice.reducer;
export const authThunks = { logout, login, initializeApp };
