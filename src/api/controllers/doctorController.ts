import { Request, Response } from "express";
import * as doctorService from "../services/doctorService.js";

export const getAllDoctors = async (req: Request, res: Response) => {
  try {
    const { page, pageSize, sort, search } = req.query;
    const doctors = await doctorService.getAllDoctors(
      Number(page),
      Number(pageSize),
      sort as string,
      search as string
    );
    res.send(doctors);
  } catch (error: any) {
    res.status(500).send(error.message);
  }
};

export const getPendingDoctors = async (req: Request, res: Response) => {
  try {
    const { page, pageSize, sort, search } = req.query;
    const nonDoctors = await doctorService.getPendingDoctors(
      Number(page),
      Number(pageSize),
      sort as string,
      search as string
    );
    res.send(nonDoctors);
  } catch (error: any) {
    res.status(500).send(error.message);
  }
};

export const applyForDoctor = async (req: Request, res: Response) => {
  try {
    const result = await doctorService.applyForDoctor(
      req.params.id,
      req.body.formDetails
    );
    res.status(201).send(result);
  } catch (error: any) {
    res.status(500).send(error.message);
  }
};

export const acceptDoctor = async (req: Request, res: Response) => {
  try {
    const result = await doctorService.acceptDoctorApplication(req.params.id);
    res.status(201).send(result);
  } catch (error: any) {
    res.status(500).send(error.message);
  }
};

export const rejectDoctor = async (req: Request, res: Response) => {
  try {
    const result = await doctorService.rejectDoctorApplication(req.params.id);
    res.status(201).send(result);
  } catch (error: any) {
    res.status(500).send(error.message);
  }
};

export const deleteDoctor = async (req: Request, res: Response) => {
  try {
    const result = await doctorService.deleteDoctor(req.params.id);
    res.send(result);
  } catch (error: any) {
    res.status(500).send(error.message);
  }
};
