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

  const [consentToReceivePhonecalls, setConsentToReceivePhonecalls] =
    useState(false);
  const [consentToReceiveSms, setConsentToReceiveSms] = useState(false);
  const [confirmPersonalInformation, setConfirmPersonalInformation] =
    useState(false);
  const [confirmEmail, setConfirmEmail] = useState(false);
  const [consentLgpd, setConsentLgpd] = useState(false);

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
        consentToReceivePhonecalls: consentToReceivePhonecalls,
        consentToReceiveSms: consentToReceiveSms,
        consentLgpd: consentLgpd,
        consentToReceiveEmail: confirmEmail,
        patientInactive: false,
        programCode: "1100",
      });
    }
  }, [
    doctorData,
    id,
    consentToReceivePhonecalls,
    consentToReceiveSms,
    consentLgpd,
    confirmEmail,
  ]);

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
      setConsentToReceivePhonecalls(
        response.consentToReceivePhonecalls || false
      );
      setConsentToReceiveSms(response.consentToReceiveSms || false);
      setConfirmPersonalInformation(response.consentTerms || false);
      setConsentLgpd(response.consentLgpd || false);

      setConfirmEmail(response.consentToReceiveEmail || false);

      if (response.consentTerms && response.consentLgpd) {
        toast.info("Termo já foi aceito anteriormente.");
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
      consentLgpd: consentLgpd,
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
    termDoctor({
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
    if (
      scrollHeight <= clientHeight ||
      scrollTop + clientHeight >= scrollHeight
    ) {
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
            checked={consentToReceivePhonecalls}
            onChange={(e) => setConsentToReceivePhonecalls(e.target.checked)}
            disabled={isSubmitted}
          />
          <label htmlFor="chk-receive-calls">Aceito receber ligações</label>
        </div>
        <div className="flex items-center gap-2 mb-4">
          <input
            id="chk-receive-sms"
            type="checkbox"
            className="h-5 w-5"
            checked={consentToReceiveSms}
            onChange={(e) => setConsentToReceiveSms(e.target.checked)}
            disabled={isSubmitted}
          />
          <label htmlFor="chk-receive-sms">Aceito receber SMS</label>
        </div>
        <div className="flex items-center gap-2 mb-4">
          <input
            id="chk-confirm-email"
            type="checkbox"
            className="h-5 w-5"
            checked={confirmEmail}
            onChange={(e) => setConfirmEmail(e.target.checked)}
            disabled={isSubmitted}
          />
          <label htmlFor="chk-confirm-email">Aceito receber E-mails</label>
        </div>
        <div className="flex items-center gap-2 mb-4">
          <input
            id="chk-confirm-personal"
            type="checkbox"
            className="h-5 w-5"
            checked={confirmPersonalInformation}
            onChange={(e) => setConfirmPersonalInformation(e.target.checked)}
            disabled={isSubmitted}
          />
          <label htmlFor="chk-confirm-personal">
            Confirmo meus dados pessoais
          </label>
        </div>
        <div className="flex items-center gap-2 mb-4">
          <input
            id="chk-lgpd"
            type="checkbox"
            className="h-5 w-5"
            checked={consentLgpd}
            onChange={(e) => setConsentLgpd(e.target.checked)}
            disabled={isSubmitted}
          />
          <label htmlFor="chk-lgpd">Aceito LGPD/privacidade de dados</label>
        </div>
      </div>

      <div
        ref={termRef}
        onScroll={handleScroll}
        className="mt-5 border border-gray-200 rounded-lg p-5 h-[50vh] overflow-y-auto text-lg leading-relaxed"
      >
        <div className="text-center text-xl md:text-2xl font-bold text-blue mt-2 mb-4">
          AVISO DE PRIVACIDADE E CONSENTIMENTO
        </div>
        <div className="text-justify text-xl md:text-2x1 leading-relaxed">
          <p>
            Lorem ipsum dolor sit amet. Est nisi rerum eos placeat natus aut
            quia quas hic nemo quam est iure dolore sit culpa aliquam. Ea harum
            quibusdam et officia voluptates ut alias ullam est asperiores ipsam
            id dolorem asperiores. Sed ipsam quam et harum veritatis est sunt
            cumque non saepe distinctio. A maxime ducimus sed incidunt velit id
            tempora quidem rem nihil totam. Eum dolorum officia ut voluptate
            earum ut ipsam quisquam qui deserunt natus ut dignissimos vero in
            deleniti quasi. Eum sint quisquam hic galisum eveniet rem incidunt
            dolorum ea soluta error. Et expedita repellat sed odio voluptas ut
            inventore possimus. Non consequuntur quidem qui laudantium officiis
            sit internos necessitatibus At libero veniam et natus delectus non
            beatae cumque sit labore fugit. Id animi galisum vel veniam velit
            sed esse doloribus.
          </p>

          <p>
            Sed nobis delectus ex voluptatum rerum ut vitae Quis ea odio
            eligendi qui unde quod est cumque nulla hic blanditiis nostrum. Nam
            fugit porro cum vitae consequatur eum quibusdam eligendi et dolorem
            tempora. Vel quasi provident sed laborum placeat qui obcaecati nemo
            et dignissimos tempora quo velit officia. Et nemo voluptatem sit
            rerum aspernatur qui ipsam omnis et illum dolorem non ducimus nobis
            eum illo voluptatem. Ex maiores aliquid ut neque quia non provident
            labore sed eveniet fugiat ea ipsum tempora a nihil exercitationem.
          </p>
          <p>
            Ut architecto voluptate sed perferendis labore sed repellat quos qui
            alias modi et exercitationem molestiae At eveniet assumenda. Ut
            veritatis nesciunt At libero laboriosam eum facilis placeat est
            rerum eligendi. Ut ipsam atque qui pariatur ipsa ut cupiditate quia
            et architecto neque qui galisum impedit et officia libero non
            similique consequatur. A dolor debitis in enim odio a nihil sunt.
            Vel asperiores consequatur qui quod rerum id minima accusantium? A
            libero vero qui omnis amet nam nisi veniam ut repellendus galisum
            eum facilis quod. Qui quaerat alias eum obcaecati quos id sapiente
            fuga.
          </p>
          <p>
            Et quia maiores vel consequatur similique ea velit excepturi vel
            quia animi ea enim voluptatem est vero illo id voluptatem sunt. Non
            provident inventore sit mollitia repellat ea dolorem accusamus aut
            dolorem tempore ad quis repellat qui maxime nisi. Eum ipsa voluptate
            in quam quidem et dolorem adipisci eum laboriosam tempora ut
            consequatur numquam! Non incidunt enim qui maxime suscipit sit fuga
            dolores ea labore quam! Sit laudantium quas in deleniti distinctio
            ut deleniti incidunt qui magnam iste aut aliquid culpa. Et nihil
            fuga est nihil dolor rem ipsum architecto et quas distinctio qui
            dolorem doloremque et rerum consequatur. Est similique facilis sit
            assumenda ipsam nam excepturi ipsum a sunt cupiditate aut velit
            dolor.
          </p>
          <p>
            Ad voluptatibus tempore qui commodi illum sed perferendis porro aut
            deserunt nulla ab dicta rerum. In nihil saepe eos dolores fugiat qui
            tenetur dolore nam suscipit recusandae. Ut repudiandae praesentium
            eum enim quis id iusto quis nam iusto cumque qui molestiae omnis et
            voluptas doloribus aut voluptas consectetur. Et quam voluptate et
            voluptatem rerum id soluta dolorem. Et vero officia eos quia
            inventore eos doloribus laudantium sit voluptatibus laboriosam qui
            labore voluptas.
          </p>
          <p>
            {" "}
            Aut itaque eveniet ab nobis necessitatibus non quas galisum et
            dolorem voluptatem et autem dolorum. Eos dolores quia ut repellendus
            provident id consequatur dolores. Est ducimus autem vel minus minima
            quo similique inventore qui deleniti accusamus sed nobis modi At
            minima maxime nam voluptatum eaque. Quo earum galisum hic mollitia
            obcaecati et aperiam debitis cum nihil modi et impedit voluptate et
            doloremque officia. Quo galisum omnis sed quia atque est dolorem
            facilis. Hic corrupti error quo sint repellat et odio natus qui
            dolorem ipsum non illum recusandae ut nostrum consequatur quo
            reprehenderit autem? Est excepturi quia aut nulla saepe qui nisi
            dolore et rerum mollitia aut quam autem hic corporis dolores. Eos
            corrupti nesciunt eos itaque voluptas et quae doloribus et vero odit
            non dolore vitae. Aut voluptate natus qui deserunt asperiores sit
            corporis voluptas ut sunt perferendis non ullam veritatis id
            eligendi repellat et quia similique?
          </p>
          <p>
            Id earum voluptatem et enim illo ut alias inventore. Ut nulla
            distinctio qui sunt quam ab odit fugit sit adipisci rerum nam
            sapiente Quis in ipsa nesciunt et voluptatum eligendi! Sed nisi
            vitae est earum facilis et consequuntur cupiditate qui porro
            molestiae. Id velit unde ut alias quia ab deserunt quis. Ut sunt
            quia aut minima dolorum ea blanditiis porro hic assumenda omnis.
          </p>
          <p>
            Eos doloribus voluptatem ad quos amet aut dolores sint a expedita
            consequatur et nemo repellendus. Qui asperiores voluptatibus eos
            aspernatur suscipit quo voluptatem ratione. Non odit consectetur sit
            ratione velit qui recusandae eligendi ut obcaecati voluptatem est
            ipsam perspiciatis quo ratione iure et beatae tempora. Est iure
            quibusdam est asperiores nulla qui suscipit suscipit. Est dolor
            facilis ut nihil soluta ea consequatur sequi quo placeat quam ea
            labore quae et exercitationem officiis ut consequatur iusto.{" "}
          </p>
          <p>
            Hic repellat autem et nostrum autem eos earum commodi qui saepe
            porro est tempore quia quo maxime quia et repudiandae quia. Et
            voluptatem sunt qui dolore iure rem rerum galisum. Aut quos atque
            quo earum voluptatem eum esse veritatis sed modi laborum. Quo
            commodi doloribus qui dolores quaerat aut quasi corporis ut
            consequatur reprehenderit. Non quibusdam ipsum cum saepe quaerat ad
            perferendis quidem. Eos natus odit qui laudantium minus est incidunt
            recusandae. Vel minima dolor sed optio consequatur et veritatis quia
            ut saepe inventore aut odit cumque id corrupti blanditiis.{" "}
          </p>
          <p>
            Aut facilis ipsam nam consequatur officia aut consequuntur tempora
            aut consequatur quod et architecto accusantium! Et nesciunt quam eos
            ipsa quos qui consectetur laudantium ea deserunt necessitatibus in
            saepe magni. 33 aliquam illo ex harum accusantium ut architecto
            tempora ab autem veritatis 33 nesciunt excepturi et tenetur minus?
            Vel eaque veniam et iusto officia et quia voluptatem. In nulla
            accusantium eum consectetur iure et galisum fuga quo esse quia aut
            veritatis maiores ut atque nihil? Sit adipisci aliquam est eligendi
            doloribus eum enim dolorum nam repudiandae culpa rem voluptatem
            suscipit. Id labore maiores in voluptas internos sed adipisci quia
            in voluptates deleniti sit consequatur deleniti sed molestias eaque
            eum Quis internos.{" "}
          </p>
          <p>
            Qui doloribus praesentium vel sint explicabo aut dolor expedita. Ea
            pariatur sunt et quos consequuntur in temporibus voluptas. Rem
            dolores officiis At exercitationem sunt sit dignissimos voluptatem
            id eligendi velit rem eligendi repellendus et quam beatae. Quo
            possimus veritatis sed nostrum culpa aut doloribus quisquam quo
            voluptatem praesentium. Sit doloribus veritatis et voluptate itaque
            ut quia reprehenderit non cupiditate voluptatum qui rerum enim. At
            odit totam hic quos voluptate ea fuga consequuntur vel quae
            consequatur aut quisquam corporis ab suscipit minus. Eos soluta
            expedita non voluptates sequi 33 odio commodi ut voluptatem quia ut
            nesciunt doloribus. Qui aspernatur tenetur est quae sunt quo porro
            inventore rem animi tempora qui consequatur debitis et vitae
            aperiam. Non harum molestiae aut minima perspiciatis sit magnam
            voluptas ab iusto eligendi et voluptas voluptatibus et temporibus
            exercitationem in praesentium magnam?{" "}
          </p>
          <p>
            Qui illo voluptatem eum velit fuga qui obcaecati possimus eos
            voluptas ipsum eum exercitationem odit hic dolore unde. Sed sint
            reiciendis et voluptate accusamus in laborum error et dolor ipsam
            sed iste reprehenderit! Ut cumque rerum eos veritatis accusantium
            eos impedit accusamus in numquam ducimus. Aut harum esse ut
            voluptatum voluptas ut eius galisum vel delectus perspiciatis ut
            autem quisquam. Ut magnam sapiente ab molestiae dolore et dolores
            impedit 33 velit sunt 33 corporis molestias! Et eveniet odit ab
            veniam optio id odio expedita? Et eius vitae ab placeat rerum non
            magni illo quo assumenda similique.{" "}
          </p>
          <p>
            Aut cumque rerum aut corrupti consequatur id soluta repellendus non
            pariatur dolore? Ut voluptas quia qui repellat Quis quo porro
            mollitia est possimus odio ad illo quos. Et ipsum consequuntur sit
            sapiente earum ut dolore consectetur eos ullam ipsa vel
            necessitatibus rerum in aspernatur consequuntur ut alias tempora.
            Aut corporis corrupti sed aliquid cupiditate ad voluptas
            voluptatibus ex omnis sunt est possimus maxime et consequatur
            molestias. Qui doloribus accusantium et sequi totam non enim dolor
            id galisum asperiores eum velit molestias. In molestiae molestiae id
            odio sunt est harum eveniet aut voluptatum harum est totam fuga qui
            minus rerum qui accusantium unde. Ab similique enim cum eligendi
            inventore cum minus provident.{" "}
          </p>
          <p>
            Aut quae voluptatem qui omnis veritatis qui distinctio debitis et
            quisquam dolorum eos adipisci quas. Ut placeat eius rem quia omnis
            ut fugit rerum! Est recusandae earum ex voluptatem nostrum et
            dolores adipisci qui ullam aspernatur. Eos consequatur eligendi eos
            quibusdam cupiditate et molestias totam. Qui fugiat esse eos
            laboriosam internos sit aliquam nulla et quis iusto sit quidem
            dignissimos hic quia accusantium. Aut animi cupiditate aut nemo
            consequatur aut facilis amet ut maiores exercitationem. Qui nihil
            quos et harum harum in voluptatibus eligendi est iste consectetur ut
            velit quidem. Aut ducimus voluptas vel adipisci voluptates et
            dolores amet aut laborum sunt. Sed similique esse ut ducimus
            voluptates sed voluptatum dolore sit fugiat incidunt ab fuga quia.{" "}
          </p>
          <p>
            Et obcaecati explicabo aut porro autem ut odit officiis non
            explicabo natus. Cum cumque enim id quis excepturi sed voluptate
            vero quo sint molestiae a nostrum veritatis. Qui eius deserunt aut
            exercitationem sunt aut consequatur vitae est voluptas placeat est
            quia atque ut illum totam. 33 Quis nesciunt nam veniam soluta qui
            deserunt dolore. Ut autem facilis qui voluptatem laudantium sit
            corrupti consequatur ut culpa quia. Est nobis ipsum in nostrum modi
            aut quis nesciunt. In deserunt autem et dolor corporis et reiciendis
            eveniet qui corrupti voluptas qui dolor ipsam.{" "}
          </p>
          <p>
            Aut odit minima et cupiditate quam cum ipsam beatae eum omnis
            numquam qui magnam eaque eum rerum voluptatem! Est culpa repellendus
            nam nihil optio et facilis nisi est optio iste. Est eaque molestiae
            et fugit quos ea molestiae quaerat et modi reprehenderit aut galisum
            dignissimos quo sapiente ratione! Ut explicabo vero qui sint fugiat
            in optio consequatur aut ducimus nostrum. Aut sunt provident sed
            sequi voluptatum et odit maiores non sequi eveniet et voluptatem
            magni eum molestiae molestiae.{" "}
          </p>
          <p>
            Sed consequatur iusto et veniam omnis aut odit quia At repellendus
            quasi sed voluptatibus debitis ut quos voluptatem? Est veniam
            mollitia ea quidem animi ad vero molestiae qui sequi sequi? Et
            aspernatur ipsa et Quis laboriosam vel maiores beatae qui voluptatem
            nisi et libero internos est accusamus labore eum sapiente ipsum. Sed
            quia tempore ut vero sint 33 quam eligendi ut nobis earum eos
            voluptas provident. Qui inventore harum qui veniam nihil eos
            incidunt placeat! Et quia quisquam sit incidunt illum qui nostrum
            aliquam est doloremque molestiae et labore nobis id enim
            consequuntur est ipsum aperiam. Id dicta perspiciatis quo aliquid
            asperiores et repellendus mollitia ut cumque quis et velit impedit.
            Sit rerum asperiores hic aspernatur pariatur in maxime quidem ut
            nostrum fugiat. Et quasi explicabo est nisi deleniti qui atque
            magnam ut rerum natus eum itaque omnis.{" "}
          </p>
          <p>
            Non quidem iusto et nihil facere est impedit reprehenderit et
            cupiditate inventore. Qui numquam ipsum eos adipisci sequi et
            consequatur magnam aut molestias fugiat! Et sapiente explicabo ut
            nostrum maiores non sint enim aut asperiores debitis id consectetur
            pariatur ut asperiores corporis! Et tempore vitae sed possimus velit
            sit tempora assumenda eos molestiae eaque quo quas alias ut aliquid
            praesentium. Vel sint nihil et cumque modi aut maiores amet. Et
            doloribus recusandae in aspernatur sunt qui quidem quibusdam vel
            enim ratione rem magni facere. Aut consequatur quam et dolores nobis
            ut debitis laboriosam rem labore eaque est voluptas neque ea
            consequatur quaerat sed repudiandae rerum. Quo cumque soluta ut
            impedit quos ut illo fugiat cum repellendus dolor. Aut nobis
            consequatur est autem reiciendis ut laborum cumque quo quia iure et
            impedit ratione hic nesciunt voluptas non voluptatem optio.{" "}
          </p>
          <p>
            Ea repudiandae consectetur et ipsam tenetur aut modi internos in
            sint culpa sit adipisci veniam in assumenda molestias. 33 deleniti
            illum aut incidunt molestias qui laborum optio qui optio doloribus
            et impedit voluptates? Sit Quis reprehenderit in nostrum molestiae
            ut facilis consequatur qui tempora unde. Aut dolor dicta vel saepe
            praesentium At corporis aperiam id deserunt ratione aut voluptates
            consequatur aut nisi inventore. Est dolor maxime rem recusandae
            maxime ut nihil commodi eum magni deleniti eos expedita voluptate.
            Et recusandae repellat qui omnis ullam ut inventore laboriosam ex
            facere asperiores! Est dolore ipsam sed sapiente accusantium et
            perferendis laborum ad quos voluptatem.{" "}
          </p>
          <p>
            Hic laboriosam temporibus et voluptas rerum ab deleniti corporis qui
            omnis omnis non voluptatum sint eos maiores animi ut consequatur
            enim. Non eligendi labore non modi soluta rem adipisci rerum eum
            dolores galisum ea eius omnis et inventore sequi. Aut voluptas
            voluptas aut velit voluptates qui velit tenetur nam eaque maxime. Ut
            natus asperiores sit natus facere et adipisci consequatur nam rerum
            veniam non asperiores deserunt. Et facilis sequi id iste esse et
            ratione dolorum et debitis excepturi? Qui repellat cumque 33 error
            reiciendis est possimus animi rem aperiam iure non soluta tenetur
            aut dolor autem et ducimus fuga. Qui illo enim non necessitatibus
            iusto qui iusto explicabo est esse consectetur et earum quos et quod
            commodi At aliquid sapiente. Quo modi voluptatem qui exercitationem
            consequatur eos beatae asperiores qui internos expedita et nulla
            sunt in provident consequatur id repudiandae voluptatem. Et
            voluptatem galisum non optio molestiae sit illo dolorem 33 totam
            ipsam in neque unde eum officiis veritatis!
          </p>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-3 mt-8">
        <Button
          onClick={handleAccept}
          label="ACEITAR"
          isLoading={isLoading}
          disabled={!isScrolled || isSubmitted || !consentLgpd || !consentLgpd}
          customClass="w-full bg-main-purple text-white"
        />
        <Button
          onClick={handleRefuse}
          label="RECUSAR"
          isLoading={isLoading}
          disabled={!isScrolled || isSubmitted}
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
