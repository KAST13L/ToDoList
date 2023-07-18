import React, { FC, useState } from "react";
import {
  DragDropContext,
  Draggable,
  Droppable,
  DropResult,
} from "react-beautiful-dnd";

type NameType = {
  id: number;
  name: string;
};

const nameList: NameType[] = [
  {
    id: 1,
    name: "Steve",
  },
  {
    id: 2,
    name: "Georg",
  },
  {
    id: 3,
    name: "Yana",
  },
  {
    id: 4,
    name: "Tom",
  },
];

interface Props {
  position?: "horizontal" | "vertical";
}

export const Dnd: FC<Props> = ({ position = "vertical" }) => {
  const [names, setNames] = useState<NameType[]>(nameList);

  const handleOnDragEnd = (result: DropResult) => {
    if (!result.destination) return;
    const items = Array.from(names);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    setNames(items);
  };

  return (
    <DragDropContext onDragEnd={handleOnDragEnd}>
      <Droppable droppableId={"names"} direction={position}>
        {(provided) => (
          <ul
            className="m-8 text-center flex justify-center"
            ref={provided.innerRef}
            {...provided.droppableProps}
          >
            {names.map(({ id, name }, index) => {
              return (
                <Draggable key={id} draggableId={`${id}`} index={index}>
                  {(provided) => (
                    <li
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      className="border-2 rounded-full bg-amber-300 w-40 p-5 m-5"
                    >
                      <p>{name}</p>
                    </li>
                  )}
                </Draggable>
              );
            })}
            {provided.placeholder}
          </ul>
        )}
      </Droppable>
    </DragDropContext>
  );
};
