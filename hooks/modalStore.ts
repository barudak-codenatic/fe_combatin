import { create } from "zustand";

type ModalType =
  | "addModule"
  | "addMaterial"
  | "addTes"
  | "editModule"
  | "editMaterial"
  | "editTest"
  | null;

interface ModalState {
  modalType: ModalType;
  isOpen: boolean;
  payload: unknown; 
  openModal: (type: ModalType, payload?: unknown) => void;
  closeModal: () => void;
}

export const useModalStore = create<ModalState>((set) => ({
  modalType: null,
  isOpen: false,
  payload: null,
  openModal: (type, payload = null) =>
    set({ modalType: type, isOpen: true, payload }),
  closeModal: () => set({ modalType: null, isOpen: false, payload: null }),
}));
