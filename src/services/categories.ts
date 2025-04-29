
import { Category } from '@/types';
import { v4 as uuidv4 } from 'uuid';
import { supabase } from '@/integrations/supabase/client';
import { getLocalStorageData, saveCategoriesToLocalStorage } from './mockData';

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
      const { categories } = getLocalStorageData();
      return categories;
    }

    // Transform categories to match the application's format
    return categories.map(category => ({
      ...category,
      createdAt: new Date(category.created_at),
    }));
  } catch (error) {
    console.error('Error in getCategories:', error);
    // Fall back to local storage
    const { categories } = getLocalStorageData();
    return categories;
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
      const { categories } = getLocalStorageData();
      return categories.find(category => category.id === id);
    }

    if (!category) return undefined;

    return {
      ...category,
      createdAt: new Date(category.created_at),
    };
  } catch (error) {
    console.error('Error in getCategoryById:', error);
    // Fall back to local storage
    const { categories } = getLocalStorageData();
    return categories.find(category => category.id === id);
  }
};

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

    return {
      ...data,
      createdAt: new Date(data.created_at),
    };
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

    return {
      ...data,
      createdAt: new Date(data.created_at),
    };
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

export const deleteCategory = async (id: string): Promise<void> => {
  try {
    const { error } = await supabase
      .from('categories')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error('Error deleting category:', error);
      // Fall back to local storage
      const { categories } = getLocalStorageData();
      
      const filteredCategories = categories.filter(c => c.id !== id);
      saveCategoriesToLocalStorage(filteredCategories);
    }
  } catch (error) {
    console.error('Error in deleteCategory:', error);
    // Fall back to local storage
    const { categories } = getLocalStorageData();
    
    const filteredCategories = categories.filter(c => c.id !== id);
    saveCategoriesToLocalStorage(filteredCategories);
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
      const { categories } = getLocalStorageData();
      return categories.filter(category => category.type === type);
    }

    return categories.map(category => ({
      ...category,
      createdAt: new Date(category.created_at),
    }));
  } catch (error) {
    console.error('Error in getCategoriesByType:', error);
    // Fall back to local storage
    const { categories } = getLocalStorageData();
    return categories.filter(category => category.type === type);
  }
};
