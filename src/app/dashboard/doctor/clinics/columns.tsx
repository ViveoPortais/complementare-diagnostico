"use client"
 
import { ColumnDef } from "@tanstack/react-table"

export type Clinics = {
  clinicName: string;
  cliniCEP: string;
  clinicAddress: string;
  clinicNumber: string;
  clinicCity: string;
  clinicState: string;
  clinicComplement: string;
  clinicServices: string;
}
 
export const columns: ColumnDef<Clinics>[] = [
  {
    accessorKey: "clinicName",
    header: "Nome",
  },
  {
    accessorKey: "addressPostalCode",
    header: "CEP",
  },
  {
    accessorKey: "clinicAddress",
    header: "Endereço",
  },
  {
    accessorKey: "addressNumber",
    header: "Número"
  },
  {
    accessorKey: "addressCity",
    header: "Cidade",
  },
  {
    accessorKey: "addressState",
    header: "Estado",
  },
  {
    accessorKey: "addressComplement",
    header: "Complemento"
  },
  {
    accessorKey: "services",
    header: "Serviços",
  },
]