"use client";

import { maskedField } from "../../../../components/custom/MaskedField";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { addTreatment, getTreatments } from "@/services/treatment";
import { CgSpinner } from "react-icons/cg";
import { toast } from "react-toastify";
import { sendToken, validateToken } from "@/services/auth";
import { addPurchase } from "@/services/purchase";
import { patientInfoValidationSchema, saleValidationProps, saleValidationSchema, tokenInfoValidationSchema } from "@/lib/utils";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { PatientSection } from "@/components/saleRegistration/PatientSection";
import { SendTokenDialog } from "@/components/saleRegistration/SendTokenDialog";
import { SaleSection } from "@/components/saleRegistration/SaleSection";

const patientSchema = patientInfoValidationSchema;
const tokenSchema = tokenInfoValidationSchema;
const saleSchema = saleValidationSchema;

export default function SaleRegistration() {
  const patientFormInfo = useForm({ resolver: zodResolver(patientSchema) });
  const tokenFormInfo = useForm({ resolver: zodResolver(tokenSchema) });
  const saleFormInfo = useForm({ resolver: zodResolver(saleSchema) });

  const [isLoadingPatientInformation, setIsLoadingPatientInformation] = useState(false);
  const [isLoadingToken, setIsLoadingToken] = useState(false);
  const [isLoadingSavePatient, setIsLoadingSavePatient] = useState(false);
  const [isLoadingSaveSale, setIsLoadingSaveSale] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [showPatientFields, setShowPatientFields] = useState(false);
  const [showSaleFields, setShowSaleFields] = useState(false);
  const [showTokenButton, setShowTokenButton] = useState(false);
  const [showSaveSaleButton, setShowSaveSaleButton] = useState(false);
  const [phaseValidation, setPhaseValidation] = useState(true); // inserir CPF para validação
  const [phaseSaleRegister, setPhaseSaleRegister] = useState(false); // paciente já existe e é elegível
  const [phasePreRegister, setPhasePreRegister] = useState(false); // pré-cadastro do paciente
  const [phaseSaleAfterPreRegister, setPhaseSaleAfterPreRegister] = useState(false); // pré-cadastro do paciente
  const [token, setToken] = useState("");
  const [disabledSaveSale, setDisabledSaveSale] = useState(false);
  const [saleRegistrationData, setSaleRegistrationData] = useState({
    programCode: process.env.PROGRAM_CODE,
    email: '',
    cpf: '',
    birthDate: '',
    name: '',
    mobilePhone: ''
  });
  const [saleInfo, setSaleInfo] = useState({
    quantityMedicament: 0,
    purchaseDate: "",
  });

  const handleCPFChange = (e: any) => {
    if (saleRegistrationData.cpf === e.target.value)
      return;

    if (e.target.value[13] != "_" && e.target.value.length > 0) {
      setIsLoadingPatientInformation(true);

      getTreatments({ cpf: e.target.value })
        .then((res) => {

          if (res.data.isUserException === true) {
            toast.warning(res.data.additionalMessage);

            if (res.data.additionalMessage.includes("CPF não encontrado")) {
              setShowPatientFields(true);
              setShowTokenButton(true);
              setPhaseValidation(false);
              setPhasePreRegister(true);
            }

            return;
          }

          setSaleRegistrationData({
            ...saleRegistrationData,
            name: JSON.parse(res.data.value).PatientName,
            birthDate: JSON.parse(res.data.value).BirthDate,
            mobilePhone: JSON.parse(res.data.value).MobilePhone,
            email: JSON.parse(res.data.value).EmailAddress1,
            cpf: JSON.parse(res.data.value).PatientCpf
          });

          toast.success('CPF validado com sucesso! O paciente está cadastrado no programa Complementare Diagnóstico™.');

          setShowTokenButton(false);
          setShowPatientFields(true);
          setShowSaleFields(true);
          setShowSaveSaleButton(true);
          setPhaseValidation(false);
          setPhasePreRegister(false);
          setPhaseSaleRegister(true);
        })
        .catch((reason) => {
          toast.error("Erro ao buscar o paciente.");
        })
        .finally(() => {
          setIsLoadingPatientInformation(false);
        });
    } else {
      setShowPatientFields(false);
      setShowSaleFields(false);
    }

    setSaleRegistrationData({
      ...saleRegistrationData,
      cpf: e.target.value,
    });
  };

  const handleSendToken = (data: any) => {
    setIsLoadingToken(true);

    setSaleRegistrationData({
      ...saleRegistrationData,
      'mobilePhone': data.mobilePhone,
      'name': data.name,
      'birthDate': data.birthDate,
      'email': data.email
    });

    sendToken({name: "TOKEN_CADASTRO", mobilePhone: data.mobilePhone,})
      .then((result) => {
        toast.success(`Enviamos o número do token da validação para o telefone ${data.mobilePhone}.`);

        setIsOpen(true);
        setShowTokenButton(false);
      })
      .catch((result) => {
        toast.error(
          "Houve um erro no envio do token. Por favor, tente novamente."
        );
      })
      .finally(() => {
        setIsLoadingToken(false);
      });
  };

  const handleSavePatient = (data: any) => {
    setIsLoadingSavePatient(true);

    setToken(data.token);

    validateToken({
      name: "TOKEN_CADASTRO",
      mobilePhone: saleRegistrationData.mobilePhone,
      token: data.token,
    })
      .then((data) => {
        addTreatment({ ...saleRegistrationData, programCode: "" })
          .then((result) => {
            setIsOpen(false);
            toast.success(result.additionalMessage);
            setShowSaleFields(true);
            setShowSaveSaleButton(true);
            setPhasePreRegister(false)

            if (phasePreRegister)
              setPhaseSaleAfterPreRegister(true);
            else
              setPhaseSaleRegister(true);
          })
          .catch((result) => {
            console.log("result");
            console.log(result);
          })
          .finally(() => {
            setIsLoadingSavePatient(false);
          });
      })
      .catch((result) => {
        toast.error("Token inválido. Por favor, tente novamente.");
        setIsLoadingSavePatient(false);
      });
  };

  const handleSaveSale = (data: any) => {
    setIsLoadingSaveSale(true);

    setSaleInfo({
      ...saleInfo,
      purchaseDate: data.purchaseDate,
      quantityMedicament: data.quantityMedicament
    })

    addPurchase({ purchaseDate: data.purchaseDate, quantityMedicament: data.quantityMedicament, patientCpf: saleRegistrationData.cpf })
      .then(_ => {
        setDisabledSaveSale(true);
        toast.success("Registro realizado com sucesso.");
        setInterval(function () { location.reload(); }, 6000);
      })
      .catch((result) => {
        toast.success("Houve um erro no registro da venda. Por favor, tente novamente.");
      })
      .finally(() => {
        setIsLoadingSaveSale(false);
      });
  };

  return (
    <div className="w-full h-full flex flex-col mt-8 lg:mt-0">
      <div className=" mb-10 text-xl border important-color rounded-md p-3 bg-red-400">
        {phaseValidation && <h1 className="text-lg text-white">Paciente | Validação do Paciente no programa</h1>}
        {phaseSaleRegister && <h1 className="text-lg text-white">Paciente | Registro de Venda</h1>}
        {phasePreRegister && <h1 className="text-lg text-white">Paciente | Pré Cadastro</h1>}
        {phaseSaleAfterPreRegister && <h1 className="text-lg text-white">Paciente | Registro de Venda via Pré Cadastro</h1>}
      </div>
      <div className="w-full px-2 lg:px-4">
        <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-3 md:gap-8 pb-3 border-b-2">
          {maskedField("cpf", handleCPFChange, "cpf", "CPF", true, undefined, saleRegistrationData.cpf)}
          {isLoadingPatientInformation && (
            <div className="flex items-center">
              <CgSpinner size={40} className="animate-spin" />
            </div>
          )}
        </div>
        {showPatientFields && (
          <div>
            <form noValidate onSubmit={patientFormInfo.handleSubmit(handleSendToken)}>
              <PatientSection
                control={patientFormInfo.control}
                errors={patientFormInfo.formState.errors}
                name={saleRegistrationData.name}
                birthDate={saleRegistrationData.birthDate}
                mobilePhone={saleRegistrationData.mobilePhone}
                email={saleRegistrationData.email}
                setValue={patientFormInfo.setValue} />

              <div className="flex items-center pt-5">
                {showTokenButton && (
                  <Button className="lg:w-[200px]" size="lg" type="submit" variant={`default`}>
                    {isLoadingToken ? (<CgSpinner size={20} className="text-white animate-spin" />) : ("Salvar Dados")}
                  </Button>
                )}
              </div>
            </form>

            <SendTokenDialog
              control={tokenFormInfo.control}
              errors={tokenFormInfo.formState.errors}
              open={isOpen}
              isLoading={isLoadingSavePatient}
              onClose={(open) => setIsOpen(!open)}
              onConfirm={tokenFormInfo.handleSubmit(handleSavePatient)}
              token={token} />
          </div>
        )}
        {showSaleFields && (
          <div>
            <form noValidate onSubmit={saleFormInfo.handleSubmit(handleSaveSale)}>
              <SaleSection
                control={saleFormInfo.control}
                errors={saleFormInfo.formState.errors}
                quantityMedicament={saleInfo.quantityMedicament}
                purchaseDate={saleInfo.purchaseDate}
                setValue={saleFormInfo.setValue} />

              <div className="flex items-center pb-5 pt-5">
                {showSaveSaleButton && (
                  <Button className="lg:w-[200px]" disabled={disabledSaveSale} size="lg" type="submit" variant={`default`}>
                    {isLoadingSaveSale ? (<CgSpinner size={20} className="text-white animate-spin" />) : ("Salvar Venda")}
                  </Button>
                )}
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
