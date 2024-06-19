import User from "../models/User.js";
import Doctor from "../models/Doctor.js";
import Appointment from "../models/Appointment.js";

export const getAllUsers = async (
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

  let searchParams: Record<string, any> = {};
  if (search) {
    const words = search.split(" ");
    const regex = new RegExp("\\b" + words.join("|\\b"), "i");
    const users = await User.find({
      $or: [{ firstName: { $regex: regex } }, { lastName: { $regex: regex } }],
    });
    const userIds = users.map((user) => user._id);
    searchParams = { _id: { $in: userIds } };
  }

  const totalDocs = await User.countDocuments(searchParams);

  const totalPages = Math.ceil(totalDocs / pageSize);

  const users = await User.find(searchParams)
    .select("-password")
    .sort(sortParams)
    .skip((page - 1) * pageSize)
    .limit(pageSize);

  return { data: users, totalPages };
};

export const getUserById = async (userId: string) => {
  return User.findById(userId).select("-password");
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

export const checkIfUserExists = async (email: string) => {
  const user = await User.findOne({ email: email });

  const emailPresent = user ? true : false;

  return emailPresent;
};
