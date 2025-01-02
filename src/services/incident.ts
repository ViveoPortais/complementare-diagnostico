import { api } from "./api";

const programCode = "150";

export const addDocumentation = async (
  data: any,
  documentationAttach?: any
) => {
  const res = await api.post("/Incident/adddocumentation", {
    ...data,
    documentationAttach: documentationAttach ? documentationAttach : null,
  });
  return res.data;
};

export const editDocumentation = async (
  data: any,
  id: string,
  documentationAttach?: any
) => {
  const res = await api.post("/Incident/editdocumentation", {
    ...data,
    id: id,
    documentationAttach: documentationAttach ?? documentationAttach,
  });
  return res.data;
};

export const getDocsFromLib = async (filters: any) => {
  const res = await api.get("/Incident/getdocsfromlib", {
    params: {
      ...filters,
      programCode: programCode,
    },
  });
  return res.data;
};

export const getDocAttachment = async (id: any) => {
  const res = await api.post("/Incident/getdocattchment", null, {
    params: {
      annotationId: id,
      programCode: programCode,
    },
  });
  return res.data;
};
