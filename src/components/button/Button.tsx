import { IconType } from "react-icons";

interface ButtonProps {
  label: string;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  disabled?: boolean;
  small?: boolean;
  icon?: IconType;
  type?: "button" | "submit" | "reset" | undefined;
  customClass?: string;
  loadingCustomClass?: string;
  isLoading?: boolean;
  breakText?: boolean;
}

const Button = ({
  label,
  onClick,
  disabled,
  icon: Icon,
  type,
  customClass,
  isLoading,
  breakText,
  loadingCustomClass,
}: ButtonProps) => {


  return (
<button
  onClick={onClick}
  disabled={disabled}
  className={`
    relative 
    disabled:bg-gray-500 
    disabled:border-gray-500 
    disabled:opacity-70 
    text-white       /* texto branco */
    border-2 
    font-semibold 
    py-2 
    z-0 
    text-md 
    disabled:cursor-not-allowed 
    rounded-lg 
    hover:opacity-80 
    transition 
    ${customClass}
  `}
  type={type}
>
  {Icon && <Icon size={24} className="absolute left-4 top-3" />}
  {isLoading ? (
    <div className={`${loadingCustomClass} flex justify-center items-center`}>
      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white" />
    </div>
  ) : (
    <span className={`uppercase ${breakText && "whitespace-nowrap"}`}>
      {label}
    </span>
  )}
</button>

  );
};

export default Button;
