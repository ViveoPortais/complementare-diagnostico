import { create } from "zustand";

interface ModalProps {
  isModalOpen: boolean;
  openModal: (action: boolean) => void;
}

export interface useModalStore {
  isOpen: boolean
  onOpen: () => void
  onClose: () => void
}


export const useModal = create<ModalProps>((set) => ({
  isModalOpen: false,
  openModal: (action) => set(() => ({ isModalOpen: action })),
}));

export const useAccept = create<ModalProps>((set) => ({
  isModalOpen: false,
  openModal: (action) => set(() => ({ isModalOpen: action })),
}));

export const useModalEmail = create<ModalProps>((set) => ({
  isModalOpen: false,
  openModal: (action) => set(() => ({ isModalOpen: action })),
}));

export const passwordErr = create<ModalProps>((set) => ({
  isModalOpen: false,
  openModal: (action) => set(() => ({ isModalOpen: action })),
}));

export const passwordCorrect = create<ModalProps>((set) => ({
  isModalOpen: false,
  openModal: (action) => set(() => ({ isModalOpen: action })),
}));

export const acceptPreRegisterModal = create<ModalProps>((set) => ({
  isModalOpen: false,
  openModal: (action) => set(() => ({ isModalOpen: action })),
}));

export const modalRegisterUser = create<ModalProps>((set) => ({
  isModalOpen: false,
  openModal: (action) => set(() => ({ isModalOpen: action })),
}));

export const useModalRescue = create<ModalProps>((set) => ({
  isModalOpen: false,
  openModal: (action) => set(() => ({ isModalOpen: action })),
}));

export const useModalInativePartial = create<ModalProps>((set) => ({
  isModalOpen: false,
  openModal: (action) => set(() => ({ isModalOpen: action })),
}));

export const useModalTotalPartial = create<ModalProps>((set) => ({
  isModalOpen: false,
  openModal: (action) => set(() => ({ isModalOpen: action })),
}));

export const useInativeTermsModal = create<useModalStore>((set) => ({
  isOpen: false,
  onOpen: () => set({ isOpen: true }),
  onClose: () => set({ isOpen: false }),
}))

export const useTermsModal = create<useModalStore>((set) => ({
  isOpen: false,
  onOpen: () => set({ isOpen: true }),
  onClose: () => set({ isOpen: false }),
}))

export const useDrawer = create<useModalStore>((set) => ({
  isOpen: false,
  onOpen: () => set({ isOpen: true }),
  onClose: () => set({ isOpen: false }),
}))
