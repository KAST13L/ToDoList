import {ComponentMeta, ComponentStory} from '@storybook/react';
import React from 'react';
import {App} from './App';
import {Provider} from "react-redux";
import {store} from "@app/app/store";
import {BrowserRouter} from "react-router-dom";
import {withRouter} from "storybook-addon-react-router-v6";

export default {
    title: 'App/App',
    component: App,
    /*decorators: [withRouter],
    parameters: {
        reactRouter: {
            routePath: '/',
        }
    }*/
} as ComponentMeta<typeof App>;

const Template: ComponentStory<typeof App> = (args) => <BrowserRouter><Provider
    store={store}>
    <App {...args} />
</Provider></BrowserRouter>;

export const True = Template.bind({});
True.args = {
    demo: true
}
export const False = Template.bind({});
False.args = {
    demo: false
}
