"use client"

import { LoadingOverlay } from "@/components/custom/LoadingOverlay";
import { AdditionalFields } from "@/components/professional/teamManagement/AdditionalFields";
import { SearchComponent } from "@/components/professional/teamManagement/SearchComponent";
import { teamManagementProfessionalValidationProps, teamManagementProfessionalValidationSchema } from "@/lib/utils";
import { getDoctorCRMUFByProgram, getNurses, linkProfessional } from "@/services/doctor";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { columns } from "./columns";
import { DataTable } from "@/components/dashboard/DataTable";
import { Button } from "@/components/ui/button";

export default function TeamManagement() {
    const router = useRouter();
    const [showAdditionalFields, setShowAdditionalFields] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [representativeId, setRepresentativeId] = useState<string | null>(null);
    const [tableData, setTableData] = useState<any[]>([]);

    const {
        control,
        register,
        handleSubmit,
        setValue,
        getValues,
        formState: { errors },
        reset
    } = useForm<teamManagementProfessionalValidationProps>({
        resolver: zodResolver(teamManagementProfessionalValidationSchema),
        defaultValues: {
            licenseState: '',
            professionalName: '',
            licenseNumber: ''
        },
        mode: "onChange"
    });

    const fetchDataLinks = async () => {
        setIsLoading(true);
        try {
            const res = await getNurses();

            if (res.totalCount > 0)
                setTableData(res.data);
        } catch (error) {
            toast.error("Erro ao buscar dados dos vínculos");
        } finally {
            setIsLoading(false);
        }
    }

    const handleSearchDoctor = async (licenseState: string, licenseNumber: string) => {
        setIsLoading(true);
        const hasValues = getValues("licenseNumber") || getValues("licenseState");

        if (hasValues) {
            setValue("licenseNumber", "");
            setValue("licenseState", "");
        }

        try {
            const response = await getDoctorCRMUFByProgram(licenseNumber, licenseState);
            debugger
            if (response.isValidData) {
                toast.success(response.additionalMessage);
                setValue("professionalName", response.value[0].name);
                setRepresentativeId(response.value[0].representativeId);
            } else {
                toast.warning(response.additionalMessage);
            }
            setShowAdditionalFields(true);
        } catch (error) {
            toast.error('Erro ao buscar médico');
        } finally {
            setIsLoading(false);
        }
    };

    const validateSearch = () => {
        const { licenseNumber, licenseState } = getValues();
        const errorsInSearch: any = {};

        if (!licenseNumber) errorsInSearch.licenseNumber = { message: "Insira um número de registro válido" };
        if (!licenseState) errorsInSearch.licenseState = { message: "Informe um estado" };

        return errorsInSearch;
    };

    const onSearch = () => {
        const errorsInSearch = validateSearch();

        if (Object.keys(errorsInSearch).length === 0) {
            const { licenseState, licenseNumber } = getValues();
            handleSearchDoctor(licenseState, licenseNumber);
        } else {
            for (const key in errorsInSearch) {
                setValue(key as keyof teamManagementProfessionalValidationProps, "", { shouldValidate: true });
                toast.error(errorsInSearch[key]?.message);
            }
        }
    };

    const onLink: SubmitHandler<teamManagementProfessionalValidationProps> = async (data) => {
        setIsLoading(true);
        try {
            if (representativeId !== null) {
                const response = await linkProfessional(representativeId);

                if (response.isValidData) {
                    toast.success(response.additionalMessage);
                    router.refresh();
                    fetchDataLinks();
                } else {
                    toast.warning(response.additionalMessage);                    
                }
            }
        } catch (error) {
            toast.error('Erro ao vincular profissional');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchDataLinks();
    }, []);

    return (
        <div className="h-full w-full">
            <LoadingOverlay isVisible={isLoading} />

            <h1 className="bg-red-400 p-4 rounded-xl w-full text-start text-white font-semibold text-lg md:text-2xl mb-8">
                Gestão de equipes
            </h1>

            <form
                className="flex flex-col gap-3 w-full h-full mb-10"
                onSubmit={handleSubmit(onLink)}
            >
                <SearchComponent
                    control={control}
                    register={register}
                    errors={errors}
                    onSearch={onSearch}
                />

                {showAdditionalFields && (
                    <AdditionalFields
                        control={control}
                        register={register}
                        errors={errors}
                    />
                )}

                <div className="flex flex-col md:flex-row gap-2">
                    <div className="flex 1">
                        <Button
                            type="submit"
                            size="lg"
                            className="mt-4 md:mt-3 bg-red-400"
                        >
                            Solicitar Vínculo
                        </Button>
                    </div>
                </div>
            </form>

            {/* <DataTable
                columns={columns}
                data={tableData}
            /> */}
        </div>
    );
}