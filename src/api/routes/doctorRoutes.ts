import express from "express";
import * as doctorController from "../controllers/doctorController.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

router.get("/", doctorController.getAllDoctors);

router.get("/pending-doctors", verifyToken, doctorController.getNotDoctors);

router.post("/apply/:id", verifyToken, doctorController.applyForDoctor);

router.put("/accept/:id", verifyToken, doctorController.acceptDoctor);

router.put("/reject/:id", verifyToken, doctorController.rejectDoctor);

router.delete("/:id", verifyToken, doctorController.deleteDoctor);

export default router;
