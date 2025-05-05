'use client'

import Breadcrumb from "@/components/common/breadcrumb"
import { NavigationButtons } from "@/components/edu"
import { useSplitPath } from "@/hooks"
import apiClient from "@/services/apiService"
import { Material } from "@/types"
import { useQuery } from "@tanstack/react-query"
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

const MaterialPage = () => {

    const materialId = useSplitPath(4)
    
    const { data, isLoading, error } = useQuery({
        queryKey : ['getMaterial'],
        queryFn : () => apiClient.get<Material>(`/materials/${materialId}`)
    })

    const materialData = data?.data
    if (materialData) {
        return(
            <div>
                <Breadcrumb
                        crumbs={[
                            { label : materialData.module.name, href:`/module/${materialData.moduleId}` },
                            { label : materialData.title, href:`/module/${materialData.id}` }
                        ]}
                    />
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {data?.data.content.replace(/\\n/g, '\n')}
                </ReactMarkdown>
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
}

export default MaterialPage