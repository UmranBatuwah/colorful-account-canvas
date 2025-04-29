
import { Category } from '@/types';
import { v4 as uuidv4 } from 'uuid';
import { supabase } from '@/integrations/supabase/client';
import { getLocalStorageData, saveCategoriesToLocalStorage } from '../mockData';
import { transformCategory } from './utils';

export const createCategory = async (category: Omit<Category, 'id' | 'createdAt'>): Promise<Category> => {
  try {
    // Get current user
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error('User not authenticated');
    }

    const newCategory = {
      ...category,
      user_id: user.id,
      type: category.type // TransactionType is already valid for the DB
    };
    
    const { data, error } = await supabase
      .from('categories')
      .insert([newCategory])
      .select()
      .single();
    
    if (error) {
      console.error('Error creating category:', error);
      // Fall back to local storage
      const { categories } = getLocalStorageData();
      
      const localNewCategory: Category = {
        ...category,
        id: uuidv4(),
        createdAt: new Date(),
      };
      
      const updatedCategories = [...categories, localNewCategory];
      saveCategoriesToLocalStorage(updatedCategories);
      
      return localNewCategory;
    }

    return transformCategory(data);
  } catch (error) {
    console.error('Error in createCategory:', error);
    // Fall back to local storage
    const { categories } = getLocalStorageData();
    
    const localNewCategory: Category = {
      ...category,
      id: uuidv4(),
      createdAt: new Date(),
    };
    
    const updatedCategories = [...categories, localNewCategory];
    saveCategoriesToLocalStorage(updatedCategories);
    
    return localNewCategory;
  }
};
