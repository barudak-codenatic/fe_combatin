'use client'

import { useNavigationStore, useSplitPath } from "@/hooks";
import apiClient from "@/services/apiService";
import { Module } from "@/types";
import { useQuery } from "@tanstack/react-query";
import { CardLearning } from "./card-learning";
import { useEffect } from "react";

export const SideBar = () => {
    const moduleId = useSplitPath(2);
    const currentItemId = useSplitPath(4); 
    const currentType = useSplitPath(3) as 'material' | 'test'; 
    
    const setModule = useNavigationStore(state => state.setModule);
    const setCurrentItem = useNavigationStore(state => state.setCurrentItem);
    
    const { data, isLoading, error } = useQuery({
        queryKey: ['getModuleId', moduleId],
        queryFn: () => apiClient.get<Module>(`/modules/${moduleId}`)
    });
    
    useEffect(() => {
        if (data?.data && currentItemId && currentType) {
            setModule(data.data);
            
            const items = currentType === 'material' ? data.data.materials : data.data.test;
            const currentIndex = items.findIndex(item => item.id === currentItemId);
            
            if (currentIndex !== -1) {
                setCurrentItem({
                    id: currentItemId,
                    type: currentType,
                    index: currentIndex,
                });
            }
        }
    }, [data?.data, currentItemId, currentType, setModule, setCurrentItem]);
    
    if (isLoading) return <div>Loading...</div>;
    if (error) return <div>Error loading module</div>;
    if (!data?.data) return <div>No module data available</div>;
    
    return (
        <div className="flex flex-col">
            <div>
                <h3 className="mb-2">Materi</h3>
                <div className="flex flex-col gap-2">
                    {
                        data.data.materials.map((material) => (
                            <CardLearning 
                                type="materials" 
                                key={material.id} 
                                data={material} 
                                href={`/module/${moduleId}/material/${material.id}`}
                                // isActive={currentType === 'material' && currentItemId === material.id}
                            />
                        ))
                    }
                </div>
            </div>
            <div>
                <h3 className="my-2">Test</h3>
                <div className="flex flex-col gap-2">
                    {
                        data.data.test.map((test) => (
                            <CardLearning 
                                type="test" 
                                key={test.id} 
                                data={test} 
                                href={`/module/${moduleId}/test/${test.id}`}
                                // isActive={currentType === 'test' && currentItemId === test.id}
                            />
                        ))
                    }
                </div>
            </div>
        </div>
    );
};