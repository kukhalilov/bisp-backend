import express from "express";
import * as clinicController from "../controllers/clinicController.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

router.get("/", clinicController.getAllClinics);

router.get("/pending-clinics", verifyToken, clinicController.getAllPendingClinics);

router.post("/apply", verifyToken, clinicController.applyForClinic);

router.put("/accept/:id", verifyToken, clinicController.acceptClinic);

router.put("/reject/:id", verifyToken, clinicController.rejectClinic);

router.put("/edit/:id", verifyToken, clinicController.editClinic);

router.delete("/:id", verifyToken, clinicController.deleteClinic);

export default router;