import React, { useEffect } from "react";
import { Link, Outlet, useLocation, useParams } from "react-router-dom";
import { socket } from "../../socket";

export default function Messages() {
  const location = useLocation();
  const params = useParams();

  useEffect(() => {
    socket.auth = { userId: params.userId };
    socket.connect();

    socket.on("connect", () => {
      console.log("Connected : " + socket.id);
    });

    socket.on("disconnect", () => {
      console.log("User disconnected");
    });

    return () => {
      socket.disconnect();
      socket.off("connect");
      socket.off("disconnect");
    };
  }, []);

  return (
    <>
      <div className="msg-nav">
        <Link
          to={`/messages/${params.userId}/private`}
          className={
            location.pathname.indexOf(`/messages/${params.userId}/private`) != -1 ? "tilt" : ""
          }
        >
          <i className="fa-solid fa-lock"></i>
          <span>Private</span>
        </Link>
        <Link
          to={`/messages/${params.userId}`}
          className={location.pathname === `/messages/${params.userId}` ? "tilt" : ""}
        >
          <i className="fa-solid fa-unlock"></i>
          <span>Public</span>
        </Link>
      </div>
      <Outlet />
    </>
  );
}
