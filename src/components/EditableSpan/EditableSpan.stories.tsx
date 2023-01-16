import React, {useState} from 'react'
import {EditableSpan} from './EditableSpan'
import {ComponentMeta, ComponentStory} from "@storybook/react";
import {action} from "@storybook/addon-actions";

export default {
    title: 'Universal Components/EditableSpan Stories',
    component: EditableSpan
} as ComponentMeta<typeof EditableSpan>;


const Template: ComponentStory<typeof EditableSpan> = (args) => <EditableSpan {...args}/>;
export const View = Template.bind({});
View.args = {
    value: 'click and change this text',
    onChange: action('change span title')
}