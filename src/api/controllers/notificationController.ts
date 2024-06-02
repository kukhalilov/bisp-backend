import { Request, Response } from "express";
import * as notificationService from "../services/notificationService.js";

export const getAllNotifications = async (req: Request, res: Response) => {
  try {
    const userNotifications = await notificationService.fetchAllNotifications(
      req.params.userId
    );
    res.send(userNotifications);
  } catch (error: any) {
    res
      .status(500)
      .send(`An error occurred while fetching notifications: ${error.message}`);
  }
};
