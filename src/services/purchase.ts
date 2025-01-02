import { IPurchaseData } from "@/types"
import api from "./api";

const sotyktuMedicamentId: string = '606bea92-4d3f-474c-943d-9ba2219c726a';
const programCode = process.env.PROGRAM_CODE;

export const addPurchase = async (data: IPurchaseData) => {
	const response = await api.post("/purchase/purchases", { ...data, programCode, medicamentName: 'Sotyktu', medicamentId: sotyktuMedicamentId });
	return response.data;
}

export const getPurchases = async (page: number, pageSize: number, cpf: string) => {
	const response = await api.get(`/report/purchase-reports?programCode=${programCode}&page=${page}&pageSize=${pageSize}&patientCpf=${cpf}`);
	return response.data;
}
