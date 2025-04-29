
import { supabase } from '@/integrations/supabase/client';
import { getLocalStorageData, saveCategoriesToLocalStorage } from '../mockData';

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
