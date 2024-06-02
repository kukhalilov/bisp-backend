import express from "express";
import { verifyToken } from "../middleware/auth.js";
import * as userController from "../controllers/userController.js";

const router = express.Router();

router.get("/", verifyToken, userController.getAllUsers);

router.get("/:id", userController.getUser);

router.put("/:id/update-profile", verifyToken, userController.updateProfile);

router.delete("/:id", verifyToken, userController.deleteUser);

router.post("/login", userController.login);

router.post("/register", userController.register);

export default router;
