import { sendEmail } from "../../utilities/email.js";
import Appointment from "../models/Appointment.js";
import Notification from "../models/Notification.js";
import User from "../models/User.js";

export const fetchAllAppointments = async (search?: string) => {
  const keyword = search
    ? {
        $or: [{ userId: search }, { doctorId: search }],
      }
    : {};

  const appointments = await Appointment.find(keyword)
    .populate("doctorId")
    .populate("userId");
  return appointments;
};

export const saveAppointment = async (
  appointmentData: any,
  userNotificationData: any,
  doctorNotificationData: any
) => {
  const appointment = new Appointment(appointmentData);
  const userNotification = new Notification(userNotificationData);
  const doctorNotification = new Notification(doctorNotificationData);

  await Promise.all([
    appointment.save(),
    userNotification.save(),
    doctorNotification.save(),
  ]);

  const user = await User.findById(appointmentData.userId);
  const doctor = await User.findById(appointmentData.doctorId);
  await sendEmail(user!.email, 'Appointment Booked', userNotification.content);
  await sendEmail(doctor!.email, 'Appointment Booked', doctorNotification.content);

  return appointment;
};

export const markAppointmentAsCompleted = async (appointmentId: string) => {
  const appointment = await Appointment.findByIdAndUpdate(
    { _id: appointmentId },
    { status: "completed" }
  )
    .populate("doctorId")
    .populate("userId");

  if (!appointment) {
    throw new Error("Appointment not found");
  }

  const userNotification = new Notification({
    userId: appointment.userId,
    content: `Your appointment with Dr. ${
      (appointment.doctorId as any).firstName
    } ${(appointment.doctorId as any).lastName} has been completed`,
  });
  const doctorNotification = new Notification({
    userId: appointment.doctorId,
    content: `Your appointment with ${(appointment.userId as any).firstName} ${
      (appointment.userId as any).lastName
    } has been completed`,
  });

  await Promise.all([userNotification.save(), doctorNotification.save()]);

  const user = await User.findById(appointment.userId);
  const doctor = await User.findById(appointment.doctorId);
  await sendEmail(user!.email, 'Appointment Completed', userNotification.content);
  await sendEmail(doctor!.email, 'Appointment Completed', doctorNotification.content);

  return appointment;
};
