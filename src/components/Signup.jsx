import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { usersContext } from "../context/UsersContext";
import { useContext } from "react";
import EmojiPicker from "emoji-picker-react";

export default function Signup() {
  const [userdata, setUserdata] = useState({
    name: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    quote: "",
    color: "#ffffff",
  });

  const [emoji, setEmoji] = useState("");

  const ctxValue = useContext(usersContext);
  const navigate = useNavigate();

  let handleSubmit = async (e) => {
    e.preventDefault();
    if (userdata.password !== userdata.confirmPassword) {
      alert("Password does not match");
      return;
    }
    if (userdata.name === "You") {
      alert("Not a Valid Name");
      return;
    }

    if (emoji === "") {
      let nameArr = userdata.name.split(" ");
      let initials = "";

      nameArr.map((part) => {
        part = part.toLocaleUpperCase();
        initials += part.charAt(0);
      });

      setEmoji(initials);
    }

    await fetch("http://localhost:3000/user/createuser", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: userdata.name,
        username: userdata.username,
        password: userdata.password,
        email: userdata.email,
        quote: userdata.quote,
        color: userdata.color,
        emoji: emoji,
      }),
    })
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        if (data.success === true) {
          localStorage.setItem("token", data.authtoken);
          ctxValue.fetchUserDetails();
          alert("User Created");
          navigate("/");
        }
      });
  };

  const onChange = (e) => {
    setUserdata({ ...userdata, [e.target.name]: e.target.value });
  };

  return (
    <div className="signup">
      <h1>Signup</h1>
      <form
        autoComplete="off"
        className="signupForm"
        action=""
        onSubmit={handleSubmit}
      >
        <div>
          <input
            required
            type="text"
            value={userdata.name}
            onChange={onChange}
            name="name"
            placeholder="Enter your name"
          />
          <input
            required
            type="text"
            value={userdata.username}
            onChange={onChange}
            name="username"
            placeholder="Enter your username"
          />
          <input
            required
            type="email"
            value={userdata.email}
            onChange={onChange}
            name="email"
            placeholder="Enter your email"
          />
          <input
            placeholder="Enter your quote"
            type="text"
            name="quote"
            value={userdata.quote}
            onChange={onChange}
            required
          />
          <input
            required
            type="password"
            name="password"
            value={userdata.password}
            onChange={onChange}
            placeholder="Enter your password"
          />
          <input
            required
            type="password"
            name="confirmPassword"
            value={userdata.confirmPassword}
            onChange={onChange}
            placeholder="Enter your password again"
          />
          <input type="submit" value="Signup" />
        </div>
        <div>
          <div className="color-selector-div">
            <label htmlFor="color">Select color for your cover</label>
            <input
              type="color"
              title="Choose your cover color"
              name="color"
              value={userdata.color}
              onChange={onChange}
              id="color"
              required
            />
          </div>
          <div className="emoji-selector-div">
            <span>Select emoji for you</span>
            <span className="emoji">
              <span>{emoji}</span>
            </span>
          </div>
        </div>
        <div>
          <EmojiPicker
            onEmojiClick={(e) => setEmoji(e.emoji)}
            height={"65vh"}
            emojiStyle="facebook"
          />
        </div>
      </form>
    </div>
  );
}
