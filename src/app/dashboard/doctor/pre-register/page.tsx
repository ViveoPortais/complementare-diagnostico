"use client";

import { CustomSelect } from "@/components/custom/CustomSelect";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { responseOptions } from "@/helpers/select-filters";
import { addPatient, getAllFromProgram } from "@/services/survey";
import { useEffect, useRef, useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import {
  acceptPreRegisterModal,
  modalRegisterUser,
  useModalRescue,
} from "@/hooks/useModal";
import useSession from "@/hooks/useSession";
import { toast } from "react-toastify";

export default function PreRegister() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [sendQuestions, setSendQuestions] = useState({
    PatientName: "",
    CPF: "",
    FileName: "",
    Base64: "",
    SurveyResponses: [] as {
      SurveyId: string;
      QuestionResponse: string;
      QuestionId: string;
    }[],
    HealthProgramCode: "150",
  });

  const [data, setData] = useState<
    {
      id: string;
      exibitionOrder: number;
      questionDescription: string;
      questionOption: { optionDescription: string }[];
      surveyId: string;
    }[]
  >([]);

  const [responses, setResponses] = useState<{ [key: string]: string }>({});
  const modalRescue = useModalRescue();
  const modalAccept = acceptPreRegisterModal();
  const modalRegister = modalRegisterUser();
  const dataStore = useSession();
  const [ticket, setTicket] = useState("");

  const handleChange = (e: any) => {
    setSendQuestions({
      ...sendQuestions,
      [e.target.name]: e.target.value,
    });
  };

  const handleSelectChange = (questionId: string, surveyId: string, e: any) => {
    const response = e.target ? e.target.value : e;
    setResponses((prevResponses) => ({
      ...prevResponses,
      [questionId]: response,
    }));

    setSendQuestions((prevState) => {
      const updatedResponses = prevState.SurveyResponses.map((qr) =>
        qr.QuestionId === questionId
          ? { ...qr, QuestionResponse: response }
          : qr
      );

      if (!updatedResponses.find((qr) => qr.QuestionId === questionId)) {
        updatedResponses.push({
          SurveyId: surveyId,
          QuestionId: questionId,
          QuestionResponse: response,
        });
      }

      return {
        ...prevState,
        SurveyResponses: updatedResponses,
      };
    });
  };

  const allFromProgram = async () => {
    getAllFromProgram()
      .then((res) => {
        setData(res);
        console.log(res);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleSendQuestions = () => {
    addPatient(sendQuestions)
      .then((res) => {
        if (res.additionalMessage === "Patient already exists!") {
          modalRegister.openModal(true);
          return;
        }
        if (res.additionalMessage === "Doctor with partial inactivation!") {
          toast.error(
            "Você não pode cadastrar pacientes com inativação parcial"
          );
          return;
        }
        if (!res.isValidData) {
          modalRescue.openModal(true);
          return;
        }
        if (res.isValidData) {
          modalAccept.openModal(true);
          handleClearFields();
          dataStore.setTicket(res.additionalMessage);
          setTicket(res.additionalMessage);
          if (fileInputRef.current) {
            fileInputRef.current.value = "";
          }
          return;
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const fileBase64 = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files && e.target.files[0];

    if (file) {
      const reader = new FileReader();

      reader.onloadend = () => {
        setSendQuestions({
          ...sendQuestions,
          Base64: reader.result as string,
          FileName: file.name,
        });
      };

      reader.readAsDataURL(file);
    }
  };

  const handleClearFields = () => {
    setSendQuestions({
      ...sendQuestions,
      PatientName: "",
      CPF: "",
      FileName: "",
      Base64: "",
      SurveyResponses: [] as {
        SurveyId: string;
        QuestionResponse: string;
        QuestionId: string;
      }[],
    });
    setResponses({});

    // Clear file input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  useEffect(() => {
    allFromProgram();
  }, [dataStore.ticket]);

  return (
    <div className="w-full h-full flex flex-col mt-8 lg:mt-0">
      <div className=" mb-10 text-xl border border-red-400 rounded-md p-3 bg-red-400">
        <h1 className="text-lg text-white">
          Preencha os dados abaixo para cadastrar seus pacientes.{" "}
        </h1>
      </div>
      <div className="w-full px-2 lg:px-4">
        <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-3 md:gap-8 ">
          <Input
            placeholder="Nome do paciente"
            name="PatientName"
            type="text"
            value={sendQuestions.PatientName}
            onChange={handleChange}
          />
          <Input
            placeholder="CPF"
            name="CPF"
            type="text"
            value={sendQuestions.CPF}
            onChange={handleChange}
          />
          <Input
            placeholder="Receita Médica"
            name="base64"
            type="file"
            onChange={fileBase64}
            ref={fileInputRef}
          />
        </div>
        <div className="w-full items-center grid grid-cols-1 gap-8 mt-3">
          {data.map((item) => (
            <div
              key={item.id}
              className="w-full items-center grid grid-cols-1 gap-5 mt-6 border border-red-400 rounded-md p-5"
            >
              <div>
                <span className="text-base text-main-green">
                  {item.exibitionOrder}. {item.questionDescription}
                </span>
              </div>
              <div>
                <CustomSelect
                  name={`questions-${item.id}`}
                  label="Respostas"
                  options={responseOptions}
                  value={responses[item.id] || ""}
                  onChange={(e) =>
                    handleSelectChange(item.id, item.surveyId, e)
                  }
                />
              </div>
            </div>
          ))}
        </div>
        <div className="w-full items-center grid grid-cols-1 gap-8 mt-3 ">
          <div className="w-full items-center grid grid-cols-1 gap-5 mt-6  bg-gray-200 rounded-md p-5">
            <div className="flex flex-col text-xs">
              <span>Referência:</span>
              <span>
                - Vucic S., Ferguson.T.A Cummings, C., Hotchkin, M.T., Genge,A.,
                Glanzman, R., Roet, K.C.D., Cudkowicz, M., & Kiernan, M.C.
              </span>
              <span>
                (2021). Gold Coast diagnostic criteria: implications for ALS
                diagnosis and clinical trial enrollment. Muscle Nerve, 64(5),
                532-537.
              </span>
              <span>https://dol.org/10.1002/mus.27392</span>
              <span>
                Turner M.R.(2022), Diagnosing ALS: the Gold Coast criteria and
                the role of EMG. Practical Neurology, practneurol-2021-003256.
              </span>
              <span>https://dol.org/10.1136/practneurol-2021-003256</span>
            </div>
          </div>
        </div>
        <div className="flex flex-col md:flex-row gap-8 mt-4 md:mt-8 mb-12 ">
          <Button
            className="lg:w-[200px]"
            size="lg"
            variant={`tertiary`}
            onClick={handleSendQuestions}
          >
            Registrar
          </Button>

          <Button
            className="lg:w-[200px]"
            size="lg"
            variant={`tertiary`}
            onClick={handleClearFields}
          >
            Limpar
          </Button>
        </div>
      </div>
      <div>
        <Dialog
          open={modalRescue.isModalOpen}
          onOpenChange={modalRescue.openModal}
        >
          <DialogContent className="w-[30%] rounded-lg lg:max-w-[80vw] backgroundModal border border-none">
            <div className="flex flex-col p-5">
              <span className="text-xl font-semibold  text-white">
                O seu paciente não cumpriu os critérios de elegibilidade para
                realização do exame de Eletroneuromiografia pelo programa Vida
                Rara.
              </span>
              <span className="text-xl font-semibold  text-white">
                Por esse motivo o cadastro dele não constará em nosso banco de
                dados. Em caso de dúvidas entre contato com o número: 0800 400
                5003 de segunda a sexta exceto feriados nacionais.
              </span>
            </div>
          </DialogContent>
        </Dialog>
      </div>
      <div>
        <Dialog
          open={modalAccept.isModalOpen}
          onOpenChange={modalAccept.openModal}
        >
          <DialogContent className="w-[30%] rounded-lg lg:max-w-[80vw] backgroundModal border border-none">
            <div className="flex flex-col p-5">
              <span className="text-xl font-semibold text-white">
                Seu paciente é elegível para realização de Eletroneuromiografia.
              </span>
              <span className="text-xl font-semibold text-white">
                Por favor anote o ticket {ticket} no pedido de exame da
                Eletroneuromiografia informe ao seu paciente que entre em
                contato com o número 0800 400 5003 para realizar o cadastro no
                programa Vida Rara e agendar o exame. No momento do contato o
                paciente deverá informar o número do ticket que consta no pedido
                do exame, a partir desse momento o exame terá validade de 30
                dias.
              </span>
            </div>
          </DialogContent>
        </Dialog>
      </div>
      <div>
        <Dialog
          open={modalRegister.isModalOpen}
          onOpenChange={modalRegister.openModal}
        >
          <DialogContent className="w-[30%] rounded-lg lg:max-w-[80vw] backgroundModal border border-none">
            <div className="flex flex-col p-5">
              <span className="text-xl font-semibold text-white">
                Seu paciente é já está cadastrado no programa Vida Rara
              </span>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
