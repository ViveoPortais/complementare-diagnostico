// components/ProfessionalFields.tsx
import React from 'react';
import { Controller } from 'react-hook-form';
import { CustomSelect } from "@/components/custom/CustomSelect";
import { Input } from '@/components/ui/input';
import { UFlist } from "@/helpers/select-filters";

type ProfessionalFieldsProps = {
    control: any;
    doctors: any[];
    setSelectedDoctor: (doctor: any) => void;
    setValue: any;
    handleUfChange: (uf: string) => void;
};

const ProfessionalFields: React.FC<ProfessionalFieldsProps> = ({ control, doctors, setSelectedDoctor, setValue, handleUfChange }) => {
    return (
        <>
            <div className="flex flex-col md:flex-row gap-4">
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
                            <Input type="text" placeholder="CRM" {...field} readOnly />
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
            </div>
        </>
    );
};

export default ProfessionalFields;
