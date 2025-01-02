import { Controller } from "react-hook-form";
import { Input } from "../ui/input";
import { DatePickerComponent } from "../custom/CustomCalendar";
import { useEffect } from "react";
import { saleValidationProps } from "@/lib/utils";

type saleSectionProps = {
	control: any,
	errors: any,
	quantityMedicament: number,
	purchaseDate: string,
	setValue: (name: keyof saleValidationProps, value: any) => void
};

export const SaleSection = ({ control, errors, quantityMedicament, purchaseDate, setValue }: saleSectionProps) => {

	useEffect(() => {
		setValue('quantityMedicament', quantityMedicament);
		setValue('purchaseDate', purchaseDate);
	}, [quantityMedicament, purchaseDate]);

	return (
		<div>
			<div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-3 md:gap-8 mt-7">
				<Input name="program" type="text" readOnly={true} value="Complementare Diagnóstico" />
				<Input name="medicament" type="text" readOnly={true} value="Sotyktu" />
			</div>

			<div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-3 md:gap-8 mt-7">
				<Controller control={control} defaultValue={quantityMedicament} name="quantityMedicament" render={({ field }) => (
					<div className="flex flex-col w-full">
						<Input {...field} placeholder="Quantidade" type="number" value={field.value} />
						{errors.quantityMedicament &&
							<span className="text-xs text-red-400 mt-1">
								{errors.quantityMedicament.message}
							</span>
						}
					</div>
				)} />

				<Controller control={control} defaultValue={purchaseDate} name="purchaseDate" render={({ field }) => (
					<div className="flex flex-col w-full">
						<DatePickerComponent label="Data da compra" onChange={(date: any) => field.onChange(date)} value={field.value} />
						{errors.purchaseDate &&
							<span className="text-xs text-red-400 mt-1">
								{errors.purchaseDate.message}
							</span>
						}
					</div>
				)} />
			</div>
		</div>
	)
}
