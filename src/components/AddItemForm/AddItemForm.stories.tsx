import React from 'react'
import {action} from '@storybook/addon-actions'
import {AddItemForm} from './AddItemForm'
import {ComponentMeta, ComponentStory} from "@storybook/react";

export default {
    title: 'Universal Components/AddItemForm Stories',
    component: AddItemForm
} as ComponentMeta<typeof AddItemForm>;

const asyncCallback = async (...params: any) => {
    action('Button inside form clicked')(...params);
}
const Template: ComponentStory<typeof AddItemForm> = (args) => <AddItemForm {...args}/>;
export const View = Template.bind({});
View.args = {
    addItem: asyncCallback
}

