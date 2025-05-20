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
      name: category.name,
      description: category.description || '',
      color: category.color || '#3B82F6',
      type: category.type,
      created_at: new Date().toISOString()
    };
    
    console.log('Attempting to create category with data:', newCategory);
    
    const { data, error } = await supabase
      .from('categories')
      .insert([newCategory])
      .select('*')
      .single();
    
    if (error) {
      console.error('Supabase error creating category:', error);
      throw new Error(error.message || 'Failed to create category');
    }

    if (!data) {
      console.error('No data returned from Supabase after category creation');
      throw new Error('No data returned after category creation');
    }

    console.log('Category created successfully in Supabase:', data);
    return transformCategory(data);
  } catch (error: any) {
    console.error('Error in createCategory:', error);
    throw error;
  }
};
