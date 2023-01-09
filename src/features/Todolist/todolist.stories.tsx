import React from 'react'
import {ComponentMeta, ComponentStory} from "@storybook/react";
import {Provider} from "react-redux";
import {store} from "@app/app/store";
import {Todolist} from "@app/features/Todolist/todolist.component";
import {TaskPriorities, TaskStatuses} from "@app/api/todolists-api";
import {action} from "@storybook/addon-actions";

export default {
    title: 'Element TODO/Todolist',
    component: Todolist,
    argTypes: {
        removeTodolist: {action: 'remove todolist'},
        removeTask: {action: 'remove task'},
        changeFilter: {action: 'change filter'},
        changeTaskTitle: {action: 'change task title'},
        changeTodolistTitle: {action: 'change todolist title'},
        changeTaskStatus: {action: 'change task status'},
        addTask: {action: 'add task'},
    }
} as ComponentMeta<typeof Todolist>;

const Template: ComponentStory<typeof Todolist> = (args) => <Provider
    store={store}><Todolist {...args}/></Provider>;
export const View = Template.bind({});
View.args = {
    todolist: {
        title: 'Що купити?',
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
            title: 'сіль',
            description: 'yo yo yo',
            addedDate: "2"
        }, {
            id: 'taskId',
            status: TaskStatuses.Draft,
            todoListId: 'todolistId',
            startDate: '1',
            priority: TaskPriorities.Middle,
            order: 1,
            deadline: '1',
            title: 'хліб',
            description: 'yo yo yo',
            addedDate: "2"
        }, {
            id: 'taskId',
            status: TaskStatuses.Draft,
            todoListId: 'todolistId',
            startDate: '1',
            priority: TaskPriorities.Middle,
            order: 1,
            deadline: '1',
            title: 'молоко',
            description: 'yo yo yo',
            addedDate: "2"
        },
    ]
}





