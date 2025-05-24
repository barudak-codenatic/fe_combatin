"use client"

import Breadcrumb from "@/components/common/breadcrumb"
import TooltipButton from "@/components/common/tooltip"
import { CardLearning, ProgressBar } from "@/components/edu"
import { useSplitPath } from "@/hooks"
import useApiRequest from "@/hooks/useRequest"
import apiClient from "@/services/apiService"
import { Module, ModuleForm } from "@/types"
import { useQuery } from "@tanstack/react-query"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { useEffect, useRef, useState, FormEvent } from "react"
import { IoCheckmark, IoClose, IoCreateOutline, IoTrashOutline, IoBookOutline, IoSchoolOutline } from "react-icons/io5"

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
            <div className="flex flex-col gap-2 bg-white rounded-xl shadow-sm p-6">
                <div className="flex gap-6 w-full pb-6">
                    {isEdit ? (
                        previewImg ? (
                            <div className="relative w-64 h-48 rounded-xl overflow-hidden shadow-md">
                                <Image
                                    src={previewImg}
                                    alt="Preview"
                                    fill
                                    className="object-cover"
                                />
                            </div>
                        ) : moduleData.img_url ? (
                            <div className="relative w-64 h-48 rounded-xl overflow-hidden shadow-md">
                                <Image
                                    src={moduleData.img_url}
                                    alt={moduleData.name}
                                    fill
                                    className="object-cover"
                                />
                            </div>
                        ) : (
                            <div className="bg-gradient-to-br from-blue-400 to-indigo-600 w-64 h-48 rounded-xl shadow-md flex items-center justify-center">
                                <IoBookOutline className="text-white text-5xl" />
                            </div>
                        )
                    ) : moduleData.img_url ? (
                        <div className="relative w-64 h-48 rounded-xl overflow-hidden shadow-md">
                            <Image
                                src={moduleData.img_url}
                                alt={moduleData.name}
                                fill
                                className="object-cover"
                            />
                        </div>
                    ) : (
                        <div className="bg-gradient-to-br from-blue-400 to-indigo-600 w-64 h-48 rounded-xl shadow-md flex items-center justify-center">
                            <IoBookOutline className="text-white text-5xl" />
                        </div>
                    )}

                    <div className="flex-grow">
                        {isEdit ? (
                            <form onSubmit={handleSubmit} className="flex flex-col gap-3">
                                <div className="flex flex-col gap-1">
                                    <label htmlFor="module-image" className="text-sm font-medium text-gray-700">
                                        Gambar Modul
                                    </label>
                                    <div className="flex items-center">
                                        <label htmlFor="module-image" className="cursor-pointer bg-gray-50 hover:bg-gray-100 text-gray-700 px-4 py-2 rounded-lg border transition-colors">
                                            Pilih Gambar
                                        </label>
                                        <input
                                            id="module-image"
                                            type="file"
                                            ref={fileInputRef}
                                            accept="image/*"
                                            className="hidden"
                                            onChange={(e) => {
                                                const file = e.target.files?.[0] || null
                                                if (file) {
                                                    setForm((prev) => ({ ...prev, img: file }))
                                                    setPreviewImg(URL.createObjectURL(file))
                                                }
                                            }}
                                        />
                                        <span className="ml-3 text-sm text-gray-500">
                                            {form.img ? form.img.name : "Belum ada file yang dipilih"}
                                        </span>
                                    </div>
                                </div>
                                
                                <div className="flex flex-col gap-1">
                                    <label htmlFor="module-name" className="text-sm font-medium text-gray-700">
                                        Nama Modul
                                    </label>
                                    <input
                                        id="module-name"
                                        type="text"
                                        value={form.name}
                                        onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
                                        className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        placeholder="Nama Modul"
                                    />
                                </div>
                                
                                <div className="flex flex-col gap-1">
                                    <label htmlFor="module-description" className="text-sm font-medium text-gray-700">
                                        Deskripsi
                                    </label>
                                    <textarea
                                        id="module-description"
                                        value={form.description}
                                        onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))}
                                        className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        placeholder="Deskripsi"
                                        rows={3}
                                    />
                                </div>
                            </form>
                        ) : (
                            <div className="flex flex-col h-full justify-between">
                                <div>
                                    <h2 className="text-2xl font-bold text-gray-800 mb-2">{moduleData.name}</h2>
                                    <div className="flex gap-4 text-sm text-gray-500 mb-4">
                                        <div className="flex items-center">
                                            <span className="font-medium mr-1">Dibuat:</span>
                                            <span>{new Date(moduleData.createdAt).toLocaleDateString('id-ID', { 
                                                day: 'numeric', 
                                                month: 'long', 
                                                year: 'numeric' 
                                            })}</span>
                                        </div>
                                        <div className="flex items-center">
                                            <span className="font-medium mr-1">Diperbarui:</span>
                                            <span>{new Date(moduleData.updatedAt).toLocaleDateString('id-ID', { 
                                                day: 'numeric', 
                                                month: 'long', 
                                                year: 'numeric' 
                                            })}</span>
                                        </div>
                                    </div>
                                </div>
                                
                                {moduleData.progress.length > 0 && (
                                    <div className="mt-auto">
                                        <div className="flex items-center justify-between mb-1">
                                            <span className="text-sm font-medium text-gray-700">Progres Pembelajaran</span>
                                        </div>
                                        <ProgressBar value={moduleData.progress[0].progress}/>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    <div className="flex h-fit gap-2">
                        {isEdit ? (
                            <>
                                <TooltipButton label="Batal">
                                    <button
                                        className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
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
                                        <IoClose color="red" size={22} />
                                    </button>
                                </TooltipButton>
                                <TooltipButton label="Simpan">
                                    <button 
                                        className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
                                        onClick={handleSubmit}
                                    >
                                        <IoCheckmark color="green" size={22} />
                                    </button>
                                </TooltipButton>
                            </>
                        ) : (
                            <>
                                <TooltipButton label="Edit">
                                    <button 
                                        className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
                                        onClick={() => setEdit(true)}
                                    >
                                        <IoCreateOutline color="black" size={22} />
                                    </button>
                                </TooltipButton>
                                <TooltipButton label="Hapus">
                                    <button 
                                        className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
                                        onClick={() => handleDelete(moduleData.id)}
                                    >
                                        <IoTrashOutline color="red" size={22} />
                                    </button>
                                </TooltipButton>
                            </>
                        )}
                    </div>
                </div>

                {!isEdit && (
                    <div className="bg-gray-50 border-y-[2px] py-6">
                        <h2 className="text-lg font-semibold text-gray-800 mb-2">Deskripsi</h2>
                        <p className="text-gray-700 whitespace-pre-line">{moduleData.description}</p>
                    </div>
                )}

                <div >
                    <div className="flex gap-2 mb-4 border-b-[2px]">
                        <button 
                            onClick={() => setActive('material')}
                            className={`flex items-center gap-2 px-4 py-3 font-medium transition-colors ${
                                isActive === 'material' 
                                    ? 'text-red-600 border-b-2 border-red-600' 
                                    : 'text-gray-600 hover:text-red-600'
                            }`}
                        >
                            <IoBookOutline size={18} />
                            Materi
                        </button>
                        <button 
                            onClick={() => setActive('test')}
                            className={`flex items-center gap-2 px-4 py-3 font-medium transition-colors ${
                                isActive === 'test' 
                                    ? 'text-red-600 border-b-2 border-red-600' 
                                    : 'text-gray-600 hover:text-red-600'
                            }`}
                        >
                            <IoSchoolOutline size={18} />
                            Tes
                        </button>
                    </div>
                    
                    {isActive === 'material' && moduleData.materials.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-12 text-center">
                            <div className="bg-gray-100 p-4 rounded-full mb-4">
                                <IoBookOutline className="text-gray-400 text-4xl" />
                            </div>
                            <h3 className="text-lg font-medium text-gray-700 mb-1">Belum ada materi</h3>
                            <p className="text-gray-500 max-w-md">Belum ada materi yang tersedia untuk modul ini.</p>
                        </div>
                    ) : isActive === 'test' && moduleData.test.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-12 text-center">
                            <div className="bg-gray-100 p-4 rounded-full mb-4">
                                <IoSchoolOutline className="text-gray-400 text-4xl" />
                            </div>
                            <h3 className="text-lg font-medium text-gray-700 mb-1">Belum ada tes</h3>
                            <p className="text-gray-500 max-w-md">Belum ada tes yang tersedia untuk modul ini.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
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
                    )}
                </div>
            </div>
        </div>
    )
}

export default ModulePage
