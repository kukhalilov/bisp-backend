import * as doctorDal from "../../db/dataAccess/doctorDal.js";

export const getAllDoctors = async () => {
  return doctorDal.getAllDoctors();
};

export const getNotDoctors = async () => {
  return doctorDal.getNotDoctors();
};

export const applyForDoctor = async (userId: string, formDetails: any) => {
  return doctorDal.applyForDoctor(userId, formDetails);
};

export const acceptDoctorApplication = async (userId: string) => {
  return doctorDal.acceptDoctorApplication(userId);
};

export const rejectDoctorApplication = async (userId: string) => {
  return doctorDal.rejectDoctorApplication(userId);
};

export const deleteDoctor = async (userId: string) => {
  return doctorDal.deleteDoctor(userId);
};
