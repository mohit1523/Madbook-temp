import "./App.css";
import Navbar from "./components/Navbar";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import UserDetailsProvider from "./context/UsersContext";
import { useEffect, useState } from "react";
import PublicMsgContext from "./context/PublicMsgContext";

function App() {
  const navigate = useNavigate();
  const location = useLocation();
  const [link, setLink] = useState("signup");
  useEffect(() => {
    if (location.pathname === "/login") setLink("login");
    else if (location.pathname === "/signup") setLink("signup");
    else if (!localStorage.getItem("token")) {
      navigate(`/${link}`);
    }
  }, []);
  return (
    <>
      <PublicMsgContext>
        <UserDetailsProvider>
          <Navbar />
          <Outlet />
        </UserDetailsProvider>
      </PublicMsgContext>
    </>
  );
}

export default App;
