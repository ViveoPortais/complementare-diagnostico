import { patientInfoValidationProps } from "@/lib/utils";
import { Controller } from "react-hook-form";
import { Input } from "../ui/input";
import { useEffect } from "react";
import { DatePickerComponent } from "../custom/CustomCalendar";
import { maskedField } from "../custom/MaskedField";

type patientSectionProps = {
  control: any,
  errors: any,
  name: string,
  birthDate: string,
  mobilePhone: string,
  email: string,
  setValue: (name: keyof patientInfoValidationProps, value: any) => void
}

export const PatientSection = ({
  control,
  errors,
  name,
  birthDate,
  mobilePhone,
  email,
  setValue
}: patientSectionProps) => {

  useEffect(() => {
    setValue('name', name);
    setValue('birthDate', birthDate);
    setValue('mobilePhone', mobilePhone);
    setValue('email', email);
  }, [name, birthDate, mobilePhone, email, setValue]);

  return (
    <div>
      <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-3 md:gap-8 mt-7">
        <Controller control={control} defaultValue={name} name="name" render={({ field: {ref, ...field} }) => (
          <div className="flex flex-col w-full">
            <Input {...field} ref={ref} placeholder="Nome completo" value={field.value} />
            {errors.name &&
              <span className="text-xs text-red-400 mt-1">
                {errors.name.message}
              </span>
            }
          </div>
        )} />

        <Controller control={control} defaultValue={birthDate} name="birthDate" render={({ field: {ref, ...field} }) => (
          <div className="flex flex-col w-full">
            <DatePickerComponent label="Data de nascimento" onChange={(date: any) => field.onChange(date)} value={field.value} />
            {errors.birthDate &&
              <span className="text-xs text-red-400 mt-1">
                {errors.birthDate.message}
              </span>
            }
          </div>
        )} />
      </div>

      <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-3 md:gap-8 mt-7">
        <Controller control={control} defaultValue={mobilePhone} name="mobilePhone" render={({ field: {ref, ...field} }) => (
          <div>
            {maskedField("cellphone", field.onChange, field.name, "Telefone", true, undefined, field.value)}
            {errors.mobilePhone &&
              <span className="text-xs text-red-400 mt-1">
                {errors.mobilePhone.message}
              </span>
            }
          </div>
        )} />

        <Controller control={control} defaultValue={email} name="email" render={({ field: {ref, ...field} }) => (
          <div>
            <Input {...field} ref={ref}  placeholder="E-mail" value={field.value} />
            {errors.email &&
              <span className="text-xs text-red-400 mt-1">
                {errors.email.message}
              </span>
            }
          </div>
        )} />
      </div>
    </div>
  )
}