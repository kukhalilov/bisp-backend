import * as clinicDal from "../../db/dataAccess/clinicDal.js";

export const getAllClinics = async (
  page: number,
  pageSize: number,
  sort: string,
  search: string
) => {
  return clinicDal.getAllClinics(page, pageSize, sort, search);
};

export const getAllPendingClinics = async (
  page: number,
  pageSize: number,
  sort: string,
  search: string
) => {
  return clinicDal.getAllPendingClinics(page, pageSize, sort, search);
};

export const applyForClinic = async (formDetails: any) => {
  return clinicDal.applyForClinic(formDetails);
};

export const acceptClinicApplication = async (clinicId: string) => {
  return clinicDal.acceptClinicApplication(clinicId);
};

export const rejectClinicApplication = async (clinicId: string) => {
  return clinicDal.rejectClinicApplication(clinicId);
};

export const editClinic = async (clinicId: string, formDetails: any) => {
  return clinicDal.editClinic(clinicId, formDetails);
};

export const deleteClinic = async (clinicId: string) => {
  return clinicDal.deleteClinic(clinicId);
};
