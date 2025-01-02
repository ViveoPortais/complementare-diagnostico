"use client"
 
import OpenFile from "@/components/custom/OpenFile";
import { ColumnDef } from "@tanstack/react-table"
import dayjs from "dayjs";


export type DocProps = {
  availableIn: string;
  title: string;
  diseaseId: string;
  medicamentId: string;
  contentType: string;
  annotationsId: string[];
}

export const columns: ColumnDef<DocProps>[] = [
  {
    accessorKey: "availableIn",
    header: "Disponivel em:",
    cell: ({ row }) => {
      const doc = row.original;

      if (doc.availableIn) {
        return dayjs(doc.availableIn).format("DD/MM/YYYY");
      }
      return "";
    },
  },
  {
    accessorKey: "title",
    header: "Titulo",
  },
  {
    accessorKey: "diseaseId",
    header: "Doença",
    cell: ({ row }) => {
      const doc = row.original;

      if (doc.diseaseId === "6484b250-14f8-4379-82d4-5a38bc2a297f") {
        return "Angioedema Hereditário";
      }
      return "";
    },
  },
  {
    accessorKey: "medicamentId",
    header: "Medicamento",
    cell: ({ row }) => {
      const doc = row.original;

      if (doc.medicamentId === "405b970d-b6b7-4058-94a2-b6e60766f2be") {
        return "Icatibanto (FIRAZYR®)";
      }
      return "Lanadelumabe (TAKHZYRO®)";
    },
  },
  {
    accessorKey: "contentType",
    header: "Acessar",
    cell: ({ row }) => {
      const doc = row.original;

      if (doc.contentType !== null) {
        return (
          <OpenFile
            type={doc.contentType}
            annotationsId={doc.annotationsId[0]}
          />
        );
      }

      return null;
    },
  },
]