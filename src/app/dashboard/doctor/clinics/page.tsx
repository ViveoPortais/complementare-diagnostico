'use client'

import { useCallback, useEffect, useState } from "react";
import { toast } from "react-toastify";

import { getClinics } from "@/services/account";
import useSession from "@/hooks/useSession";

import { columns } from "./columns";
import { DataTable } from "@/components/dashboard/DataTable";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";


export default function Clinics() {
    const { isLogged } = useSession();

    const [isLoading, setIsLoading] = useState(false);
    const [data, setData] = useState<any[]>([]);
    const [filter, setFilter] = useState({
        clinicName: "",
        city: "",
        service: "",
    });
    
    const handleChange = (e: any) => {
        const { name, value } = e.target;
        setFilter({ ...filter, [name]: value });
    };

    const getClinicsList = useCallback(() => {
        setIsLoading(true);

        getClinics(filter)
        .then((res) => {
            setData(res);
        })
        .catch(() => {
            toast.error("Erro ao buscar clínicas")
        })
        .finally(() => {
            setIsLoading(false);
          })
    }, [filter])

    useEffect(() => {
        if(isLogged) {
            getClinicsList();
        }
      }, [filter]);

    return (
        <div className="w-full h-full flex flex-col items-center justify-center mt-8 lg:mt-0">
            <div className="w-full px-6 lg:px-4">
                <div className="w-full grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <Input
                        placeholder="Nome da clínica"
                        name="clinicName"
                        onChange={handleChange}
                        value={filter.clinicName}
                    />
                    <Input
                        placeholder="Cidade"
                        name="city"
                        onChange={handleChange}
                        value={filter.city}
                    />
                    <Input
                        placeholder="Serviços"
                        name="service"
                        type="select"
                        onChange={handleChange}
                        value={filter.service}
                    />
                </div>

                <Button 
                    className="mt-4 md:mt-8 mb-12 w-full md:w-[48%] lg:w-[200px] self-start" 
                    variant={`tertiary`}
                    size="lg"
                >
                    Buscar
                </Button>
            </div>

            {/* <DataTable 
                columns={columns} 
                data={data} 
                isLoading={isLoading}
            /> */}
        </div>
    )
}