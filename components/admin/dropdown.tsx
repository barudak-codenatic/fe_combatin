"use client"
import { FaBook, FaClipboardQuestion, FaPlus } from "react-icons/fa6"
import { ImBooks } from "react-icons/im"
import { IoMdArrowDropdown } from "react-icons/io"
import { DropDown } from "../common"
import { useModalStore } from "@/hooks/modalStore"

export const NewIcon = () => {
    return (
        <div className="flex flex-gap-2 h-full">
            <FaPlus className="h-full aspect-square"/>
            <IoMdArrowDropdown className="h-full aspect-square"/>
        </div>
    )
}

export const NewDropdown = () => {
    const openModal = useModalStore((state) => state.openModal);

    return (
        <DropDown otherStyles="w-48 -translate-x-24" trigger={<NewIcon/>}>
            <button onClick={() => openModal("addModule")} className="flex w-full gap-2 hover:bg-gray-200 px-3 py-2 items-center">
                <ImBooks color="black" size={25}/>
                <p className="">Tambah Modul</p>
            </button>
            <button onClick={() => openModal("addMaterial")} className="flex w-full gap-2 hover:bg-gray-200 px-3 py-2 items-center">
                <FaBook color="black" size={25}/>
                <p className="">Tambah Materi</p>
            </button>
            <button onClick={() => openModal("addTes")} className="flex w-full gap-2 hover:bg-gray-200 px-3 py-2 items-center">
                <FaClipboardQuestion color="black" size={25}/>
                <p className="">Tambah Tes</p>
            </button>
        </DropDown>
    )
}