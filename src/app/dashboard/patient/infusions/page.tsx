'use client'

import { useCallback, useEffect, useState } from "react";

import useSession from "@/hooks/useSession";

import { DataTable } from "@/components/dashboard/DataTable";
import { columns } from "./columns";
import { getTreatmentInfusions } from "@/services/treatment";
import { toast } from "react-toastify";

export default function Infusions() {
    const { isLogged } = useSession();

    const [isLoading, setIsLoading] = useState(false);
    const [data, setData] = useState<any[]>([]);
    // const [filter, setFilter] = useState({
    //     page: 1,
    //     pageSize: 10000,
    // });

    const getInfusions = useCallback(() => {
        setIsLoading(true);

        getTreatmentInfusions()
        .then((res) => {
            setData(res);
        })
        .catch(() => {
            toast.error("Erro ao buscar infusões");
        })
        .finally(() => {
            setIsLoading(false);
        });

    }, 
        [
            isLogged,
            // filter
        ]
    )

    useEffect(() => {
        if(isLogged) {
            getInfusions();
        }
    }, [getInfusions]);

    return (
        <div className="w-full h-full flex flex-col items-center justify-center mt-8 lg:mt-8 ">
            {/* <DataTable 
                columns={columns} 
                data={data}
                isLoading={isLoading}
            /> */}
        </div>
    )
}