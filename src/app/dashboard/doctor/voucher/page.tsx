'use client'

import { useState } from "react";
import { CgSpinner } from "react-icons/cg";
import { toast } from "react-toastify";

import { CustomSelect } from "@/components/custom/CustomSelect";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { examsList } from "@/helpers/select-filters";
import { addVoucher } from "@/services/voucher";

export default function DiagnosticVoucher() {
    const [isLoading, setIsLoading] = useState(false);
    const [exam, setExam] = useState("");
    const [voucher, setVoucher] = useState("");

    const [patientData, setPatientData] = useState({
        emailaddress: "",
        mobilephone: "",
    });

    function getVoucher() {
        setIsLoading(true);

        addVoucher(true, exam)
        .then((res) => {
          if(res.isValidData) {
            setVoucher(res.value.name)
            toast.success("Voucher gerado com sucesso!" + "\n" + "Nº: " + res.value.name)

          } else {
            toast.error("Erro ao gerar voucher")
          }
        })
        .catch(() => {
            toast.error("Erro ao gerar voucher")
        })
        .finally(() => {
          setIsLoading(false);
        });
    }

    return (
        <div className="w-full h-full flex flex-col items-center justify-center mt-8 lg:mt-0">
            <CustomSelect
                name="exam"
                label="Exame" 
                value={exam}
                onChange={(e) => setExam(e)}
                options={examsList}
                customClass="w-full"
            />

            <div className="w-full grid grid-cols-1 md:grid-cols-4 gap-4 mt-8">
                <Input
                    className="md:col-span-3"
                    placeholder="Voucher de diagnóstico"
                    disabled
                    value={voucher}
                />

                <div className="w-full h-full items-end justify-end">
                    <Button 
                        className={`w-full px-3 py-6 md:px-4 md:py-8 text-lg font-semibold md:mt-6 ${isLoading && "bg-zinc-500"}`}
                        disabled={exam === "" || isLoading || voucher !== ""}
                        onClick={() => getVoucher()}
                    >
                        { isLoading ? <CgSpinner size={20} className="text-white animate-spin" /> : "Gerar voucher" }
                    </Button>
                </div>
            </div>
        </div>
    )
}