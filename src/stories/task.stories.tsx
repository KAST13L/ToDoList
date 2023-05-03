import React from 'react'
import {ComponentMeta, ComponentStory} from "@storybook/react";
import {Task} from "@app/features/TodolistList/Task/task.component";
import {Provider} from "react-redux";
import {store} from "@app/app/store";
import {HashRouter} from "react-router-dom";
import {TaskPriorities, TaskStatuses} from "@app/common/enum/common.enums";

export default {
    title: 'Element TODO/Task',
    component: Task,
    argTypes: {
        removeTask: {action: 'remove task'},
        changeTaskTitle: {action: 'change task title'},
        changeTaskStatus: {action: 'change task status'}
    }
} as ComponentMeta<typeof Task>;

const Template: ComponentStory<typeof Task> = (args) => <HashRouter><Provider store={store}><Task {...args}/></Provider></HashRouter>;
export const CompletedTask = Template.bind({});
CompletedTask.args = {
    task: {
        id: 'taskId',
        status: TaskStatuses.Completed,
        todoListId: 'todolistId',
        startDate: '1',
        priority: TaskPriorities.Urgently,
        order: 1,
        deadline: '1',
        title: 'Грокаєм алгоритми',
        description: 'yo yo yo',
        addedDate: "2"
    }
}
export const TaskInProgress = Template.bind({});
TaskInProgress.args = {
    task: {
        id: 'taskId',
        status: TaskStatuses.InProgress,
        todoListId: 'todolistId',
        startDate: '1',
        priority: TaskPriorities.Urgently,
        order: 1,
        deadline: '1',
        title: 'Грокаєм алгоритми',
        description: 'yo yo yo',
        addedDate: "2"
    }
}






