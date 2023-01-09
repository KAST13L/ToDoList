import React from 'react'
import {ComponentMeta, ComponentStory} from "@storybook/react";
import {Task} from "@app/features/Task/task.component";
import {TaskPriorities, TaskStatuses} from "@app/api/todolists-api";

export default {
    title: 'Element TODO/Task',
    component: Task,
    argTypes: {
        removeTask: {action: 'remove task'},
        changeTaskTitle: {action: 'change task title'},
        changeTaskStatus: {action: 'change task status'},
    }
} as ComponentMeta<typeof Task>;

const Template: ComponentStory<typeof Task> = (args) => <Task {...args}/>;
export const View = Template.bind({});
View.args = {
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





