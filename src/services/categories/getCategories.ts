
import { Category } from '@/types';
import { supabase } from '@/integrations/supabase/client';
import { getLocalStorageData } from '../mockData';

// Function to get all categories from Supabase
export const getCategories = async (): Promise<Category[]> => {
  try {
    const { data: categories, error } = await supabase
      .from('categories')
      .select('*')
      .order('name');
    
    if (error) {
      console.error('Error fetching categories:', error);
      // Fall back to local storage if there's an error
      return getLocalStorageData().categories;
    }

    // Transform categories to match the application's format
    return categories.map(category => ({
      id: category.id,
      name: category.name,
      description: category.description || undefined,
      color: category.color || '#3B82F6',
      type: category.type === 'income' ? 'income' : 'expense',
      createdAt: category.created_at ? new Date(category.created_at) : new Date(),
    }));
  } catch (error) {
    console.error('Error in getCategories:', error);
    // Fall back to local storage
    return getLocalStorageData().categories;
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
      const localCategories = getLocalStorageData().categories;
      return localCategories.find(c => c.id === id);
    }

    if (!category) return undefined;

    return {
      id: category.id,
      name: category.name,
      description: category.description || undefined,
      color: category.color || '#3B82F6',
      type: category.type === 'income' ? 'income' : 'expense',
      createdAt: category.created_at ? new Date(category.created_at) : new Date(),
    };
  } catch (error) {
    console.error('Error in getCategoryById:', error);
    // Fall back to local storage
    const localCategories = getLocalStorageData().categories;
    return localCategories.find(c => c.id === id);
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
      const localCategories = getLocalStorageData().categories;
      return localCategories.filter(category => category.type === type);
    }

    return categories.map(category => ({
      id: category.id,
      name: category.name,
      description: category.description || undefined,
      color: category.color || '#3B82F6',
      type: category.type === 'income' ? 'income' : 'expense',
      createdAt: category.created_at ? new Date(category.created_at) : new Date(),
    }));
  } catch (error) {
    console.error('Error in getCategoriesByType:', error);
    // Fall back to local storage
    const localCategories = getLocalStorageData().categories;
    return localCategories.filter(category => category.type === type);
  }
};
