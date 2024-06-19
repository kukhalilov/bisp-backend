import express from "express";
import userRoutes from "./userRoutes.js";
import doctorRoutes from "./doctorRoutes.js";
import appointmentRoutes from "./appointmentRoutes.js";
import notificationRoutes from "./notificationRoutes.js";
import clinicRoutes from "./clinicRoutes.js";

const router = express.Router();

router.use("/users", userRoutes);
router.use("/doctors", doctorRoutes);
router.use("/appointments", appointmentRoutes);
router.use("/notifications", notificationRoutes);
router.use("/clinics", clinicRoutes);

export default router;
