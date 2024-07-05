import React, { useContext, useEffect, useState } from "react";
import Post from "./PostComponent";
import Comment from "./Comment";
import ProfilePhoto from "./ProfilePhoto";
import { Link, useNavigate, useParams } from "react-router-dom";
import Like from "./Like";
import { usersContext } from "../context/UsersContext";

export default function Profile() {
  const params = useParams();
  const ctxValue = useContext(usersContext);
  const navigate = useNavigate();

  const [allPost, setAllPosts] = useState([]);
  const [allComments, setAllComments] = useState([]);
  const [allLikes, setAllLikes] = useState([]);
  const [user, setUser] = useState({});
  const [tab, setTab] = useState("post");

  let callAllPosts = async () => {
    await fetch("http://localhost:3000/post/getpostsofuser", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "auth-token": localStorage.getItem("token"),
      },
      body: JSON.stringify({
        _id: params.userId,
      }),
    })
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        setAllPosts(data);
      });
  };

  let callAllLikes = async () => {
    await fetch("http://localhost:3000/like/getlikesofuser", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "auth-token": localStorage.getItem("token"),
      },
      body: JSON.stringify({
        _id: params.userId,
      }),
    })
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        setAllLikes(data);
      });
  };

  let callAllComments = async () => {
    await fetch("http://localhost:3000/comment/getcommentsOfuser", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "auth-token": localStorage.getItem("token"),
      },
      body: JSON.stringify({
        _id: params.userId,
      }),
    })
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        setAllComments(data.reverse());
      });
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  let getUser = async () => {
    await fetch("http://localhost:3000/user/getsingleuser", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "auth-token": localStorage.getItem("token"),
      },
      body: JSON.stringify({
        userId: params.userId,
      }),
    })
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        setUser(data.user);
      });
  };

  useEffect(() => {
    getUser();
    callAllPosts();
    callAllComments();
    callAllLikes();
  }, [params]);

  return (
    <div className="profile">
      <div className="user-info-box">
        <ProfilePhoto emoji={user.emoji} />
        <div>
          <h1>{user.name}</h1>
          <h3>@{user.username}</h3>
        </div>
        <div>
          <a href={`mailto:${user.email}`} className="sendEmailBtn">
            <i className="fa-solid fa-envelope"></i> {user.email}
          </a>
        </div>
        {ctxValue.currUser._id === params.userId ? (
          <Link
            title="Click to logout"
            className="logout"
            onClick={handleLogout}
          >
            Logout <i className="fa-solid fa-arrow-right-from-bracket"></i>
          </Link>
        ) : (
          <></>
        )}
      </div>
      <div className="backImg" style={{ background: user.color }}>
        <span>{user.quote}</span>
      </div>
      <div className="profile-nav">
        <Link
          onClick={() => setTab("post")}
          className={`${tab === "post" ? "active-tab" : ""}`}
        >
          Posts
        </Link>
        <Link
          onClick={() => setTab("like")}
          className={`${tab === "like" ? "active-tab" : ""}`}
        >
          Likes
        </Link>
        <Link
          onClick={() => setTab("comment")}
          className={`${tab === "comment" ? "active-tab" : ""}`}
        >
          Comments
        </Link>
      </div>

      <div className={`user-posts-box ${tab != "post" ? "disable-tab" : ""}`}>
        {allPost &&
          allPost.map((elem) => {
            if (elem.user === params.userId) {
              return (
                <Post
                  user={elem.user}
                  key={elem._id}
                  id={elem._id}
                  accountName={
                    user._id === ctxValue.currUser._id ? "You" : user.name
                  }
                  title={elem.title}
                  description={elem.description}
                  date={elem.date}
                  emoji={user.emoji}
                />
              );
            }
          })}
      </div>
      <div className={`user-likes-box ${tab != "like" ? "disable-tab" : ""}`}>
        {allLikes &&
          allLikes.map((elem) => {
            return (
              <Link
                key={elem._id}
                title="Click to open post"
                to={`/post/${elem.post}`}
              >
                <Like id={user._id} name={user.name} date={elem.date} />
              </Link>
            );
          })}
      </div>
      <div
        className={`user-comments-box ${tab != "comment" ? "disable-tab" : ""}`}
      >
        {allComments &&
          allComments.map((elem) => {
            return (
              <Link
                title="Click to open post"
                key={elem._id}
                to={`/post/${elem.post}`}
              >
                <Comment
                  id={elem._id}
                  userId={elem.user}
                  text={elem.commentText}
                  date={elem.date}
                />
              </Link>
            );
          })}
      </div>
    </div>
  );
}
