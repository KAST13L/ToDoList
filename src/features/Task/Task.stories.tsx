import React, {useState} from 'react'
import {ComponentMeta, ComponentStory} from "@storybook/react";
import {Task} from "@app/features/Task/task.component";
import {TaskPriorities, TaskStatuses, TaskType} from "@app/api/todolists-api";

export default {
    title: 'Element TODO/Task',
    component: Task,
    decorators: [
        (StoryFn) => {
            const [title, setTitle] = useState<string>('Task Task Task');

            const [task, setTask] = useState<TaskType>({
                id: 'taskId',
                status: TaskStatuses.InProgress,
                todoListId: 'todolistId',
                startDate: '1',
                priority: TaskPriorities.Urgently,
                order: 1,
                deadline: '1',
                title: title,
                description: 'yo yo yo',
                addedDate: "2"
            })

            if (!title) {
                setTitle('null')
            }

            return (
                <Task
                    task={task}
                    todolistId={'todolistId'}
                    changeTaskStatus={() => {}}
                    changeTaskTitle={setTitle}
                    removeTask={() => {}}
                />
            );
        }
    ]
} as ComponentMeta<typeof Task>;

const Template: ComponentStory<typeof Task> = (args) => <Task {...args}/>;
export const View = Template.bind({});





