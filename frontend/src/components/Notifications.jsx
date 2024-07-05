import React, { useEffect, useState } from "react";
import SubNotification from "./SubNotification";

export default function Notifications() {
  const [notifications, setNotifications] = useState([]);

  const getNotifications = async () => {
    await fetch("https://madbook-api.vercel.app/notifications/getnotifications", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "auth-token": localStorage.getItem("token"),
      },
    })
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        setNotifications(data.reverse());
      });
  };

  let getTime = (dt) => {
    const currDay = new Date();
    const dateOfPost = new Date(dt);
    let secondSincePosted = (currDay - dateOfPost) / 1000;

    if (secondSincePosted < 60) {
      return `${Math.round(secondSincePosted)} seconds`;
    }
    secondSincePosted /= 60;
    if (secondSincePosted < 60) {
      return `${Math.round(secondSincePosted)} minutes`;
    }
    secondSincePosted /= 60;
    if (secondSincePosted < 24) {
      return `${Math.round(secondSincePosted)} hours`;
    }
    secondSincePosted /= 24;
    if (secondSincePosted < 30) {
      return `${Math.round(secondSincePosted)} days`;
    }
    secondSincePosted /= 30;
    if (secondSincePosted < 12) {
      return `${Math.round(secondSincePosted)} months`;
    }
    return `${Math.round(secondSincePosted)} years`;
  };

  useEffect(() => {
    getNotifications();
  }, []);
  return (
    <div className="notifications-page">
      {notifications &&
        notifications.map((elem) => {
          return (
            <SubNotification
              key={elem._id}
              sUser={elem.sendingUser}
              link={elem.link}
              type={elem.type}
              date={getTime(elem.date)}
            />
          );
        })}
    </div>
  );
}
