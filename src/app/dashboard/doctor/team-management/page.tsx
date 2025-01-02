"use client"

import { LoadingOverlay } from "@/components/custom/LoadingOverlay";
import { ActionButtons } from "@/components/doctor/teamManagement/ActionButtons";
import { AdditionalFields } from "@/components/doctor/teamManagement/AdditionalFields";
import { SearchComponent } from "@/components/doctor/teamManagement/SearchComponent";
import { teamManagementValidationProps, teamManagementValidationSchema } from "@/lib/utils";
import { getNurses, linkProfessional, searchProfessional } from "@/services/doctor";
import { addProfessional, getOptionsProfessions } from "@/services/professions";
import { IStringMap } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { columns } from "./columns";
import { DataTable } from "@/components/dashboard/DataTable";

export default function TeamManagement() {
    const router = useRouter();
    const [isProfessionsLoading, setIsProfessionsLoading] = useState(false);
    const [optionsProfessions, setOptionsProfessions] = useState<IStringMap[]>([]);
    const [showAdditionalFields, setShowAdditionalFields] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [linkDisabled, setLinkDisabled] = useState(true);
    const [registerDisabled, setRegisterDisabled] = useState(true);
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
    } = useForm<teamManagementValidationProps>({
        resolver: zodResolver(teamManagementValidationSchema),
        defaultValues: {
            emailAddress: '',
            licenseStateCoren: '',
            professionalName: '',
            licenseNumberCoren: '',
            professionalTypeStringMap: '',
            mobilephone: ''
        },
        mode: "onChange"
    });

    const fetchProfessions = async () => {
        setIsProfessionsLoading(true);
        try {
            const response = await getOptionsProfessions();
            const filteredProfessions = response.filter(profession => profession.optionName !== 'Médico');
            setOptionsProfessions(filteredProfessions);
        } catch (error) {
            toast.error("Erro ao trazer profissionais");
        } finally {
            setIsProfessionsLoading(false);
        }
    };

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

    const handleSearchProfessional = async (professionalTypeStringMapId: string, licenseState: string, nroRegistro: string) => {
        setIsLoading(true);
        setLinkDisabled(true);
        setRegisterDisabled(true);
        const hasValues = getValues("emailAddress") || getValues("professionalName") || getValues("mobilephone");

        if (hasValues) {
            setValue("emailAddress", "");
            setValue("professionalName", "");
            setValue("mobilephone", "");
        }

        try {
            const professional = await searchProfessional(professionalTypeStringMapId, licenseState, nroRegistro);
            if (professional.isValidData) {
                setLinkDisabled(false);
                toast.success(professional.additionalMessage);
                setValue("emailAddress", professional.value[0].email);
                setValue("professionalName", professional.value[0].name);
                setValue("mobilephone", professional.value[0].mobilephone);
                setRepresentativeId(professional.value[0].representativeId);
            } else {
                toast.warning(professional.additionalMessage);
                setRegisterDisabled(false);
            }
            setShowAdditionalFields(true);
        } catch (error) {
            toast.error('Erro ao buscar profissionais');
        } finally {
            setIsLoading(false);
        }
    };

    const validateSearch = () => {
        const { professionalTypeStringMap, licenseNumberCoren, licenseStateCoren } = getValues();
        const errorsInSearch: any = {};

        if (!professionalTypeStringMap) errorsInSearch.selectProfessions = { message: "Selecione uma profissão" };
        if (!licenseNumberCoren) errorsInSearch.nroRegistro = { message: "Insira um número de registro válido" };
        if (!licenseStateCoren) errorsInSearch.licenseState = { message: "Informe um estado" };

        return errorsInSearch;
    };

    const onSearch = () => {
        const errorsInSearch = validateSearch();

        if (Object.keys(errorsInSearch).length === 0) {
            const { professionalTypeStringMap, licenseStateCoren, licenseNumberCoren } = getValues();
            handleSearchProfessional(professionalTypeStringMap, licenseStateCoren, licenseNumberCoren);
        } else {
            for (const key in errorsInSearch) {
                setValue(key as keyof teamManagementValidationProps, "", { shouldValidate: true });
                toast.error(errorsInSearch[key]?.message);
            }
        }
    };

    const onRegister: SubmitHandler<teamManagementValidationProps> = async (data) => {
        setIsLoading(true);
        try {
            const response = await addProfessional(data);
            if (response.isValidData) {
                toast.success(response.additionalMessage);
                reset();
                fetchDataLinks();
                router.replace("/dashboard/doctor/team-management");
            }
        } catch (error) {
            toast.error('Erro ao cadastrar e vincular profissional');
        } finally {
            setIsLoading(false);
        }
    };

    const onLink = async () => {
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
        fetchProfessions();
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
                onSubmit={handleSubmit(onRegister)}
            >
                <SearchComponent
                    control={control}
                    register={register}
                    errors={errors}
                    onSearch={onSearch}
                    optionsProfessions={optionsProfessions}
                    loading={isProfessionsLoading}
                />

                {showAdditionalFields && (
                    <AdditionalFields
                        control={control}
                        register={register}
                        errors={errors}
                        disabledFields={registerDisabled}
                    />
                )}

                <ActionButtons
                    onLink={onLink}
                    linkDisabled={linkDisabled}
                    registerDisabled={registerDisabled}
                />
            </form>

            {/* <DataTable
                columns={columns}
                data={tableData}
            /> */}
        </div>
    );
}