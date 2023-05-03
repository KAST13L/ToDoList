import React from 'react'
import {ComponentMeta, ComponentStory} from "@storybook/react";
import {Provider} from "react-redux";
import {store} from "@app/app/store";
import {Todolist} from "@app/features/todolist-list/todolists/todolist/todolist.component";
import {TaskPriorities, TaskStatuses} from "@app/common/enum/common.enums";

export default {
    title: 'Element TODO/TodolistList',
    component: Todolist,
    argTypes: {
        removeTodolist: {action: 'remove todolists'},
        removeTask: {action: 'remove tasks'},
        changeFilter: {action: 'change filter'},
        changeTaskTitle: {action: 'change tasks title'},
        changeTodolistTitle: {action: 'change todolists title'},
        changeTaskStatus: {action: 'change tasks status'},
        addTask: {action: 'add tasks'},
    }
} as ComponentMeta<typeof Todolist>;

const Template: ComponentStory<typeof Todolist> = (args) => <Provider
    store={store}><Todolist {...args}/></Provider>;

export const TodoWithTask = Template.bind({});
TodoWithTask.args = {
    todolist: {
        title: 'Що купити?',
        addedDate: '1',
        order: 1,
        id: 'todoWhatBuy',
        filter: "all",
        entityStatus: "idle"
    },
    tasks: [
        {
            id: 'taskId',
            status: TaskStatuses.Completed,
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

export const TodoWithoutTask = Template.bind({});
TodoWithoutTask.args = {
    todolist: {
        title: 'Що купити?',
        addedDate: '1',
        order: 1,
        id: 'todoWhatBuy',
        filter: "all",
        entityStatus: "idle"
    },
    tasks: []
}

export const TodoWithoutTasksOfOneType = Template.bind({});
TodoWithoutTasksOfOneType.args = {
    todolist: {
        title: 'Що купити?',
        addedDate: '1',
        order: 1,
        id: 'todoWhatBuy',
        filter: "active",
        entityStatus: "idle"
    },
    tasks: [
        {
            id: 'taskId',
            status: TaskStatuses.Completed,
            todoListId: 'todolistId',
            startDate: '1',
            priority: TaskPriorities.Middle,
            order: 1,
            deadline: '1',
            title: 'молоко',
            description: 'yo yo yo',
            addedDate: "2"
        }]
}





