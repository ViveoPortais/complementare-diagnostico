"use client";

import Button from "@/components/button/Button";
import Input from "@/components/input/Input";
import Loading from "@/components/loading/Loading";
import { getConsentTerms, termDoctor } from "@/services/doctor";
import {
  getConsentTermsPatient,
  getPatientByProgram,
  termPatient,
} from "@/services/patient";
import { useSearchParams } from "next/navigation";
import {Suspense, useEffect, useState, useRef } from "react";
import { toast } from "react-toastify";

const TermsPatientContent = () => {
  const searchParams = useSearchParams();
  const UrlRouter = searchParams.get("id") as string | null;

  const [id, setId] = useState("");
  const [doctorData, setDoctorData] = useState<any>({});
  const [dataDoctor, setDataDoctor] = useState<any>(null);


  const [consentProgramParticipation, setConsentProgramParticipation] =
    useState(false);

  const [confirmEmail, setConfirmEmail] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const termRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (UrlRouter) setId(UrlRouter);
  }, [UrlRouter]);

  useEffect(() => {
    if (!id) return;
    getDoctorByProgra();
    getConsentTerm();
  }, [id]);

  useEffect(() => {
    if (doctorData && Object.keys(doctorData).length > 0) {
      setDataDoctor({
        patientId: id,
        consentTerms: true,
        consentProgramParticipation: consentProgramParticipation,
        consentToReceiveEmail: confirmEmail,
        patientInactive: false,
        programCode: "1100",
      });
    }
  }, [
    doctorData,
    id,
    consentProgramParticipation,
    confirmEmail,
  ]);

  useEffect(() => {
    if (consentProgramParticipation) {
      setConfirmEmail(true);
    } else {
      setConfirmEmail(false);
    }
  }, [consentProgramParticipation]);

  const getDoctorByProgra = async () => {
    setIsLoading(true);
    getPatientByProgram({
      patientId: id,
      programcode: "1100",
    })
      .then((response) => setDoctorData(response))
      .finally(() => setIsLoading(false));
  };

  const getConsentTerm = async () => {
    getConsentTermsPatient({
      patientId: id,
      programcode: "1100",
    }).then((response) => {
      setConsentProgramParticipation(
        response.consentProgramParticipation || false
      );

      setConfirmEmail(response.consentToReceiveEmail || false);

      if (response.consentTerms && response.consentLgpd) {
        toast.info("Termo já foi aceito anteriormente.");
        setIsSubmitted(true);
      } if (response.consentTerms == false && response.consentLgpd == false) {
        toast.info("Termo já foi recusado anteriormente.");
        setIsSubmitted(true);
      }
      if (response.patientInactive) {
        toast.error("Paciente inativo no programa.");
        setIsSubmitted(true);
      }
    });
  };

  const handleAccept = async () => {
    setIsLoading(true);
    termPatient({
      ...dataDoctor,
      consentTerms: true,
    })
      .then((response) => {
        if (response.isValidData) {
          toast.success("Termo aceito com sucesso.");
          setIsSubmitted(true);
        } else {
          toast.error(response.value);
        }
      })
      .finally(() => setIsLoading(false));
  };

  const handleRefuse = async () => {
    setIsLoading(true);
    termPatient({
      ...dataDoctor,
      consentTerms: false,
    })
      .then((response) => {
        if (response.isValidData) {
          toast.success("Termo recusado com sucesso.");
          setIsSubmitted(true);
        } else {
          toast.error(response.value);
        }
      })
      .finally(() => setIsLoading(false));
  };

  const handleScroll = () => {
    if (!termRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = termRef.current;

    const tolerance = 50;

    if (scrollTop + clientHeight + tolerance >= scrollHeight) {
      setIsScrolled(true);
    }
  };

  useEffect(() => {
    if (!termRef.current) return;
    const { scrollHeight, clientHeight } = termRef.current;
    if (scrollHeight <= clientHeight) setIsScrolled(true);
  }, []);

  return (
    <div className="px-5 py-3 md:px-12 md:py-5">
      <div className="flex flex-col gap-3 border border-gray-200 p-5 rounded-lg">
        {isLoading ? (
          <Loading />
        ) : (
          <>
            <div className="flex flex-col md:flex-row gap-3">
              <Input
                name="name"
                type="text"
                disabled
                placeholder="Paciente"
                label="Paciente"
                value={doctorData.name || ""}
              />
              <Input
                name="telephoneNumber"
                type="text"
                disabled
                placeholder="Celular"
                label="Celular"
                value={doctorData.telephoneNumber || ""}
              />
            </div>
            <div className="flex flex-col md:flex-row gap-3">
              <Input
                name="cpf"
                type="text"
                disabled
                placeholder="CPF"
                label="CPF"
                value={doctorData.cpf || ""}
              />
              <Input
                name="emailAddress"
                type="text"
                disabled
                placeholder="E-mail"
                label="E-mail"
                value={doctorData.emailAddress || ""}
              />
            </div>
          </>
        )}
      </div>

      <div className="mt-5 bg-gray-50 border border-gray-200 rounded-lg p-5">
        <h2 className="text-lg font-bold mb-4">Consentimentos</h2>
        <div className="flex items-center gap-2 mb-4">
          <input
            id="chk-receive-calls"
            type="checkbox"
            className="h-5 w-5"
            checked={consentProgramParticipation}
            onChange={(e) => setConsentProgramParticipation(e.target.checked)}
            disabled={isSubmitted}
          />
          <label htmlFor="chk-receive-calls">Aceito participar do Programa Complementare e concordo com o regulamento do Programa.- <span className='text-red-500 text-sm'>É necessario aceitar para continuar.</span></label>
        </div>
       
       
        
       
       
        <div className="mt-5 p-4 bg-yellow-100 border-l-4 border-yellow-500 text-yellow-800 text-base font-semibold rounded">
        Para aceitar o regulamento do Programa, é <u>necessário ler a página até o final</u>. Isso ativará as opções de <strong>aceite</strong> ou <strong>recusa</strong>.

        </div>
      </div>

      <div
        ref={termRef}
        onScroll={handleScroll}
        className="mt-5 border border-gray-200 rounded-lg p-5 h-[50vh] overflow-y-auto text-lg leading-relaxed"
      >
        <div className="text-center text-3xl text-enzimaisBlue font-bold mt-5 mb-10">
            <span>REGULAMENTO</span>
          </div>
        <div className="text-start text-xl md:text-2xl font-bold text-blue mt-2 mb-4">
          1. O que é o Programa Complementare?
        </div>
        <div className="text-justify text-xl md:text-2x1 leading-relaxed">
          <p>
            • O Programa de Diagnóstico Complementare® (“Programa”) é um serviço oferecido pela AstraZeneca
            do Brasil Ltda. sociedade inscrita no CNPJ/ME sob o nº. 60.318.797/0001-00, com sede na Rodovia Raposo
            Tavares, Km 26,9, na cidade de Cotia, Estado de São Paulo (“AstraZeneca”), e tem por objetivo proporcionar
            aos médicos solicitantes acesso limitado a testes/exames laboratoriais específicos, destinados a apoiar
            diagnósticos de doenças raras nas áreas terapêuticas de atuação da AstraZeneca. Este serviço é operado por um
            fornecedor especializado, contratado especificamente para essa finalidade
          </p>

          <p>
            • Os testes/exames laboratoriais oferecidos no âmbito do Programa aos médicos e respectivos pacientes
            serão custeados pela AstraZeneca, cabendo aos participantes arcarem apenas com os custos relacionados a
            eventuais deslocamentos para realização dos testes/exames no laboratório credenciado. Através do Programa,
            serão coletados dados de resultados e de fatores de risco dos pacientes que serão armazenados e compartilhados
            com a AstraZeneca, de forma anonimizada, para análise de dados do Programa, mantendo os dados pessoais dos
            pacientes em anonimato.
          </p>
          <p>
            • A inclusão e/ou exclusão de exames e laboratórios credenciados para coleta e análise dos exames fica a
            critério exclusivo da AstraZeneca, podendo ser alterado a qualquer momento, independentemente de aviso prévio.

          </p>

          <div className="text-start text-xl md:text-2xl font-bold text-blue mt-4 mb-4">
            2. Participação no Programa
          </div>
          <p>
            • A participação no Programa é condicionada ao conhecimento e aceitação de todas as condições
            estabelecidas neste regulamento (“Regulamento”). No caso de participante menor de idade, apenas o responsável
            legal poderá aceitar este Regulamento.

          </p>
          <p>
            • Este Regulamento define as condições aplicáveis à participação no Programa, sem prejuízo das leis
            aplicáveis. O cadastro e início da participação no Programa implica conhecimento total deste Regulamento pelos
            pacientes participantes, inclusive no que se refere ao tratamento de dados pessoais, conforme estabelecido na
            Política de Privacidade da AstraZeneca. Portanto, antes de se cadastrar no Programa, os participantes devem ler
            com atenção este Regulamento e a Política de Privacidade da AstraZeneca, disponível no link:
            https://www.azprivacy.astrazeneca.com/americas/brazil/br/privacy-notices.html.
          </p>
          <p>
            • O Programa é realizado por prazo indeterminado, podendo ser alterado, suspenso ou encerrado a qualquer
            momento, mediante comunicação através de e-mail via Programa Complementare.
          </p>
          <div className="text-start text-xl md:text-2xl font-bold text-blue mt-4 mb-4">
            3. Participantes – Quem pode participar do Programa?
          </div>
          <p>
            •  Médicos. Médicos atuando regularmente no território nacional (com inscrição ativa no respectivo
            Conselho Regional de Medicina) e que queiram solicitar e dar acesso aos exames do Programa para pacientes
            residentes no Brasil, desde que os pacientes se enquadrem nos critérios de elegibilidade, pré definidos, de acordo
            com cada doença contemplada no Programa Complementare.
          </p>
          <p>
            • Pacientes. Pacientes com sinais e/ou sintomas sugestivos de alguma doença rara dentro das áreas
            terapêuticas de atuação que da AstraZeneca e que tenham interesse em participar do Programa.
          </p>
          <div className="text-start text-xl md:text-2xl font-bold text-blue mt-4 mb-4">
            4. Como o paciente pode utilizar os serviços?
          </div>
          <p>
            • O paciente terá acesso aos exames mediante apresentação de uma solicitação médica devidamente
            carimbada, assinada e contendo o motivo do pedido
          </p>
          <p>
            • Para participar do Programa, o paciente deverá realizar seu cadastro via plataforma ou por meio de
            ligação telefônica pelo telefone 0800 7791234. Caso o cadastro for realizado via telefone, o paciente receberá um
            link, enviado por SMS, e-mail ou WhatsApp, com o presente Regulamento. A participação no Programa está
            condicionada à confirmação da aceitação das regras estabelecidas neste documento. Caso não haja confirmação,
            a participação não será permitida
          </p>
          <p>
            • Após a realização do cadastro e de posse da solicitação médica, o paciente deverá entrar em contato com o
            Programa para agendar o exame solicitado. O agendamento poderá ser feito por telefone no número 0800
            7791234, ou diretamente pela própria Plata
          </p>
          <p>
            • Informações do médico requisitante: (i) nome completo do médico; (ii) CRM do médico/estado de registro;
          </p>
          <p>
            • Informações do paciente: (i) nome; (ii) cpf; (iii) data de nascimento; (iv) telefones para contato; (v) e-mail;
            (vi) endereço completo; (vii) sexo.
          </p>
          <p>
            • Caso o paciente seja menor de idade ou esteja hospitalizado e impossibilitado de entrar em contato com o
            Programa, o responsável legal pelo paciente deverá fazer o agendamento cumprindo os requisitos dos itens
            acima
          </p>
          <p>
            • A solicitação médica com o pedido de exames tem validade de 30 (trinta) dias a partir da data de emissão. Após
            este prazo o paciente terá que solicitar um novo pedido de exames ao médico
          </p>
          <p>
            • Procedimentos agendados e não realizados no prazo máximo de 30 (trinta) dias após o agendamento serão
            cancelados. Para um novo agendamento, o paciente terá que solicitar um novo pedido de exames ao médico e
            entrar em contato com o Programa novamente.
          </p>
          <div className="text-start text-xl md:text-2xl font-bold text-blue mt-4 mb-4">
            5. Responsabilidades
          </div>
          <p>
            • Do paciente ambulatorial
          </p>
          <p>
          • Ligar no 0800 ou via WhatsApp para agendar os exames;
          </p>
          <p>
          • Comparecer no laboratório indicado para a realização dos procedimentos dentro dos
            prazos estipulados portando documento original com foto e pedido médico datado, menos de 30
            (trinta) dias, em mãos;
          </p>
          <p>
          • Comunicar à equipe do Programa através do 0800 779 1234 ou via WhatsApp através
          </p>
          <p>
          • Do responsável pelo paciente menor de idade ou hospitalizado e impossibilitado de ligar:
          </p>
          <p>
          • Ligar no 0800 ou entre em contato via WhatsApp para autorizar a realização do exame
          </p>
          <p>
          • Seguir o procedimento descrito nos itens 5.1.2, 5.1.3 ou 5.2 acima que for aplicável.
          </p>
          <div className="text-start text-xl md:text-2xl font-bold text-blue mt-2 mb-4">
            6. Proteção de Dados Pessoais. Política de Privacidade e Compartilhamento de Informações
          </div>
          <p>
          • A AstraZeneca tem o compromisso de respeitar a privacidade e a proteção dos dados pessoais dos
            participantes do Programa, nos termos deste Regulamento.
          </p>
          <p>
          • Os dados pessoais utilizados no Programa terão as seguintes finalidades: (i) gestão do programa e dos
            exames concedidos; (ii) prevenção de eventuaisfraudes e realização de controlesinternossobre o Programa; (iii)
            atendimento a solicitações dos participantes; (iv) envio de informações sobre o Programa aos participantes; (v)
            envio de informações a respeito de serviços da AstraZeneca e demais empresas do Grupo; (vi) realização de
            estudos sobre o Programa, mas com dados anonimizados; e (vii) cumprimento de eventuais obrigações legais ou
            regulatórias
          </p>
          <p>
            • Serão tratados osseguintes dados:
            Nome completo,CPF, data de nascimento,sexo, telefone, endereço completo, e-mail, idade,
            exame solicitado, status e data da realização do exame, resultado (positivo ou negativo) e
            eventuais interações do paciente com o Programa;
          </p>
          <p>
          • Quando for necessário compartilhar dos dados do Programa com qualquer área da AstraZeneca, as
            informações serão anonimizadas, garantido que os dados não permitam a identificação do paciente.
          </p>
          <p>
          • A AstraZeneca utilizará medidas técnicas e administrativas aptas a proteger os dados e informações
            pessoais de acessos não autorizados e de situações acidentais ou ilícitas de destruição, perda, alteração,
            comunicação ou difusão e exigirá que seus parceiros, fornecedores e prestadores de serviço também o façam.
            Maiores informações sobre tratamento de dados pessoais pela AstraZeneca e medidas de segurança que serão
            conferidas aos dados pessoais dos pacientes estão disponíveis em nosso Aviso de Privacidade em
            https://www.azprivacy.astrazeneca.com/americas/brazil/br/privacy-notices.html
          </p>
          <p>
          • A AstraZeneca armazenará os dados pessoais dos participantes até que eles não sejam mais necessários
            no âmbito do Programa, salvo se a AstraZeneca precisar mantê-los para alguma outra finalidade, como o
            cumprimento de obrigação legal ou para a proteção dos direitos da AstraZeneca e de terceiros, nos termos da
            legislação aplicável. Caso o titular não interaja com o Programa por um período de três anos, seus dados serão
            excluídos.
          </p>
          <p>
          • Em caso de relato de um evento adverso relacionado a qualquer medicamento da AstraZeneca,
            profissionais de farmacovigilância da empresa poderão entrar em contato com o paciente participante ou com o
            médico prescritor para obter informações complementares.
          </p>
          <p>
          • Informações geradas pelo relato de um evento adverso de qualquer medicamento da
            AstraZeneca serão, nos termos da lei, coletadas, armazenadas e processadas pela AstraZeneca para
            monitoramento da segurança dos seus medicamentos e, quando for preciso, essas informações serão
            enviadas à Autoridade Sanitária local ou global.
          </p>
          <p>
          • Para melhor adequação dos benefícios e execução do Programa, a AstraZeneca se reserva o direito de,
            mediante uso de informações coletadas no ato do cadastro, realizar consultas à terceiros autorizados para
            validação dos dados cadastrais.
          </p>
          <p>
          • Nos termos da Lei Geral de Proteção de Dados (LGPD), os participantes podem solicitar a
            atualização/alteração de seus dados cadastrais e/ou a exclusão/cancelamento de seu cadastro, a qualquer tempo
            e sem necessidade de apresentar qualquer justificativa para tal, por meio do e-mail
            complementare@programacomplementare.com.br. No entanto, no caso de ser solicitada a exclusão de
            informações do cadastro, os participantes estão cientes que poderão não mais estar aptos a participar do Programa
            e serão excluídos dos serviços do Programa. Para maiores detalhes dos direitos dos participantes, acesse o Aviso
            de Privacidade da AstraZeneca, informado no item 7.4.
          </p>
          <p>
          • Ao se cadastrar no Programa, os participantes, médico e paciente, concordam que as informações que
            fornecerem no ato do cadastro sejam administradas pela AstraZeneca e/ou por uma empresa que possua parceria
            firmada com a AstraZeneca na gestão dos serviços do Programa e mantidas em sigilo.

          </p>
          <p>
          • A AstraZeneca não fornece, cede ou compartilha, sem a expressa autorização dos participantes, as
            informações do Programa a terceiros para qualquer fim que não seja o mínimo necessário para o correto
            funcionamento do Programa.
          </p>
          <p>
          • A AstraZeneca não envia mensagens por correio eletrônico aos participantes do Programa solicitando o
            fornecimento dos Dados Pessoais ou de qualquer outro dado ou informação sigilosa. Caso o participante tenha
            qualquer tipo de dúvida sobre a autenticidade das mensagens recebidas em seu correio eletrônico deverá entrar
            em contato imediato com a AstraZeneca.
          </p>
          <div className="text-start text-xl md:text-2xl font-bold text-blue mt-2 mb-4">
            7. Disposições Gerais
          </div>
          <p>
          • O Programa é integralmente pautado na autonomia, independência e liberdade do médico.
          </p>
          <p>
          • A AstraZeneca não autoriza a realização de exames pelo Programa com fins de pesquisa clínica e/ou de publicações científicas.
          </p>
          <p>
          • Em caso de dúvidas sobre o Programa, os participantes poderão contatar o serviço através do telefone
            0800 779 1234 ou pelo WhatsApp (11) 95469-0536 de segunda à sexta-feira das 8h às 20h (exceto feriados).

          </p>
          <p>
          • Este Regulamento será disponibilizado aos médicos via plataforma do Programa.
          </p>
          <p>
          • Fica eleito o foro central da cidade de São Paulo, Estado de São Paulo, como competente para dirimir
            eventuais disputas oriundas deste Regulamento.
          </p>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-3 mt-8">
        <Button
          onClick={handleAccept}
          label="ACEITAR"
          isLoading={isLoading}
          disabled={!isScrolled || isSubmitted ||  !consentProgramParticipation  || !confirmEmail}
          customClass="w-full bg-[#004aad] text-white"
        />
        <Button
          onClick={handleRefuse}
          label="RECUSAR"
          isLoading={isLoading}
          disabled={!isScrolled || isSubmitted || consentProgramParticipation || confirmEmail}
          customClass="w-full bg-main-black text-black"
        />
      </div>
    </div>
  );
};

const TermsPatient = () => {
  return (
    <Suspense fallback={<Loading />}>
      <TermsPatientContent />
    </Suspense>
  );
};


export default TermsPatient;
