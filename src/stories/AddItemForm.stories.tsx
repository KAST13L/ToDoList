import React from 'react'
import {AddItemForm} from '../common/components/AddItemForm/AddItemForm'
import {ComponentMeta, ComponentStory} from "@storybook/react";

export default {
    title: 'Universal Components/AddItemForm Stories',
    component: AddItemForm,
    argTypes: {
        addItem: {action: 'add item'}
    }
} as ComponentMeta<typeof AddItemForm>;

const Template: ComponentStory<typeof AddItemForm> = (args) => <AddItemForm {...args}/>;
export const View = Template.bind({});

