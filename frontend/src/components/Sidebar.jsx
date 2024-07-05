import React, { useContext, useState } from "react";
import { usersContext } from "../context/UsersContext";
import Post from "./PostComponent";

export default function Sidebar() {
  const ctxValue = useContext(usersContext);
  const [friend, setFriend] = useState();
  const [userPosts, setUserPosts] = useState([]);

  let fetchPosts = async (id) => {
    await fetch("https://madbook-api.vercel.app/post/getpostsofuser", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        _id: id,
      }),
    })
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        setUserPosts(data.reverse());
        setFriend(ctxValue.userDetails.find((obj) => obj._id === id).name);
      });
  };

  return (
    <div className="sidebar">
      <div className="peoples">
        <h4>People on MadBook :-</h4>
        <table>
          {ctxValue.userDetails &&
            ctxValue.userDetails.map((elem) => {
              if (elem.name === "You") {
                return (
                  <thead key={elem._id}>
                    <tr>
                      <td
                        key={elem._id}
                        onClick={() => {
                          fetchPosts(elem._id);
                        }}
                      >
                        {elem.name}
                      </td>
                    </tr>
                  </thead>
                );
              } else {
                return (
                  <tbody key={elem._id}>
                    <tr>
                      <td
                        onClick={() => {
                          fetchPosts(elem._id);
                        }}
                      >
                        {elem.name}
                      </td>
                    </tr>
                  </tbody>
                );
              }
            })}
        </table>
      </div>
      <div className="display-div">
        <h1>&#128100; {friend}</h1>
        {userPosts.length === 0 ? (
          <div className="noPost">No Posts to show &#128542;</div>
        ) : (
          ""
        )}
        {userPosts &&
          userPosts.map((elem) => {
            return (
              <Post
                user={elem.user}
                key={elem._id}
                id={elem._id}
                accountName={friend}
                title={elem.title}
                description={elem.description}
                date={elem.date}
                emoji={
                  ctxValue.userDetails.find((currUser) => {
                    return currUser._id === elem.user;
                  }).emoji
                }
              />
            );
          })}
      </div>
    </div>
  );
}
