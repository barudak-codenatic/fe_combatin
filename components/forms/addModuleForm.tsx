'use client'
import { useModalStore } from "@/hooks/modalStore";
import { CustomButton, CustomInput } from "../common";
import { ChangeEvent, FormEvent, useRef, useState } from "react";
import useApiRequest from "@/hooks/useRequest";
import apiClient from "@/services/apiService";
import { useRouter } from "next/navigation";
import { ModuleForm } from "@/types";

export const AddModuleForm = () => {
    const { loading, error, makeRequest, data } = useApiRequest<{message : string}, string>();
    const { closeModal } = useModalStore();

    const formRef = useRef<HTMLFormElement | null>(null)

    const router = useRouter()

    const [form, setForm] = useState<ModuleForm>({
        img : null,
        name : '',
        description : '',
    })


    const handleSubmit = async (e:FormEvent) => { 
        e.preventDefault()
        if (!form.img) {
            console.log("Gambar wajib diisi");
            return;
          }
        try {
            const formData = new FormData()
            formData.append('file', form.img)
            formData.append('name', form.name)
            formData.append('description', form.description)
            await makeRequest(() => apiClient.post('/modules', formData, { headers : {'Content-Type': 'multipart/form-data'} }));
            formRef.current?.reset()
            await router.push('/module')
        } catch (err) {
            formRef.current?.reset()
            console.log(err)
        }
     }

    return (
        <form ref={formRef} onSubmit={handleSubmit} className="flex flex-col gap-3">
            <CustomInput 
                type="file" 
                title="Gambar"
                accept="image/*"
                handleChange={(e:ChangeEvent<HTMLInputElement>) => {setForm({...form, img : e.target.files[0]})}}
            />
            <CustomInput 
                type="text" 
                title="Judul"
                value={form.name}
                handleChange={(e) => setForm({...form, name : e.target.value})}
                />
            <CustomInput 
                type="area" 
                title="Deskripsi"
                value={form.description}
                handleChange={(e) => setForm({...form, description : e.target.value})}
                />
            {/* <MessageRes error={error}/> */}
            <div className="flex justify-end gap-3">
                <CustomButton 
                    title="Batal"
                    type="button"
                    onClick={closeModal}
                    loading={loading}
                />
                <CustomButton 
                    title="Simpan"
                    type="submit"
                    loading={loading}
                />
            </div>
        </form>
    )
};
