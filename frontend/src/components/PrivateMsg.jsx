import React, { useContext } from "react";
import logo from "../assets/mad-logo.png";
import { Link, Outlet, useParams } from "react-router-dom";
import { usersContext } from "../context/UsersContext";
import ProfilePhoto from "./ProfilePhoto";

export default function PrivateMsg() {
  const ctxValue = useContext(usersContext);
  const params = useParams();

  return (
    <div className="private-messages">
      <div className="allpeople">
        <ul>
          {ctxValue.userDetails &&
            ctxValue.userDetails.map((elem) => {
              if (elem.name === "You") {
                return <div key={elem._id}></div>;
              } else {
                return (
                  <li key={elem._id}>
                    <Link
                      to={`/messages/${params.userId}/private/${elem._id}`}
                      state={{ user: elem }}
                    >
                      <ProfilePhoto emoji={elem.emoji} />
                      <span>{elem.name}</span>
                    </Link>
                  </li>
                );
              }
            })}
        </ul>
      </div>

      <Outlet />
    </div>
  );
}
