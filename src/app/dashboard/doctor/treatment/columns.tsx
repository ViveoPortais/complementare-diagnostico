"use client";

import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { ColumnDef } from "@tanstack/react-table";
import dayjs from "dayjs";

import { MdHistory } from "react-icons/md";

export type Report = {
  examId: string;
  patientName: string;
  patientCpf: string;
  status: string;
  disease: string;
  medicament: string;
  initialDosage: string;
  lastDosage: string;
  phase: string; // pré cadastro, acesso e adesão
  registerDate: string;
  patientUf: string;
  patientCity: string;
};

export type Treatment = {
  createdOn: string;
  patientName: string;
  historic: string;
  patientCpf: string;
  treatmentStatusName: string;
  treatmentPhaseName: string;
  diseaseName: string;
  medicamentName: string;
};

export const columns2: ColumnDef<Report>[] = [
  {
    accessorKey: "patientName",
    header: "Nome do paciente",
  },
  {
    accessorKey: "patientCpf",
    header: "CPF do paciente",
  },
  {
    accessorKey: "status",
    header: "Status",
  },
  {
    accessorKey: "disease",
    header: "Patologia",
  },
  {
    accessorKey: "medicament",
    header: "Medicamento",
  },
  {
    accessorKey: "initialDosage",
    header: "Dosagem inicial",
  },
  {
    accessorKey: "lastDosage",
    header: "Dosagem Atual",
  },
  {
    accessorKey: "phase",
    header: "Fase",
  },
  {
    accessorKey: "registerDate",
    header: "Data de cadastro",
  },
  {
    accessorKey: "patientCity",
    header: "Cidade",
  },
  {
    accessorKey: "patientUf",
    header: "UF",
  },
  {
    accessorKey: "examDetail",
    header: "Detalhes",
    cell: ({ row }) => {
      const report = row.original;

      return (
        <Dialog>
          <DialogTrigger>
            <MdHistory
              size={24}
              className="text-main-purple hover:text-main-purple/70"
            />
          </DialogTrigger>

          <DialogContent>{report.patientName}</DialogContent>
        </Dialog>
      );
    },
  },
];

export const columns: ColumnDef<Treatment>[] = [
  {
    accessorKey: "createdOn",
    header: "Data de Cadastro",
    cell: ({ row }) => {
      const report = row.original;
      if (report.createdOn) {
        return dayjs(report.createdOn).format("DD/MM/YYYY");
      }
      return "";
    },
  },
  {
    accessorKey: "patientName",
    header: "Paciente",
  },
  {
    accessorKey: "historic",
    header: "Solicitar serviços",
    cell: ({ row }) => {
      const report = row.original;

      return (
        <Dialog>
          <DialogTrigger className="w-full flex items-center justify-center">
            <MdHistory
              size={24}
              className="text-main-purple hover:text-main-purple/70"
            />
          </DialogTrigger>

          <DialogContent>{report.patientName}</DialogContent>
        </Dialog>
      );
    },
  },
  {
    accessorKey: "patientCpf",
    header: "CPF",
  },
  {
    accessorKey: "treatmentStatusName",
    header: "Status",
  },
  {
    accessorKey: "treatmentPhaseName",
    header: "Fase",
  },
  {
    accessorKey: "diseaseName",
    header: "Doença",
  },
  {
    accessorKey: "medicamentName",
    header: "Medicamento",
  },
];
