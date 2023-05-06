import { RequestStatusType } from "@app/app/app.reducer";
import {
  todolistsApi,
  TodolistType,
} from "@app/features/todolist-list/todolists/todolists.api";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { createAppAsyncThunk } from "@app/common/utils/create-app-async-thunk";
import { ResultCode } from "@app/common/enum/common.enums";

// types
export type FilterValuesType = "all" | "active" | "completed";
export type TodolistDomainType = TodolistType & {
  filter: FilterValuesType;
  entityStatus: RequestStatusType;
};

// asyncThunk
export const fetchTodolists = createAppAsyncThunk<
  { todolists: TodolistType[] },
  void
>("todolists/fetchTodolists", async () => {
  const res = await todolistsApi.getTodolists();
  return { todolists: res.data };
});
export const removeTodolist = createAppAsyncThunk<{ id: string }, string>(
  "todolists/removeTodolist",
  async (todolistId, { dispatch, rejectWithValue }) => {
    dispatch(
      todolistsActions.changeTodolistEntityStatus({
        id: todolistId,
        status: "loading",
      })
    );
    const res = await todolistsApi.deleteTodolist(todolistId);
    if (res.data.resultCode === ResultCode.Success) {
      return { id: todolistId };
    } else {
      return rejectWithValue({ data: res.data });
    }
  }
);
export const addTodolist = createAppAsyncThunk<
  { todolist: TodolistType },
  string
>("todolists/addTodolist", async (title, { rejectWithValue }) => {
  const res = await todolistsApi.createTodolist(title);
  if (res.data.resultCode === ResultCode.Success) {
    return { todolist: res.data.data.item };
  } else {
    return rejectWithValue({ data: res.data });
  }
});

export const changeTodolistTitle = createAppAsyncThunk<
  { id: string; title: string },
  { id: string; title: string }
>(
  "todolists/changeTodolistTitle",
  async ({ id, title }, { rejectWithValue }) => {
    const res = await todolistsApi.updateTodolist(id, title);
    if (res.data.resultCode === ResultCode.Success) {
      return { id, title };
    } else {
      return rejectWithValue({ data: res.data });
    }
  }
);

export const slice = createSlice({
  name: "todolist",
  initialState: [] as TodolistDomainType[],
  reducers: {
    changeTodolistFilter(
      state,
      action: PayloadAction<{ id: string; filter: FilterValuesType }>
    ) {
      const index = state.findIndex((tl) => tl.id === action.payload.id);
      state[index].filter = action.payload.filter;
    },
    changeTodolistEntityStatus(
      state,
      action: PayloadAction<{ id: string; status: RequestStatusType }>
    ) {
      const index = state.findIndex((tl) => tl.id === action.payload.id);
      state[index].entityStatus = action.payload.status;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTodolists.fulfilled, (state, action) => {
        return action.payload.todolists.map((tl) => ({
          ...tl,
          filter: "all",
          entityStatus: "idle",
        }));
      })
      .addCase(removeTodolist.fulfilled, (state, action) => {
        state.filter((tl) => tl.id !== action.payload.id);
        const index = state.findIndex((tl) => tl.id === action.payload.id);
        state.splice(index, 1);
      })
      .addCase(addTodolist.fulfilled, (state, action) => {
        state.unshift({
          ...action.payload.todolist,
          entityStatus: "idle",
          filter: "all",
        });
      })
      .addCase(changeTodolistTitle.fulfilled, (state, action) => {
        const index = state.findIndex((tl) => tl.id === action.payload.id);
        state[index].title = action.payload.title;
      });
  },
});

export const todolistsReducer = slice.reducer;
export const todolistsActions = slice.actions;
export const todolistsThunks = {
  fetchTodolists,
  removeTodolist,
  addTodolist,
  changeTodolistTitle,
};
