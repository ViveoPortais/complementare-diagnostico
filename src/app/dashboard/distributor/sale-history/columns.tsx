import { ColumnDef } from "@tanstack/react-table";
import dayjs from "dayjs";

export type DataType = {
    patientName: string;
    status: string;
    purchaseDate: string;
    medicamentName: string;
    quantityMedicament: string;
    id: string;
};

export const columns: ColumnDef<DataType>[] = [
    {
        accessorKey: "patientName",
        header: "NOME DO PACIENTE",
    },
    {
        accessorKey: "status",
        header: "STATUS",
    },
    {
        accessorKey: "purchaseDate",
        header: "DATA DA COMPRA",
        cell: ({ row }) => {
            const date = row.original.purchaseDate;
            return date ? dayjs(date).format("DD/MM/YYYY") : "";
        },
    },
    {
        accessorKey: "medicamentName",
        header: "MEDICAMENTO",
    },
    {
        accessorKey: "quantityMedicament",
        header: "NÚMERO DE UNIDADES",
    },
]
