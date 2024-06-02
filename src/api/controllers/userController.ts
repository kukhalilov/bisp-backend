import { Request, Response } from "express";
import * as userService from "../services/userService.js";

export const getUser = async (req: Request, res: Response) => {
  try {
    const user = await userService.getUserById(req.params.id);
    return res.send(user);
  } catch (error: any) {
    res.status(500).send(error.message);
  }
};

export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const users = await userService.getAllUsers(
      req.query.excludeUserId as string
    );
    return res.send(users);
  } catch (error: any) {
    res.status(500).send(error.message);
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const result = await userService.loginUser(email, password);
    return res.status(201).send(result);
  } catch (error: any) {
    res.status(400).send(error.message);
  }
};

export const register = async (req: Request, res: Response) => {
  try {
    const result = await userService.registerUser(req.body);
    return res.status(201).send(result);
  } catch (error: any) {
    res.status(400).send(error.message);
  }
};

export const updateProfile = async (req: Request, res: Response) => {
  try {
    const result = await userService.updateUserProfile(req.params.id, req.body);
    return res.status(201).send(result);
  } catch (error: any) {
    res.status(500).send(error.message);
  }
};

export const deleteUser = async (req: Request, res: Response) => {
  try {
    const result = await userService.deleteUser(req.params.id);
    return res.send(result);
  } catch (error: any) {
    res.status(500).send(error.message);
  }
};
