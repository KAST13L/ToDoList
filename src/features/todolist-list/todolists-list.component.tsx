import React, { useEffect, FC } from "react";
import { useSelector } from "react-redux";
import { todolistsThunks } from "./todolists/todolists.reducer";
import { Navigate } from "react-router-dom";
import { Todolist } from "@app/features/todolist-list/todolists/todolist/todolist.component";
import Grid from "@mui/material/Grid";
import {
  selectIsLoggedIn,
  selectTasks,
  selectTodolists,
} from "@app/app/selectors";
import { NoTodolistComponent } from "@app/features/todolist-list/todolists/todolist/no-todolist.component";
import { useActions } from "@app/common/hooks/useActions";

export const TodolistsList: FC = () => {
  const todolists = useSelector(selectTodolists);
  const tasks = useSelector(selectTasks);
  const isLoggedIn = useSelector(selectIsLoggedIn);

  const { fetchTodolists } = useActions(todolistsThunks);

  useEffect(() => {
    if (!isLoggedIn) {
      return;
    }
    fetchTodolists();
  }, []);

  if (!isLoggedIn) {
    return <Navigate to={"/login"} />;
  }

  const renderTodolists = todolists.map((tl) => {
    let allTodolistTasks = tasks[tl.id];
    return <Todolist key={tl.id} todolist={tl} tasks={allTodolistTasks} />;
  });

  return (
    <Grid container className="flex justify-evenly items-start">
      {!todolists.length && <NoTodolistComponent />}
      {renderTodolists}
    </Grid>
  );
};
