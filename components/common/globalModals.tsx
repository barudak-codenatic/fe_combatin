"use client"
import { useModalStore } from "@/hooks/modalStore";
import { AnimatePresence, motion } from "framer-motion";
import { ReactNode } from "react";
import { AddModuleForm } from "../forms/addModuleForm";
import { AddMaterialForm } from "../forms/addMaterialForm";

interface ModalProps {
    isOpen: boolean;
    setIsOpen: (open: boolean) => void;
    children: ReactNode;
};

const Modal = ({ isOpen, setIsOpen, children } : ModalProps) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setIsOpen(false)}
          className="bg-slate-900/20 backdrop-blur p-8 fixed inset-0 z-50 grid place-items-center overflow-y-scroll"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-gradient-to-br bg-white p-6 rounded-lg w-full max-w-lg shadow-xl cursor-default relative overflow-hidden"
          >
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export const GlobalModals = () => {
  const { modalType, closeModal } = useModalStore();

  return (
    <>
      {modalType === "addModule" && (
        <Modal isOpen={true} setIsOpen={closeModal}>
          <AddModuleForm/>
        </Modal>
      )}

      {modalType === "addMaterial" && (
        <Modal isOpen={true} setIsOpen={closeModal}>
          <AddMaterialForm/>
        </Modal>
      )}

      {modalType === "addTes" && (
        <Modal isOpen={true} setIsOpen={closeModal}>
          <h2 className="text-2xl font-bold mb-2">Tambah Tes</h2>
          <p>Isi tes di sini.</p>
        </Modal>
      )}
    </>
  );
};


export default GlobalModals;