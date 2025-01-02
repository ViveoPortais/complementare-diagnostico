interface listProfessions {
    id: string;
    value: string;
}

export interface IProfessionalData {
    typeProfessional?: string;
    professionalName?: string;
    cpf?: string;
    licenseNumberCoren?: string | number;
    licenseStateCoren?: string;
    mobilePhone?: string;
    emailAddress?: string;
    password?: string;
    programRegulation?: boolean;
    professionalTypeStringMap?: string;
    [key: string]: string | number | boolean | undefined;
  }

  export interface IUpdateRepresentativeInfo {
    nurseId: string;
    emailAddress?: string;
    mobilePhone?: string;
    cpf?: string;
    programCode?: string;
  }