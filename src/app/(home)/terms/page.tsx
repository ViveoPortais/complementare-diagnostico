'use client';

import React, { Suspense, useEffect, useState, useRef } from 'react';
import { useSearchParams } from 'next/navigation';
import Button from '@/components/button/Button';
import Input from '@/components/input/Input';
import Loading from '@/components/loading/Loading';
import { toast } from 'react-toastify';
import { getConsentTerms, getDoctorByProgram, termDoctor } from '@/services/doctor';
import ReactInputMask from 'react-input-mask';

const TermsContent = () => {
  const searchParams = useSearchParams();
  const UrlRouter = searchParams?.get('id') || null;

  const [id, setId] = useState('');
  const [doctorData, setDoctorData] = useState<any>({});
  const [dataDoctor, setDataDoctor] = useState<any>(null);
  const [cpf, setCpf] = useState(doctorData.cpf || '')
  const [telephoneNumber, setTelephoneNumber] = useState(doctorData.telephoneNumber || '')
  const [isEmailValid, setIsEmailValid] = useState(false)
  const [emailAddress, setEmailAddress] = useState(doctorData.emailAddress || '')
  const [consentToReceivePhonecalls, setConsentToReceivePhonecalls] = useState(false);
  const [consentProgramParticipation, setConsentProgramParticipation] =
    useState(false);
  const [consentToReceiveSms, setConsentToReceiveSms] = useState(false);
  const [confirmPersonalInformation, setConfirmPersonalInformation] = useState(false);
  const [confirmEmail, setConfirmEmail] = useState(false);
  const missingInfo =
    !doctorData.cpf ||
    !doctorData.emailAddress ||
    !isEmailValid ||
    !doctorData.telephoneNumber;
  const [consentLgpd, setConsentLgpd] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const termRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (UrlRouter) setId(UrlRouter);
  }, [UrlRouter]);

  function validateEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

  useEffect(() => {
    if (!id) return;
    fetchDoctorData();
    fetchConsentTerms();
  }, [id]);

  useEffect(() => {
    if (doctorData && Object.keys(doctorData).length > 0) {
      setDataDoctor({
        doctorId: id,
        doctorName: doctorData.name,
        doctorEmail: doctorData.emailAddress,
        doctorCPF: doctorData.cpf,
        mobilePhone: doctorData.telephoneNumber,
        licenseNumber: doctorData.licenseNumber,
        licenseState: doctorData.licenseState,
        consentProgramParticipation,
        consentToReceivePhonecalls,
        consentToReceiveSms,
        confirmPersonalInformation,
        consentLgpd,
        consentToReceiveEmail: confirmEmail,
        programCode: '1100',
      });
    }
  }, [
    doctorData,
    id,
    consentProgramParticipation,
    consentToReceivePhonecalls,
    consentToReceiveSms,
    confirmPersonalInformation,
    consentLgpd,
  ]);

  useEffect(() => {
    if (consentProgramParticipation) {
      setConsentToReceivePhonecalls(true);
      setConsentToReceiveSms(true);
      setConfirmEmail(true);
      setConfirmPersonalInformation(true);
      setConsentLgpd(true);
    } else {
      setConsentToReceivePhonecalls(false);
      setConsentToReceiveSms(false);
      setConfirmEmail(false);
      setConfirmPersonalInformation(false);
      setConsentLgpd(false);
    }
  }, [consentProgramParticipation]);

  const fetchDoctorData = async () => {
    setIsLoading(true);
    try {
      const response = await getDoctorByProgram({ doctorId: id, programcode: '1100' });
      setDoctorData(response);
    } finally {
      setIsLoading(false);
    }
  };



  const fetchConsentTerms = async () => {
    const response = await getConsentTerms({ doctorId: id, programcode: '1100' });
    setConsentToReceivePhonecalls(response.consentToReceivePhonecalls || false);
    setConsentProgramParticipation(
      response.consentProgramParticipation || false
    );
    setConsentToReceiveSms(response.consentToReceiveSms || false);
    setConfirmPersonalInformation(response.confirmPersonalInformation || false);
    setConsentLgpd(response.consentLgpd || false);
    setConfirmEmail(response.consentToReceiveEmail || false);

    if (response.consentTerms && response.consentLgpd) {
      toast.info('Termo já foi aceito anteriormente.');
      setIsSubmitted(true);
    }
    if (response.consentTerms == false && response.consentLgpd == false) {
      toast.info("Termo já foi recusado anteriormente.");
      setIsSubmitted(true);
    }
    if (response.doctorInactive) {
      toast.error('Médico inativo no programa.');
      setIsSubmitted(true);
    }
  };

