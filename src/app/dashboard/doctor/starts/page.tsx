"use client";

import ContentCard from "@/components/ContentCard";
import { useRouter } from "next/navigation";
import React from "react";

const Page = () => {
  const router = useRouter();

  return (
    <div>
      <ContentCard
        title="Bem Vindo ao Painel do Médico"
        bgColor="bg-red-400"
        hideButton
        isHeight={true}
      />
      <div className="grid grid-cols-1 md:grid md:grid-cols-2 gap-5 my-5">
        <ContentCard
          title="Regulamento"
          bgColor="bg-red-400"
          buttonText="Ver Mais"
          onButtonClick={() => alert('Selecionar a rota a ser enviada')}
        />
        <ContentCard
          title="Conteudos"
          bgColor="bg-red-400"
          buttonText="Ver Mais"
          onButtonClick={() => alert('Selecionar a rota a ser enviada')}
        />
      </div>
    </div>
  );
};

export default Page;
