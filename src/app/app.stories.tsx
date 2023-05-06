import { ComponentMeta, ComponentStory } from "@storybook/react";
import React from "react";
import { App } from "./App";
import { Provider } from "react-redux";
import { store } from "@app/app/store";
import { BrowserRouter } from "react-router-dom";

export default {
  title: "App/App",
  component: App,
} as ComponentMeta<typeof App>;

const Template: ComponentStory<typeof App> = (args) => (
  <BrowserRouter>
    <Provider store={store}>
      <App {...args} />
    </Provider>
  </BrowserRouter>
);

export const View = Template.bind({});
View.args = {};
