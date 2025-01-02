import { IUpdateRepresentativeInfo } from "@/types/professions";
import api from "./api";
import { IDoctorData, IUpdateDoctorData } from "@/types";

const programCode = `${process.env.PROGRAM_CODE}`;

export const getUserInfo = async () => {

  console.log(api.defaults.headers.Authorization);

  const res = await api.get("/user/getuserdata", {
    params: {
      programCode: programCode,
    },
  });
  return res.data;
};

export const updateDoctorInfo = async (data: IUpdateDoctorData) => {
  const res = await api.put("/doctor/updatedoctor", data);
  return res.data;
};

export const updateRepresentativeInfo = async (data: IUpdateRepresentativeInfo) => {

  const res = await api.post("/Representative/updateprofessional", data);
  return res.data;
};