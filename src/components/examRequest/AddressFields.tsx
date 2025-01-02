"use client";

import React, { useEffect } from 'react';
import { Controller } from 'react-hook-form';
import { Input } from "@/components/ui/input";
import { CustomSelect } from "@/components/custom/CustomSelect";
import { UFlist } from "@/helpers/select-filters";
import { DatePickerComponent } from '../custom/CustomCalendar';
import { AddressData } from '@/services/api';
import { maskedField } from '../custom/MaskedField';
import { toast } from 'react-toastify';

type AddressFieldsProps = {
    control: any;
    setValue: any;
    address: any;
    ufList: any[];
};

const AddressFields: React.FC<AddressFieldsProps> = ({ control, setValue, address, ufList }) => {
    const handleCepBlur = async (cepValue: string) => {
        if (cepValue.length === 9) {
            const data = await AddressData(cepValue);
            if (data && data.erro !== true) {
                setValue('address.address', data.logradouro || '');
                setValue('address.neighborhood', data.bairro || '');
                setValue('address.city', data.localidade || '');
                setValue('address.uf', data.uf || '');
                setValue('address.number', data.number);
            } else {
                toast.error('CEP inválido ou não encontrado');
            }
        }
    };
    return (
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4'>
            <div className='col-span-1'>
                <Controller
                    name="address.name"
                    control={control}
                    render={({ field }) => (
                        <Input type='text' placeholder='Nome do Local' {...field} />
                    )}
                />
            </div>
            <div className='col-span-1'>
                <Controller
                    name="address.responsibleName"
                    control={control}
                    render={({ field }) => (
                        <Input type='text' placeholder='Nome do Responsável' {...field} />
                    )}
                />
            </div>
            <div className='col-span-1'>
                <Controller
                    name="address.cep"
                    control={control}
                    render={({ field }) => (
                        <div className="flex flex-col w-full">
                            {maskedField(
                                'cep',
                                field.onChange,
                                field.name,
                                'CEP',
                                true,
                                () => handleCepBlur(field.value),
                                field.value
                            )}
                        </div>
                    )}
                />
            </div>
            <div className='col-span-1'>
                <Controller
                    name="address.address"
                    control={control}
                    render={({ field }) => (
                        <Input type='text' placeholder='Logradouro' {...field} />
                    )}
                />
            </div>
            <div className='col-span-1'>
                <Controller
                    name="address.number"
                    control={control}
                    render={({ field }) => (
                        <Input type='text' placeholder='Número' {...field} />
                    )}
                />
            </div>
            <div className='col-span-1'>
                <Controller
                    name="address.complement"
                    control={control}
                    render={({ field }) => (
                        <Input type='text' placeholder='Complemento' {...field} />
                    )}
                />
            </div>
            <div className='col-span-1'>
                <Controller
                    name="address.neighborhood"
                    control={control}
                    render={({ field }) => (
                        <Input type='text' placeholder='Bairro' {...field} />
                    )}
                />
            </div>
            <div className='col-span-1'>
                <Controller
                    name="address.city"
                    control={control}
                    render={({ field }) => (
                        <Input type='text' placeholder='Cidade' {...field} />
                    )}
                />
            </div>
            <div className='col-span-1'>
                <Controller
                    name="address.uf"
                    control={control}
                    render={({ field }) => (
                        <CustomSelect {...field} label="UF" options={ufList} />
                    )}
                />
            </div>
            <div className='col-span-1'>
                <Controller
                    name="address.phone"
                    control={control}
                    render={({ field }) => (
                        <Input type='text' placeholder='Telefone do Responsável' {...field} />
                    )}
                />
            </div>
            <div className='col-span-1'>
                <Controller
                    name="address.cpf"
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
            <div className='col-span-1'>
                <Controller
                    name="address.birthDate"
                    control={control}
                    render={({ field }) => (
                        <DatePickerComponent
                            value={field.value}
                            onChange={date => field.onChange(date)}
                            label="Data de Nascimento do Responsável"
                        />
                    )}
                />
            </div>
        </div>
    );
};

export default AddressFields;
