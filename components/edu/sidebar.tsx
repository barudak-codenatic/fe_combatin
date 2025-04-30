'use client'
import { useSplitPath } from "@/hooks";
import apiClient from "@/services/apiService";
import { Module } from "@/types";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { FaBook } from "react-icons/fa6";
import { CardLearning } from "./card-learning";

export const SideBar = () => {

    const moduleId = useSplitPath(2)

    const { data, isLoading, error } = useQuery({
        queryKey : ['getModuleId'],
        queryFn : () => apiClient.get<Module>(`/modules/${moduleId}`)
    })

    return(
        <div className="flex flex-col">
            <div>
                <h3 className="mb-2">Materi</h3>
                <div className="flex flex-col gap-2">
                    {
                        data?.data.materials.map((material)=>(
                            <CardLearning type="materials" key={material.id} data={material} href={`/module/${moduleId}/material/${material.id}`}/>
                        ))
                    }
                </div>
            </div>
            <div>
                <h3 className="my-2">Test</h3>
                <div className="flex flex-col gap-2">
                    {
                        data?.data.test.map((test, i)=>(
                            <CardLearning type="test" key={test.id} data={test} href={`/module/${moduleId}/test/${test.id}`}/>
                        ))
                    }
                </div>
            </div>
        </div>
    )
};
