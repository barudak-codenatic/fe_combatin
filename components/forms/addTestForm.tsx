'use client'
import { useModalStore } from "@/hooks/modalStore";
import { CustomButton, CustomInput, SelectDropdown } from "../common";
import { FormEvent, useRef, useState } from "react";
import useApiRequest from "@/hooks/useRequest";
import apiClient from "@/services/apiService";
import { useQuery } from "@tanstack/react-query";
import { Modules } from "@/types";

interface FormState {
  moduleId: string;
  title: string;
  description: string;
  config: string[];
}

export const AddTestForm = () => {
  const { loading: postLoading, error: postError, makeRequest, data: postData } = useApiRequest<{ message: string }, string>();
  const { closeModal } = useModalStore();

  const formRef = useRef<HTMLFormElement | null>(null);
  
  const [form, setForm] = useState<FormState>({
    moduleId: '',
    title: '',
    description: '',
    config: []
  });

  const [selectedOption, setSelectedOption] = useState<string>('');

  const configOptions = [
    { label: "Jab", value: "jab" },
    { label: "Uppercut", value: "uppercut" },
    { label: "Cross", value: "cross" },
    { label: "Block", value: "block" },
    { label: "Hook", value: "hook" }
  ];

  const { data, isLoading, error } = useQuery({
    queryKey: ['getAllModules'],
    queryFn: () => apiClient.get<Modules[]>('/modules'),
  });

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      await makeRequest(() => apiClient.post(`/test/${form.moduleId}`, form));
      formRef.current?.reset();
    } catch (err) {
      formRef.current?.reset();
      console.log(err);
    }
  };

  const addConfigItem = () => {
    if (selectedOption) {
      setForm({
        ...form,
        config: [...form.config, selectedOption]
      });
      setSelectedOption('');
    }
  };

  const removeConfigItem = (index: number) => {
    setForm({
      ...form,
      config: form.config.filter((_, i) => i !== index)
    });
  };

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="flex flex-col gap-3">
      <SelectDropdown
        value={form.moduleId}
        onChange={(e) => setForm({ ...form, moduleId: e.target.value })}
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
        handleChange={(e) => setForm({ ...form, title: e.target.value })}
      />
      
      <CustomInput
        type="area"
        title="Deskripsi"
        value={form.description}
        handleChange={(e) => setForm({ ...form, description: e.target.value })}
      />

      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium">Config</label>
        <div className="flex gap-2">
          <select
            className="flex-1 p-2 border border-gray-300 rounded-md"
            value={selectedOption}
            onChange={(e) => setSelectedOption(e.target.value)}
          >
            <option value="">Pilih opsi</option>
            {configOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <button
            type="button"
            onClick={addConfigItem}
            className="px-3 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          >
            Tambah
          </button>
        </div>

        {form.config.length > 0 && (
          <div className="mt-2">
            <p className="text-sm font-medium mb-1">Config yang dipilih:</p>
            <div className="flex flex-wrap gap-2">
              {form.config.map((item, index) => (
                <div 
                  key={index}
                  className="flex items-center gap-1 bg-gray-100 px-2 py-1 rounded-md"
                >
                  <span>{item}</span>
                  <button
                    type="button"
                    onClick={() => removeConfigItem(index)}
                    className="text-red-500 hover:text-red-700 font-bold"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

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
  );
};