'use client'

import { useCallback, useEffect, useState } from "react";
import { toast } from "react-toastify";

import { getTreatments } from "@/services/treatment";
import useSession from "@/hooks/useSession";

import { columns } from "./columns";
import { DataTable } from "@/components/dashboard/DataTable";
import { maskedField } from "@/components/custom/MaskedField";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function Protocols() {
    const { isLogged } = useSession();

    const [isLoading, setIsLoading] = useState(false);
    const [maskedValue, setmaskedValue] = useState("");
    const [data, setData] = useState<any[]>([]);

    const [filter, setFilter] = useState({
        examStatus: "",
        patientName: "",
        patientCpf: "",
        page: 0,
        pageSize: 10000,
    })

    const handleFilterChange = (e: any) => {
        const { name, value } = e.target;
        if(name === "patientCpf") {
            setmaskedValue(value);
            setFilter({ ...filter, patientCpf: value.replace(/\D/g, "") })
        } else {

            setFilter({ ...filter, [name]: value });
        }
    };

    const clearFilter = () => {
        setFilter({
            examStatus: "",
            patientName: "",
            patientCpf: "",
            pageSize: 1000,
            page: 0,
        });
    };

    const getFilteredData = useCallback(() => {
        setIsLoading(true);

        getTreatments(filter)
        .then((res) => {
            // setData(res);
        })
        .catch(() => {
            toast.error("Erro ao buscar diagnósticos")
        })
        .finally(() => {
            setIsLoading(false);
          })
    }, [filter])

    useEffect(() => {
        if(isLogged) {
            getFilteredData();
        }
    }, [filter])

    return (
        <div className="w-full h-full flex flex-col items-center justify-center mt-8 lg:mt-0">
            <div className="w-full px-6 lg:px-4">
                <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <Input
                        placeholder="Nome do paciente"
                        name="patientName"
                        type="text"
                        value={filter.patientName}
                        onChange={handleFilterChange}
                    />
                    {maskedField(
                        "cpf",
                        handleFilterChange,
                        "patientCpf",
                        "CPF do paciente",
                        false,
                        () => {},
                        maskedValue,
                    )}
                </div>
                <div className="flex flex-col md:flex-row gap-8 mt-4 md:mt-8 mb-12 ">
                    <Button  
                        className="lg:w-[200px]" 
                        size="lg"
                        variant={`tertiary`}
                    >
                        Buscar
                    </Button>

                    <Button  
                        className="lg:w-[200px]" 
                        size="lg"
                        variant={`tertiary`}
                        onClick={clearFilter}
                    >
                        Limpar filtros
                    </Button>
                </div>
            </div>

            {/* <DataTable 
                columns={columns}
                isLoading={isLoading}
                data={data}
            /> */}
        </div>
    )
}