import React from 'react'
import {ComponentMeta, ComponentStory} from "@storybook/react";
import {Provider} from "react-redux";
import {store} from "@app/app/store";
import {Todolist} from "@app/features/Todolist/todolist.component";
import {TaskPriorities, TaskStatuses} from "@app/api/todolists-api";

export default {
    title: 'Element TODO/Todolist',
    component: Todolist,
} as ComponentMeta<typeof Todolist>;

const Template: ComponentStory<typeof Todolist> = (args) => <Provider
    store={store}><Todolist {...args}/></Provider>;
export const View = Template.bind({});
View.args = {
    addTask: () => {},
    changeFilter: () => {},
    changeTaskStatus: () => {},
    changeTaskTitle: () => {},
    changeTodolistTitle: () => {},
    removeTask: () => {},
    removeTodolist: () => {},
    todolist: {
        title: 'yes',
        addedDate: '2',
        order: 23,
        id: 'sas',
        filter: "all",
        entityStatus: "idle"
    },
    tasks: [
        {
            id: 'taskId',
            status: TaskStatuses.Draft,
            todoListId: 'todolistId',
            startDate: '1',
            priority: TaskPriorities.Middle,
            order: 1,
            deadline: '1',
            title: 'title',
            description: 'yo yo yo',
            addedDate: "2"
        },
    ]
}





