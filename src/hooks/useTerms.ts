import { create } from "zustand";

interface AcceptTermsProps {
  isTermModalOpen: boolean;
  isPatientTermsAccepted: boolean;
  isMedicDiagnosticTermsAccepted: boolean;
  isMedicTreatmentTermsAccepted: boolean;
  isRegulationAccepted: boolean;

  openTermModal: (action: boolean) => void;
  acceptPatientTerms: (value: boolean) => void;
  acceptMedicDiagnosticTerms: (value: boolean) => void;
  acceptMedicTreatmentTerms: (value: boolean) => void;
  acceptRegulation: (value: boolean) => void;
}

export const useAcceptTerms = create<AcceptTermsProps>((set) => ({
  isTermModalOpen: false,
  isPatientTermsAccepted: false,
  isMedicDiagnosticTermsAccepted: false,
  isMedicTreatmentTermsAccepted: false,
  isRegulationAccepted: false,

  openTermModal: (action) => set(() => ({ isTermModalOpen: action })),
  acceptPatientTerms: (isAccepted) =>
    set(() => ({ isPatientTermsAccepted: isAccepted })),
  acceptMedicDiagnosticTerms: (isAccepted) =>
    set(() => ({ isMedicDiagnosticTermsAccepted: isAccepted })),
  acceptMedicTreatmentTerms: (isAccepted) =>
    set(() => ({ isMedicTreatmentTermsAccepted: isAccepted })),
  acceptRegulation: (isAccepted) =>
    set(() => ({ isRegulationAccepted: isAccepted })),
}));
