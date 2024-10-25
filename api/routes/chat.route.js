import express from "express";
import verifyToken from "../middleware/verifyToken.js";
import {
  addChat,
  getChat,
  getChats,
  readChat,
} from "../controllers/chat.controller.js";

const router = express.Router();

router.post("/create", verifyToken, addChat);
router.get("/", verifyToken, getChats);
router.get("/:id", verifyToken, getChat);
router.put("/read/:id", verifyToken, readChat);

export default router;
