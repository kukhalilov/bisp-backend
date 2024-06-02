import express from "express";
import { verifyToken } from "../middleware/auth.js";
import * as notificationController from "../controllers/notificationController.js";

const router = express.Router();

router.get("/:userId", verifyToken, notificationController.getAllNotifications);

export default router;
