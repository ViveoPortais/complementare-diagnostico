import React from "react";
import Image from "next/image";
import { Button } from "./ui/button";

interface ContentCardProps {
  isCustomBg?: boolean;
  bgColor?: string;
  textColor?: string;
  buttonColor?: string;
  buttonBorderColor?: string;
  title: string;
  subtitle?: string;
  subtitleTwo?: string;
  subtitleThree?: string;
  subtitleFour?: string;
  subtitleFive?: string;
  subtitleSix?: string;
  subtitleSeven?: string;
  textemail?: string;
  textphone?: string;
  buttonText?: string;
  svgIcon?: string;
  hasIcon?: boolean;
  hideButton?: boolean;
  isHeight?: boolean;
  onButtonClick?: () => void;
}

const ContentCard = ({
  isCustomBg,
  bgColor,
  title,
  subtitle,
  subtitleTwo,
  textemail,
  textphone,
  buttonText,
  hideButton,
  subtitleThree,
  subtitleFour,
  subtitleFive,
  subtitleSix,
  subtitleSeven,
  isHeight,
  onButtonClick,
}: ContentCardProps) => {
  const sendEmail = () => {
    window.open(
      "mailto:teste@suporteaopaciente.com.br?subject=Subject&body=Body%20goes%20here"
    );
  };

  const calling = () => {
    window.open("tel:0800 000 0000");
  };

  return (
    <div
      className={`w-full rounded-xl lg:h-52 ${
        isHeight ? "2xl:h-80" : "2xl:h-60"
      } ${
        isCustomBg
          ? "bg-[url('/')] bg-contain bg-no-repeat bg-careDarkBlue scale-x-[-1]"
          : `${bgColor}`
      } `}
    >
      <div className={`${isCustomBg && "scale-x-[-1]"} flex flex-col h-full`}>
        <div className="text-white md:w-full ml-3 2xl:ml-5 mt-5 md:mt-8 xl:mt-4 text-3xl flex flex-col">
          <span>{title}</span>
          <span className="text-sm mt-2 ml-1 opacity-95 w-3/4">{subtitle}</span>
          <span className="text-base font-medium mt-3 ml-1 opacity-95">
            {subtitleTwo}
          </span>
          <span className="flex flex-col text-base font-medium mt-3 ml-1 opacity-95">
            <span>{subtitleThree}</span>
            <span>{subtitleFour}</span>
            <span>{subtitleFive}</span>
            <span>{subtitleSix}</span>
          </span>
          <span className="text-base font-medium mt-3 ml-1 opacity-95">
            {subtitleSeven}
          </span>
          <span
            onClick={sendEmail}
            className="text-sm font-bold ml-1 opacity-95 cursor-pointer hover:text-careDarkBlue"
          >
            {textemail}
          </span>
          <span
            onClick={calling}
            className="text-2xl md:text-3xl lg:text-3xl xl:text-xl xl:mt-0 2xl:mt-3 2xl:text-3xl font-bold ml-1 opacity-95 hover:text-careDarkBlue cursor-pointer"
          >
            {textphone}
          </span>
        </div>
        <div
          className={`ml-3 2xl:ml-5 my-5 flex ${
            hideButton ? "justify-end" : "justify-between"
          } items-end h-full`}
        >
          {!hideButton && (
            <Button size="lg" variant={`tertiary`} onClick={onButtonClick}>
              {buttonText}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ContentCard;
