import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import Sidebar from "./components/Sidebar.jsx";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import PostForm from "./components/PostForm.jsx";
import Login from "./components/Login.jsx";
import Signup from "./components/Signup.jsx";
import Messages from "./components/Messages.jsx";
import Profile from "./components/Profile.jsx";
import PublicMsg from "./components/PublicMsg";
import PrivateMsg from "./components/PrivateMsg";
import ChatBox from "./components/ChatBox.jsx";
import PostPage from "./components/PostPage.jsx";
import Notifications from "./components/Notifications.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/",
        element: <PostForm />,
      },
      {
        path: "/people",
        element: <Sidebar />,
      },
      {
        path: "/login",
        element: <Login />,
      },
      {
        path: "/signup",
        element: <Signup />,
      },
      {
        path: "/messages/:userId",
        element: <Messages />,
        children: [
          {
            path: "/messages/:userId",
            element: <PublicMsg />,
          },
          {
            path: "/messages/:userId/private/",
            element: <PrivateMsg />,
            children: [
              {
                path: "/messages/:userId/private/:receiverId",
                element: <ChatBox />,
              },
            ],
          },
        ],
      },
      {
        path: "/profile/:userId",
        element: <Profile />,
      },
      {
        path: "/post/:postId",
        element: <PostPage />,
      },
      {
        path: "/notifications",
        element: <Notifications/>
      }
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
