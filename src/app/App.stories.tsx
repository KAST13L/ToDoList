import {ComponentMeta, ComponentStory} from '@storybook/react';
import React from 'react';
import {App} from './App';
import {Provider} from "react-redux";
import {store} from "@app/app/store";

export default {
    title: 'App/App',
    component: App,
} as ComponentMeta<typeof App>;

const Template: ComponentStory<typeof App> = (args) => <Provider
    store={store}>
    <App {...args} />
</Provider>;

export const View = Template.bind({});
