import { IProfessionalData } from "@/types/professions";
import api from "./api";
import { IStringMap, IStringMapData } from "@/types";

const programCode = `${process.env.PROGRAM_CODE}`;

export const getListProfessions = async (data: IStringMapData) => {
  const response = await api.get("/StringMap/getbasicstringmaplist", {
    params: {
      entityName: data.entityName,
      attributeName: data.attributeName,
      programCode: data.programCode
    }
  })

  return response.data
}

export const getOptionsProfessions = async (): Promise<IStringMap[]> => {
  const optionsProfessions = await getListProfessions({
    entityName: "Representative",
    attributeName: "ProfessionalTypeStringMap",
    programCode: `${process.env.PROGRAM_CODE}`
  });

  return (
    optionsProfessions.filter((item: IStringMap) => item !== null).sort((a: IStringMap, b: IStringMap) => {
      return a.optionName.localeCompare(b.optionName);
    })
  );
};

export const addProfessional = async (data: IProfessionalData) => {
  const res = await api.post("/Representative/addprofessional", {
    ...data,
    programCode: programCode
  });
  return res.data;
}