useEffect(() => {
  if (doctorData && Object.keys(doctorData).length) {
    setCpf(doctorData.cpf || '')
    setTelephoneNumber(doctorData.telephoneNumber || '')
    setEmailAddress(doctorData.emailAddress || '')
  }
}, [doctorData])


  const handleAccept = async () => {
    setIsLoading(true);
    const response = await termDoctor({
      ...dataDoctor,
      consentTerms: true,
    });
    response.isValidData
      ? toast.success('Termo aceito com sucesso.')
      : toast.error(response.value);
    setIsSubmitted(true);
    setIsLoading(false);
  };

  const handleRefuse = async () => {
    setIsLoading(true);
    setConsentToReceivePhonecalls(false);
    setConsentToReceiveSms(false);
    setConfirmPersonalInformation(false);
    setConsentLgpd(false);
    const response = await termDoctor({
      ...dataDoctor,
      consentTerms: false,
    });
    response.isValidData
      ? toast.success('Termo recusado com sucesso.')
      : toast.error(response.value);
    setIsSubmitted(true);
    setIsLoading(false);
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

  useEffect(() => {
  if (doctorData && Object.keys(doctorData).length) {
    const rawCpf = doctorData.cpf || ''
    const rawEmail = doctorData.emailAddress || ''
    const rawPhone = doctorData.telephoneNumber || ''

    setCpf(rawCpf)
    setEmailAddress(rawEmail)
    setTelephoneNumber(rawPhone)

    
    setIsEmailValid(validateEmail(rawEmail))

    if (termRef.current) {
      const { scrollHeight, clientHeight } = termRef.current
      setIsScrolled(scrollHeight <= clientHeight)
    }
  }
}, [doctorData])


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
                placeholder="Médico"
                label="Médico"
                value={doctorData.name || ''}
              />

              <Input
                name="licenseNumber"
                type="text"
                disabled
                placeholder="CRM"
                label="CRM"
                value={doctorData.licenseNumber || ''}
              />
              <Input
                name="licenseState"
                type="text"
                disabled
                placeholder="UF"
                label="UF"
                value={doctorData.licenseState || ''}
              />

            </div>
            <div className="flex flex-col md:flex-row gap-3">

              <ReactInputMask
                mask="999.999.999-99"
                alwaysShowMask={false}
                onChange={e => setCpf(e.target.value)}
                name="patientCpf"
                value={cpf}
                maskPlaceholder={null}
              >
                <Input
                  label="CPF do paciente"
                  placeholder="999.999.999-99"
                />
              </ReactInputMask>

              <ReactInputMask
                mask="(99) 99999-9999"
                value={telephoneNumber}
                onChange={e => setTelephoneNumber(e.target.value)}
                maskPlaceholder={null}
              >
                <Input
                  label="Celular"
                  placeholder="(99) 99999-9999"
                />
              </ReactInputMask>

              <Input
                name="emailAddress"
                type="text"
                placeholder="E-mail"
                label="E-mail"
                value={emailAddress}
                onChange={e => setEmailAddress(e.target.value)}

              />
            </div>
          </>
        )}
      </div>
      <p className="text-red-500 text-md mt-4">
        É necessário confirmar os dados de celular, e-mail e CPF para continuar.
      </p>
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
        <div className="text-center text-xl md:text-2xl font-bold text-blue mt-2 mb-4">
          REGULAMENTO
        </div>
        <div className="text-start text-xl md:text-2xl font-bold text-blue mt-2 mb-4">
          1. O que é o Programa Complementare?
        </div>
        <div className="text-justify text-xl md:text-2x1 leading-relaxed">
          <p>• O Programa de Diagnóstico Complementare® (“Programa”) é um serviço oferecido pela <strong>AstraZeneca </strong>
            do Brasil Ltda. sociedade inscrita no CNPJ/ME sob o nº. 60.318.797/0001-00, com sede na Rodovia Raposo
            Tavares, Km 26,9, na cidade de Cotia, Estado de São Paulo (“AstraZeneca”), e tem por objetivo proporcionar
            aos médicos solicitantes acesso limitado a testes/exames laboratoriais específicos, destinados a apoiar
            diagnósticos de doenças raras nas áreas terapêuticas de atuação da <strong>AstraZeneca</strong>. Este serviço é operado por um
            fornecedor especializado, contratado especificamente para essa finalidade.
          </p>

          <p>• Os testes/exames laboratoriais oferecidos no âmbito do Programa aos médicos e respectivos pacientes
            serão custeados pela <strong>AstraZeneca</strong>, cabendo aos participantes arcarem apenas com os custos relacionados a
            eventuais deslocamentos para realização dos testes/exames no laboratório credenciado. Através do Programa,
            serão coletados dados de resultados e de fatores de risco dos pacientes que serão armazenados e compartilhados
            com a <strong>AstraZeneca</strong>, de forma anonimizada, para análise de dados do Programa, mantendo os dados pessoais dos
            pacientes em anonimato.
          </p>
          <p>• A inclusão e/ou exclusão de exames e laboratórios credenciados para coleta e análise dos exames fica a
            critério exclusivo da <strong>AstraZeneca</strong>, podendo ser alterado a qualquer momento, independentemente de aviso
            prévio.

          </p>
          <div className="text-start text-xl md:text-2xl font-bold text-blue mt-2 mb-4">
            2. Participação no Programa
          </div>
          <p>• A participação no Programa é condicionada ao conhecimento e aceitação de todas as condições
            estabelecidas neste regulamento (“Regulamento”).
          </p>
          <p>• Este Regulamento define as condições aplicáveis à participação no Programa, sem prejuízo das das
            leis aplicáveis. O cadastro e início da participação no Programa implicam conhecimento total deste Regulamento
            pelos médicos participantes, inclusive no que se refere ao tratamento de dados pessoais, conforme estabelecido
            na Política de Privacidade da <strong>AstraZeneca</strong>. Portanto, antes de se cadastrar no Programa, os participantes devem
            ler com atenção este Regulamento e a Política de Privacidade da <strong>AstraZeneca</strong>, disponível no link:
            <a href="https://www.azprivacy.astrazeneca.com/americas/brazil/br/privacy-notices.html" target="_blank" rel="noopener noreferrer" className="underline">
              https://www.azprivacy.astrazeneca.com/americas/brazil/br/privacy-notices.html
            </a>
          </p>
          <p>• O Programa é realizado por prazo indeterminado, podendo ser alterado, suspenso ou encerrado a qualquer
            momento, mediante comunicação através de e-mail via Programa Complementare.
          </p>
          <div className="text-start text-xl md:text-2xl font-bold text-blue mt-2 mb-4">
            3. Participantes – Quem pode participar do Programa?
          </div>
          <p>• Médicos. Médicos atuando regularmente no território nacional (com inscrição ativa no respectivo
            Conselho Regional de Medicina) e que queiram solicitar e dar acesso aos exames do Programa para pacientes
            residentes no Brasil, desde que os pacientes se enquadrem nos critérios de elegibilidade, pré definidos, de acordo
            com cada doença contemplada no Programa Complementare
          </p>
          <p>• Pacientes. Pacientes com sinais e/ou sintomas sugestivos de alguma doença rara dentro das áreas terapêuticas de atuaçãoque da <strong>AstraZeneca </strong> e tenham interesse em participar do Programa.
          </p>
          <div className="text-start text-xl md:text-2xl font-bold text-blue mt-2 mb-4">
            4. Como o médico pode utilizar os serviços?
          </div>
          <p>• Para utilizar o Programa, o médico deverá realizar seu cadastro via plataforma do Programa ou por
            meio de ligação telefônica pelo telefone 0800 7791234, na qual poderá gerenciar solicitações dos exames/testes
            e acompanhar resultados. O médico estará apto a participar do Programa e a disponibilizar acesso aos seus
            pacientes somente após a aceitação deste Regulamento..
          </p>
          <p>• O médico é responsável por fornecer ao paciente uma solicitação médica, devidamente carimbada e
            assinada, contendo o nome do exame, motivo da solicitação, nome do médico, CRM e data, pedido este que será
            inserido/elaborado na própria plataforma. Além disso, o médico poderá realizar um pré-cadastro do paciente,
            para participação do Programa
          </p>
          <p>• Caso o paciente não demonstre interesse em participar do Programa no período de 2 (dois) a 3 (três)
            semanas, seus dados do pré-cadastro, serão excluídos.
          </p>
        </div>
        <div className="text-start text-xl md:text-2xl font-bold text-blue mt-2 mb-4">
          5. Responsabilidade do Médico
        </div>
        <p>• Fornecer o pedido de exames para o paciente solicitar o agendamento;
        </p>
        <p>• Nos casos de paciente hospitalizado, quando a coleta do material for feita por
        </p>
        <p>• Orientar o responsável pelo paciente a ligar no 0800 ou utilizar a Plataforma para
          autorizar a realização do exame;
        </p>
        <p>• O médico deve consultar e seguir rigorosamente as instruções específicas fornecidas sobre
          os procedimentos adequados para a coleta, armazenamento e transporte das amostras, garantindo a
          integridade e a qualidade das mesmas;

        </p>
        <p>• Providenciar o preparo e a armazenagem da amostra nas condições necessárias, até que
          a amostra seja retirada;

        </p>
        <p>• Providenciar a documentação necessária para transporte de amostra biológica que será
          enviada previamente para preenchimento;
        </p>
        <p>• Providenciar a autorização e orientações necessárias para a retirada do material na
          instituição de saúde, indicando a pessoa responsável pela guarda da amostra;

        </p>
        <p>• Nos casos de paciente hospitalizado, caso disponível na sua região, quando a
          coleta do material for feita por um laboratório parceiro do Programa:
        </p>
        <p>• Ligar para o 0800 ou entrar em contato via WhatsApp para certificar-se que o Programa
          dispõe de um laboratório parceiro para fazer a coleta hospitalar e agendar a coleta
        </p>
        <p>• Certificar-se que instituição de saúde permite a entrada de um profissional de saúde
          externo, de laboratório parceiro, para realizar a coleta;

        </p>
        <p>• Providenciar a autorização para entrada do profissional de saúde externo, de um
          laboratório parceiro do Programa, para coleta de amostra de material biológico de paciente internado;

        </p>
        <p>• Orientar o responsável pelo paciente a ligar no 0800 ou entrar em contato via WhatsApp para autorizar a realização do exame;

        </p>
        <p>• Providenciar a documentação necessária para transporte de amostra biológica que será
          enviada previamente para preenchimento.
        </p>
        <div className="text-start text-xl md:text-2xl font-bold text-blue mt-2 mb-4">
          6. Proteção de Dados Pessoais. Política de Privacidade e Compartilhamento de Informações
        </div>
        <p>• A <strong>AstraZeneca </strong> tem o compromisso de respeitar a privacidade e a proteção dos dados pessoais dos
          participantes do Programa, nos termos deste Regulamento.
        </p>
        <p>• Os dados pessoais utilizados no Programa terão as seguintes finalidades: (i) gestão do programa e dos
          exames concedidos; (ii) prevenção de eventuaisfraudes e realização de controlesinternossobre o Programa; (iii)
          atendimento a solicitações dos participantes; (iv) envio de informações sobre o Programa aos participantes; (v)
          envio de informações a respeito de serviços da <strong>AstraZeneca </strong> e demais empresas do Grupo; (vi) realização de
          estudos sobre o Programa, mas com dados anonimizados; e (vii) cumprimento de eventuais obrigações legais ou
          regulatórias.

        </p>
        <p>• Serão tratados osseguintes dados:
          Nome completo, CRM, instituição, cidade e estado.

        </p>
        <p>• Quando for necessário compartilhar dos dados do Programa com qualquer área da <strong>AstraZeneca</strong>,
          as informações serão anonimizadas, garantido que os dados não permitam a identificação do paciente.
        </p>
        <p>• Ao aderir ao Programa, os particiantes estão cientes de que seus dados pessoais coletados pela
          <strong>AstraZeneca </strong> poderão sertransferidos para outras empresas do grupo <strong>AstraZeneca</strong>, no Brasil e no exterior, e para
          determinados terceiros que auxiliam a <strong>AstraZeneca </strong> a implementar, desempenhar, operacionalizar, fornecer e a
          aprimorar o Programa, tais como: administradores da plataforma do Programa, empresa de cloud-computing,
          prestadores de serviços de TI e demais fornecedores e prestadores de serviço da <strong>AstraZeneca</strong>. A <strong>AstraZeneca </strong>
          também poderá compartilhar os dados pessoais dos participantes com auditores e consultores, no Brasil e no
          exterior, responsáveis por verificar se a <strong>AstraZeneca </strong> está agindo em conformidade com os requisitos legais
          internos e externos; sucessores ou parceiros de negócios da <strong>AstraZeneca</strong>, no caso de venda, alienação ou
          colaboração/um consórcio de seus negócios. Nos casos de transferência a terceiros, no Brasil ou no exterior,
          tomaremos medidas efetivas para garantir que todos os destinatários dos dados pessoais tenham um nível
          adequado de proteção de dados, nos termos exigidos pela legislação de proteção de dados aplicável
        </p>
        <p>• A <strong>AstraZeneca </strong> utilizará medidas técnicas e administrativas aptas a proteger os dados e informações
          pessoais de acessos não autorizados e de situações acidentais ou ilícitas de destruição, perda, alteração,
          comunicação ou difusão e exigirá que seus parceiros, fornecedores e prestadores de serviço também o façam.
          Maiores informações sobre tratamento de dados pessoais pela <strong>AstraZeneca </strong> e medidas de segurança que serão
          conferidas aos dados pessoais dos pacientes estão disponíveis em nosso Aviso de Privacidade em
          <a href="https://www.azprivacy.astrazeneca.com/americas/brazil/br/privacy-notices.html" target="_blank" rel="noopener noreferrer" className="underline">
            https://www.azprivacy.astrazeneca.com/americas/brazil/br/privacy-notices.html
          </a>
        </p>
        <p>• A <strong>AstraZeneca </strong> armazenará os dados pessoais dos participantes até que eles não sejam mais necessários
          no âmbito do Programa, salvo se a <strong>AstraZeneca </strong> precisar mantê-los para alguma outra finalidade, como o cumprimento de obrigação legal ou para a proteção dos direitos da AstraZeneca e de terceiros, nos termos da
          legislação aplicável. Caso o titular não interaja com o Programa por um período de três anos, seus dados serão
          excluídos.

        </p>
        <p>• Em caso de relato de um evento adverso relacionado a qualquer medicamento da <strong> AstraZeneca </strong>,
          profissionais de farmacovigilância da empresa poderão entrar em contato com o paciente participante ou com o
          médico prescritor para obter informações complementares.
        </p>
        <p>• Informações geradas pelo relato de um evento adverso de qualquer medicamento da
          <strong> AstraZeneca </strong> serão, nos termos da lei, coletadas, armazenadas e processadas pela <strong>AstraZeneca </strong> para
          monitoramento da segurança dos seus medicamentos e, quando for preciso, essas informações serão
          enviadas à Autoridade Sanitária local ou global.
        </p>
        <p>• Para melhor adequação dos benefícios e execução do Programa, a <strong>AstraZeneca </strong> se reserva o direito de,
          mediante uso de informações coletadas no ato do cadastro, realizar consultas à terceiros autorizados para
          validação dos dados cadastrais.
        </p>
        <p>• Nos termos da Lei Geral de Proteção de Dados (LGPD), os participantes podem participantes solicitar
          a atualização/alteração de seus dados cadastrais e/ou a exclusão/cancelamento de seu cadastro, a qualquer tempo
          e sem necessidade de apresentar qualquer justificativa para tal, por meio do e-mail:
          <a
            href="mailto:complementare@programacomplementare.com.br"
            className="underline"
          >
            complementare@programacomplementare.com.br
          </a>. No entanto, no caso de ser solicitada a exclusão de
          informações do cadastro, os participantes estão cientes que poderão não mais estar aptos a participar do Programa
          e serão excluídos dos serviços do Programa. Para maiores detalhes dos direitos dos participantes, acesse o Aviso
          de Privacidade da <strong>AstraZeneca</strong>, informado no item 7.4.
        </p>
        <p>• Ao se cadastrar no Programa, os participantes, médico e paciente, concordam que as informações que
          fornecerem no ato do cadastro sejam administradas pela <strong>AstraZeneca </strong> e/ou por uma empresa que possua parceria
          firmada com a AstraZeneca na gestão dos serviços do Programa e mantidas em sigilo.
        </p>
        <p>• A <strong>AstraZeneca </strong> não fornece, cede ou compartilha, sem a expressa autorização dos participantes, as
          informações do Programa a terceiros para qualquer fim que não seja o mínimo necessário para o correto
          funcionamento do Programa.
        </p>
        <p>• A <strong>AstraZeneca </strong> não envia mensagens por correio eletrônico aos participantes do Programa solicitando o
          fornecimento dos Dados Pessoais ou de qualquer outro dado ou informação sigilosa. Caso o participante tenha
          qualquer tipo de dúvida sobre a autenticidade das mensagens recebidas em seu correio eletrônico deverá entrar
          em contato imediato com a <strong>AstraZeneca</strong>
        </p>
        <div className="text-start text-xl md:text-2xl font-bold text-blue mt-2 mb-4">
          7. Disposições Gerais
        </div>
        <p>• O Programa é integralmente pautado na autonomia, independência e liberdade do médico.
        </p>
        <p>• A <strong>AstraZeneca </strong> não autoriza a realização de exames pelo Programa com fins de pesquisa clínica e/ou
          de publicações científicas.

        </p>
        <p>• Em caso de dúvidas sobre o Programa, os participantes poderão contatar o serviço através do telefone 0800 779 1234 ou pelo WhatsApp (11) 95469-0536 de segunda à sexta-feira das 8h às 20h (exceto feriados).

        </p>
        <p>• Este Regulamento será disponibilizado aos médicos via plataforma do Programa.
        </p>
        <p>• Fica eleito o foro central da cidade de São Paulo, Estado de São Paulo, como competente para dirimir
          eventuais disputas oriundas deste Regulamento.
        </p>
      </div>
      <div className="flex flex-col md:flex-row gap-3 mt-8">
        <Button
          onClick={handleAccept}
          label="ACEITAR"
          isLoading={isLoading}
          disabled={
            !isScrolled ||
            isSubmitted ||
            missingInfo ||
            !consentLgpd ||
            !confirmPersonalInformation ||
            !consentProgramParticipation ||
            !consentToReceivePhonecalls ||
            !consentToReceiveSms ||
            !confirmEmail
          }
          customClass="w-full bg-[#004aad] text-white"
        />


        <Button
          onClick={handleRefuse}
          label="RECUSAR"
          isLoading={isLoading}
          disabled={!isScrolled || isSubmitted || consentLgpd || confirmPersonalInformation || consentProgramParticipation || consentToReceivePhonecalls || consentToReceiveSms || confirmEmail}
          customClass="w-full bg-main-black text-black"
        />
      </div>
    </div>
  );
};

const Terms = () => {
  return (
    <Suspense fallback={<Loading />}>
      <TermsContent />
    </Suspense>
  );
};

export default Terms;
