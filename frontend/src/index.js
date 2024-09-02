import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.js";
import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import AuthLayout from "./layout/auth_layout.jsx";
import ProtectedLayout from "./layout/protected_layout.jsx";

import Login from "./components/Login.js";
import Dashboard from "./components/Dashboard.js";
import Branches from "./components/BranchTrack.js";
import Sidebar from "./components/Sidebar.js";
import Todos from "./components/Todos.js";

import AuthContextProvider from "./context/auth_context.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <ProtectedLayout />,
    children: [
      { path: "dashboard", element: <Dashboard /> },
      { path: "branches", element: <Branches /> },
      { path: "todos", element: <Todos /> },
    ],
  },
  {
    path: "auth",
    element: <AuthLayout />,
    children: [
      {
        path: "login",
        element: <Login />,
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AuthContextProvider>
      <RouterProvider router={router} />
    </AuthContextProvider>
  </React.StrictMode>
);
