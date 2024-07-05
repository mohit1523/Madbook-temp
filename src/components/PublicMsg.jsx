import React, { useContext, useEffect } from "react";
import { useState } from "react";
import { publicMsgContext } from "../context/PublicMsgContext";
import { useParams } from "react-router-dom";
import { socket } from "../../socket";

export default function PublicMsg() {
  const msgCtxValue = useContext(publicMsgContext);
  const params = useParams();
  const [msg, setMsg] = useState("");

  const sendMsg = (e) => {
    e.preventDefault();

    msgCtxValue.setAllMsgs((prevAllMsgs) => [
      ...prevAllMsgs,
      { user: "You", msg: msg },
    ]);

    socket.emit("public-msg", {
      msg: msg,
      currUser: params.userId,
    });
    setMsg("");
  };

  useEffect(() => {
    socket.on("msg-received", (data) => {
      msgCtxValue.setAllMsgs((prevAllMsgs) => [
        ...prevAllMsgs,
        { user: data.currUser, msg: data.msg },
      ]);
    });

    const sendBtn = document.getElementById("sendBtn");
    sendBtn.addEventListener("mousedown", () => {
      sendBtn.style.boxShadow = "0 0 5px black inset";
    });
    sendBtn.addEventListener("mouseup", () => {
      sendBtn.style.boxShadow = "0 0 0px black inset";
    });

    return () => {
      socket.off("msg-received");
    };
  }, []);

  return (
    <div className="public-messages">
      <div id="msgs">
        {msgCtxValue.allMsgs &&
          msgCtxValue.allMsgs.map((elem) => {
            return (
              <div
                className={elem.user === "You" ? "my-msg" : "other-msg"}
                key={Math.random()}
              >
                <div>{elem.user === "You" ? "You" : elem.user}</div>
                <div>{elem.msg}</div>
              </div>
            );
          })}
      </div>
      <form onSubmit={sendMsg} action="">
        <input
          type="text"
          required
          onChange={(e) => setMsg(e.target.value)}
          value={msg}
        />
        <input id="sendBtn" type="submit" value="Send Message" />
      </form>
    </div>
  );
}
