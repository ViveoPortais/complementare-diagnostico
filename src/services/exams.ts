import { api } from "./api";

const programCode = `${process.env.PROGRAM_CODE}`;

export const getListOptions = async () => {
    const response = await api.get("/exam/options", {
      params: {
        programcode: programCode
      },
    });
    return response.data;
  };