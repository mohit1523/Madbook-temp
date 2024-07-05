import React, { useEffect, useState } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import { socket } from "../../socket";
import ProfilePhoto from "./ProfilePhoto";

export default function ChatBox(props) {
  const params = useParams();
  const { state } = useLocation();
  const thisUser = state.user;
  const [allMsgs, setAllMsgs] = useState([]);
  const [currMsg, setCurrMsg] = useState("");

  const fetchMsgs = async () => {
    await fetch("https://madbook-api.vercel.app/chat/getuserchat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "auth-token": localStorage.getItem("token"),
      },
      body: JSON.stringify({
        receiver: params.receiverId,
      }),
    })
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        setAllMsgs(data);
      });
  };

  useEffect(() => {
    setAllMsgs([]);
    fetchMsgs();

    socket.on("private-msg", ({ msg, from }) => {
      console.log("Message : " + msg + " | " + "From : " + from);
      setAllMsgs((preMsg) => [
        ...preMsg,
        {
          sender: from,
          receiver: params.receiverId,
          msg: msg,
          date: new Date()
        },
      ]);
    });

    return () => {
      socket.off("private-msg");
    };
  }, []);

  const sendMsg = async (e) => {
    e.preventDefault();
    await fetch("https://madbook-api.vercel.app/chat/sendmsg", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "auth-token": localStorage.getItem("token"),
      },
      body: JSON.stringify({
        receiver: params.receiverId,
        msg: currMsg,
      }),
    })
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        setCurrMsg("");
      });

    socket.emit("private-msg", {
      msg: currMsg,
      to: params.receiverId,
    });
    setCurrMsg("");
  };

  let getTimeWithAMPM = (time) => {
    let [h, m] = time;
    return `${h % 12 ? h % 12 : 12}:${m < 10 ? "0" + m : m} ${
      h >= 12 ? "PM" : "AM"
    }`;
  };

  let getTimeOfMsg = (date) => {
    let dt = new Date(date);
    return getTimeWithAMPM([dt.getHours(), dt.getMinutes()]);
  };

  return (
    <div className="chatbox">
      <div className="user-details-chat">
        <ProfilePhoto emoji={thisUser.emoji}/>
        <Link
          title="Click to view profile"
          to={`/profile/${params.receiverId}`}
        >
          {thisUser.name}
        </Link>
      </div>
      <div className="user-chats">
        {allMsgs &&
          allMsgs.map((elem) => {
            return (
              <div
                className={`${
                  elem.sender != thisUser._id ? "my-msg" : "other-msg"
                }`}
                key={elem.date}
              >
                <div>{elem.msg}</div>
                <div className="time-of-msg">{getTimeOfMsg(elem.date)}</div>
              </div>
            );
          })}
      </div>

      <form action="" onSubmit={sendMsg}>
        <div>
          <i className="fa-brands fa-mdb"></i>
          <input
            value={currMsg}
            onChange={(e) => {
              setCurrMsg(e.target.value);
            }}
            type="text"
            required
          />
        </div>
        <button id="sendBtn" disabled={currMsg === ""} type="submit">
          <i className="fa-regular fa-paper-plane"></i>
        </button>
      </form>
    </div>
  );
}
