import express from "express";
import { login, logout, regsiter } from "../controllers/auth.controller.js";

const router = express.Router();

router.post("/register", regsiter);
router.post("/login", login);
router.post("/logout", logout);

export default router;
