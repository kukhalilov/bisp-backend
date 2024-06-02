import * as notificationDal from "../../db/dataAccess/notificationDal.js";

export const fetchAllNotifications = async (userId: string) => {
  const notifications = await notificationDal.getAllNotifications(userId);
  return notifications;
};
