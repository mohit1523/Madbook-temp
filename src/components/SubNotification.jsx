import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function SubNotification(props) {
  const [sendingUser, setSendingUser] = useState({});

  let getUser = async () => {
    await fetch("http://localhost:3000/user/getsingleuser", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "auth-token": localStorage.getItem("token"),
      },
      body: JSON.stringify({
        userId: props.sUser,
      }),
    })
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        console.log(data);
        setSendingUser(data.user);
      });
  };

  useEffect(() => {
    getUser();
  }, []);

  //COMPONENT RENDER OR RETURN CODE
  switch (props.type) {
    case "like":
      return (
        <Link title="Click to view post" to={props.link}>
          <i className="fa-brands fa-gratipay"></i>
          <div>
            <Link
              title="Click to view user profile"
              to={`/profile/${sendingUser._id}`}
            >
              {sendingUser.name}
            </Link>{" "}
            liked on your post {props.date} ago
          </div>
        </Link>
      );
    case "comment":
      return (
        <Link title="Click to view post" to={props.link}>
          <i className="fa-solid fa-comments"></i>
          <div>
            <Link
              title="Click to view user profile"
              to={`/profile/${sendingUser._id}`}
            >
              {sendingUser.name}
            </Link>{" "}
            commented on your post {props.date} ago
          </div>
        </Link>
      );
    default:
      return <></>;
  }
}
