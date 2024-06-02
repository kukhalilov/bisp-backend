import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import * as userDal from "../../db/dataAccess/userDal.js";
import User from "../../db/models/User.js";

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
  const { emailPresent } = await userDal.registerUser(userData);

  if (emailPresent) {
    throw new Error("An error occurred while registering user");
  }

  const hashedPass = bcrypt.hashSync(userData.password, 10);
  const user = new User({ ...userData, password: hashedPass });
  const result = await user.save();

  if (!result) {
    throw new Error("An error occurred while registering user");
  }

  return "User registered successfully";
};

export const updateUserProfile = async (userId: string, updatedData: any) => {
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

export const getAllUsers = async (excludeUserId: string) => {
  const users = await userDal.getAllUsers(excludeUserId);
  return users;
};

export const deleteUser = async (userId: string) => {
  const result = await userDal.deleteUser(userId);

  if (!result) {
    throw new Error("An error occurred while deleting user");
  }

  return result;
};
