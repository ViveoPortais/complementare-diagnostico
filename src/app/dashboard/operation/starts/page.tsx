"use client";

import ContentCard from "@/components/ContentCard";
import { useRouter } from "next/navigation";
import React from "react";

const Page = () => {
  const router = useRouter();

  return (
    <div>
      <ContentCard
        title="Bem Vindo ao Painel de Operações"
        subtitle="Aqui você pode inativar os médicos"
        subtitleTwo="Escolha uma das opções abaixo para começar."
        bgColor="bg-main-purple"
        hideButton
      />
      <div className="grid grid-cols-1 md:grid md:grid-cols-2 gap-5 my-5">
        <ContentCard
          title="Inativação de Médicos"
          subtitle="Aqui você pode inativar os médicos"
          subtitleTwo="Clique no botão abaixo para inativar um médico."
          bgColor="bg-main-purple"
          buttonText="Ver Mais"
          onButtonClick={() => router.push("/dashboard/operation/inativation")}
        />
      </div>
    </div>
  );
};

export default Page;
