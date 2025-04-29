
import { Category } from '@/types';
import { supabase } from '@/integrations/supabase/client';
import { transformCategory, getLocalStorageCategories, getLocalStorageCategoryById } from './utils';

// Function to get all categories from Supabase
export const getCategories = async (): Promise<Category[]> => {
  try {
    const { data: categories, error } = await supabase
      .from('categories')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching categories:', error);
      // Fall back to local storage if there's an error
      return getLocalStorageCategories();
    }

    // Transform categories to match the application's format
    return categories.map(transformCategory);
  } catch (error) {
    console.error('Error in getCategories:', error);
    // Fall back to local storage
    return getLocalStorageCategories();
  }
};

export const getCategoryById = async (id: string): Promise<Category | undefined> => {
  try {
    const { data: category, error } = await supabase
      .from('categories')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) {
      console.error('Error fetching category by ID:', error);
      // Fall back to local storage
      return getLocalStorageCategoryById(id);
    }

    if (!category) return undefined;

    return transformCategory(category);
  } catch (error) {
    console.error('Error in getCategoryById:', error);
    // Fall back to local storage
    return getLocalStorageCategoryById(id);
  }
};

export const getCategoriesByType = async (type: 'income' | 'expense'): Promise<Category[]> => {
  try {
    const { data: categories, error } = await supabase
      .from('categories')
      .select('*')
      .eq('type', type)
      .order('name');
    
    if (error) {
      console.error('Error fetching categories by type:', error);
      // Fall back to local storage
      const localCategories = getLocalStorageCategories();
      return localCategories.filter(category => category.type === type);
    }

    return categories.map(transformCategory);
  } catch (error) {
    console.error('Error in getCategoriesByType:', error);
    // Fall back to local storage
    const localCategories = getLocalStorageCategories();
    return localCategories.filter(category => category.type === type);
  }
};
