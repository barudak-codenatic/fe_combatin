"use client"

import { ProgressBar } from "@/components/edu"
import { content } from "@/content"
import apiClient from "@/services/apiService"
import { Modules } from "@/types"
import { useQuery } from "@tanstack/react-query"
import Image from "next/image"
import Link from "next/link"

const ModulesPage = () => {
    const { data, isLoading, error } = useQuery({
        queryKey : ['getAllModules'],
        queryFn : () => apiClient.get<Modules[]>('/modules')
    })
    console.log(data)
    return (
        <div className="max-w-7xl mx-auto grid grid-cols-4 gap-3 mt-28">
            {
                data?.data.map(e=>(
                    <Link href={`/module/${e.id}`} key={e.id} className="h-64 flex flex-col rounded-lg p-3">
                        {e.img_url?<Image
                            src={e.img_url}
                            alt={e.name}
                            width={200}
                            height={200}
                            className="h-full w-full rounded-lg"
                        />:<div className="bg-red-400 w-full h-full rounded-lg"/>}
                        <div>
                            <h2>{e.name}</h2>
                            <p>{e.description}</p>
                            {e.progress > 0?
                                <ProgressBar value={e.progress[0].progress}/>:null
                            }
                            
                        </div>
                        
                    </Link>
                ))
            }
        </div>
    )
 }

export default ModulesPage