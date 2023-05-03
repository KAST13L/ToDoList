import React from 'react'
import {EditableSpan} from './EditableSpan'
import {ComponentMeta, ComponentStory} from "@storybook/react";
import {action} from "@storybook/addon-actions";

export default {
    title: 'Universal Components/EditableSpan Stories',
    component: EditableSpan,
    argTypes: {
        onChange: {action: 'change span title'}
    }
} as ComponentMeta<typeof EditableSpan>;


const Template: ComponentStory<typeof EditableSpan> = (args) => <EditableSpan {...args}/>;
export const View = Template.bind({});
View.args = {
    value: 'click and change this text',
}