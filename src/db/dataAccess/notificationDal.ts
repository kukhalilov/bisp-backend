import Notification from "../models/Notification.js";

export const getAllNotifications = async (userId: string) => {
  return Notification.find({ userId });
};
