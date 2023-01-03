import {ComponentStory, ComponentMeta} from '@storybook/react';
import {Header} from "@app/features/Header/header.component";
import {Provider} from "react-redux";
import {store} from "@app/app/store";

export default {
    title: 'Common/Header',
    component: Header,
} as ComponentMeta<typeof Header>;

const Template: ComponentStory<typeof Header> = () => <Provider
    store={store}><Header/></Provider>

export const View = Template.bind({});
