"use client";

import React, { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { examRequestSchema, examRequestValidationProps } from "@/lib/utils";
import DoctorFields from '@/components/examRequest/DoctorFields';
import ProfessionalFields from '@/components/examRequest/ProfessionalFields';
import AddressFields from '@/components/examRequest/AddressFields';
import PatientInfo from '@/components/examRequest/PatientInfo';
import ConsentCheckbox from '@/components/examRequest/ConsentCheckbox';
import useSession from '@/hooks/useSession';
import { UFlist } from '@/helpers/select-filters';
import { Separator } from '@/components/ui/separator';
import { CustomSelect } from '@/components/custom/CustomSelect';
import { Input } from '@/components/ui/input';
import { getListOptions } from '@/services/exams';
import { Button } from '@/components/ui/button';
import { ConfirmationDialog } from '@/components/examRequest/ConfirmationDeliveryEmail';
import DiagnosticFields from '@/components/examRequest/DiagnosticFields';
import { LoadingOverlay } from '@/components/custom/LoadingOverlay';

const RequestExamPage: React.FC = () => {
  const session = useSession();
  const isDoctor = session?.role === 'doctor';
  const [selectedDoctor, setSelectedDoctor] = useState<any>(null);
  const [deliveryOption, setDeliveryOption] = useState<[]>([]);
  const [laboratories, setLaboratories] = useState<[]>([]);
  const [diagnosticDiseases, setDiagnosticDiseases] = useState<[]>([]);
  const [diagnosticExamDefinitions, setDiagnosticExamDefinitions] = useState<[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [defaultValues, setDefaultValues] = useState<examRequestValidationProps>({
    crm: '',
    uf: '',
    email: session.email || '',
    patientName: '',
    patientCpf: '',
    birthDate: '',
    emailSendVoucher: '',
    deliveryType: '',
    userName: session.name,
    address: {},
    consent: false,
    cityExam: '',
    diseases: '',
    laboratoryExam: '',
    typeRequest: '',
    ufExam: ''
  });

  const {
    control,
    handleSubmit,
    setValue,
    watch,
    getValues,
    formState: { errors }
  } = useForm<examRequestValidationProps>({
    resolver: zodResolver(examRequestSchema),
    defaultValues
  });

  let deliveryType = watch('deliveryType');

  const handleUfChange = async () => {

  };

  const onSubmit = () => {
  };

  function getDoctorsForProfessional(): any {
    //function para finalizar depois
  }

  const onConfirm = () => {
    setValue('emailSendVoucher', session.email);
    setIsDialogOpen(false);
  }

  const onClose = () => {
    setValue('emailSendVoucher', '');
    setIsDialogOpen(false);
  }

  function handleDeliveryType(value: any) {
    const selectedOption: any = deliveryOption.find((option: any) => option.id === value);
    setValue('deliveryType', selectedOption.value);

    if (selectedOption.value === 'E-mail')
      setIsDialogOpen(true);
  }

  useEffect(() => {
    const optionsList = async () => {
      setIsLoading(true);
      await getListOptions()
        .then((res) => {
          debugger
          if (res.isValidData) {
            if (isDoctor) {
              let doctor = res.value.doctors[0]
              let voucherReceiptTypes = res.value.voucherReceiptTypes;
              let laboratories = res.value.accounts;
              let diseases = res.value.diseases;
              let examDefinitions = res.value.examDefinitions;

              setLaboratories(laboratories);
              setDiagnosticDiseases(diseases);
              setDiagnosticExamDefinitions(examDefinitions);

              const deliveryOptions = (voucherReceiptTypes || []).map((option: any) => ({
                id: option.id,
                value: option.optionName
              }));

              setDefaultValues(prevValues => ({
                ...prevValues,
                crm: doctor.licenseNumber,
                uf: doctor.licenseState,
              }))

              setDeliveryOption(deliveryOptions);
            }
          }

        })
        .catch((err) => {
          console.log(err);
        })
        .finally(() => {
          setIsLoading(false);
        })
    }

    optionsList();
  }, [])

  return (
    <div className="h-full w-full">
      <LoadingOverlay isVisible={isLoading} />
      <form className="flex flex-col gap-4 h-full" onSubmit={handleSubmit(onSubmit)}>
        <DoctorFields
          control={control}
          setValue={setValue}
          crmDoctor={defaultValues.crm}
          ufDoctor={defaultValues.uf}
          email={session?.email || ''}
          userName={session.name}
          isDoctor={isDoctor}
          role={session?.role || ''}
          doctors={getDoctorsForProfessional()}
          selectedDoctor={selectedDoctor}
          setSelectedDoctor={setSelectedDoctor}
          handleUfChange={handleUfChange}
        />

        <Separator className="bg-red-400/80" />

        {!isDoctor && (
          <>
            <ProfessionalFields
              control={control}
              doctors={getDoctorsForProfessional()}
              setSelectedDoctor={setSelectedDoctor}
              setValue={setValue}
              handleUfChange={handleUfChange}
            />

            <Separator className="bg-red-400/80" />
          </>
        )}

        <PatientInfo
          control={control}
          email={session.email || ''}
        />

        <Separator className="bg-red-400/80" />

        <DiagnosticFields
          control={control}
          setValue={setValue}
          laboratories={laboratories}
          diseases={diagnosticDiseases}
          examDefinitions={diagnosticExamDefinitions}
        />

        <Separator className="bg-red-400/80" />

        <div className='flex flex-col md:flex-row gap-4'>
          <div className='flex-1'>
            <CustomSelect
              name="deliveryType"
              label="Tipo de Recebimento"
              options={deliveryOption}
              onChange={handleDeliveryType}
            />
          </div>
          <div className='flex-1'>
            <Controller
              name="voucherData"
              control={control}
              render={({ field }) => (
                <Input type="text" placeholder="Dados para envio do(s) voucher(s)" {...field} />
              )}
            />
          </div>
        </div>

        <Separator className="bg-red-400/80" />

        {deliveryType === 'Correios' && (
          <AddressFields
            control={control}
            setValue={setValue}
            address={watch('address')}
            ufList={UFlist}
          />
        )}

        {deliveryType === 'E-mail' && (
          <div className='flex flex-col md:flex-row '>
            <div className="flex-1">
              <Controller
                name="emailSendVoucher"
                control={control}
                render={({ field }) => (
                  <Input
                    type="email"
                    placeholder="E-mail do responsável"
                    {...field}
                  />
                )}
              />
            </div>
          </div>
        )}

        <ConfirmationDialog
          open={isDialogOpen}
          onClose={onClose}
          onConfirm={onConfirm}
        />

        <ConsentCheckbox
          control={control}
          errors={errors}
        />

        <div className="flex justify mt-4">
          <Button type="submit" size={`lg`} className={`mt-4 md:mt-3 bg-red-400`}>
            Salvar alterações
          </Button>
        </div>
      </form>
    </div>
  );
};

export default RequestExamPage;
