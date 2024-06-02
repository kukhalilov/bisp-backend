import Appointment from "../models/Appointment.js";
import Notification from "../models/Notification.js";

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

  return appointment;
};
