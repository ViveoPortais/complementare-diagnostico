"use client";

import { ColumnDef } from "@tanstack/react-table";
import dayjs from "dayjs";

export type DataType = {
    professionalName: string;
    statusNurse: string;
    aproveDate: string;
};

export const columns: ColumnDef<DataType>[] = [
    {
        accessorKey: "professionalName",
        header: "Solicitante",
    },
    {
        accessorKey: "statusNurse",
        header: "Status",
    },
    {
        accessorKey: "aproveDate",
        header: "Data de inclusão",
        cell: ({ row }) => {
            const date = row.original.aproveDate;
            return date ? dayjs(date).format("DD/MM/YYYY HH:mm") : "";
        },
    },
];
