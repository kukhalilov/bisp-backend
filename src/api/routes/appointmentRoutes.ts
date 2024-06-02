import express from "express";
import { verifyToken } from "../middleware/auth.js";
import * as appointmentController from "../controllers/appointmentController.js";

const router = express.Router();

router.get("/", verifyToken, appointmentController.getAllAppointments);

router.post("/book", verifyToken, appointmentController.bookAppointment);

router.put(
  "/:id/completed",
  verifyToken,
  appointmentController.markAppointmentCompleted
);

export default router;
