import React from "react";
import { ComponentMeta, ComponentStory } from "@storybook/react";
import { Login } from "@app/features/auth/login/login.component";
import { Provider } from "react-redux";
import { store } from "@app/app/store";
import { HashRouter } from "react-router-dom";

export default {
  title: "App/login",
  component: Login,
} as ComponentMeta<typeof Login>;

const Template: ComponentStory<typeof Login> = () => (
  <HashRouter>
    <Provider store={store}>
      <Login />
    </Provider>
  </HashRouter>
);
export const View = Template.bind({});
