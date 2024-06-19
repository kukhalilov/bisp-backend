import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import * as userDal from "../../db/dataAccess/userDal.js";
import User from "../../db/models/User.js";
import Notification from "../../db/models/Notification.js";
import { sendEmail } from "../../utilities/email.js";

export const loginUser = async (email: string, password: string) => {
  const user = await User.findOne({ email });

  if (!user || !bcrypt.compareSync(password, user.password)) {
    throw new Error("Incorrect credentials");
  }

  const token = jwt.sign(
    { userId: user._id, isAdmin: user.isAdmin },
    process.env.JWT_SECRET || "your-secret-key",
    { expiresIn: "2 days" }
  );

  return { msg: "User logged in successfully", token };
};

export const registerUser = async (userData: any) => {
  const emailPresent = await userDal.checkIfUserExists(userData.email);

  if (emailPresent) {
    throw new Error("An error occurred while registering user");
  }

  const hashedPass = bcrypt.hashSync(userData.password, 10);
  const user = new User({ ...userData, password: hashedPass });
  const result = await user.save();

  if (!result) {
    throw new Error("An error occurred while registering user");
  }

  const notification = new Notification({
    userId: user.id,
    content: `Congratulations, You have successfully registered!`,
  });

  await notification.save();

  await sendEmail(user!.email, "Successful Registration", notification.content);

  return "User registered successfully";
};

export const updateUserProfile = async (userId: string, updatedData: any) => {
  if (updatedData.password) {
    updatedData.password = bcrypt.hashSync(updatedData.password, 10);
  }

  const result = await userDal.updateUser(userId, updatedData);

  if (!result) {
    throw new Error("An error occurred while updating user");
  }

  return result;
};

export const getUserById = async (userId: string) => {
  const user = await userDal.getUserById(userId);

  if (!user) {
    throw new Error("User not found");
  }

  return user;
};

export const getAllUsers = async (
  page: number,
  pageSize: number,
  sort: string,
  search: string
) => {
  return userDal.getAllUsers(page, pageSize, sort, search);
};

export const deleteUser = async (userId: string) => {
  const result = await userDal.deleteUser(userId);

  if (!result) {
    throw new Error("An error occurred while deleting user");
  }

  return result;
};
