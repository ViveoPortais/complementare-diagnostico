"use client";

import { CustomSelect } from "@/components/custom/CustomSelect";
import { Button } from "@/components/ui/button";
import { useModalInativePartial, useModalTotalPartial } from "@/hooks/useModal";
import useSession from "@/hooks/useSession";
import { inactiveDoctor } from "@/services/doctor";
import { ColumnDef } from "@tanstack/react-table";

export type Report2 = {
  doctorId: any;
  doctorName: string;
  doctorCRMUF: string;
  inactivationType: string;
  motivo: string;
};

export const columns: ColumnDef<Report2>[] = [
  {
    accessorKey: "doctorName",
    header: "Nome do Médico",
  },
  {
    accessorKey: "doctorCRMUF",
    header: "CRM do Médico",
  },
  {
    accessorKey: "inactivationType",
    header: "Status",
    cell: ({ row }) => {
      const params = row.original;
      return (
        <div>
          {params.inactivationType === "#TOTAL_INACTIVATION" && (
            <span>Inativação Total </span>
          )}
          {params.inactivationType === "#PARTIAL_INACTIVATION" && (
            <span>Inativação Parcial </span>
          )}
          {params.inactivationType === null && <span>Ativo </span>}
        </div>
      );
    },
  },
  {
    accessorKey: "Inativação",
    header: "Tipo de Inativação",

    cell: ({ row }) => {
      const params = row.original;
      const dataStorage = useSession();

      const handleChange = (value: string) => {
        dataStorage.setInactiveType(value);
        dataStorage.setNameInactive(params.doctorName);
        dataStorage.setCrmInactive(params.doctorCRMUF);
      };

      return (
        <div>
          <CustomSelect
            onChange={handleChange}
            customClass="w-52"
            params={params}
            name="teste"
            options={[
              { id: "#TOTAL_INACTIVATION", value: "Inativação Total" },
              { id: "#PARTIAL_INACTIVATION", value: "Inativação Parcial" },
            ]}
          />
        </div>
      );
    },
  },
  {
    accessorKey: "motivo",
    header: "Motivo da Inativação Total",

    cell: ({ row }) => {
      const params = row.original;
      const dataStorage = useSession();

      const handleChange = (value: string) => {
        dataStorage.setMotivo(value);
      };

      return (
        <div>
          <CustomSelect
            customClass="w-52"
            params={params}
            name="motivo"
            onChange={handleChange}
            options={[
              { id: "Óbito", value: "Óbito" },
              { id: "Solicitação Paciente", value: "Solicitação Paciente" },
              { id: "DSBR", value: "DSBR" },
              {
                id: "Enceramento do Programa",
                value: "Enceramento do Programa",
              },
              { id: "Pedido do Médico", value: "Pedido do Médico" },
            ]}
          />
        </div>
      );
    },
  },
  {
    accessorKey: "Ações",
    header: "Ações",

    cell: ({ row }) => {
      const report = row.original;
      const dataStorage = useSession();
      const partialModal = useModalInativePartial();
      const totalPartial = useModalTotalPartial();

      const inative = () => {
        const data = {
          ProgramCode: "150",
          DoctorByProgramId: report.doctorId,
          InactiveType: dataStorage.inactiveType,
        };
        inactiveDoctor(data as any)
          .then(() => {
            if (dataStorage.inactiveType === "#PARTIAL_INACTIVATION") {
              refresh();
              partialModal.openModal(true);
            }
            if (dataStorage.inactiveType === "#TOTAL_INACTIVATION") {
              refresh();
              totalPartial.openModal(true);
            }
            dataStorage.setInactiveType("");
            dataStorage.setMotivo("");
          })
          .catch(() => {
            console.log("Erro ao inativar");
          });
      };

      const refresh = () => {
        dataStorage.setRefresh(true);
      };

      return (
        <div>
          <Button variant="secondary" size="lg" onClick={inative}>
            Inativar
          </Button>
        </div>
      );
    },
  },
];
