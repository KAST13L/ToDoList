import React, { FC, useState } from "react";
import { Task } from "@app/features/todolist-list/todolists/todolist/tasks/task/task.component";
import { TaskType } from "@app/features/todolist-list/tasks/task.api";
import { TaskStatuses } from "@app/common/enum/common.enums";
import { TodolistDomainType } from "@app/features/todolist-list/todolists/todolists.reducer";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import { useActions } from "@app/common/hooks/useActions";
import { tasksThunks } from "@app/features/todolist-list/tasks/tasks.reducer";

type PropsType = {
  tasks: TaskType[];
  todolist: TodolistDomainType;
};

export const Tasks: FC<PropsType> = ({ tasks, todolist }) => {
  let tasksForTodolist = tasks;

  if (todolist.filter === "active") {
    tasksForTodolist = tasks.filter((t) => t.status === TaskStatuses.New);
  }
  if (todolist.filter === "completed") {
    tasksForTodolist = tasks.filter((t) => t.status === TaskStatuses.Completed);
  }

  const handleDrop = (droppedItem: any) => {
    if (!droppedItem.destination) return;
    const updatedList = [...tasks];
    const [reorderedItem] = updatedList.splice(droppedItem.source.index, 1);
    updatedList.splice(droppedItem.destination.index, 0, reorderedItem);
    //setFilteredTasks(updatedList);
  };

  return (
    <>
      <div className="my-3 text-center font-thin text-zinc-500">
        {!tasks.length
          ? "TodolistList is empty. Create your first tasks!"
          : !tasksForTodolist.length &&
            "The list of tasks of the selected type is empty!"}
      </div>
      <DragDropContext onDragEnd={handleDrop}>
        <Droppable droppableId="todolist-container">
          {(provided) => (
            <div {...provided.droppableProps} ref={provided.innerRef}>
              {tasksForTodolist.map((item, index) => (
                <Draggable key={item.id} draggableId={item.id} index={index}>
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.dragHandleProps}
                      {...provided.draggableProps}
                    >
                      <Task task={item} todolistId={todolist.id} />
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </>
  );
};
