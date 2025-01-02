 
import { ColumnDef } from "@tanstack/react-table"
import dayjs from "dayjs";

export type ExamProps = {
  createdOn: string;
  nameDoctor: string;
  licenseNumber: string;
  namePatient: string;
  cpf: string;
  patientStatus: string;
  examDefinition: string;
  voucher: string;
  scheduledDate: string;
  examStatus: string;

}

export const columns: ColumnDef<ExamProps>[] = [
    {
      accessorKey: "createdOn",
      header: "Data da solicitação",
      cell: ({ row }) => {
        const exam = row.original;

        if (exam.createdOn) {
          return dayjs(exam.createdOn).format("DD/MM/YYYY");
        }
        return "";
      },
    },
    {
      accessorKey: "nameDoctor",
      header: "Médico",
    },
    {
      accessorKey: "licenseNumber",
      header: "CRM/UF",
    },

    {
      accessorKey: "namePatient",
      header: "Paciente",
    },
    {
      accessorKey: "cpf",
      header: "CPF",
    },
    {
      accessorKey: "patientStatus",
      header: "Status",
    },
    {
      accessorKey: "examDefinition",
      header: "Exame",
    },
    {
      accessorKey: "voucher",
      header: "Voucher",
    },
    {
      accessorKey: "scheduledDate",
      header: "Data agendada",
      cell: ({ row }) => {
        const exam = row.original;

        if (exam.scheduledDate) {
          return dayjs(exam.scheduledDate).format("DD/MM/YYYY");
        }
        return "";
      },
    },
    {
      accessorKey: "examStatus",
      header: "Status do exame",
    },
]