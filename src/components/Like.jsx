import React, { useContext } from "react";
import { usersContext } from "../context/UsersContext";

export default function Like(props) {
  const ctxValue = useContext(usersContext);


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

  let styles = {
    main:{
        background: "cornflowerblue",
        margin: "2vh 2vw",
        padding: "2vh 1vw",
        fontFamily: "Raleway, sans-serif",
        borderRadius: "10px"
    },
    icon: {
        marginRight : "1vw",
    }
  }

  return (
    <div style={styles.main}>
      <i style={styles.icon} className="fa-brands fa-gratipay"></i>
      {props.id === ctxValue.currUser._id ? "You" : props.name} liked a post {getTime(props.date)} ago
    </div>
  );
}
