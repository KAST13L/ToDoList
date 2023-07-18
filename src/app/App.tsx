import React, { FC, useEffect } from "react";
import { useSelector } from "react-redux";
import { Route, Routes } from "react-router-dom";
import { Login } from "@app/features/auth/login/login.component";
import { TodolistsList } from "@app/features/todolist-list/todolists-list.component";
import { Header } from "@app/features/header/header.component";
import { selectIsInitialized } from "@app/app/selectors";
import { Loader } from "@app/common/components/Loader/Loader";
import { authThunks } from "@app/features/auth/auth.reducer";
import { useActions } from "@app/common/hooks/useActions";
import { ErrorSnackbar } from "@app/common/components/ErrorSnackbar/ErrorSnackbar";
import { Dnd } from "@app/features/dnd/Dnd";

export const App: FC = () => {
  const isInitialized = useSelector(selectIsInitialized);
  const { initializeApp } = useActions(authThunks);

  useEffect(() => {
    initializeApp();
  }, []);

  if (!isInitialized) return <Loader />;

  return (
    <span>
      <ErrorSnackbar />
      <Header />
      <div className="mx-8">
        <Dnd position={"horizontal"} />
        <Routes>
          <Route path="/" element={<TodolistsList />} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </div>
    </span>
  );
};
