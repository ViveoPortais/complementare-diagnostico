"use client"

import { LoadingOverlay } from "@/components/custom/LoadingOverlay";
import { DataTable } from "@/components/dashboard/DataTable";
import { useEffect, useState } from "react";
import { columns } from "./columns";
import { getPurchases } from "@/services/purchase";
import { maskedField } from "@/components/custom/MaskedField";
import { Button } from "@/components/ui/button";
import { IoSearch } from "react-icons/io5";
import { CgSpinner } from "react-icons/cg";

export default function SalesHistory() {
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingSearch, setIsLoadingSearch] = useState(false);
  const [tableData, setTableData] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalAmount, setTotalAmount] = useState(0);
  const [cpf, setCpf] = useState('')

  useEffect(() => {
    fetchData(currentPage, rowsPerPage);
  }, [currentPage, rowsPerPage])

  const fetchData = async (_currenPage: number, _rowsPerPage: number) => {
    setIsLoading(true);

    getPurchases(_currenPage, _rowsPerPage, cpf).then(res => {
      setTableData(res.items);
      setTotalAmount(res.totalAmount);
    }).catch(res => {
      console.log('res')
      console.log(res)
    }).finally(() => {
      setIsLoading(false);
      setIsLoadingSearch(false);
    });
  }

  const updatePageSize = async (pageSize: number) => {
    setRowsPerPage(pageSize);
  }

  const updatePage = async (pageIndex: number) => {
    setCurrentPage(pageIndex);
  }

  const handleCPFChange = (e: any) => {
    setCpf(e.target.value);
  };

  const handleSearch = async () => {
    setIsLoadingSearch(true);
    if (currentPage != 0)
      setCurrentPage(0);
    else
      fetchData(0, rowsPerPage);
  }

  return (
    <div className="h-full w-full">
      <LoadingOverlay isVisible={isLoading} />
      <div className=" mb-10 text-xl border rounded-md p-3 important-color">
        <h1 className="text-lg text-white">
          Paciente | Histórico de Venda
        </h1>
      </div>
      <div className="w-full px-2 lg:px-4">
        <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-3 md:gap-8 pb-3 border-b-2">
          {maskedField(
            'cpf',
            handleCPFChange,
            'cpf',
            'Escreva aqui...',
            true,
            undefined,
            cpf,
            false,
            'cpf'
          )}
          <div className="flex items-center justify-center inline-block pb-5 pt-5">
            <Button
              className="lg:w-[200px]"
              size="lg"
              variant={`default`}
              onClick={handleSearch}
            >
              {isLoadingSearch
                ? (<CgSpinner size={20} className="text-white animate-spin" />) :
                ("FILTRAR")
              }
            </Button>
          </div>
        </div>
      </div>

      <div className="mt-5">
        <DataTable
          columns={columns}
          data={tableData}
          updatePageSizeOption={updatePageSize}
          updatePage={updatePage}
          pageIndex={currentPage}
          totalAmount={totalAmount}
        />
      </div>
    </div>
  )
}