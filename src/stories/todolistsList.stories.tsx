import React from 'react'
import {ComponentMeta, ComponentStory} from "@storybook/react";
import {TodolistsList} from "@app/features/todolist-list/todolists-list.component";
import {Provider} from "react-redux";
import {store} from "@app/app/store";
import {BrowserRouter, Route, Routes} from "react-router-dom";

export default {
    title: 'Element TODO/List of todolists',
    component: TodolistsList,
} as ComponentMeta<typeof TodolistsList>;

const Template: ComponentStory<typeof TodolistsList> = (args) => <BrowserRouter>
    <Provider
        store={store}>
        <Routes>
            <Route path='/todolist' element={<TodolistsList {...args}/>}/>
            <Route path='/' element={<TodolistsList {...args}/>}/>
        </Routes>
    </Provider>
</BrowserRouter>;
export const ListTodolistsWithTodo = Template.bind({})
ListTodolistsWithTodo.args = {}






