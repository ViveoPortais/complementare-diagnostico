import { Controller } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { maskedField } from "@/components/custom/MaskedField";
import { teamManagementValidationProps } from "@/lib/utils";

interface AdditionalFieldsProps {
    control: any;
    register: any;
    errors: any;
    disabledFields: boolean;
}

export function AdditionalFields({
    control,
    register,
    errors,
    disabledFields
}: AdditionalFieldsProps) {
    return (
        <div className="flex flex-col md:flex-row gap-2">
            <div className="flex-1">
                <Input
                    type="text"
                    placeholder="Nome completo"
                    {...register("professionalName", { required: true })}
                    className="w-full"
                    disabled={disabledFields}
                />
                {errors.professionalName && (
                    <span className="w-full text-xs text-red-400 mt-1">
                        {errors.professionalName.message}
                    </span>
                )}
            </div>
            <div className="flex-1">
                <Input
                    type="email"
                    placeholder="E-mail"
                    {...register("emailAddress", { required: true })}
                    className="w-full"
                    disabled={disabledFields}
                />
                {errors.emailAddress && (
                    <span className="w-full text-xs text-red-400 mt-1">
                        {errors.emailAddress.message}
                    </span>
                )}
            </div>
            <div className="flex-1 md:flex-none">
                <Controller
                    name="mobilephone"
                    control={control}
                    render={({ field }) =>
                        maskedField(
                            "cellphone",
                            field.onChange,
                            field.name,
                            "Celular",
                            false,
                            () => { },
                            field.value,    
                            disabledFields                        
                        )
                    }
                />
                {errors.mobilephone && (
                    <span className="w-full text-xs text-red-400 mt-1">
                        {errors.mobilephone.message}
                    </span>
                )}
            </div>
        </div>
    );
}
