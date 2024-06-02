import { Request, Response } from "express";
import * as appointmentService from "../services/appointmentService.js";

export const getAllAppointments = async (req: Request, res: Response) => {
  try {
    const appointments = await appointmentService.getAllAppointments(
      req.query.search as string
    );
    res.send(appointments);
  } catch (error: any) {
    res
      .status(500)
      .send(`An error occurred while fetching appointments: ${error.message}`);
  }
};

export const bookAppointment = async (req: Request, res: Response) => {
  try {
    const result = await appointmentService.bookAppointment(
      {
        date: req.body.date,
        time: req.body.time,
        doctorId: req.body.doctorId,
        userId: req.body.userId,
      },
      {
        userId: req.body.userId,
        content: `You booked an appointment with Dr. ${req.body.doctorName} ${req.body.doctorSurname} for ${req.body.date} ${req.body.time}`,
      },
      {
        userId: req.body.doctorId,
        content: `You have an appointment with ${req.body.userName} ${req.body.userSurname} on ${req.body.date} at ${req.body.time}`,
      }
    );

    res.status(201).send(result);
  } catch (error: any) {
    res
      .status(500)
      .send(`An error occurred while booking appointment: ${error.message}`);
  }
};

export const markAppointmentCompleted = async (req: Request, res: Response) => {
  try {
    await appointmentService.completeAppointment(req.params.id);
    res.status(201).send("Appointment marked as completed");
  } catch (error: any) {
    res
      .status(500)
      .send(
        `An error occurred while marking appointment as completed: ${error.message}`
      );
  }
};
