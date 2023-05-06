import React from "react";
import { ComponentMeta, ComponentStory } from "@storybook/react";
import { Header } from "@app/features/header/header.component";
import { Provider } from "react-redux";
import { store } from "@app/app/store";
import { BrowserRouter } from "react-router-dom";

export default {
  title: "App/header",
  component: Header,
} as ComponentMeta<typeof Header>;

const Template: ComponentStory<typeof Header> = (args) => (
  <BrowserRouter>
    <Provider store={store}>
      <Header {...args} />
    </Provider>
  </BrowserRouter>
);
export const View = Template.bind({});
View.args = {};
