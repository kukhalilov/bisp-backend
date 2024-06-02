import User from "../models/User.js";
import Doctor from "../models/Doctor.js";
import Appointment from "../models/Appointment.js";

export const getUserById = async (userId: string) => {
  return User.findById(userId).select("-password");
};

export const getAllUsers = async (excludeUserId: string) => {
  return User.find({ _id: { $ne: excludeUserId } }).select("-password");
};

export const deleteUser = async (userId: string) => {
  const user = await User.findById(userId);
  const idForAppointmentDeletion = user?.isDoctor ? "doctorId" : "userId";
  await user?.deleteOne();
  await Doctor.findOneAndDelete({ id: userId });
  await Appointment.deleteMany({ [idForAppointmentDeletion]: userId });
  return "User deleted successfully";
};

export const updateUser = async (userId: string, updatedData: any) => {
  const result = await User.findByIdAndUpdate(userId, updatedData);

  if (!result) {
    return null;
  }

  return "User updated successfully";
};

export const registerUser = async (userData: any) => {
  const emailPresent = await User.findOne({ email: userData.email });

  return { emailPresent };
};
