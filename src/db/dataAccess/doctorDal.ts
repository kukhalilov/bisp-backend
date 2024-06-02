import Doctor from "../models/Doctor.js";
import User from "../models/User.js";
import Notification from "../models/Notification.js";
import Appointment from "../models/Appointment.js";

export const getAllDoctors = async () => {
  return Doctor.find().populate("id").where("isDoctor").equals(true);
};

export const getNotDoctors = async () => {
  return Doctor.find({
    isDoctor: false,
  }).populate("id");
};

export const applyForDoctor = async (userId: string, formDetails: any) => {
  const alreadyFound = await Doctor.findOne({ id: userId });
  if (alreadyFound) {
    throw new Error("Doctor application already exists");
  }

  const doctor = new Doctor({ ...formDetails, id: userId });
  const result = await doctor.save();

  if (!result) {
    throw new Error("An error occurred while submitting doctor application");
  }

  return "Doctor application submitted successfully";
};

export const acceptDoctorApplication = async (userId: string) => {
  await User.findByIdAndUpdate(userId, {
    isDoctor: true,
    status: "accepted",
  });
  await Doctor.findOneAndUpdate({ id: userId }, { isDoctor: true });

  const notification = new Notification({
    userId,
    content: `Congratulations, Your application has been accepted.`,
  });

  await notification.save();

  return "Doctor application accepted successfully, notification sent";
};

export const rejectDoctorApplication = async (userId: string) => {
  const user = await User.findByIdAndUpdate(userId, {
    isDoctor: false,
    status: "rejected",
  });

  await Doctor.findOneAndDelete({ id: userId });

  const notification = new Notification({
    userId,
    content: `Sorry, Your application has been rejected.`,
  });

  await notification.save();

  return "Doctor application rejected successfully, rejection notification sent";
};

export const deleteDoctor = async (userId: string) => {
  await User.findByIdAndUpdate(userId, { isDoctor: false });
  await Doctor.findOneAndDelete({ id: userId });
  await Appointment.findOneAndDelete({ userId });

  return "Doctor deleted successfully";
};
