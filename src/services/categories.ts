
import { Category } from '@/types';
import { v4 as uuidv4 } from 'uuid';
import { getLocalStorageData, saveCategoriesToLocalStorage } from './mockData';

export const getCategories = (): Category[] => {
  const { categories } = getLocalStorageData();
  return categories;
};

export const getCategoryById = (id: string): Category | undefined => {
  const { categories } = getLocalStorageData();
  return categories.find(category => category.id === id);
};

export const createCategory = (category: Omit<Category, 'id' | 'createdAt'>): Category => {
  const { categories } = getLocalStorageData();
  
  const newCategory: Category = {
    ...category,
    id: uuidv4(),
    createdAt: new Date(),
  };
  
  const updatedCategories = [...categories, newCategory];
  saveCategoriesToLocalStorage(updatedCategories);
  
  return newCategory;
};

export const updateCategory = (id: string, category: Partial<Category>): Category => {
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
};

export const deleteCategory = (id: string): void => {
  const { categories } = getLocalStorageData();
  
  const filteredCategories = categories.filter(c => c.id !== id);
  saveCategoriesToLocalStorage(filteredCategories);
};

export const getCategoriesByType = (type: 'income' | 'expense'): Category[] => {
  const { categories } = getLocalStorageData();
  return categories.filter(category => category.type === type);
};
