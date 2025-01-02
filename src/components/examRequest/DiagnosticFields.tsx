"use client";

import React, { useEffect, useState } from 'react';
import { Controller } from 'react-hook-form';
import { CustomSelect } from '@/components/custom/CustomSelect';

const ufs = [
    { id: 'GO', value: 'GO' },
    { id: 'MG', value: 'MG' },
    { id: 'RJ', value: 'RJ' },
    { id: 'SP', value: 'SP' },
];

const cities = {
    GO: ['Goiânia'],
    MG: ['Belo Horizonte'],
    RJ: ['Rio de Janeiro'],
    SP: ['São Paulo'],
};

const DiagnosticFields: React.FC<{ control: any; setValue: any; laboratories: any[]; diseases: any[]; examDefinitions: any[] }> = ({ control, setValue, laboratories, diseases, examDefinitions }) => {
    const [selectedUF, setSelectedUF] = useState<string | null>(null);
    const [selectedCity, setSelectedCity] = useState<string | null>(null);
    const [filteredLaboratories, setFilteredLaboratories] = useState<any[]>([]);

    const handleUFChange = (value: string) => {
        setSelectedUF(value);
        setSelectedCity(null);
        setValue('ufExam', value);
    };

    const handleCityChange = (value: string) => {
        setSelectedCity(value);
        setValue('cityExam', value);
    };

    useEffect(() => {
        if (selectedCity) {
            const filtered = laboratories.filter(lab => lab.addressState === selectedUF);
            setFilteredLaboratories(filtered);
        }
    }, [selectedCity, laboratories, selectedUF]);

    return (
        <div className="flex flex-col gap-4">
            <div className="flex flex-row gap-4">
                <Controller
                    name="diseases"
                    control={control}
                    render={({ field }) => (
                        <CustomSelect
                            label="Suspeita Diagnóstico"
                            options={diseases.map(disease => ({ id: disease.id, value: disease.name }))}
                            {...field}
                        />
                    )}
                />

                <Controller
                    name="typeRequest"
                    control={control}
                    render={({ field }) => (
                        <CustomSelect
                            label="Tipo de Solicitação"
                            options={examDefinitions.map(exam => ({ id: exam.id, value: exam.name }))}
                            {...field}
                        />
                    )}
                />

                <Controller
                    name="ufExam"
                    control={control}
                    render={({ field }) => (
                        <CustomSelect
                            label="UF"
                            options={ufs}
                            onChange={(value) => {
                                handleUFChange(value);
                                field.onChange(value);
                            }}
                            value={field.value}
                            name={field.name}
                        />
                    )}
                />
            </div>

            {selectedUF && (
                <div className="flex flex-row gap-4">
                    <Controller
                        name="cityExam"
                        control={control}
                        render={({ field }) => (
                            <CustomSelect
                                label="Cidade"
                                options={cities[selectedUF as keyof typeof cities]?.map(city => ({ id: city, value: city })) || []}
                                onChange={(value) => {
                                    handleCityChange(value);
                                    field.onChange(value);
                                }}
                                value={field.value}
                                name={field.name}
                            />
                        )}
                    />

                    {selectedCity && (
                        <Controller
                            name="laboratoryExam"
                            control={control}
                            render={({ field }) => (
                                <CustomSelect
                                    label="Laboratório de Análises"
                                    options={filteredLaboratories.map(lab => ({ id: lab.id, value: lab.name }))}
                                    {...field}
                                />
                            )}
                        />
                    )}
                </div>
            )}
        </div>
    );
};

export default DiagnosticFields;
