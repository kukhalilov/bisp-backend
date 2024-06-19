import Clinic from "../models/Clinic.js";
import User from "../models/User.js";
import Notification from "../models/Notification.js";
import { sendEmail } from "../../utilities/email.js";

export const getAllClinics = async (
  page: number,
  pageSize: number = 10,
  sort: string,
  search: string
) => {
  let sortParams: Record<string, any> = {};
  if (sort) {
    const [field, order] = sort.split(",");
    sortParams = { [field]: order === "desc" ? -1 : 1 };
  }

  const searchParams = search
    ? { name: { $regex: search, $options: "i" } }
    : {};

  const totalDocs = await Clinic.countDocuments({
    status: "accepted",
    ...searchParams,
  });

  const totalPages = Math.ceil(totalDocs / pageSize);

  const clinics = await Clinic.find({ status: "accepted", ...searchParams })
    .populate("doctors")
    .populate("applicant")
    .sort(sortParams)
    .skip((page - 1) * pageSize)
    .limit(pageSize);

  return { data: clinics, totalPages };
};

export const getAllPendingClinics = async (
  page: number,
  pageSize: number = 10,
  sort: string,
  search: string
) => {
  let sortParams: Record<string, any> = {};
  if (sort) {
    const [field, order] = sort.split(",");
    sortParams = { [field]: order === "desc" ? -1 : 1 };
  }

  const searchParams = search
    ? { name: { $regex: search, $options: "i" } }
    : {};

  const totalDocs = await Clinic.countDocuments({
    status: "pending",
    ...searchParams,
  });

  const totalPages = Math.ceil(totalDocs / pageSize);

  const clinics = await Clinic.find({ status: "pending", ...searchParams })
    .populate("doctors")
    .populate("applicant")
    .sort(sortParams)
    .skip((page - 1) * pageSize)
    .limit(pageSize);

  return { data: clinics, totalPages };
};

export const applyForClinic = async (formDetails: any) => {
  const clinic = new Clinic({ ...formDetails, status: "pending" });
  console.log(clinic);
  const result = await clinic.save();

  if (!result) {
    throw new Error("An error occurred while submitting clinic application");
  }

  return "Clinic application submitted successfully";
};

export const acceptClinicApplication = async (clinicId: string) => {
  const clinic = await Clinic.findByIdAndUpdate(clinicId, {
    status: "accepted",
  });
  const user = await User.findById(clinic!.applicant);

  const notification = new Notification({
    userId: clinic!.applicant,
    content: `Congratulations, Your clinic application has been accepted.`,
  });

  await notification.save();

  await sendEmail(
    user!.email,
    "Clinic Application Accepted",
    notification.content
  );

  return "Clinic application accepted successfully, notification sent";
};

export const rejectClinicApplication = async (clinicId: string) => {
  const clinic = await Clinic.findById(clinicId);
  const user = await User.findById(clinic!.applicant);

  await Clinic.findByIdAndDelete(clinicId);

  const notification = new Notification({
    userId: clinic!.applicant,
    content: `Sorry, Your clinic application has been rejected.`,
  });

  await notification.save();

  await sendEmail(
    user!.email,
    "Clinic Application Rejected",
    notification.content
  );

  return "Clinic application rejected successfully, rejection notification sent";
};

export const editClinic = async (clinicId: string, formDetails: any) => {
  const clinic = await Clinic.findByIdAndUpdate(clinicId, formDetails, {
    new: true,
  });

  if (!clinic) {
    throw new Error("An error occurred while editing clinic");
  }

  return "Clinic edited successfully";
};

export const deleteClinic = async (clinicId: string) => {
  await Clinic.findByIdAndDelete(clinicId);

  return "Clinic deleted successfully";
};
