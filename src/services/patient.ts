import { IPatientByProgram } from "@/types";
import api from "./api";

export const sendDocuments = async (data: any) => {
  const response = await api.post("/Patient/upload/files", data);

  return response.data;
};

export const getPatientByProgram = async (data: IPatientByProgram) => {
  const res = await api.get("/Patient/getpatientbyprogram", {
    params: {
      patientId: data.patientId,
      programcode: data.programcode,
    },
  });
  return res.data;
};

export const getConsentTermsPatient = async (data: any) => {
  const res = await api.get("/Patient/getconsentTerms", {
    params: {
      patientId: data.patientId,
      programcode: data.programcode,
    },
  });
  return res.data;
};

export const termPatient = async (data: any) => {
  const response = await api.post("/Patient/termpatient", data);

  return response.data;
};
