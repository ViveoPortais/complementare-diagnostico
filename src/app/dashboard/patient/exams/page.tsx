'use client'

import { useCallback, useEffect, useState } from "react";
import { toast } from "react-toastify";

import useSession from "@/hooks/useSession";

import { columns } from "./columns";
import { DataTable } from "@/components/dashboard/DataTable";
import { getPatientExamDiagnostics } from "@/services/diagnostic";


export default function Exams() {
    const { isLogged } = useSession();

    const [isLoading, setIsLoading] = useState(false);
    const [data, setData] = useState<any[]>([]);
    const [filter, setFilter] = useState({
        page: 1,
        pageSize: 10000,
    });

    const getExams = useCallback(() => {
        setIsLoading(true);
        getPatientExamDiagnostics(filter)
        .then((res) => {
            setData(res);
        })
        .catch(() => {
            toast.error("Erro ao buscar dados de exames");
        })
        .finally(() => {
            setIsLoading(false);
        });
    }, [filter]);

    useEffect(() => {
        if(isLogged) {
            getExams();
        }
    }, [getExams]);

    return (
        <div className="w-full h-full flex flex-col items-center justify-center mt-8 lg:mt-8">
            {/* <DataTable 
                columns={columns} 
                data={data}
                isLoading={isLoading}
            /> */}
        </div>
    )
}