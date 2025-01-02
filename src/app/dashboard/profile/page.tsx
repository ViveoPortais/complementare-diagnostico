"use client";

import { LoadingOverlay } from "@/components/custom/LoadingOverlay";
import { AdressSection } from "@/components/profile/AddressSection";
import { ConfirmationDialog } from "@/components/profile/ConfirmationDialog";
import { PersonalDataSection } from "@/components/profile/PersonalDataSection";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { passwordCorrect, passwordErr } from "@/hooks/useModal";
import useSession from "@/hooks/useSession";
import { doctorProfileSchema, professionalProfileSchema } from "@/lib/utils";
import { getListSpecialties } from "@/services/doctor";
import { getUserInfo, updateDoctorInfo, updateRepresentativeInfo } from "@/services/user";
import { IMedicalSpecialty, IStringMap, IUpdateDoctorData } from "@/types";
import { IUpdateRepresentativeInfo } from "@/types/professions";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { toast } from "react-toastify";

export default function Profile() {
  const auth = useSession();
  const router = useRouter();
  const accept = passwordCorrect();
  const err = passwordErr();
  const [optionsMedicalSpecialty, setMedicalSpecialtyOptions] = useState<IStringMap[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const schema = auth.role === 'doctor' ? doctorProfileSchema : professionalProfileSchema;

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
  });

  const programCode = process.env.PROGRAM_CODE;

  const [userProfile, setUserProfile] = useState<any>({
    healthProgramCode: programCode,
    name: "",
    emailAddress: "",
    licenseNumber: "",
    licenseState: "",
    mobilephone: "",
    medicalSpecialty: "",
    cpf: "",
    birthdate: "",
    addressPostalCode: "",
    addressName: "",
    addressNumber: "",
    addressComplement: "",
    addressDistrict: "",
    addressCity: "",
    addressState: "",
    addressCountry: "",
    professionalTypeStringMapId: "",
    doctorId: "",
    representativeId: "",
  });

  const fetchUserInfo = async () => {
    try {
      const res = await getUserInfo();
      if (res.isValidData) {
        setUserProfile(res.value);
      }
    } catch (err) {
      toast.error('Erro ao obter informações do usuário');
    }
  };

  const fetchSpecialties = async () => {
    try {
      const response = await getListSpecialties();
      const specialties = response.map((item: IMedicalSpecialty) => ({
        stringMapId: item.name,
        optionName: item.name
      }));
      setMedicalSpecialtyOptions(specialties);
    } catch (error) {
      console.error("Erro ao obter lista de especialidades", error);
    }
  };

  useEffect(() => {
    fetchUserInfo();
    fetchSpecialties();
  }, []);

  const updateDoctorProfile = async (data: any) => {
    try {
      const doctorData: IUpdateDoctorData = {
        doctorId: userProfile.doctorId,
        emailAddress: data.email,
        mobileNumber: data.telephoneNumber,
        medicalSpecialty: data.specialtyDoctor,
        cpf: data.cpf,
        birthDate: data.birthDate,
        AddressPostalCode: data.cep,
        AddressName: data.street,
        AddressNumber: data.number,
        AddressComplement: data.complement,
        AddressDistrict: data.neighborhood,
        AddressCity: data.city,
        AddressState: data.state,
        healthProgramCode: programCode,
      };

      setIsLoading(true);
      const res = await updateDoctorInfo(doctorData);
      if (res.isValidData) {
        toast.success(res.additionalMessage);
        router.push('/');
      } else {
        toast.error(res.additionalMessage);
      }
    } catch (err) {
      toast.error('Falha na atualização');
    } finally {
      setIsLoading(false);
    }
  };

  const updateRepresentativeProfile = async (data: any) => {
    try {
      const representativeData: IUpdateRepresentativeInfo = {
        nurseId: userProfile.representativeId,
        cpf: data.cpf,
        emailAddress: data.email,
        mobilePhone: data.telephoneNumber,
        programCode: programCode
      };

      setIsLoading(true);
      const res = await updateRepresentativeInfo(representativeData);
      if (res.isValidData) {
        toast.success(res.additionalMessage);
        router.push('/');
      } else {
        toast.error(res.additionalMessage);
      }
    } catch (err) {
      toast.error('Falha na atualização');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveChangesProfile = (data: any) => {
    if (auth.role === 'doctor') {
      updateDoctorProfile(data);
    } else if (auth.role === 'professional') {
      updateRepresentativeProfile(data);
    }
  };

  const onConfirm = (data: any) => {
    handleSaveChangesProfile(data);
    setIsDialogOpen(false);
  };

  const handleFormSubmit: SubmitHandler<any> = (data) => {
    setIsDialogOpen(true);
  };

  return (
    <div className="h-full w-full">
      <LoadingOverlay isVisible={isLoading} />

      <h1 className="bg-red-400 p-4 rounded-xl w-full text-start text-white font-semibold text-lg md:text-2xl mb-8">
        Meus dados
      </h1>

      <form
        className="flex flex-col gap-4 h-full"
        onSubmit={handleSubmit(handleFormSubmit)}
      >

        <PersonalDataSection
          control={control}
          email={userProfile.emailAddress}
          errors={errors}
          licenseNumber={userProfile.licenseNumber}
          licenseState={userProfile.licenseState}
          name={userProfile.name}
          options={optionsMedicalSpecialty}
          profileType={auth.role}
          specialty={userProfile.medicalSpecialty}
          telephoneNumber={userProfile.mobilephone}
          cpf={userProfile.cpf}
          setValue={setValue}
        />

        {auth.role === 'doctor' && (
          <>
            <Separator className="bg-red-400/80" />

            <AdressSection
              control={control}
              errors={errors}
              birthDate={userProfile.birthdate}
              cep={userProfile.addressPostalCode}
              city={userProfile.addressCity}
              complement={userProfile.addressComplement}
              neighborhood={userProfile.addressDistrict}
              number={userProfile.addressNumber}
              state={userProfile.addressState}
              street={userProfile.addressName}
              setValue={setValue}
            />
          </>
        )}

        <ConfirmationDialog
          open={isDialogOpen}
          onClose={() => setIsDialogOpen(false)}
          onConfirm={handleSubmit(onConfirm)}
          userName={auth.name}
        />

        <div className="flex justify mt-4">
          <Button type="submit" size="lg" className="mt-4 md:mt-3 bg-red-400">
            Salvar alterações
          </Button>
        </div>
      </form>
    </div>
  );
}
