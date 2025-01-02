"use client";

import { use, useCallback, useEffect, useState } from "react";
import { toast } from "react-toastify";
import useSession from "@/hooks/useSession";
import { getDoctors } from "@/services/diagnostic";
import { columns } from "./columns";
import { DataTable } from "@/components/dashboard/DataTable";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useModalInativePartial, useModalTotalPartial } from "@/hooks/useModal";

export default function Diagnostic() {
  const { isLogged, refresh, nameInactive, crmInactive, setRefresh } =
    useSession();
  const partialModal = useModalInativePartial();
  const totalModal = useModalTotalPartial();

  const [isLoading, setIsLoading] = useState(false);
  const [diagnosticRows, setDiagnosticRows] = useState<any[]>([]);
  const [filter, setFilter] = useState({
    DoctorName: "",
    DoctorCRMUF: "",
    page: 1,
    pageSize: 10000,
  });

  useEffect(() => {
    if (refresh) {
      getFilteredData();
    }
  }, [refresh]);

  const handleFilterChange = (e: any) => {
    const { name, value } = e.target;
    if (name === "patientCpf") {
      setFilter({ ...filter, DoctorCRMUF: value.replace(/\D/g, "") });
    } else {
      setFilter({ ...filter, [name]: value });
    }
  };

  const clearFilter = () => {
    setFilter({
      DoctorName: "",
      DoctorCRMUF: "",
      pageSize: 1000,
      page: 1,
    });
  };

  const getFilteredData = useCallback(() => {
    setIsLoading(true);
    setRefresh(true);
    getDoctors(filter)
      .then((res) => {
        setDiagnosticRows(res);
      })
      .catch(() => {
        toast.error("Erro ao buscar diagnósticos");
      })
      .finally(() => {
        setIsLoading(false);
        setRefresh(false);
      });
  }, [filter]);

  useEffect(() => {
    if (isLogged) {
      getFilteredData();
    }
  }, [filter]);

  return (
    <div className="w-full h-full flex flex-col items-center justify-center mt-8 lg:mt-0">
      <div className="w-full px-6 lg:px-4">
        <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Input
            placeholder="Nome do médico"
            name="DoctorName"
            type="text"
            value={filter.DoctorName}
            onChange={handleFilterChange}
          />
          <Input
            placeholder="CRM do médico"
            name="DoctorCRMUF"
            type="text"
            value={filter.DoctorCRMUF}
            onChange={handleFilterChange}
          />
        </div>

        <div className="flex flex-col md:flex-row gap-8 mt-4 md:mt-8 mb-12 ">
          <Button
            className="lg:w-[200px]"
            size="lg"
            variant={`tertiary`}
            onClick={clearFilter}
          >
            Limpar filtros
          </Button>
        </div>
      </div>
      <div>
        <Dialog
          open={partialModal.isModalOpen}
          onOpenChange={partialModal.openModal}
        >
          <DialogContent className="w-[30%] rounded-lg lg:max-w-[80vw] backgroundModal border border-none">
            <div className="flex flex-col p-5">
              <span className="text-xl font-semibold text-center text-white">
                O acesso do médico {nameInactive}, CRM {crmInactive} foi
                inativado parcialmente com sucesso!
              </span>
            </div>
          </DialogContent>
        </Dialog>
      </div>
      <div>
        <Dialog
          open={totalModal.isModalOpen}
          onOpenChange={totalModal.openModal}
        >
          <DialogContent className="w-[30%] rounded-lg lg:max-w-[80vw] backgroundModal border border-none">
            <div className="flex flex-col p-5">
              <span className="text-xl font-semibold text-center text-white">
                O acesso do médico {nameInactive}, CRM {crmInactive} foi
                bloqueado com sucesso!
              </span>
            </div>
          </DialogContent>
        </Dialog>
      </div>
{/* 
      <DataTable
        columns={columns}
        isLoading={isLoading || refresh}
        data={diagnosticRows}
      /> */}
    </div>
  );
}
