"use client"

import { content } from "@/content"
import { useSplitPath } from "@/hooks"
import apiClient from "@/services/apiService"
import { Module } from "@/types"
import { useQuery } from "@tanstack/react-query"
import Image from "next/image"
import Link from "next/link"
import { useState } from "react"
import { FaBook } from "react-icons/fa6"
const ModulePage = () => {
    const moduleId = useSplitPath(2)
    const [isActive, setActive] = useState('material')
    
    const { data, isLoading, error } = useQuery({
        queryKey : ['getModuleId'],
        queryFn : () => apiClient.get<Module>(`/modules/${moduleId}`)
    })
    const moduleData = data?.data

    return (
        <div className="container mx-auto mt-28 flex flex-col gap-4">
            <div className="flex gap-4 w-full">
                {moduleData?.img_url?<Image
                    src={moduleData?.img_url}
                    alt={moduleData?.name}
                    width={200}
                    height={200}
                />:<div className="bg-red-400 w-56 h-48 rounded-lg"/>}
                <div className="flex-grow bg-slate-200">
                    <h2>{moduleData?.name}</h2>
                    <p>{moduleData?.createdAt}</p>
                    <p>{moduleData?.updatedAt}</p>
                </div>
            </div>
            <div className="">
                <h2>Deskripsi</h2>
                <p>{moduleData?.description}</p>
            </div>
            <div>
                <div className="flex gap-2">
                    <button onClick={()=>setActive('material')}>Materi</button>
                    <button onClick={()=>setActive('test')}>Tes</button>
                </div>
                <div className="grid grid-cols-4">
                    {
                        isActive=='material'?
                        moduleData?.materials.map(material=>(
                            <Link key={material.id} className="flex gap-2" href={material.id}>
                                <FaBook size={25}/>
                                <h4>{material.title}</h4>
                            </Link>
                        )):
                        moduleData?.test.map(test=>(
                            <Link key={test.id} className="flex gap-2" href={test.id}>
                                <FaBook size={25}/>
                                <h4>{test.title}</h4>
                            </Link>
                        ))
                    }
                </div>
            </div>
        </div>
    )
 }

export default ModulePage