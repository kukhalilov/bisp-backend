import * as appointmentDal from "../../db/dataAccess/appointmentDal.js";

export const getAllAppointments = async (search?: string) => {
  const appointments = await appointmentDal.fetchAllAppointments(search);
  return appointments;
};

export const bookAppointment = async (
  appointmentData: any,
  userNotificationData: any,
  doctorNotificationData: any
) => {
  const result = await appointmentDal.saveAppointment(
    appointmentData,
    userNotificationData,
    doctorNotificationData
  );
  return result;
};

export const completeAppointment = async (appointmentId: string) => {
  const result = await appointmentDal.markAppointmentAsCompleted(appointmentId);
  return result;
};
