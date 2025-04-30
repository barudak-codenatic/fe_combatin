import { create } from "zustand";

type ModalType = "addModule" | "addMaterial" | "addTes" | null;

interface ModalState {
  modalType: ModalType;
  openModal: (type: ModalType) => void;
  closeModal: () => void;
}

export const useModalStore = create<ModalState>((set) => ({
  modalType: null,
  openModal: (type) => set({ modalType: type }),
  closeModal: () => set({ modalType: null }),
}));
