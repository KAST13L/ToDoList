import React from 'react'
import {ComponentMeta, ComponentStory} from "@storybook/react";
import {Header} from "@app/features/Header/header.component";
import {Provider} from "react-redux";
import {store} from "@app/app/store";
import {BrowserRouter} from "react-router-dom";

export default {
    title: 'App/Header',
    component: Header,
} as ComponentMeta<typeof Header>;

const Template: ComponentStory<typeof Header> = (args) => <BrowserRouter><Provider
    store={store}><Header {...args}/></Provider></BrowserRouter>;
export const UserIsAuthorized = Template.bind({});
UserIsAuthorized.args = {
    demo: true
}
export const UserIsNotAuthorized = Template.bind({});
UserIsNotAuthorized.args = {
    demo: false
}





