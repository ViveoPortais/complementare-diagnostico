import { IForgetPasswordData, ILoginData, ISendToken } from "@/types";
import api from "./api";
import { AxiosError } from "axios";

const programCode = process.env.PROGRAM_CODE;

export const login = async (data: ILoginData) => {
  const res = await api.post("/login", {
    ...data,
    healthProgramCode: programCode,
  });
  return res.data;
};

export const forgetPassword = async (data: IForgetPasswordData) => {
  try {
    const res = await api.post("/forgotpassword", {
      ...data,
      code: programCode,
    });

    const message = res.data; 
    return { success: res.status === 200, message };
  } catch (error) {
    const axiosError = error as AxiosError;
    if (axiosError.response && axiosError.response.status === 404) {
      const message = axiosError.response.data as string;
      return { success: false, message };
    }
    return { success: false, message: "Erro ao tentar recuperar senha. Tente novamente mais tarde." };
  }
};

export const sendToken = async (data: ISendToken) => {
  const res = await api.post("/token/sms", {
    ...data,
    token: '',
    programCode: programCode
  });

  return res.data;
}

export const validateToken = async (data: ISendToken) => {
  const res = await api.post("/validateregistertoken", {
    ...data,
    programCode: programCode
  });

  return res.data;
}
