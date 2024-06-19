import Doctor from "../models/Doctor.js";
import User from "../models/User.js";
import Notification from "../models/Notification.js";
import Appointment from "../models/Appointment.js";
import { sendEmail } from "../../utilities/email.js";
import mongoose from "mongoose";

export const getAllDoctors = async (
  page: number,
  pageSize: number = 10,
  sort: string,
  search: string
) => {
  let sortParams: Record<string, any> = {};
  let field = "";
  let order = "";
  if (sort) {
    [field, order] = sort.split(",");
    sortParams = { [field]: order === "desc" ? -1 : 1 };
  }

  let userIds: mongoose.Types.ObjectId[] = [];
  if (search) {
    const words = search.split(" ");
    const regex = new RegExp("\\b" + words.join("|\\b"), "i");
    const users = await User.find({
      $or: [{ firstName: { $regex: regex } }, { lastName: { $regex: regex } }],
    });
    userIds = users.map((user) => user._id);
  }

  if (search && userIds.length === 0) {
    return { data: [], totalPages: 0 };
  }

  const totalDocs = await Doctor.countDocuments({
    ...(userIds.length > 0 ? { id: { $in: userIds } } : {}),
    isDoctor: true,
  });

  const totalPages = Math.ceil(totalDocs / pageSize);

  let doctors = await Doctor.find({
    ...(userIds.length > 0 ? { id: { $in: userIds } } : {}),
    isDoctor: true,
  })
    .populate("id")
    .skip((page - 1) * pageSize)
    .limit(pageSize);

  if (field !== "" && order !== "") {
    doctors.sort((a, b) => {
      let aObj = a.toObject();
      let bObj = b.toObject();
      let aValue = aObj.hasOwnProperty(field)
        ? (aObj as any)[field]
        : (aObj.id as any)[field];
      let bValue = bObj.hasOwnProperty(field)
        ? (bObj as any)[field]
        : (bObj.id as any)[field];
      if (typeof aValue === "string") {
        return order === "asc"
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      } else if (typeof aValue === "number") {
        return order === "asc" ? aValue - bValue : bValue - aValue;
      }
      return 0;
    });
  }

  return { data: doctors, totalPages };
};

export const getPendingDoctors = async (
  page: number,
  pageSize: number = 10,
  sort: string,
  search: string
) => {
  let sortParams: Record<string, any> = {};
  let field = "";
  let order = "";
  if (sort) {
    [field, order] = sort.split(",");
    sortParams = { [field]: order === "desc" ? -1 : 1 };
  }

  let userIds: mongoose.Types.ObjectId[] = [];
  if (search) {
    const words = search.split(" ");
    const regex = new RegExp("\\b" + words.join("|\\b"), "i");
    const users = await User.find({
      $or: [{ firstName: { $regex: regex } }, { lastName: { $regex: regex } }],
    });
    userIds = users.map((user) => user._id);
  }

  if (search && userIds.length === 0) {
    return { data: [], totalPages: 0 };
  }

  const totalDocs = await Doctor.countDocuments({
    ...(userIds.length > 0 ? { id: { $in: userIds } } : {}),
    isDoctor: false,
  });

  const totalPages = Math.ceil(totalDocs / pageSize);

  let doctors = await Doctor.find({
    ...(userIds.length > 0 ? { id: { $in: userIds } } : {}),
    isDoctor: false,
  })
    .populate("id")
    .skip((page - 1) * pageSize)
    .limit(pageSize);

  if (field !== "" && order !== "") {
    doctors.sort((a, b) => {
      let aObj = a.toObject();
      let bObj = b.toObject();
      let aValue = aObj.hasOwnProperty(field)
        ? (aObj as any)[field]
        : (aObj.id as any)[field];
      let bValue = bObj.hasOwnProperty(field)
        ? (bObj as any)[field]
        : (bObj.id as any)[field];
      if (typeof aValue === "string") {
        return order === "asc"
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      } else if (typeof aValue === "number") {
        return order === "asc" ? aValue - bValue : bValue - aValue;
      }
      return 0;
    });
  }

  return { data: doctors, totalPages };
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
  const user = await User.findByIdAndUpdate(userId, {
    isDoctor: true,
    status: "accepted",
  });

  await Doctor.findOneAndUpdate({ id: userId }, { isDoctor: true });

  const notification = new Notification({
    userId,
    content: `Congratulations, Your application has been accepted.`,
  });

  await notification.save();

  await sendEmail(
    user!.email,
    "Doctor Application Accepted",
    notification.content
  );

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

  await sendEmail(
    user!.email,
    "Doctor Application Rejected",
    notification.content
  );

  return "Doctor application rejected successfully, rejection notification sent";
};

export const deleteDoctor = async (userId: string) => {
  await User.findByIdAndUpdate(userId, { isDoctor: false });
  await Doctor.findOneAndDelete({ id: userId });
  await Appointment.findOneAndDelete({ userId });

  return "Doctor deleted successfully";
};
