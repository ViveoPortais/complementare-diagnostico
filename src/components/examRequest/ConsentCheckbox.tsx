import React from 'react';
import { Controller } from 'react-hook-form';
import { Checkbox } from '../ui/checkbox';

type ConsentCheckboxProps = {
    control: any;
    errors: any;
};

const ConsentCheckbox: React.FC<ConsentCheckboxProps> = ({ control, errors }) => {
    return (
        <div className="w-full flex items-center gap-4">
            <Controller
                name="consent"
                control={control}
                render={({ field }) => (
                    <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                    />
                )}
            />
            <span className="uppercase text-[11px]">
                Aceito o Termo de Consentimento Livre e Esclarecido
            </span>
            {errors.consent && (
                <span className="ml-2 w-full text-xs text-red-400 mt-1">
                    {errors.consent.message}
                </span>
            )}
        </div>
    );
};

export default ConsentCheckbox;
