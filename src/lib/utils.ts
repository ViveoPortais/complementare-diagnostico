import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { any, z } from "zod";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

//Esquemas de validação
export const forgetPasswordValidationSchema = z.object({
  email: z.string().email({ message: `Insira um e-mail válido` })
});

export type forgetPasswordValidationProps = z.infer<typeof forgetPasswordValidationSchema>;

//------------------------ || --------------------------//

export const doctorProfileSchema = z.object({
  specialtyDoctor: z.string().min(1).optional(),
  email: z.string().email({ message: `Insira um e-mail válido` }).optional(),
  telephoneNumber: z.string().min(1).optional(),
  cpf: z.string().optional(),  
  cep: z.string().optional(),
  street: z.string().optional(),
  number: z.string().optional(),
  complement: z.string().optional(),
  neighborhood: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  birthDate: z.string().optional(),
});

export const professionalProfileSchema = z.object({
  email: z.string().email({ message: 'Insira um e-mail válido' }).optional(),
  telephoneNumber: z.string().min(1).optional(),
  cpf: z.string().optional(),
});

export type DoctorProfileValidationProps = z.infer<typeof doctorProfileSchema>;
export type ProfessionalProfileValidationProps = z.infer<typeof professionalProfileSchema>;

//------------------------ || --------------------------//

export const examRequestSchema = z.object({
  crm: z.string().min(1, { message: "CRM é obrigatório" }),
  uf: z.string().min(1, { message: "UF é obrigatório" }),
  email: z.string().email({ message: "E-mail inválido" }),
  userName: z.string().min(1, { message: "Nome é obrigatório" }),

  patientName: z.string().min(1, { message: "Nome do paciente é obrigatório" }),
  patientCpf: z.string()
    .min(1, { message: "CPF é obrigatório" })
    .regex(/^\d{11}$/, { message: "CPF deve ter 11 dígitos" }),
  birthDate: z.string().min(1, { message: "Data de nascimento é obrigatória" }),

  deliveryType: z.string().min(1, { message: "Selecione um tipo de recebimento" }),

  emailSendVoucher: z.string().email({ message: "E-mail inválido" }).optional(),

  voucherData: z.string().min(1, { message: "" }).optional(),

  diseases: z.string().min(1, { message: "Selecione uma suspeita" }),
  typeRequest: z.string().min(1, { message: "Selecione um tipo de solicitação" }),
  ufExam: z.string().min(1, { message: "UF é obrigatório" }),
  cityExam: z.string().min(1, { message: "Cidade é obrigatório" }),
  laboratoryExam: z.string().min(1, { message: "Laboratório é obrigatório" }),

  address: z.object({
    name: z.string().optional(),
    responsibleName: z.string().optional(),
    address: z.string().optional(),
    number: z.string().optional(),
    complement: z.string().optional(),
    neighborhood: z.string().optional(),
    city: z.string().optional(),
    uf: z.string().optional(),
    phone: z.string().optional(),
    cpf: z.string().optional(),
    birthDate: z.string().optional(),
    cep: z.string().optional(),
  }).optional(),

  consent: z.boolean().refine(val => val === true, { message: "É necessário aceitar o Termo de Consentimento Livre e Esclarecido" }),
});

export type examRequestValidationProps = z.infer<typeof examRequestSchema>;

//------------------------ || --------------------------//

export const teamManagementValidationSchema = z.object({
  professionalTypeStringMap: z.string().min(1, { message: "Selecione uma profissão" }),
  licenseNumberCoren: z.string().min(1, { message: "Insira um CRM ou número de registro válido" }),
  licenseStateCoren: z.string().min(1, { message: "Informe um estado" }),
  professionalName: z.string().min(1, { message: "Informe o nome completo" }),
  mobilephone: z.string().min(1, { message: "Informe o número" }),
  emailAddress: z.string().email({ message: `Insira um e-mail válido` }),
});

export type teamManagementValidationProps = z.infer<typeof teamManagementValidationSchema>;

//------------------------ || --------------------------//

export const teamManagementProfessionalValidationSchema = z.object({
  licenseNumber: z.string().min(1, { message: "Insira um CRM válido" }),
  licenseState: z.string().min(1, { message: "Informe um estado" }),
  professionalName: z.string().optional()
});

export type teamManagementProfessionalValidationProps = z.infer<typeof teamManagementProfessionalValidationSchema>;

export const saleValidationSchema = z.object({
  quantityMedicament: z.coerce.number().min(1, { message: 'Insira o número de unidades da venda' }),
  purchaseDate: z.string().min(1, { message: 'Insira a data da compra' })
});

export type saleValidationProps = z.infer<typeof saleValidationSchema>;

export const patientInfoValidationSchema = z.object({
  name: z.string().min(1, { message: 'Insira o nome do paciente' }),
  birthDate: z.string().min(1, { message: 'Insira a data de nascimento do paciente' }),
  mobilePhone: z.string().min(1, { message: 'Insira o número de celular do paciente' }),
  email: z.optional(z.string().email({ message: `Insira um e-mail válido` })).or(z.literal(''))
});

export type patientInfoValidationProps = z.infer<typeof patientInfoValidationSchema>;

export const tokenInfoValidationSchema = z.object({
  token: z.string().min(6, { message: 'Insira um token válido' })
});

export type tokenInfoValidationProps = z.infer<typeof tokenInfoValidationSchema>;
