import React from "react";
import { CircularProgress } from "@mui/material";

export const Loader = () => {
  return (
    <div className="fixed w-[100%] text-center top-[30%]">
      <CircularProgress size={"15rem"} />
    </div>
  );
};
