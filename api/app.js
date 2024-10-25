import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import authRoute from "./routes/auth.route.js";
import testRoute from "./routes/testRoute.js";
import usersRoute from "./routes/user.route.js";
import postRoute from "./routes/post.route.js";
import chatRoute from "./routes/chat.route.js";
import messageRoute from "./routes/message.route.js";

console.log("here");
const app = express();

app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRoute);
app.use("/api/test", testRoute);
app.use("/api/users", usersRoute);
app.use("/api/posts", postRoute);
app.use("/api/chat", chatRoute);
app.use("/api/messages", messageRoute);

app.listen(1200, () => {
  console.log("Server is running");
});
