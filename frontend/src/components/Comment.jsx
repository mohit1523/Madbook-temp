import React, { useEffect, useContext, useState } from "react";
import { usersContext } from "../context/UsersContext";

const Comment = (props) => {
  const [user, setUser] = useState({});

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

  const styles = {
    main: {
      position: "relative",
      borderLeft: "1px solid gray",
      margin: "3vh 0",
      padding: "0 5px",
      width: "40vw",
      fontFamily: "Raleway, sans-serif",
      color: "cornflowerblue",
    },
    text: {
      margin: "2vh 0",
      color: "black",
      fontFamily: "rajdhani, sans-serif",
    },
    deleteCmnt: {
      position: "absolute",
      top: 0,
      right: 0,
      cursor: "pointer",
      color: "black",
    },
  };

  const ctxValue = useContext(usersContext);

  const deleteComment = async () => {
    let con = confirm("Do you want to delete comment ?");

    if (con == false) return;

    await fetch("https://madbook-api.vercel.app/comment/deletecomment", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        "auth-token": localStorage.getItem("token"),
      },
      body: JSON.stringify({
        commentId: props.id,
      }),
    })
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        alert(data.msg);
      });
  };

  useEffect(() => {
    setUser(
      ctxValue.userDetails.find((currUser) => {
        return currUser._id === props.userId;
      })
    );
  }, []);

  return (
    <div style={styles.main} className="comment">
      <div>
        {props.userId === ctxValue.currUser._id ? "You" : user.name} commented{" "}
        {getTime(props.date)} ago
      </div>
      <div style={styles.text}>{props.text}</div>
      {ctxValue.currUser._id != props.userId ? (
        <></>
      ) : (
        <div
          onClick={deleteComment}
          style={styles.deleteCmnt}
          title="Click to delete comment"
        >
          <i className="fa-solid fa-trash-can"></i>
        </div>
      )}
    </div>
  );
};

export default Comment;
