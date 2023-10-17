import React, { FC } from "react";
import { Task } from "@app/features/todolist-list/todolists/todolist/tasks/task/task.component";
import { TaskType } from "@app/features/todolist-list/tasks/task.api";
import { TaskStatuses } from "@app/common/enum/common.enums";
import { TodolistDomainType } from "@app/features/todolist-list/todolists/todolists.reducer";
import { Draggable, Droppable } from "react-beautiful-dnd";

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

  return (
    <>
      <div className="my-3 text-center font-thin text-zinc-500">
        {!tasks.length
          ? "TodolistList is empty. Create your first tasks!"
          : !tasksForTodolist.length &&
            "The list of tasks of the selected type is empty!"}
      </div>
      <Droppable droppableId={todolist.id}>
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
    </>
  );
};
