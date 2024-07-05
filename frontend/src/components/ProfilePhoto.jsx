import React from "react";

export default function ProfilePhoto(props) {
  const styles = {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    border: "1px solid black",
    borderRadius: "50vw",
    fontFamily: "rajdhani",
    color: "black",
    textShadow: "0 0 3px black",
  };
  return (
    <div className="profilePhoto" style={styles}>
      <span>{props.emoji}</span>
    </div>
  );
}
