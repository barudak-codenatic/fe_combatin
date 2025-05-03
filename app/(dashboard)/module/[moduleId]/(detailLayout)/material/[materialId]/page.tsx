'use client'

import Breadcrumb from "@/components/common/breadcrumb"
import { useSplitPath } from "@/hooks"
import useApiRequest from "@/hooks/useRequest"
import apiClient from "@/services/apiService"
import { Material } from "@/types"
import { useQuery } from "@tanstack/react-query"
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

const MaterialPage = () => {
    const { loading : postLoading, error : postError, makeRequest, data : postData } = useApiRequest<{message : string}, string>();

    const materialId = useSplitPath(4)
    
    const { data, isLoading, error } = useQuery({
        queryKey : ['getMaterial'],
        queryFn : () => apiClient.get<Material>(`/materials/${materialId}`)
    })

    const handleDone = async (moduleId : string, materialId : string) => { 
        try {
            await makeRequest(() => apiClient.post(`/content-progress/${moduleId}`, {materialId, completed : true}));
        } catch (err) {
            console.log(err)
        }
    }

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
                    <button onClick={()=>handleDone(materialData.moduleId, materialData.id)}>Selesai</button>
                </div>
            </div>
        )
    }
}

export default MaterialPage