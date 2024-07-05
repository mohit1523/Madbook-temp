import React, { useContext } from "react";
import { Link, useLocation } from "react-router-dom";
import { usersContext } from "../context/UsersContext";

export default function Navbar() {
  const location = useLocation();
  const ctxValue = useContext(usersContext);

  return (
    <nav>
      <div>
        <Link className={location.pathname === "/" ? "active" : ""} to="/">
          Home
        </Link>
        <Link
          className={
            location.pathname.indexOf("/messages") != -1 ? "active" : ""
          }
          to={`/messages/${ctxValue.currUser._id}`}
        >
          Messages
        </Link>
        <Link
          className={location.pathname === "/people" ? "active" : ""}
          to="/people"
        >
          People
        </Link>
        <Link
          className={
            location.pathname.indexOf("/profile") != -1 ? "active" : ""
          }
          to={`/profile/${ctxValue.currUser._id}`}
        >
          My Profile
        </Link>
      </div>
      <div>
        {localStorage.getItem("token") ? (
          <Link
            className={location.pathname === "/notifications" ? "active" : ""}
            to="/notifications"
          >
            <i className="fa-solid fa-bell"></i>
          </Link>
        ) : (
          <>
            <Link
              className={location.pathname === "/login" ? "active" : ""}
              to="/login"
            >
              Login
            </Link>
            <Link
              className={location.pathname === "/signup" ? "active" : ""}
              to="/signup"
            >
              Signup
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}
