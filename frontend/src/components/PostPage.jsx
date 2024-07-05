import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Post from "./PostComponent";

export default function PostPage() {
  const params = useParams();
  const [post, setPost] = useState({});
  const [user, setUser] = useState(null);

  const getPost = async () => {
    await fetch("https://madbook-api.vercel.app/post/getpost", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "auth-token": localStorage.getItem("token"),
      },
      body: JSON.stringify({
        postId: params.postId,
      }),
    })
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        setPost(data);
        getUser();
      });
  };

  let getUser = async () => {
    await fetch("https://madbook-api.vercel.app/user/getsingleuser", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "auth-token": localStorage.getItem("token"),
      },
      body: JSON.stringify({
        userId: post.user,
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
    getPost();
  }, [post]);

  return (
    <>
      {user && (
        <Post
          user={user._id}
          key={post._id}
          id={post._id}
          accountName={user.name}
          title={post.title}
          description={post.description}
          date={post.date}
          profilePhoto={user.profilePhoto}
        />
      )}
    </>
  );
}
