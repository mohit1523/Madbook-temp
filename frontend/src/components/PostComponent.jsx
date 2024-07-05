import React, { useEffect, useState } from "react";
import Comment from "./Comment";
import ProfilePhoto from "./ProfilePhoto";
import { Link } from "react-router-dom";

export default function Post(props) {
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

  const [commentModal, setCommentModal] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [allComments, setAllComments] = useState({});
  const [likesCount, setLikesCount] = useState(0);
  const [currUserLiked, setCurrUserLiked] = useState(false);

  let toogleLike = () => {
    if (currUserLiked) {
      dislikePost();
    } else {
      likePost();
    }
  };

  let clickComment = () => {
    if (commentModal === false) setCommentModal(true);
    else setCommentModal(false);
  };

  let submitComment = async (e) => {
    e.preventDefault();
    await fetch("http://localhost:3000/comment/addcomment", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "auth-token": localStorage.getItem("token"),
      },
      body: JSON.stringify({
        post: props.id,
        text: commentText,
      }),
    })
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        setCommentText("");
        getComments();
      });
  };

  let getComments = async () => {
    await fetch("http://localhost:3000/comment/getcomments", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "auth-token": localStorage.getItem("token"),
      },
      body: JSON.stringify({
        postId: props.id,
      }),
    })
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        setAllComments(data.reverse());
      });
  };

  let getLikes = async () => {
    await fetch("http://localhost:3000/like/getlikes", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "auth-token": localStorage.getItem("token"),
      },
      body: JSON.stringify({
        postId: props.id,
      }),
    })
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        setLikesCount(data.likes.length);
        setCurrUserLiked(data.currUserLike);
      });
  };

  let likePost = async () => {
    setCurrUserLiked(true);
    await fetch("http://localhost:3000/like/addlike", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "auth-token": localStorage.getItem("token"),
      },
      body: JSON.stringify({
        postId: props.id,
      }),
    })
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        setLikesCount(likesCount + 1);
      });
  };

  let dislikePost = async () => {
    setCurrUserLiked(false);
    await fetch("http://localhost:3000/like/deletelike", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        "auth-token": localStorage.getItem("token"),
      },
      body: JSON.stringify({
        postId: props.id,
      }),
    })
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        setLikesCount(likesCount - 1);
      });
  };

  useEffect(() => {
    getComments();
    getLikes();
  }, []);

  return (
    <div className="post">
      <div className="profileImg">
        <Link to={`/profile/${props.user}`} title="Click to open profile">
          <ProfilePhoto emoji={props.emoji}/>
        </Link>
        <div>
          <h5 className="name">{props.accountName}</h5>
          <h5 className="time">{getTime(props.date)} ago</h5>
        </div>
      </div>
      <div>
        <h1>{props.title}</h1>
        <p>{props.description}</p>
      </div>
      <div className="engagement-section">
        <div onClick={toogleLike}>
          <i
            className={`fa-${currUserLiked ? "solid" : "regular"} fa-heart`}
          ></i>
          <span>{likesCount}</span>
        </div>
        <div onClick={clickComment}>
          <i className="fa-regular fa-comments"></i>
          <span>{allComments.length}</span>
        </div>
      </div>
      {commentModal == true ? (
        <div className="comment-div">
          <h4>Comments </h4>
          <form action="" onSubmit={submitComment}>
            <input
              type="text"
              placeholder="Enter your comment"
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
            />
            <input type="submit" value="Post" />
          </form>
          <div style={{overflowY: "auto", maxHeight: "40vh"}}>
            {allComments &&
              allComments.map((elem) => {
                return (
                  <Comment
                    id={elem._id}
                    userId={elem.user}
                    key={elem._id}
                    text={elem.commentText}
                    date={elem.date}
                  />
                );
              })}
          </div>
        </div>
      ) : (
        <></>
      )}
    </div>
  );
}
