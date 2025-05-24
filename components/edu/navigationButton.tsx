'use client'

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { IoArrowBack, IoArrowForward } from 'react-icons/io5';
import { useNavigationStore } from '@/hooks';
import useApiRequest from '@/hooks/useRequest';
import apiClient from '@/services/apiService';

interface NavigationButtonsProps {
  moduleId: string;
  currentId: string;
  type: 'material' | 'test';
}

export const NavigationButtons: React.FC<NavigationButtonsProps> = ({
  moduleId,
  currentId,
  type,
}) => {
  const router = useRouter();
  const {
    module,
    setModule,
    setCurrentItem,
    getNextItem,
    getPreviousItem,
  } = useNavigationStore();

  const { loading : postLoading, error : postError, makeRequest, data : postData } = useApiRequest<{message : string}, string>();

  useEffect(() => {
    if (module) {
      // Find the index of the current item
      const items = type === 'material' ? module.materials : module.test;
      const currentIndex = items.findIndex(item => item.id === currentId);
      
      if (currentIndex !== -1) {
        setCurrentItem({
          id: currentId,
          type,
          index: currentIndex,
        });
      }
    }
  }, [currentId, module, setCurrentItem, type]);

  const handlePrevious = () => {
    const previousItem = getPreviousItem();
    if (previousItem) {
        router.push(`/module/${moduleId}/${previousItem.type}/${previousItem.id}`);
    }
  };

  const handleNext = async () => {
    try {
        await makeRequest(() => apiClient.post(`/content-progress/${moduleId}`, {materialId : currentId, completed : true}));
        const nextItem = getNextItem();
        if (nextItem) {
            router.push(`/module/${moduleId}/${nextItem.type}/${nextItem.id}`);
        }
    } catch (error) {
        console.log(error)
    }
  };



  const previousItem = getPreviousItem();
  const nextItem = getNextItem();

  return (
    <div className="flex gap-4 mt-4">
      <button
        onClick={handlePrevious}
        disabled={!previousItem}
        className={`${!previousItem ? 'invisible' : ''} flex gap-2 items-center bg-red-600 text-white px-4 py-2 rounded-full font-bold hover:bg-red-700`}
      >
        <IoArrowBack className="w-4 h-4 mr-2" />
        Sebelumnya
      </button>
      
      <button
        onClick={handleNext}
        disabled={!nextItem}
        className={`${!nextItem ? 'invisible' : ''} flex gap-2 items-center bg-red-600 text-white px-4 py-2 rounded-full font-bold hover:bg-red-700`}
      >
        Selanjutnya
        <IoArrowForward className="w-4 h-4 ml-2" />
      </button>
    </div>
  );
};