import {AppRootStateType} from "@app/app/store";
import {TodolistDomainType} from "@app/features/Todolist/todolists.reducer";
import {TasksStateType} from "@app/features/Task/tasks.reducer";
import {RequestStatusType} from "@app/app/app.reducer";

export const selectTodolists = (state: AppRootStateType): TodolistDomainType[] => state.todolists
export const selectTasks = (state: AppRootStateType): TasksStateType => state.tasks
export const selectIsLoggedIn = (state: AppRootStateType): boolean => state.auth.isLoggedIn
export const selectIsInitialized = (state: AppRootStateType): boolean => state.app.isInitialized
export const selectStatus = (state: AppRootStateType): RequestStatusType => state.app.status

