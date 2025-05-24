'use client'

import Breadcrumb from "@/components/common/breadcrumb"
import TooltipButton from "@/components/common/tooltip"
import { NavigationButtons } from "@/components/edu"
import { useSplitPath } from "@/hooks"
import useApiRequest from "@/hooks/useRequest"
import apiClient from "@/services/apiService"
import { Material } from "@/types"
import { useQuery } from "@tanstack/react-query"
import dynamic from "next/dynamic"
import { useEffect, useLayoutEffect, useState } from "react"
import { IoCheckmark, IoClose, IoCreateOutline } from "react-icons/io5"

const MDEditor = dynamic(() => import('@uiw/react-md-editor'), { ssr: false })

const MaterialPage = () => {
  const materialId = useSplitPath(4)
  const { loading: postLoading, makeRequest } = useApiRequest<{ message: string }, string>()

  const { data, isLoading } = useQuery({
    queryKey: ['getMaterial'],
    queryFn: () => apiClient.get<Material>(`/materials/${materialId}`)
  })

  const [isEdit, setEdit] = useState(false)

  const materialData = data?.data

  const [form, setForm] = useState({
    title: '',
    content: ''
  })

  useEffect(() => {
    if (materialData) {
      setForm({
        title: materialData.title,
        content: materialData.content
      })
    }
  }, [materialData])

  const handleChange = (value: string | undefined) => {
    setForm((prev) => ({ ...prev, content: value || '' }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await makeRequest(() => apiClient.put(`/materials/${materialId}`, form))
      setEdit(false)
    } catch (err) {
      console.error('Gagal menyimpan materi', err)
    }
  }

  useEffect(() => {
    if (!isEdit) {
      const interval = setInterval(() => {
        const previewElement = document.querySelector('.w-md-editor-preview');
        const editorElement = document.querySelector('.w-md-editor');
        if (previewElement) {
          previewElement.classList.remove('w-md-editor-preview');
          editorElement.classList.remove('w-md-editor');
          clearInterval(interval);
        }
      }, 100); 

      setTimeout(() => clearInterval(interval), 3000);
    }
  }, [isEdit]);

  if (!materialData) return null

  return (
    <div className="h-full">
      <Breadcrumb
        crumbs={[
          { label: materialData.module.name, href: `/module/${materialData.moduleId}` },
          { label: materialData.title, href: `/module/${materialData.id}` }
        ]}
      />

      <form onSubmit={handleSubmit} className="space-y-4 bg-h-full mt-4">
        <div className={`flex ${!isEdit&&'border-b-[2px]'} pb-4`}>
          <input
            type="text"
            name="title"
            className={`w-full border rounded text-2xl font-bold ${isEdit ? 'border-gray-300 p-2':'border-transparent p-0'}`}
            value={form.title}
            disabled={!isEdit}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
          />
          <div className="flex h-fit gap-2">
              {isEdit ? (
                  <>
                      <TooltipButton label="Batal">
                          <button type="button" onClick={() => setEdit(false)} className="hover-icon">
                              <IoClose color="red" size={25} />
                          </button>
                      </TooltipButton>
                      <TooltipButton label="Simpan">
                          <button className="hover-icon" type="submit">
                              <IoCheckmark color="green" size={25} />
                          </button>
                      </TooltipButton>
                  </>
              ) : (
                  <>
                      <TooltipButton label="Edit">
                          <button className="hover-icon" type="button" onClick={() => setEdit(true)}>
                              <IoCreateOutline color="black" size={25} />
                          </button>
                      </TooltipButton>
                  </>
              )}
          </div>
        </div>

        <div className="h-full">
          <MDEditor
            data-color-mode="light"
            value={form.content}
            onChange={handleChange}
            visibleDragbar={isEdit? true : false}
            height={isEdit ? 350 : 'auto'}
            hideToolbar={isEdit ? false : true}
            preview={isEdit ? 'edit' : 'preview'}
            enableScroll={false}
          />
        </div>
      </form>

      <div className="flex justify-end mt-16">
        <NavigationButtons
          moduleId={materialData.moduleId}
          currentId={materialId}
          type="material"
        />
      </div>
    </div>
  )
}

export default MaterialPage
