import {ComponentMeta, ComponentStory} from '@storybook/react';
import React from 'react';
import {App} from './App';
import {Provider} from "react-redux";
import {store} from "@app/app/store";
import {HashRouter} from "react-router-dom";

export default {
    title: 'App/App',
    component: App
} as ComponentMeta<typeof App>;

const Template: ComponentStory<typeof App> = (args) => <HashRouter><Provider
    store={store}>
    <App {...args} />
</Provider></HashRouter>;

export const True = Template.bind({});
True.args = {
    demo: true
}
export const False = Template.bind({});
False.args = {
    demo: false
}
