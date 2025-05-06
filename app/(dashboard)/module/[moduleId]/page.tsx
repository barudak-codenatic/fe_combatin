"use client"

import Breadcrumb from "@/components/common/breadcrumb"
import TooltipButton from "@/components/common/tooltip"
import { CardLearning } from "@/components/edu"
import ProgressBar from "@/components/edu/progressBar"
import { useSplitPath } from "@/hooks"
import useApiRequest from "@/hooks/useRequest"
import apiClient from "@/services/apiService"
import { Module, ModuleForm } from "@/types"
import { useQuery } from "@tanstack/react-query"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { useEffect, useRef, useState, FormEvent } from "react"
import { IoCheckmark, IoClose, IoCreateOutline, IoTrashOutline } from "react-icons/io5"

const ModulePage = () => {
    const router = useRouter()
    const moduleId = useSplitPath(2)

    const [isEdit, setEdit] = useState(false)
    const [isActive, setActive] = useState<'material' | 'test'>('material')

    const [form, setForm] = useState<ModuleForm>({
        img: null,
        name: '',
        description: '',
    })

    const [previewImg, setPreviewImg] = useState<string | null>(null)
    const fileInputRef = useRef<HTMLInputElement>(null)

    const { loading: postLoading, error: postError, makeRequest } = useApiRequest<{ message: string }, string>()

    const { data, isLoading, error } = useQuery({
        queryKey: ['getModuleId'],
        queryFn: () => apiClient.get<Module>(`/modules/${moduleId}`)
    })

    const handleDelete = async (id: string | undefined) => {
        try {
            await makeRequest(() => apiClient.delete(`/modules/${id}`))
            router.replace('/module')
        } catch (err) {
            console.log(err)
        }
    }

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault()
        try {
            const formData = new FormData()
            if (form.img) formData.append('file', form.img)
            formData.append('name', form.name)
            formData.append('description', form.description)
    
            await makeRequest(() =>
                apiClient.put(`/modules/${data?.data.id}`, formData, {
                    headers: { 'Content-Type': 'multipart/form-data' },
                })
            )
    
            setEdit(false)
            setPreviewImg(null)
            router.refresh()
        } catch (err) {
            console.log(err)
        }
    }
    

    useEffect(() => {
        if (data?.data) {
            setForm({
                name: data.data.name,
                img: null,
                description: data.data.description,
            })
            setPreviewImg(null)
        }
    }, [data])

    const moduleData = data?.data
    if (!moduleData) return null

    return (
        <div className="max-w-7xl mx-auto mt-28">
            <Breadcrumb crumbs={[{ label: moduleData.name, href: `/module` }]} />
            <div className="flex flex-col gap-4">
                <div className="flex gap-4 w-full">
                    {isEdit ? (
                        previewImg ? (
                            <Image
                                src={previewImg}
                                alt="Preview"
                                width={200}
                                height={200}
                                className="w-64 h-48 object-cover rounded-lg"
                            />
                        ) : moduleData.img_url ? (
                            <Image
                                src={moduleData.img_url}
                                alt={moduleData.name}
                                width={200}
                                height={200}
                                className="w-64 h-48 object-cover rounded-lg"
                            />
                        ) : (
                            <div className="bg-red-400 w-56 h-48 rounded-lg" />
                        )
                    ) : moduleData.img_url ? (
                        <Image
                            src={moduleData.img_url}
                            alt={moduleData.name}
                            width={200}
                            height={200}
                            className="w-64 h-48 object-cover rounded-lg"
                        />
                    ) : (
                        <div className="bg-red-400 w-56 h-48 rounded-lg" />
                    )}

                    <div className="flex-grow">
                        {isEdit ? (
                            <form onSubmit={handleSubmit} className="flex flex-col gap-2">
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    accept="image/*"
                                    onChange={(e) => {
                                        const file = e.target.files?.[0] || null
                                        if (file) {
                                            setForm((prev) => ({ ...prev, img: file }))
                                            setPreviewImg(URL.createObjectURL(file))
                                        }
                                    }}
                                />
                                <input
                                    type="text"
                                    value={form.name}
                                    onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
                                    className="border rounded px-2 py-1"
                                    placeholder="Nama Modul"
                                />
                                <textarea
                                    value={form.description}
                                    onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))}
                                    className="border rounded px-2 py-1"
                                    placeholder="Deskripsi"
                                />
                            </form>
                        ) : (
                            <>
                                <h2>{moduleData.name}</h2>
                                <p>{moduleData.createdAt}</p>
                                <p>{moduleData.updatedAt}</p>
                                <ProgressBar value={moduleData.progress[0].progress}/>
                            </>
                        )}
                    </div>

                    <div className="flex h-fit gap-2">
                        {isEdit ? (
                            <>
                                <TooltipButton label="Batal">
                                    <button
                                        className="hover-icon"
                                        onClick={() => {
                                            setEdit(false)
                                            setForm({
                                                name: moduleData.name,
                                                img: null,
                                                description: moduleData.description,
                                            })
                                            setPreviewImg(null)
                                        }}
                                    >
                                        <IoClose color="red" size={25} />
                                    </button>
                                </TooltipButton>
                                <TooltipButton label="Simpan">
                                    <button className="hover-icon" onClick={handleSubmit}>
                                        <IoCheckmark color="green" size={25} />
                                    </button>
                                </TooltipButton>
                            </>
                        ) : (
                            <>
                                <TooltipButton label="Edit">
                                    <button className="hover-icon" onClick={() => setEdit(true)}>
                                        <IoCreateOutline color="black" size={25} />
                                    </button>
                                </TooltipButton>
                                <TooltipButton label="Delete">
                                    <button className="hover-icon" onClick={() => handleDelete(moduleData.id)}>
                                        <IoTrashOutline color="red" size={25} />
                                    </button>
                                </TooltipButton>
                            </>
                        )}
                    </div>
                </div>

                {!isEdit && (
                    <div>
                        <h2>Deskripsi</h2>
                        <p>{moduleData.description}</p>
                    </div>
                )}

                <div>
                    <div className="flex gap-2">
                        <button onClick={() => setActive('material')}>Materi</button>
                        <button onClick={() => setActive('test')}>Tes</button>
                    </div>
                    <div className="grid grid-cols-4 gap-4">
                        {isActive === 'material'
                            ? moduleData.materials.map((material) => (
                                  <CardLearning
                                      type="materials"
                                      key={material.id}
                                      data={material}
                                      href={`${moduleData.id}/material/${material.id}`}
                                  />
                              ))
                            : moduleData.test.map((test) => (
                                  <CardLearning
                                      type="test"
                                      key={test.id}
                                      data={test}
                                      href={`${moduleData.id}/test/${test.id}`}
                                  />
                              ))}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ModulePage
