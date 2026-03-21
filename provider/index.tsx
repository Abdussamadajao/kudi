import React from "react";
import "../global.css";
import { ThemeProvider } from "./theme-provider";
const Provider = ({ children }: { children: React.ReactNode }) => {
  return <ThemeProvider>{children}</ThemeProvider>;
};

export default Provider;
