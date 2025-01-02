import ReactInputMask from "react-input-mask";
import { Input } from "../ui/input";

export type MaskedFieldProps = {
  mask: string;
  onChange: (e: any) => void;
  name: string;
  placeholder: string;
  required?: boolean;
  onBlur?: (e: any) => void | undefined;
  value?: string;
  disabled?: boolean;
  title?: string;
};

const maskOptions = {
    cpf: "999.999.999-99",
    phone: '(99) 9999-9999',
    cellphone: '(99) 99999-9999',
    cep: '99999-999'
}

export const maskedField = (
  mask: string,
  onChange: (e: any) => void,
  name: string,
  placeholder: string,
  required?: boolean,
  onBlur?: (e: any) => void,
  value?: string,
  disabled?: boolean,
  title?: string
) => {
  return (
    <ReactInputMask
      mask={maskOptions[mask as keyof typeof maskOptions]}
      alwaysShowMask={false}
      onChange={onChange}
      name={name}
      onBlur={onBlur}
      value={value ? value : ""}
      disabled={disabled}
      title={title}
    >
      <Input placeholder={placeholder} name={name} required={required} />
    </ReactInputMask>
  );
};
