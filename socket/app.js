import { Server } from "socket.io";

const io = new Server({
  cors: {
    origin: "https://localhost:5173",
    credentials: true,
  },
});

let onlineUser = [];
console.log(onlineUser);

function addUser(userId, socketId) {
  const userExists = onlineUser.find((user) => user.userId === userId);
  if (!userExists) {
    onlineUser.push({ userId, socketId });
  }
}

function removeUser(socketId) {
  onlineUser = onlineUser.filter((user) => user.socketId !== socketId);
}

function getUser(userId) {
  return onlineUser.find((user) => user.userId === userId);
}

io.on("connection", (socket) => {
  socket.on("newUser", (userId) => {
    addUser(userId, socket.id);
  });

  socket.on("sendMessage", ({ recieverId, data }) => {
    const reciever = getUser(recieverId);

    io.to(reciever?.socketId).emit("getMessage", data);
  });

  socket.on("disconnect", () => removeUser(socket.id));
});

io.listen(4000);
