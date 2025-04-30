'use client'

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
    
    return(
        <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {data?.data.content.replace(/\\n/g, '\n')}
        </ReactMarkdown>
    )
}

export default MaterialPage