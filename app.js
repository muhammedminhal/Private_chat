var app = require("express")();
var http = require("http").createServer(app);
var io = require("socket.io")(http);

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

io.on("connection", (socket) => {
  if (socket.handshake.query.username) {
    const username = socket.handshake.query.username;
    console.log(username, "created a room and joined");
    console.log(username, "connected");
    socket.join(username);
  }

  if (socket.handshake.query.target) {
    const target = socket.handshake.query.target;
    socket.join(target);
    console.log("a user joined the room", target);
  }

  socket.on("chat message", (body) => {
    if(body.origin){
      io.to(body.origin).emit("chat message", body.msg);
    }else if(body.target){
      io.to(body.target).emit("chat message", body.msg);

    }
  });

  socket.on("disconnect", () => {
    console.log("user disconnected");
  });
});

http.listen(8000, () => {
  console.log("listening on *:8000");
});
