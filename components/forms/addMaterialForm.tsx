'use client'
import { useModalStore } from "@/hooks/modalStore";
import { CustomButton, CustomInput, SelectDropdown } from "../common";
import { ChangeEvent, FormEvent, useRef, useState } from "react";
import useApiRequest from "@/hooks/useRequest";
import apiClient from "@/services/apiService";
import { useQuery } from "@tanstack/react-query";
import { Modules } from "@/types";

interface FormState {
    moduleId : string;
    title : string;
    content : string;
  }

export const AddMaterialForm = () => {
    const { loading:postLoading, error:postError, makeRequest, data:postData } = useApiRequest<{message : string}, string>();
    const { closeModal } = useModalStore();

    const formRef = useRef<HTMLFormElement | null>(null)

    const [form, setForm] = useState<FormState>({
        moduleId : '',
        title : '',
        content : '',
    })

    const { data, isLoading, error } = useQuery({
        queryKey: ['getAllModules'],
        queryFn: () => apiClient.get<Modules[]>('/modules'),
    });

    const handleSubmit = async (e:FormEvent) => { 
        e.preventDefault()
        try {
            await makeRequest(() => apiClient.post(`/materials/${form.moduleId}`, form));
            formRef.current?.reset()
        } catch (err) {
            formRef.current?.reset()
            console.log(err)
        }
     }

    return (
        <form ref={formRef} onSubmit={handleSubmit} className="flex flex-col gap-3">
            <SelectDropdown
                value={form.moduleId}
                onChange={(e) => setForm({...form, moduleId : e.target.value})}
                data={data?.data || []}
                isLoading={isLoading}
                error={error}
                getLabel={(module) => module.name}
                getValue={(module) => module.id}                                                    
            />
            <CustomInput 
                type="text" 
                title="Judul"
                value={form.title}
                handleChange={(e) => setForm({...form, title : e.target.value})}
                />
            <CustomInput 
                type="area" 
                title="Deskripsi"
                value={form.content}
                handleChange={(e) => setForm({...form, content : e.target.value})}
                />
            {/* <MessageRes error={error}/> */}
            <div className="flex justify-end gap-3">
                <CustomButton 
                    title="Batal"
                    type="button"
                    onClick={closeModal}
                    loading={isLoading}
                />
                <CustomButton 
                    title="Simpan"
                    type="submit"
                    loading={isLoading}
                />
            </div>
        </form>
    )
};
