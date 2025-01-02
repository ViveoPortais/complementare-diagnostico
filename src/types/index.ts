export interface FormInputData {
  [key: string]: string;
}

export interface ILoginData {
  email: string;
  password: string;
  token?: string;
}

export interface IForgetPasswordData {
  email: string;
  crm: string;
}

export interface ISendToken {
  name: string;
  token?: string;
  mobilePhone: string;
  programCode?: string;
}

export interface IDoctorInfoByCRM {
  crm: string;
  ufcrm: string;
}

export interface IDoctorData {
  Name: string;
  cpf: string;
  licenseNumber: string | number;
  licenseState: string;
  medicalSpecialty: string | undefined;
  emailAddress: string;
  telephoneNumber: string;
  password: string;
  programParticipationConsent: boolean;
  consentToReceiveEmail: boolean | undefined;
  consentToReceiveSms: boolean | undefined;
  consentToReceivePhonecalls: boolean | undefined;
  [key: string]: string | number | boolean | undefined;
}

export interface IUpdateDoctorData {
  doctorId: string | undefined;
  emailAddress: string | undefined;
  mobileNumber: string | undefined;
  medicalSpecialty: string | undefined;
  cpf: string | undefined;
  birthDate: string | undefined;
  AddressPostalCode: string | undefined;
  AddressName: string | undefined;
  AddressNumber: string | undefined;
  AddressComplement: string | undefined;
  AddressDistrict: string | undefined;
  AddressCity: string | undefined;
  AddressState: string | undefined;
  healthProgramCode: string | undefined;
}

export interface IInactiveDoctor {
  ProgramCode: string;
  DoctorByProgramId: string;
  InactiveType: string;
}

export interface IDoctorByProgram {
  doctorId: string;
  programcode: string;
}

export interface IPatientByProgram {
  patientId: string;
  programcode: string;
}

export interface DiagnosticData {
  typePatient: string;
  doctorId: string;
  name: string;
  birthdate: string;
  cpf: string;
  mobilephone?: string;
  telephone?: string;
  email: string;
  nameCaregiver?: string;
  birthdateCaregiver?: string;
  cpfCaregiver?: string;
  addressPostalCode: string;
  addressName: string;
  addressCity: string;
  addressState: string;
  addressNumber: string;
  addressDistrict: string;
  addressComplement?: string;
  genderId: string;
  medicalRequestAttach: {
    fileName: string;
    contentType: string;
    documentBody: string;
    fileSize: string;
    name: string;
    healthProgramCode: string;
  };
}

export interface TreatmentData {
  programCode: string;
  email: string;
  cpf: string;
  birthDate: string;
  name: string;
  mobilePhone: string;
}

export interface IPurchaseData {
  patientCpf: string;
  quantityMedicament: number;
  purchaseDate: string;
}

export interface IStringMapData {
  entityName: string;
  attributeName: string;
  programCode: string;
}

export interface IStringMap {
  stringMapId: string;
  entityMetadataId: string;
  entityMetadataIdName: string;
  attributeMetadataId: string;
  attributeMetadataIdName: string;
  optionValue: number;
  optionName: string;
  displayOrder: number;
  isDisabled: boolean;
  optionNameLangEn: string;
  programId: string;
  isSystemOption: boolean;
  flag: string;
}

export interface IMedicalSpecialty {
  id: string;
  name: string;
}
