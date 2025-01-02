import {
  IDoctorData,
  IDoctorInfoByCRM,
  IInactiveDoctor,
  IUpdateDoctorData,
  IDoctorByProgram,
} from "@/types";
import { api } from "./api";

const programCode = `${process.env.PROGRAM_CODE}`;

export const getDoctorbyCRM = async (data: IDoctorInfoByCRM) => {
  const res = await api.get("/doctor/getdoctorbycfm", {
    params: {
      crm: data.crm,
      ufcrm: data.ufcrm,
    },
  });
  return res.data;
};

export const addDoctor = async (data: IDoctorData) => {
  const res = await api.post("/Doctor/adddoctor", {
    ...data,
    HealthProgramCode: programCode,
  });
  return res.data;
};

export const doctorAddProfessional = async (data: any) => {
  const response = await api.post("/Doctor/addprofessional", data);

  return response.data;
};

export const updateDoctor = async (data: IUpdateDoctorData) => {
  const res = await api.put("/doctor/update", {
    ...data,
    healthProgramCode: programCode,
  });
  return res.data;
};

export const disableDoctor = async (programCode: any) => {
  const res = await api.put("/doctor/disable", null, {
    params: {
      programCode: programCode,
    },
  });
  return res.data;
};

export const inactiveDoctor = async (data: IInactiveDoctor) => {
  const res = await api.put("/doctor/inactive", {
    ...data,
  });
};

export const downlaodLaudoPatient = async (id: string) => {
  const res = await api.get(`/Patient/download/report/${id}`, {
    params: {
      programCode: programCode,
    },
  });
  return res.data;
};

export const getListSpecialties = async () => {
  const res = await api.get(`/doctor/getspecialties`, {
    params: {
      programCode: programCode
    }
  });

  return res.data;
}

export const searchProfessional = async (professionalTypeStringMapId: string, licenseState: string, licenseNumber: string) => {
  const res = await api.get(`/representative/gethealthprofessionalbylicensenumber`, {
    params: {
      professionalTypeStringMapId: professionalTypeStringMapId,
      licenseNumber: licenseNumber,
      licenseState: licenseState,
      programCode: programCode
    }
  });

  return res.data;
}

export const linkProfessional = async (representativeId: string) => {
  const res = await api.post(`/representative/requesthealthprofessionalbond`, {
    representativeId: representativeId,
    programCode: programCode
  });

  return res.data;
}

export const getNurses = async () => {
  const res = await api.get(`/doctor/nurses`, {
    params: {
      programCode: programCode
    }
  });

  return res.data;
}

export const managementNurses = async (id: string, statusCode: string) => {
  const res = await api.put(`/doctor/managementnurses`, {
    doctorsRepresentativeId: id,
    statusCode: statusCode,
    programCode: programCode
  });

  return res.data;
}

export const getDoctorCRMUFByProgram = async (crm: string, ufcrm: string) => {
  const res = await api.get(`/doctor/getdoctorcrmufbyprogram`, {
    params: {
      crm: crm,
      ufcrm: ufcrm,
      programCode: programCode
    }
  });

  return res.data;
}


export const getDoctorByProgram = async (data: IDoctorByProgram) => {
  const res = await api.get('/doctor/getdoctorbyprogram', {
    params: {
      doctorId: data.doctorId,
      programcode: data.programcode,
    },
  })
  return res.data
}

export const termDoctor = async (data: any) => {
  debugger;
  const response = await api.post('/Doctor/termdoctor', data)

  return response.data
}

export const getConsentTerms = async (data: any) => {
  const res = await api.get('/doctor/getConsentTerms', {
    params: {
      doctorId: data.doctorId,
      programcode: data.programcode,
    },
  })
  return res.data
}
