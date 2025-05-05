// src/store/moduleNavigationStore.ts
import { create } from 'zustand';
import { Module } from '@/types';

interface NavigationItem {
  id: string;
  type: 'material' | 'test';
  index: number;
}

interface NavigationState {
  module: Module | null;
  currentItem: NavigationItem | null;
  setModule: (module: Module) => void;
  setCurrentItem: (item: NavigationItem) => void;
  getNextItem: () => NavigationItem | null;
  getPreviousItem: () => NavigationItem | null;
}

export const useNavigationStore = create<NavigationState>((set, get) => ({
  module: null,
  currentItem: null,
  
  setModule: (module) => {
    set({ module });
  },
  
  setCurrentItem: (item) => {
    set({ currentItem: item });
  },
  
  getNextItem: () => {
    const { module, currentItem } = get();
    
    if (!module || !currentItem) return null;
    
    if (currentItem.type === 'material') {
      // If it's not the last material, return next material
      if (currentItem.index < module.materials.length - 1) {
        return {
          id: module.materials[currentItem.index + 1].id,
          type: 'material',
          index: currentItem.index + 1
        };
      } 
      // If it's the last material, return first test if tests exist
      else if (module.test.length > 0) {
        return {
          id: module.test[0].id,
          type: 'test',
          index: 0
        };
      }
    } 
    else if (currentItem.type === 'test') {
      // If it's not the last test, return next test
      if (currentItem.index < module.test.length - 1) {
        return {
          id: module.test[currentItem.index + 1].id,
          type: 'test',
          index: currentItem.index + 1
        };
      }
    }
    
    // No next item
    return null;
  },
  
  getPreviousItem: () => {
    const { module, currentItem } = get();
    
    if (!module || !currentItem) return null;
    
    if (currentItem.type === 'material') {
      // If it's not the first material, return previous material
      if (currentItem.index > 0) {
        return {
          id: module.materials[currentItem.index - 1].id,
          type: 'material',
          index: currentItem.index - 1
        };
      }
      // No previous item for first material
    } 
    else if (currentItem.type === 'test') {
      // If it's not the first test, return previous test
      if (currentItem.index > 0) {
        return {
          id: module.test[currentItem.index - 1].id,
          type: 'test',
          index: currentItem.index - 1
        };
      } 
      // If it's the first test, return last material if materials exist
      else if (module.materials.length > 0) {
        return {
          id: module.materials[module.materials.length - 1].id,
          type: 'material',
          index: module.materials.length - 1
        };
      }
    }
    
    // No previous item
    return null;
  }
}));