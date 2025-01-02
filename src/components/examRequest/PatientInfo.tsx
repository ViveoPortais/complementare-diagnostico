import React from 'react';
import { Controller } from 'react-hook-form';
import { Input } from "@/components/ui/input";
import { DatePickerComponent } from "@/components/custom/CustomCalendar";
import { maskedField } from '../custom/MaskedField';

type PatientInfoProps = {
    control: any;
    email: string;
};

const PatientInfo: React.FC<PatientInfoProps> = ({ control, email }) => {
    return (
        <div className='flex flex-col md:flex-row gap-4'>
            <div className="flex-1">
                <Controller
                    name="patientName"
                    control={control}
                    render={({ field }) => (
                        <Input type="text" placeholder="Nome do Paciente" {...field} />
                    )}
                />
            </div>
            <div className="flex-1">
                <Controller
                    name="cpf"
                    control={control}
                    render={({ field }) => (
                        <div className="flex flex-col w-full">
                            {maskedField(
                                'cpf',
                                field.onChange,
                                field.name,
                                'CPF',
                                true,
                                undefined,
                                field.value
                            )}
                        </div>
                    )}
                />
            </div>
            <div className="flex-1">
                <Controller
                    name="birthDate"
                    control={control}
                    render={({ field }) => (
                        <DatePickerComponent
                            value={field.value}
                            onChange={date => field.onChange(date)}
                            label="Data de Nascimento"
                        />
                    )}
                />
            </div>
        </div>
    );
};

export default PatientInfo;
