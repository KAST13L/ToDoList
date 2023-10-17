import React, { FC, useEffect } from "react";
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
import {
  DragDropContext,
  Draggable,
  Droppable,
  DropResult,
} from "react-beautiful-dnd";
import { Box } from "@mui/material";

export const TodolistsList: FC = () => {
  const todolists = useSelector(selectTodolists);
  const tasks = useSelector(selectTasks);
  const isLoggedIn = useSelector(selectIsLoggedIn);

  const handleDragAndDrop = (results: DropResult) => {
    const { source, destination, type } = results;

    if (!destination) return;

    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    )
      return;

    if (type === "group") {
      const reorderedTodos = [...todolists];

      const todoSourceIndex = source.index;
      const todoDestinationIndex = destination.index;

      const [removedTodo] = reorderedTodos.splice(todoSourceIndex, 1);
      reorderedTodos.splice(todoDestinationIndex, 0, removedTodo);

      //return setTodolists(reorderedTodos);
      return;
    }

    const taskSourceIndex = source.index;
    const taskDestinationIndex = destination.index;

    const todoSourceIndex = todolists.findIndex(
      (todo) => todo.id === source.droppableId
    );
    const todoDestinationIndex = todolists.findIndex(
      (todo) => todo.id === destination.droppableId
    );

    const newSourceTasks = [...tasks[todoSourceIndex]];
    const newDestinationTasks =
      source.droppableId !== destination.droppableId
        ? [...tasks[todoDestinationIndex]]
        : newSourceTasks;

    const [deletedTask] = newSourceTasks.splice(taskSourceIndex, 1);
    newDestinationTasks.splice(taskDestinationIndex, 0, deletedTask);
  };

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

  return (
    <Grid container>
      <DragDropContext onDragEnd={handleDragAndDrop}>
        {!todolists.length && <NoTodolistComponent />}
        <Droppable droppableId="ROOT" type="group" direction={"horizontal"}>
          {(provided) => (
            <Box
              className={"flex justify-between"}
              {...provided.droppableProps}
              ref={provided.innerRef}
            >
              {todolists.map((tl, index) => {
                let allTodolistTasks = tasks[tl.id];
                return (
                  <Draggable draggableId={tl.id} index={index} key={tl.id}>
                    {(provided) => (
                      <Box
                        {...provided.dragHandleProps}
                        {...provided.draggableProps}
                        ref={provided.innerRef}
                      >
                        <Todolist
                          key={tl.id}
                          todolist={tl}
                          tasks={allTodolistTasks}
                        />
                      </Box>
                    )}
                  </Draggable>
                );
              })}
              {provided.placeholder}
            </Box>
          )}
        </Droppable>
      </DragDropContext>
    </Grid>
  );
};
