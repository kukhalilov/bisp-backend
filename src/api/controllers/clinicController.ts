import { Request, Response } from "express";
import * as clinicService from "../services/clinicService.js";

export const getAllClinics = async (req: Request, res: Response) => {
  try {
    const { page, pageSize, sort, search } = req.query;
    const clinics = await clinicService.getAllClinics(
      Number(page),
      Number(pageSize),
      sort as string,
      search as string
    );
    res.send(clinics);
  } catch (error: any) {
    res.status(500).send(error.message);
  }
};

export const getAllPendingClinics = async (req: Request, res: Response) => {
  try {
    const { page, pageSize, sort, search } = req.query;
    const clinics = await clinicService.getAllPendingClinics(
      Number(page),
      Number(pageSize),
      sort as string,
      search as string
    );
    res.send(clinics);
  } catch (error: any) {
    res.status(500).send(error.message);
  }
};

export const applyForClinic = async (req: Request, res: Response) => {
  try {
    const result = await clinicService.applyForClinic(req.body);
    res.status(201).send(result);
  } catch (error: any) {
    res.status(500).send(error.message);
  }
};

export const acceptClinic = async (req: Request, res: Response) => {
  try {
    const result = await clinicService.acceptClinicApplication(req.params.id);
    res.status(201).send(result);
  } catch (error: any) {
    res.status(500).send(error.message);
  }
};

export const rejectClinic = async (req: Request, res: Response) => {
  try {
    const result = await clinicService.rejectClinicApplication(req.params.id);
    res.status(201).send(result);
  } catch (error: any) {
    res.status(500).send(error.message);
  }
};

export const editClinic = async (req: Request, res: Response) => {
  try {
    const result = await clinicService.editClinic(
      req.params.id,
      req.body.formDetails
    );
    res.send(result);
  } catch (error: any) {
    res.status(500).send(error.message);
  }
};

export const deleteClinic = async (req: Request, res: Response) => {
  try {
    const result = await clinicService.deleteClinic(req.params.id);
    res.send(result);
  } catch (error: any) {
    res.status(500).send(error.message);
  }
};
