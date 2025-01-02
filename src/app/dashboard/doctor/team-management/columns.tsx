"use client";

import { ColumnDef } from "@tanstack/react-table";
import dayjs from "dayjs";
import { HiCheck, HiX } from "react-icons/hi";
import { FaSpinner } from "react-icons/fa";
import { useState } from "react";
import { managementNurses } from "@/services/doctor";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

export type DataType = {
    typeProfessional: string;
    professionalName: string;
    statusNurse: string;
    aproveDate: string;
    reproveDate: string;
    id: string;
};

export const columns: ColumnDef<DataType>[] = [
    {
        accessorKey: "typeProfessional",
        header: "Profissão",
    },
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
    {
        accessorKey: "reproveDate",
        header: "Data do Término",
        cell: ({ row }) => {
            const date = row.original.reproveDate;
            return date ? dayjs(date).format("DD/MM/YYYY HH:mm") : "";
        },
    },
    {
        accessorKey: "actions",
        header: "Ações",
        cell: ({ row }) => {
            const status = row.original.statusNurse;
            const id = row.original.id;
            const [loading, setLoading] = useState(false);
            const router = useRouter();

            const handleApprove = async () => {
                setLoading(true);
                try {
                    const res = await managementNurses(id, "#ACT");
                    if (res.isValidData) {
                        toast.success(res.additionalMessage);
                        router.push("/");
                    } else {
                        toast.error(res.additionalMessage);
                    }
                } catch (error) {
                    toast.error('Erro ao aprovar');
                } finally {
                    setLoading(false);
                }
            };

            const handleDisapprove = async () => {
                setLoading(true);
                try {
                    const res = await managementNurses(id, "#IACTV");
                    if (res.isValidData) {
                        toast.success(res.additionalMessage);
                        router.push("/");
                    } else {
                        toast.error(res.additionalMessage);
                    }
                } catch (error) {
                    toast.error('Erro ao desaprovar');
                } finally {
                    setLoading(false);
                }
            };

            return (
                <div className="flex justify-center space-x-2">
                    {status === "Pendente" && (
                        <button className="flex space-x-2">
                            {loading ? (
                                <FaSpinner className="animate-spin text-gray-500" aria-label="Carregando" />
                            ) : (
                                <>
                                    <HiCheck
                                        className="text-green-500 cursor-pointer"
                                        onClick={handleApprove}
                                        aria-label="Aprovar"
                                    />
                                    <HiX
                                        className="text-red-500 cursor-pointer"
                                        onClick={handleDisapprove}
                                        aria-label="Desaprovar"
                                    />
                                </>
                            )}
                        </button>
                    )}
                    {status === "Ativo" && (
                        <button>
                            {loading ? (
                                <FaSpinner className="animate-spin text-gray-500" aria-label="Carregando" />
                            ) : (
                                <HiX
                                    className="text-red-500 cursor-pointer"
                                    onClick={handleDisapprove}
                                    aria-label="Desaprovar"
                                />
                            )}
                        </button>
                    )}
                </div>
            );
        },
    },
];
