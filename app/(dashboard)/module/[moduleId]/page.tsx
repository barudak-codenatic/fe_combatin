"use client"

import { CardLearning } from "@/components/edu"
import { useSplitPath } from "@/hooks"
import useApiRequest from "@/hooks/useRequest"
import apiClient from "@/services/apiService"
import { Module } from "@/types"
import { useQuery } from "@tanstack/react-query"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { FaBook } from "react-icons/fa6"

const ModulePage = () => {
    const router = useRouter()

    const moduleId = useSplitPath(2)
    const [isActive, setActive] = useState('material')

    const { loading : postLoading, error : postError, makeRequest, data : postData } = useApiRequest<{message : string}, string>();
    
    const { data, isLoading, error } = useQuery({
        queryKey : ['getModuleId'],
        queryFn : () => apiClient.get<Module>(`/modules/${moduleId}`)
    })

    const hendleDelete = async (moduleId : string|undefined) => { 
        try {
            await makeRequest(() => apiClient.delete(`/modules/${moduleId}`));
            await router.replace('/module')
        } catch (err) {
            console.log(err)
        }
     }

    const moduleData = data?.data

    return (
        <div className="max-w-7xl mx-auto mt-28 flex flex-col gap-4">
            <div className="flex gap-4 w-full">
                {moduleData?.img_url?<Image
                    src={moduleData?.img_url}
                    alt={moduleData?.name}
                    width={200}
                    height={200}
                    className="w-64 h-48 rounded-lg"
                />:<div className="bg-red-400 w-56 h-48 rounded-lg"/>}
                <div className="flex-grow">
                    <h2>{moduleData?.name}</h2>
                    <p>{moduleData?.createdAt}</p>
                    <p>{moduleData?.updatedAt}</p>
                </div>
                <div>
                    <button onClick={()=>hendleDelete(moduleData?.id)}>delete</button>
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
                <div className="grid grid-cols-4 gap-4">
                    {
                        isActive=='material'?
                        moduleData?.materials.map(material=>(
                            <CardLearning type="materials" key={material.id} data={material} href={`${moduleData.id}/material/${material.id}`}/>
                        )):
                        moduleData?.test.map(test=>(
                            <CardLearning type="test" key={test.id} data={test} href={`${moduleData.id}/test/${test.id}`}/>
                        ))
                    }
                </div>
            </div>
        </div>
    )
 }

export default ModulePage