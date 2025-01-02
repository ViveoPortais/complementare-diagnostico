'use client'

import { useCallback, useEffect, useState } from "react";
import { toast } from "react-toastify";

import useSession from "@/hooks/useSession";
import { getDocsFromLib } from "@/services/incident";

import { columns } from "./columns";
import { DataTable } from "@/components/dashboard/DataTable";


export default function Documents() {
    const { isLogged } = useSession();

    const [isLoading, setIsLoading] = useState(false);
    const [data, setData] = useState<any[]>([]);
    const [filter, setFilter] = useState({
        page: 1,
        pageSize: 10000,
      });

    const getDocuments = useCallback(() => {
        setIsLoading(true);
        getDocsFromLib(filter)
        .then((res) => {
            const sortedData = res.data.sort((a: any, b: any) => {
            return (
                new Date(b.createdOn).getTime() - new Date(a.createdOn).getTime()
            );
            });

            // temporary id as its not coming from endpoint
            sortedData.forEach((obj: any, i: number) => obj.id = i + 1 )
            setData(sortedData);
        })
        .catch(() => {
            toast.error("Erro ao buscar documentos")
        })
        .finally(() => {
            setIsLoading(false);
        });
    }, [filter]);

    useEffect(() => {
        if(isLogged) {
          getDocuments();
        }
    }, [getDocuments, filter]);

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