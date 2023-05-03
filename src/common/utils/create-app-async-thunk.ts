import { createAsyncThunk } from '@reduxjs/toolkit';
import {AppDispatch, AppRootStateType} from "@app/app/store";
import {ResponseType} from "@app/common/types/common.types";

export const createAppAsyncThunk = createAsyncThunk.withTypes<{
	state: AppRootStateType
	dispatch: AppDispatch
	rejectValue: null | ResponseType
}>()
