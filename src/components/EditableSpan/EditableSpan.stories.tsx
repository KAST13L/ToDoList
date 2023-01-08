import React, {useState} from 'react'
import {EditableSpan} from './EditableSpan'
import {ComponentMeta, ComponentStory} from "@storybook/react";

export default {
    title: 'Universal Components/EditableSpan Stories',
    component: EditableSpan,
    decorators: [
        (StoryFn) => {
            const [value, setValue] = useState<string>('string');

            return (
                <EditableSpan
                    onChange={setValue}
                    value={value}
                />
            );
        }
    ]
} as ComponentMeta<typeof EditableSpan>;


const Template: ComponentStory<typeof EditableSpan> = (args) => <EditableSpan {...args}/>;
export const View = Template.bind({});
