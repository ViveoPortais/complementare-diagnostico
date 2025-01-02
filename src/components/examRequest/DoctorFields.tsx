"use client";

import React, { useEffect } from 'react';
import { Controller } from 'react-hook-form';
import { Input } from "@/components/ui/input";
import { CustomSelect } from "@/components/custom/CustomSelect";
import { UFlist } from "@/helpers/select-filters";

type DoctorFieldsProps = {
    control: any;
    crmDoctor: string;
    ufDoctor: string;
    setValue: any;
    email: string;
    isDoctor: boolean;
    role: string;
    doctors: any[];
    selectedDoctor: any;
    userName: string;
    setSelectedDoctor: (doctor: any) => void;
    handleUfChange: (uf: string) => void;
};

const DoctorFields: React.FC<DoctorFieldsProps> = ({ control, crmDoctor, ufDoctor, setValue, email, isDoctor, role, doctors, selectedDoctor, userName, setSelectedDoctor, handleUfChange }) => {
    useEffect(() => {
        if (crmDoctor) {
            setValue('crm', crmDoctor);
        }
        if (ufDoctor) {
            setValue('uf', ufDoctor);
        }
    }, [crmDoctor, ufDoctor, setValue]);
    return (
        <>
            {isDoctor ? (
                <>
                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="flex-1">
                            <Controller
                                name="crm"
                                control={control}
                                render={({ field }) => (
                                    <Input
                                        type="text"
                                        placeholder="CRM"
                                        {...field}
                                        readOnly
                                    />
                                )}
                            />
                        </div>
                        <div className="flex-1">
                            <Controller
                                name="uf"
                                control={control}
                                render={({ field }) => (
                                    <CustomSelect
                                        label="UF"
                                        options={UFlist}
                                        {...field}
                                    />
                                )}
                            />
                        </div>
                        <div className="flex-1">
                            <Controller
                                name="userName"
                                control={control}
                                defaultValue={userName}
                                render={({ field }) => (
                                    <Input
                                        type="string"
                                        placeholder="Nome"
                                        {...field}
                                        readOnly
                                        disabled={true}
                                    />
                                )}
                            />
                        </div>
                        <div className="flex-1">
                            <Controller
                                name="email"
                                control={control}
                                defaultValue={email}
                                render={({ field }) => (
                                    <Input
                                        type="email"
                                        placeholder="E-mail"
                                        {...field}
                                        readOnly
                                        disabled={true}
                                    />
                                )}
                            />
                        </div>
                    </div>
                </>
            ) : (
                <>
                    <div className="flex-1">
                        <Controller
                            name="doctor"
                            control={control}
                            render={({ field }) => (
                                <CustomSelect
                                    {...field}
                                    label="Médicos"
                                    options={doctors.map(doc => ({ id: doc.id, value: doc.name }))}
                                    onChange={e => {
                                        const selected = doctors.find(doc => doc.id === e.target.value);
                                        setSelectedDoctor(selected);
                                        setValue('crm', selected?.crm || '');
                                        setValue('uf', selected?.uf || '');
                                        setValue('email', selected?.email || '');
                                    }}
                                />
                            )}
                        />
                    </div>
                    <div className="flex-1">
                        <Controller
                            name="crm"
                            control={control}
                            render={({ field }) => (
                                <Input
                                    type="text"
                                    placeholder="CRM"
                                    {...field}
                                    readOnly
                                />
                            )}
                        />
                    </div>
                    <div className="flex-1">
                        <Controller
                            name="uf"
                            control={control}
                            render={({ field }) => (
                                <CustomSelect
                                    {...field}
                                    label="UF"
                                    options={UFlist}
                                    onChange={e => handleUfChange(e.target.value)}
                                />
                            )}
                        />
                    </div>
                </>
            )}
        </>
    );
};

export default DoctorFields;
