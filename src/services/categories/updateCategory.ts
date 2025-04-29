
import { Category } from '@/types';
import { supabase } from '@/integrations/supabase/client';
import { getLocalStorageData, saveCategoriesToLocalStorage } from '../mockData';
import { transformCategory } from './utils';

export const updateCategory = async (id: string, category: Partial<Category>): Promise<Category> => {
  try {
    // Remove properties that should not be updated directly
    const { id: _, createdAt: __, ...updateData } = category;
    
    const { data, error } = await supabase
      .from('categories')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      console.error('Error updating category:', error);
      // Fall back to local storage
      const { categories } = getLocalStorageData();
      
      const index = categories.findIndex(c => c.id === id);
      if (index === -1) {
        throw new Error(`Category with id ${id} not found`);
      }
      
      const updatedCategory = {
        ...categories[index],
        ...category,
      };
      
      const updatedCategories = [...categories];
      updatedCategories[index] = updatedCategory;
      
      saveCategoriesToLocalStorage(updatedCategories);
      
      return updatedCategory;
    }

    return transformCategory(data);
  } catch (error) {
    console.error('Error in updateCategory:', error);
    // Fall back to local storage
    const { categories } = getLocalStorageData();
    
    const index = categories.findIndex(c => c.id === id);
    if (index === -1) {
      throw new Error(`Category with id ${id} not found`);
    }
    
    const updatedCategory = {
      ...categories[index],
      ...category,
    };
    
    const updatedCategories = [...categories];
    updatedCategories[index] = updatedCategory;
    
    saveCategoriesToLocalStorage(updatedCategories);
    
    return updatedCategory;
  }
};
