const express = require("express");
const connectToDB = require("./db.js");
const cors = require("cors");
const post = require("./routes/post.js");
const user = require("./routes/user.js");
const chat = require("./routes/chat.js");
const comment = require("./routes/comment.js");
const like = require("./routes/like.js");
const notifications = require("./routes/notifications.js");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://https://madbook.vercel.app/:5173",
  },
});

app.get('/', (req, res) => {
  res.send("Express on vercel")
})

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use("/post", post);
app.use("/chat", chat);
app.use("/user", user);
app.use("/comment", comment);
app.use("/like", like);
app.use("/notifications", notifications);

io.use((socket, next) => {
  const uid = socket.handshake.auth.userId;
  socket.userId = uid;
  next();
})

io.on("connection", (socket) => {
  socket.join(socket.userId);

  socket.on("public-msg", (data) => {
    socket.broadcast.emit("msg-received", data);
  });

  socket.on("private-msg", ({ msg, to }) => {
    socket.join(to);
    io.to(to).emit("private-msg", {
      msg: msg,
      from: socket.userId
    })
    socket.leave(to);
  })
});

connectToDB();

server.listen(3000, () => {
  console.log(`MadBook app listening on port 3000`);
});
